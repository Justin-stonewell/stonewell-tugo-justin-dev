const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
// Travel Quote Form initial data
export function travelQuoteInit() {
  const data = {
      insuredType: '',
      insuredGroupType: 'Individual',
      originCountry: '',
      originCountryName: '',
      originProvince: '',
      originProvinceName: '',
      destCountry: '',
      destCountryName: '',
      destProvince: '',
      destProvinceName: '',
      tripDirection: '',
      inDestination: '',
      // lastArrived: null,
      tripStartDate: null,
      tripEndDate: null,
      tripPeriod: 0,
      tripType: 'SINGLE',
      multiTripDays: 0,
      tripArrivalDate: null, 
      eligilbeAgrement : null,
      insuredNumber: '',
      insuredPersons: [{
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: null,
        age: 0,
        ageDays: 0,
        relationship: 'Primary',
        beneficiaryName:'',
        beneficiaryRelationship: '',
        attendSchoolName:'',
        graduatedDate: null,
        yearDateAfterGraduated: null,
        sameDate: true,
        tripStartDate: null,
        tripEndDate: null,
        tripPeriod: 0,
        arrivalDate: null,
        travelType: '',
        tripType: 'SINGLE',
        tripDepartureDate: null, // for Top-up
        tripArrivalDate: null, // for Top-up
        tripTotalDays: 0,  // for Top-up        
        tripOtherCoverageDays: 0,  // for Top-up
        multiTripDays: 0,
        preExistCond: false,
        coverCond: false,
        maternity: false,
        mentalIllness: false,
        height: '',
        weight: '',
        diabetes: '',
        insulin: '',
        cholesterol: '',
        highBloodPressure: '',
        hospitalized: '',
        whenHospitalized: '',
        WhyHospitalized: '',
        otherHealthIssue: '',
        travelQuote60Id: '',
        quoteDate: '',
        product: '',
        allianz: '',
        bluecross: '',
        tugo: '',
        selectedProduct: '',
        eligilbeIns: '',
        physicalCard: false,
        deliverDateInsuranceCard: null,
        insurancePlans: [],
        selectedPlan: [],
        selectedMedQuesAnswer: [],
        medicalSurvey: { // For Allianz Canadian over 65
          surveyScore: '',
          scoringReference: '',
          verificationToken: '',
          medicalSurveyAnswers: []
        },
        // optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
        optionalCarewellService: {},
        optionalAddOnPlans: [],
        renewalInsurance: false,
      }],
      eligilbeStuent: false,
      //family premium
      familyGroup: { 
          isSelected: false, 
          selectedCompnayName: '',
          totalPremium: 0,
          discountPremium: 0,
          familyPremium: 0
      },
      //contact
      contactName:'',
      phoneInCanada: true,
      contactPhone:'',
      contactEmail: '',
      // mailing address
      maillingInCanada: true,
      mailStreetName:  '',
      mailUnitApartmentNo:  '',
      mailCity:  '',
      mailProvince:  '',
      mailPostalCode:  '',
      mailCountry:  'CA',
      // mailCountry:  '',
      // payment information
      paymentByClient: false,
      paymentMethod: '',
      creditCardType: '',
      creditCardNumber: '',
      cardHolderName: '',
      cardcvv: '',
      cardExpired: '',
      senderName: '',
      // billing address
      sameMailAddress:false,
      billStreetName:  '',
      billUnitApartmentNo:  '',
      billCity:  '',
      billProvince:  '',
      billPostalCode:  '',
      billCountry:  '',
      //
      vendorID: '',
      sourceFrom: '',
      userID:'',
      renewal: false,
      // 
      applicationID: '',
      timeZone: timezone,
      note: '',
      sourceChnnel: '',
      preferLanguage: 'en',
      // preferLanguage: '',
      submitType: ''
    }

  return data
}

// Life Quote Form initial data
export function lifeQuoteInit() {
  const data = {
      productType: '',
      productTypeDesc: '',
      productKind: '',
      productKindDesc: '',
      selectedBenefitAmount: '',
      benefitAmount: '',
      firstName: '',
      lastName: '',
      birthDate: null,
      age: 0,
      smokeStatus: '',
      healthStatus: '',
      healthStatusDesc: '',
      phone: '',
      email: '',
      gender: '',
      contactMethod: '',
      personID : '',
      quoteID : '',
      quoteDate: '',
      timeZone: timezone  
  }
    return data
  }

// Health Quote Form initial data
export function healthQuoteInit() {
  const data = {
    insuranceKind: '',
    insuranceKindDesc: '',
    productType: '',
    productTypeDesc: '',
    productKind: '',
    productKindDesc: '',
    selectedBenefitAmount: '',
    benefitAmount: '',
    phone: '',
    email: '',
    contactMethod: '',
    // for Critical illness or Disability
    familyIllnessHistory: '',
    ageIllness: '',
    nameIllness: '', 
    // for selected Disability
    annualIncome: '',
    occupation: '',
    roleAtWork: '',
    insuredNumber: '',
    province: '',
    insuredPersons: [{
      relationship: 'Primary',
      firstName: '',
      lastName: '',
      birthDate: null,
      age: 0,
      gender: '',
      smokeStatus: '',
      healthStatus: '',
      healthStatusDesc: ''
    }],
    personID : '',
    quoteID : '',
    quoteDate: '',
    timeZone: timezone
  }
    return data
  }

// Group Quote Form initial data
export function groupQuoteInit() {
  const data = {
    healthPlan: '',
    dentalPlan: '',
    paramedical: '',
    prescriptionDrug: '',
    visionPlan: '',
    longTermDisability: '',
    shortTermDisability: '',
    criticalIllnessInsurance: '',
    groupRRSPandDPSP: '',
    groupTFSA: '',
    companyName: '',
    natureOfBusiness: '',
    contactPerson: '',
    businessYear: '',
    numberOfFullTime: '',
    numberOfcovered: '',
    reasonNotSame: '',
    phone: '',
    email: '',
    contactMethod: '',
    insuredNumber: '',
    insuredPersons: [],
    personID : '',
    quoteID : '',
    timeZone: timezone
  }
    return data
  }

// Group Enrolment Form initial data
export function groupEnrolmentFormInit() {
  const data = {
    // for admin info
    contractNumber: '',
    planClass: '',
    planMemberId: '',
    MemberType: '',
    DateOfHire: '',
    BillingGroupNumber: '',
    BillingGroupName: '',
    ContractHolderName: '',
    EffectiveDateOfCoverage: '',
    Occupation: '',
    Salary: '',
    SalaryBasis: '',
    childrenNumber: '',
    beneficiaryNumber: '',
    
    planMember: [{
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: null,
      age: 0,
      gender: '',
      language: '',
      address: '',
      aptNumber: '',
      city: '',
      province: '',
      postalCode: '',
      email: '',
      phone: '',
      provinceOfEmployment: '',
      maritalStatus: '',
      coverageSelection: '',
      extendedHealth: '',
      dental: '',
    }],

    banking: [{
      transitNumber:'',
      institutionNumber: '',
      accountNumber: ''
    }],

    spouse: [{
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: null,
      age: 0,
      gender: '',
      hasOwnBenefits: '',
      ownExtendedHealth: '',
      ownDental: '',
      ownBenefitsCarrier: '',
      extendedHealth: '',
      dental: ''
    }],

    children: [{
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: null,
      age: 0,
      gender: '',
      isStudent: '',
      isOverAgeDisabledChild: '',
      extendedHealth: '',
      dental: ''
    }],

    beneficiary: [{
      firstName: '',
      lastName: '',
      relationship: '',
      percentage: ''
    }],

    contingentBeneficiary: [{
      firstName: '',
      lastName: '',
      relationship: '',
      percentage: ''
    }],

    nominationOfTrustee: '',
    planMemberSignature: '',

    vendorID: '',
    enrolmentID : '',
    enrolmentDate: '',
    timeZone: timezone
  }
    return data
  }

// export function groupEnrolmentFormInit() {
//   const data = {
//     // for admin info
//     contractNumber: '',
//     planClass: '',
//     planMemberId: '',
//     MemberType: '',
//     DateOfHire: '',
//     BillingGroupNumber: '',
//     BillingGroupName: '',
//     ContractHolderName: '',
//     EffectiveDateOfCoverage: '',
//     Occupation: '',
//     Salary: '',
//     SalaryBasis: '',
//     childrenNumber: '2',
//     beneficiaryNumber: '2',
    
//     planMember: [{
//       firstName: 'Samantha',
//       lastName: 'Jin',
//       middleName: 'Middle',
//       birthDate: '1995-05-05',
//       age: 28,
//       gender: 'Female',
//       language: 'English',
//       address: '176 Otawa st',
//       aptNumber: '123',
//       city: 'Toronto',
//       province: null,
//       postalCode: 'M2M 2M2',
//       email: 'sujung8193@gmail.com',
//       phone: '416-645-3858',
//       provinceOfEmployment: null,
//       maritalStatus: 'Married',
//       coverageSelection: 'Family',
//       extendedHealth: '',
//       dental: '',
//     }],

//     banking: [{
//       transitNumber:'001',
//       institutionNumber: '12345',
//       accountNumber: '51231231'
//     }],

//     spouse: [{
//       firstName: 'James',
//       lastName: 'Park',
//       middleName: 'Mid',
//       birthDate: '1995-05-01',
//       age: 28,
//       gender: 'Male',
//       hasOwnBenefits: '',
//       ownExtendedHealth: 'Single',
//       ownDental: 'Family',
//       ownBenefitsCarrier: 'Sunlife',
//       extendedHealth: '',
//       dental: ''
//     }],

//     children: [{
//       firstName: 'Cubby',
//       lastName: 'Jin',
//       middleName: 'Middles',
//       birthDate: '2021-10-29',
//       age: 1,
//       gender: 'Male',
//       isStudent: 'True',
//       isOverAgeDisabledChild: 'False',
//       extendedHealth: '',
//       dental: ''
//     },
//     {
//       firstName: 'Baily',
//       lastName: 'Jin',
//       middleName: 'Middles',
//       birthDate: '2022-04-03',
//       age: 1,
//       gender: 'Female',
//       isStudent: '',
//       isOverAgeDisabledChild: ''
//     }],

//     beneficiary: [{
//       firstName: 'Cubby',
//       lastName: 'Jin',
//       relationship: 'Siblings',
//       percentage: '50'
//     },
//     {
//       firstName: 'Baily',
//       lastName: 'Jin',
//       relationship: 'Siblings',
//       percentage: '50'
//     }],

//     contingentBeneficiary: [{
//       firstName: '',
//       lastName: '',
//       relationship: '',
//       percentage: ''
//     }],

//     nominationOfTrustee: '',
//     planMemberSignature: '',

//     vendorID: '',
//     enrolmentID : '',
//     enrolmentDate: '',
//     timeZone: timezone
//   }
//     return data
//   }