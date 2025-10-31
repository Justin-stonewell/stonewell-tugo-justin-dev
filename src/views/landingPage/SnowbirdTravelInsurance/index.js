import React from 'react'
import { useState, useEffect } from 'react';
//3rd library
// import { Grid, Typography, IconButton } from '@material-ui/core'
import { Grid, Hidden } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
import Button from '../../../components/common/CustomButtons/Button'

//components
import MetaTags from '../../../components/common/MetaTags';
import SideMenu from '../../../components/common/SideMenu';

//style
// import bannerLandingStyles from '../../../assets/jss/styles/bannerLandingStyle';

// icon
import CallIcon from '@mui/icons-material/Call';

// image
import snowbirdImg from '../../../assets/imgs/landingPage/snowbird travel insurance for canadian seniors.jpg'

// const useStyles = makeStyles(bannerLandingStyles)

const sideMenuContents = [
  {
    href: '#we-handle-all-snowbird-insurance-claim',
    title: 'Worry Free Claim Service',
  },
  {
    href: '#key-features-of-snowbird-travel-insurance',
    title: 'Key Features',
  },
  {
    href: '#benefit-detail-of-snowbirds-insurance',
    title: 'Benefit Detail',
  },
  {
    href: '#general-exclusion-of-travel-insurance-for-seniors',
    title: 'General Coverage Exclusion',
  },
  {
    href: '#how-to-arrange-direct-payment-travel-insurance-for-canadian-seniors',
    title: 'Direct Payment for Big Expenses',
  },
  {
    href: '#why-choose-us-for-snowbird-insurance',
    title: 'Why choose us',
  },
  {
    href: '#How-much-does-snowbirds-travel-insurance-cost?',
    title: 'Cost of Snowbirds Travel Insurance',
  },
  {
    href: '#Conclusion-from-travel-insurance-advisor',
    title: 'My Recommendations',
  },
  {
    href: '#how-to-get-a-quote-for-snowbirds-insurance',
    title: 'Get a Quote Now',
  },
]

export default function SnowbirdTravelInsurance ({match}) {

  const metaData = {
    title: 'Comprehensive Snowbird Travel Insurance for Canadian Seniors',
    description: 'Find the best snowbird travel insurance plans tailored for Canadian seniors. Explore affordable options for extensive coverage.',
    canonical: match.url,
    keywords: 'snowbird travel insurance, snowbird insurance, Canadian seniors travel insurance, snowbird travel insurance for pre-existing conditions, snowbird travel insurance reviews'
  }

  // const classes = useStyles()

   //Responsive Design
   const [width, setWidth] = useState(window.innerWidth);
   function handleWindowSizeChange() {
     setWidth(window.innerWidth);
   }
 
   useEffect(() => {
     window.addEventListener('resize', handleWindowSizeChange);
     return () => {
         window.removeEventListener('resize', handleWindowSizeChange);
     }
   }, []);
 
   let isMobile = (width <= 768);

  
  return (
    <>
    <MetaTags data={metaData} />
      <Grid container justifyContent="center" style={{ marginTop:isMobile? '0':'4vh'}}>

          <Grid item container
              // className={classes.bannerWrapper}
              style={{
                // background: `url(/imgs/banner${window.location.pathname}.png)`,
                // background: `url(${snowbirdImg}) center / cover no-repeat`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                background:'#2a2f71',
                padding:isMobile?'5vh':'5vh 20vh'
              }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {/* Title */}
              <Grid item container justifyContent='center' style={{ color:"#fff" }}>
                  <h1 style={{ fontWeight:'800', fontSize:isMobile?'35px':'45px' }}>
                    <strong>Snowbird Travel Insurance For Canadian Seniors</strong>
                  </h1>
              </Grid>

              {/* Sub Title */}
              <Grid item container justifyContent='center' style={{ color:"#fff" }}>
                  <h2 style={{ fontSize:isMobile?'18px':'25px'}}>
                    With Stress-Free Claims Assistance
                  </h2>
              </Grid>

              <Button 
                  variant="contained" 
                  color="secondary" 
                  href="tel:1-833-645-3858"
                  style={{ marginTop:'1vh'}}
                >
                <CallIcon fontSize="large"/> Call us for a quote now<br/>1-833-645-3858
              </Button>
              
          </Grid>

          <Hidden mdDown>
            <Grid item sm={12} lg={4} xl={2}>
              <SideMenu
                pageName={'Snowbird Travel Insurance for Canadian Seniors'}
                lists={sideMenuContents}
              />
              <Button 
                  variant="contained" 
                  color="dark" 
                  href="tel:1-833-645-3858"
                  style={{ position:'sticky', top:'600px'}}
                >
                <CallIcon fontSize="large"/> Call us for a quote now<br/>1-833-645-3858
              </Button>
            </Grid>
          </Hidden>

          <Grid item sm={12} lg={8} xl={5} style={{ margin:'2vh' }}>

          <section id="we-handle-all-snowbird-insurance-claim">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71'}}>Enjoy Your Trip - We Handle All Your Claims!</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <span style={{ color:'#F2736C'}}>
                  <strong>Please refrain from asking your children or grandchildren for snowbird travel insurance claims anymore. </strong>
                </span> 
                  Just send the necessary documents to our claims processing service representative. We will contact the insurance company directly and handle the claim application on your behalf from start to finish. You don't have to worry – simply focus on your travels.
              </p>
          </section>

          <section id="key-features-of-snowbird-travel-insurance">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Key Features of Travel Medical Insurance for Canadian Seniors</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <ul>
                  <li><strong>Coverage for medical emergencies and hospital stays:</strong> Including comprehensive care for sudden illnesses or injuries, ensuring peace of mind during travel.</li>
                  <li><strong>Provisions for medical evacuation:</strong> Facilitating safe and prompt transportation to a medical facility, if required, in case of serious health emergencies.</li>
                  <li><strong>Tailored to address the health concerns of seniors:</strong> Customized policies considering the unique health needs and risks associated with older travelers.</li>
                </ul>
              </p>

              <img alt={'snowbird travel insurance for canadian seniors'} src={snowbirdImg} width="100%" /> 
          </section>

          <section id="benefit-detail-of-snowbirds-insurance">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Choosing the Best Canadian Travel Insurance for Seniors</h2>  

              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <span style={{ color:'#F2736C'}}><strong>Don't waste your time and energy comparing various snowbird insurance plans on your own. </strong></span>  
                Let our insurance experts select the plan that best suits your budget and needs. 
                We can include a variety of options <span style={{ color:'#F2736C'}}><strong>such as emergency medical expenses, trip cancellation and interruption insurance, lost luggage insurance, and accidental death insurance,</strong></span>  among others.
              </p>
            
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <ul>
                  <li><strong>Emergency Medical Coverage:</strong> Includes expenses for sudden illnesses or injuries during travel, such as hospitalization, physician services, and medical evacuation.</li>
                  <li><strong>COVID-19 Coverage:</strong> Offers medical expense coverage for testing positive for COVID-19 during travel under certain conditions.</li>
                  <li><strong>Ambulance Services:</strong> Covers ground, air, or sea ambulance services up to the policy limit.</li>
                  <li><strong>Professional Medical Services:</strong> Provides up to $500 per incident for services by licensed professionals like physiotherapists and acupuncturists.</li>
                  <li><strong>Out-of-Pocket Expenses:</strong> Compensates up to $3,500 for additional costs like accommodation and meals during a medical incident.</li>
                  <li><strong>Dental Emergencies:</strong> Up to $4,000 coverage for dental accidents and $500 for other dental emergencies during the trip.</li>
                  <li><strong>Travel Assistance:</strong> Includes airfare for return home or to a medical facility if necessary, and transportation of family or friends.</li>
                  <li><strong>Repatriation:</strong> Covers up to $15,000 for the preparation and return of the body, and up to $4,000 for burial or cremation at the place of death.</li>
                  <li><strong>Identity Fraud Recovery:</strong> Offers up to $5,000 for expenses related to the recovery from identity fraud incidents.</li>
                  <li><strong>Trip Cancellation & Interruption:</strong> Protects against the financial impact of having to cancel or interrupt a trip due to emergencies, with reimbursements for non-refundable expenses.</li>
                  <li><strong>Luggage Protection:</strong> Offers compensation for the loss, theft, or damage to baggage, as well as support for necessities if baggage arrival is delayed.</li>
                  <li><strong>Delay Coverage:</strong> Provides for extra costs incurred due to travel delays caused by factors like severe weather or transport strikes.</li>
                  <li><strong>Accidental Death & Injury:</strong> Delivers financial support in the event of accidental death or serious injury while traveling.</li>

                </ul>
              </p>
          </section>

          <section id="general-exclusion-of-travel-insurance-for-seniors">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>What's not covered by Snowbird Insurance?</h2>  
                <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                  <span style={{ color:'#F2736C'}}><strong>Snowbird insurance policies typically have certain exclusions that policyholders should be aware of. </strong></span>  
                </p>

                <p style={{ color:'#444', marginTop:'1vh', fontSize:'18px' }}>
                  Here are some key aspects that are generally not covered:
                </p>

                <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                  <ul>
                    <li><strong>Elective Treatments:</strong> As mentioned, elective treatments are not usually covered by snowbird insurance. These are treatments that are not medically necessary, such as cosmetic surgery. It's advisable to schedule these procedures either before your departure or after you return to Canada.</li>
                    <li><strong>Pre-existing Medical Conditions:</strong> Most snowbird insurance policies do not cover pre-existing medical conditions. However, some plans do offer coverage for this, but it's essential to read the fine print and understand the terms. These conditions are typically defined as any health issue that existed before the start of the policy.</li>
                    <li><strong>Routine Medical Care and Check-ups:</strong> Regular health check-ups and ongoing treatments, like dialysis or chemotherapy, are often not covered. Snowbird insurance is primarily designed for unexpected medical emergencies, not for continuing or routine care.</li>
                    <li><strong>Extreme Sports and High-risk Activities:</strong> Activities deemed high-risk, such as skydiving, scuba diving, or mountain climbing, may not be covered under standard policies. It's crucial to check if additional coverage is needed for such activities.</li>
                    <li><strong>Travel for Medical Treatment:</strong> If the primary purpose of travel is to seek medical treatment abroad, this is generally not covered by snowbird insurance.</li>
                    <li><strong>Alcohol or Drug-related Incidents:</strong>  Any medical issues arising due to the consumption of alcohol or recreational drugs are typically excluded from coverage.</li>
                    <li><strong>War and Conflict Zones:</strong> Injuries or illnesses sustained in areas experiencing war, civil unrest, or significant conflict may not be covered.</li>
                  </ul>
                </p>
            </section>

            <section id="how-to-arrange-direct-payment-travel-insurance-for-canadian-seniors">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Direct Payment for Major Medical Expenses</h2>  
            
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                In cases of significant medical events like hospitalization, surgery, or emergency transportation, we understand the financial strain it can bring. 
                <span style={{ color:'#F2736C'}}>
                  <strong>To ease this, we ensure that your snowbirds travel insurance for Canadian seniors includes provisions for direct payments from the insurance company. </strong>
                </span>
                This feature means that in the event of substantial medical expenses, the insurer will arrange direct payment, mitigating your financial concerns and allowing you to focus on recovery.
              </p>
            </section>

            <section id="why-choose-us-for-snowbird-insurance">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Why Choose Stonewell for Your Insurance Needs?</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                  While it's true that the benefits of insurance policies are generally the same whether purchased directly from an insurer or through a broker, the real difference lies in the service provided. 
                  <span style={{ color:'#F2736C'}}><strong>Insurance policies, regardless of where they are bought, do not vary in benefits as neither insurers nor brokers offer uniquely customized insurance products. </strong></span> 
                  Therefore, the decision comes down to choosing the provider of the service.
              </p>

              <p style={{ color:'#444', marginTop:'1vh', fontSize:'18px' }}> 
                  The value of an insurance policy is not just in its purchase but significantly in how it is utilized during emergencies. 
                  How you navigate these situations can determine whether you fully receive the benefits of your insurance or not, and each insurance company has different processes. 
                  Navigating these processes in an emergency can be challenging. This is where Stonewell excels - we offer prompt and proper guidance. 
                  If necessary, <span style={{ color:'#F2736C'}}><strong>we can directly contact the insurance company on your behalf. We also handle all claims for you, allowing you to focus solely on your travel and, in emergencies, on your treatment without the additional stress of insurance procedures</strong></span> 
              </p>
            </section>

            <section id="How-much-does-snowbirds-travel-insurance-cost?">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>How much does snowbirds travel insurance cost?</h2>  
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                  The cost of snowbird travel insurance varies based on several factors, including the age of the traveler, the duration of the trip, and the specifics of the coverage.
                  <span style={{ color:'#F2736C'}}><strong>Generally, older travelers can expect higher premiums due to increased health risks. The length of stay and the destinations also play significant roles in determining the cost.</strong></span> 
                  It's important to compare different plans to find the best coverage that fits your budget and travel needs.
              </p>

              <p style={{ color:'#444', marginTop:'1vh', fontSize:'18px' }}>
                  Here are some <span style={{ color:'#F2736C'}}><strong>example of snowbirds medical insurance premium:</strong></span> 
              </p>

              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                  <ul>
                    <li><strong>60 year old, Female, 120 days Trip to United States: </strong> $441.91 for $10M Coverage</li>
                    <li><strong>68 year old, Male with Dentaliabetes, 120 days Trip to United States: </strong> $823.12 for $10M Coverage</li>
                    <li><strong>74 year old, Female, 126 days Trip to United States: </strong> $1,359.09 for $10M Coverage</li>
                    <li><strong>78 year old, Male with Blood Pressure, 95 days Trip to Mexico:</strong> $960.11 CAD for $10M Coverage</li>
                    <li><strong>83 year old, Female with Blood Pressure and Diabetes, 66 days Trip to Australia: </strong> $2,961.46 for $10M Coverage</li>
                  </ul>
              </p>
            </section>

            <section id="Conclusion-from-travel-insurance-advisor">
                <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Conclusion</h2>  
                
                <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px', marginBottom:'10vh' }}> 
                    For Canadian snowbirds, travel is more than a pastime – it's a way of life. 
                    <span style={{ color:'#F2736C'}}><strong>With the right snowbird travel insurance from Stonewell, you can embark on your journeys with the assurance that you are fully protected. </strong></span>
                    Whether you're seeking adventure or tranquility, your travel insurance is your partner in making every moment worry-free.
                </p>
            </section>


          </Grid>
         
      </Grid>

    </>
  )
}


