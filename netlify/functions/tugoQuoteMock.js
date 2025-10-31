// netlify/functions/tugoQuoteMock.js
//
// This is the "public" handler the frontend will POST to.
// It normalizes the incoming request into our internal form,
// calls quoteWithFallback(), and returns a clean quote result.

const { quoteWithFallback } = require("./_tugoQuoteService");

// small helper to send JSON w/ CORS
function sendJson(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(data),
  };
}

function handleOptions() {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: "",
  };
}

// helper: quick age calc from YYYY-MM-DD
function calcAge(dobStr) {
  const today = new Date();
  const [yyyy, mm, dd] = dobStr.split("-");
  const birth = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// helper: detect if destination includes USA
function destinationIncludesUSA(dest) {
  if (!dest) return false;
  const lower = dest.toLowerCase();
  return (
    lower.includes("usa") ||
    lower.includes("u.s.") ||
    lower.includes("united states") ||
    lower === "us" ||
    lower === "u.s" ||
    lower === "u.s.a" ||
    lower === "u.s.a." ||
    lower === "america"
  );
}

// normalize incoming frontend payload into the "form" shape
function buildInternalFormFromClientReq(clientReq) {
  // clientReq is what frontend sent us
  // expected shape (yours from Application.js):
  // {
  //   province,
  //   destinationCountry,
  //   departureDate,
  //   returnDate,
  //   purposeOfTrip,
  //   travellers: [
  //     { firstName, lastName, dob, province }
  //   ],
  //   company: 'tugo'
  // }

  const province = clientReq.province;
  const destinationCountry = clientReq.destinationCountry;
  const startDate = clientReq.departureDate;
  const endDate = clientReq.returnDate;

  const travellers = Array.isArray(clientReq.travellers)
    ? clientReq.travellers
    : [];

  const insuredPersons = travellers.map((t) => {
    // TuGo only really wants age + province for pricing
    const age = t.dob ? calcAge(t.dob) : null;
    return {
      firstName: t.firstName || "",
      lastName: t.lastName || "",
      birthDate: t.dob || "",
      gender: null, // we didn't capture gender in UI
      age,
    };
  });

  return {
    residenceCountry: "Canada",
    province,
    destinationCountry,
    includesUSA: destinationIncludesUSA(destinationCountry),
    startDate,
    endDate,
    insuredPersons,
    isFamilyPlan: insuredPersons.length > 1, // crude rule
    deductible: 0,
    tripCosts: [], // not wiring trip cost yet
    preExisting: false, // not wired yet
  };
}

// Turn our internal "form" into the final quote result we expose to FE
function buildPublicResponse(form, quoteResult) {
  // quoteResult looks like:
  // {
  //   source: 'tugo_api' | 'db_fallback',
  //   currency: 'CAD',
  //   premium: <number>,
  //   taxes: <number>,
  //   total: <number>,
  //   deductible: 0,
  //   productCode: 'PL-xxxx',
  //   coverages: {...}
  // }

  return {
    ok: true,
    debug: {
      formSentToService: form,
    },
    quote: {
      source: quoteResult.source,
      currency: quoteResult.currency,
      premium: quoteResult.premium,
      taxes: quoteResult.taxes,
      total: quoteResult.total,
      deductible: quoteResult.deductible,
      productCode: quoteResult.productCode,
      coverages: quoteResult.coverages || {},
    },
  };
}

exports.handler = async (event, context) => {
  console.log("[tugoQuoteMock] handler called, method=", event.httpMethod);

  // preflight for CORS
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  if (event.httpMethod !== "POST") {
    return sendJson(405, { error: "Method not allowed" });
  }

  if (!event.body) {
    return sendJson(400, { error: "Missing request body" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    console.error("[tugoQuoteMock] invalid JSON:", err);
    return sendJson(400, { error: "Invalid JSON" });
  }

  // payload could be either:
  // 1) direct form (old)
  // 2) { endpoint: 'quotePrice', request: {...} } (newer)
  let clientReq = payload;
  if (payload && payload.request) {
    console.log("[tugoQuoteMock] incoming clientReq:", payload);
    clientReq = payload.request;
  } else {
    console.log("[tugoQuoteMock] incoming clientReq (legacy):", payload);
  }

  // build internal canonical form for the service
  const form = buildInternalFormFromClientReq(clientReq);
  console.log("[tugoQuoteMock] form to quoteWithFallback():", form);

  try {
    // actually get quote (TuGo API or fallback)
    const quoteResult = await quoteWithFallback(form);

    console.log("[tugoQuoteMock] quoteResult:", quoteResult);

    // return clean response
    return sendJson(200, buildPublicResponse(form, quoteResult));
  } catch (err) {
    console.error("[tugoQuoteMock] ERROR while quoting:", err && err.message);
    if (err && err.response) {
      console.error(" status:", err.response.status);
      console.error(" headers:", err.response.headers);
      console.error(" data:", err.response.data);
    } else if (err && err.request) {
      console.error(" no response received. request config:", {
        url: err.config && err.config.url,
        method: err.config && err.config.method,
        headers: err.config && err.config.headers,
      });
    } else {
      console.error(" raw error object:", err);
    }

    return sendJson(500, {
      ok: false,
      error: "quote_failed",
      message: err.message || String(err),
    });
  }
};
