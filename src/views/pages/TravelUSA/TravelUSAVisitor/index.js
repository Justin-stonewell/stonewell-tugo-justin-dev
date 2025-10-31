import { useState, useContext, useEffect } from 'react';
// core components
import { Grid, Typography, IconButton } from '@material-ui/core';
//components
import MetaTags from '../../../../components/common/MetaTags';
import SectionContent from '../../../../components/common/SectionContent'
import { Text, LanguageContext } from '../../../../components/common/LanguageProvider'
// import Accordion from '../../../../components/common/Accordion'
import BannerQuote from '../../../../components/common/BannerQuote';
import BannerUSA from '../../../../components/common/BannerUSA';
import CTA from '../../../../components/common/Footers/CallToAction';

import IconCard from '../../../../components/common/IconCard/IconCard';
import FeatureCard from '../../../../components/common/IconCard/FeatureCard';
import CustomizedTables, { CustomizedTables4Rows } from '../../../../components/common/Tables/basicTable';
import StickyLeftMenu from '../../../../components/common/StickyLeftMenu'
// import WhyUs from '../../../../components/common/WhyUs'
// import AccordionFAQ from '../../../ads/common/Accordion';
import Hidden from '@material-ui/core/Hidden'
import { Button } from '@material-ui/core';
import { Card, CardContent  } from '@mui/material';
// import { Rating } from '@mui/material';

// GIF
import directPaymentFinder from '../../../../assets/imgs/gif/direct-payment-finder-USA.gif'

//icons
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import HealthAndSafetySharpIcon from '@mui/icons-material/HealthAndSafetySharp';
import PaymentSharpIcon from '@mui/icons-material/PaymentSharp';
import LooksOneSharpIcon from '@mui/icons-material/LooksOneSharp';
import LooksTwoSharpIcon from '@mui/icons-material/LooksTwoSharp';
import Looks3SharpIcon from '@mui/icons-material/Looks3Sharp';
// import StarIcon from '@mui/icons-material/Star';
//logos
// import PatriotLogo from '../../../../assets/imgs/logo/Patriot-logo.png'
// import VisitorSecureLogo from '../../../../assets/imgs/logo/VisitorSecure-logo.png'

// banner Title
const bannerTitle = [<Text tid={`TravelInsurance.USA.Visitor.PageTitle`} />]

// banner Quote box
// const quoteBox = [
//   <iframe width="100%" height="{HEIGHT}" frameborder="0" allowtransparency="true" src="https://stonewell.brokersnexus.com/widget2/visitors-insurance/"></iframe>
// ]

// Breadcrumbs
const links = [
  {
      to: '/usa',
      name: 'Home'
  },
  // {
  //     to: '/usa/travel-insurance',
  //     name: 'Travel Insurance'
  // },  
  {
    to: '/usa/travel-insurance/visitor',
    name: 'TravelInsurance.USA.Visitor.PageTitle'
},  
] 

// Call To Action Banner Link
const CTALinks = 'https://stonewell.brokersnexus.com/visitors-insurance/'
      
// const faqLists = [
//   {
//     question: 'TravelInsurance.FAQ.list.CanBuyTIWithPreExisting',
//     answer: 'TravelInsurance.FAQ.list.CanBuyTIWithPreExisting.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.Pre-existing',
//     answer: 'TravelInsurance.FAQ.list.Pre-existing.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.WaitingPeriod',
//     answer: 'TravelInsurance.FAQ.list.WaitingPeriod.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.WhoContact',
//     answer: 'TravelInsurance.FAQ.list.WhoContact.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.WhenBuyTI',
//     answer: 'TravelInsurance.FAQ.list.WhenBuyTI.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.HowToExtendTI',
//     answer: 'TravelInsurance.FAQ.list.HowToExtendTI.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.CovidCovered',
//     answer: 'TravelInsurance.FAQ.list.CovidCovered.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.WhatDeductible',
//     answer: 'TravelInsurance.FAQ.list.WhatDeductible.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.WhatBeneficiary',
//     answer: 'TravelInsurance.FAQ.list.WhatBeneficiary.detail',
//   },

//   {
//     question: 'TravelInsurance.FAQ.list.HowToClaim',
//     answer: 'TravelInsurance.FAQ.list.HowToClaim.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.HowRefund',
//     answer: 'TravelInsurance.FAQ.list.HowRefund.detail',
//   },
//   {
//     question: 'TravelInsurance.FAQ.list.OutofPocket',
//     answer: 'TravelInsurance.FAQ.list.OutofPocket.detail',
//   },
// ]
// Products
const whoIsVisitor = [
  {
    title: 'tourists',
    src: '/imgs/icon/student.svg',
    src2: '/imgs/icon/student-bk.svg'
  },
  {
    title: 'relatives visiting family',
    src: '/imgs/icon/companion.svg',
    src2: '/imgs/icon/companion-bk.svg'
  },
  {
    title: 'newImmigrants',
    src: '/imgs/icon/graduate.svg',
    src2: '/imgs/icon/graduate-bk.svg'
  }
]  
//The reason Why need student Ins
const coverages = [
  {
    title: 'usaVisitorSumInsured',
    src: '/imgs/icon/dollar.svg',
    desc: 'We really don’t know when, where and how we’ll pass away but it will certainly happen in our life, having life insurance plan will bring you and your family peace of mind.',
  },
  {
    title: 'DentalHealthEyes',
    src: '/imgs/icon/dental.svg',
    desc: 'if you’re the main income stream earner in your family and loved ones financially depend on you, you must have a life insurance or similar back up plans in case you unexpectedly pass away. Life insurance can be very affordable and easy plans than other backup plans',
  },
  {
    title: 'ProServices',
    src: '/imgs/icon/doctor.svg',
    desc: 'You don’t want your family and loved ones in financial stress with outstanding mortgage, auto loan and other final expenses such as funeral costs.',
  },
  {
    title: 'prescriptionDrug',
    src: '/imgs/icon/drugs.svg',
    desc: 'Life insurance proceed can be used pay esate taxes. As we all know, life insurance proceed is tax free and this can minimize and significantly reduce the taxes to your heir',
  },
 
]

//benefit detail table
const PatriotBenefit = [
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.SumInsured',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.EmergencyMedical.detail',
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.WalkInClinic',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.WalkInClinic.detail',
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.UrgentCareClinic',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.UrgentCareClinic.detail',
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.EmergencyHospital',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.EmergencyHospital.detail',
    tooltip: 'TravelInsurance.Patriot.VI.Benefit.list.EmergencyHospital.tooltip'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.EmergencyHospitalNotUSA',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.EmergencyHospitalNotUSA.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.IntensiveCare',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.IntensiveCare.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.Outpatient',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.Outpatient.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.Examination',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.Examination.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.Chemotherapy',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.Chemotherapy.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.MedicalDevice',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.MedicalDevice.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.Dentist',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.Dentist.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.DentistAccident',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.DentistAccident.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.EyeExam',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.EyeExam.detail',
    tooltip: 'TravelInsurance.Patriot.VI.Benefit.list.EyeExam.tooltip'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.ChiropracticCare',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.ChiropracticCare.detail',
    tooltip: 'TravelInsurance.Patriot.VI.Benefit.list.ChiropracticCare.tooltip'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.PrescriptionDrug',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.PrescriptionDrug.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.ADandD',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.ADandD.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.AccidentalDeath',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.AccidentalDeath.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.BedsideVisit',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.BedsideVisit.detail',
    tooltip: 'TravelInsurance.Patriot.VI.Benefit.list.BedsideVisit.tooltip'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.Baggage',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.Baggage.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.ReturnTravel',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.ReturnTravel.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.ReturnofMinorChildren',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.ReturnofMinorChildren.detail',
    tooltip: 'TravelInsurance.Patriot.VI.Benefit.list.ReturnofMinorChildren.tooltip'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.Cremation',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.Cremation.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.PetReturn',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.PetReturn.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.PetAccidentalDeath',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.PetAccidentalDeath.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.IDTheft',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.IDTheft.detail'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.PersonalLiability',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.PersonalLiability.detail',
    tooltip: 'TravelInsurance.Patriot.VI.Benefit.list.PersonalLiability.tooltip'
  },
  {
    title: 'TravelInsurance.Patriot.VI.Benefit.list.PremiumExample',
    details: 'TravelInsurance.Patriot.VI.Benefit.list.PremiumExample.detail',
    tooltip: 'TravelInsurance.Patriot.VI.Benefit.list.PremiumExample.tooltip'
  }
 
]

const visitorSecureBenefit = [
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.SumInsured',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.UrgentCareClinic',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.UrgentCareClinic.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.EmergencyHospital',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.EmergencyHospital.detail',
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.EmergencyMedical.detail',
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.Inpatientsurgery',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.Inpatientsurgery.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.ConsultatntPhysician',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.ConsultatntPhysician.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.InpatientNurse',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.InpatientNurse.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.IntensiveCare',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.IntensiveCare.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.LocalAmbulance',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.LocalAmbulance.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientSurgery',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientSurgery.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientSurgeryRoom',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientSurgeryRoom.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientPreAdmissionTest',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientPreAdmissionTest.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientXraysLabs',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientXraysLabs.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientEmergencyRoom',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientEmergencyRoom.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientObservationRoom',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientObservationRoom.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientPrescriptionDrugs',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.OutpatientPrescriptionDrugs.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.Anesthesiologist',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.Anesthesiologist.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.DentalAccident',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.DentalAccident.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PhysicalTherapy',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PhysicalTherapy.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.MedicalDevice',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.MedicalDevice.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PreexistingCondition',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PreexistingCondition.detail',
    tooltip: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PreexistingCondition.tooltip'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.RepatriationRemains',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.RepatriationRemains.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.LocalBurialCremation',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.LocalBurialCremation.detail'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.ADandD',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.ADandD.detail',
    tooltip: 'TravelInsurance.VisitorSecure.VI.Benefit.list.ADandD.tooltip'
  },
  {
    title: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PremiumExample',
    details: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PremiumExample.detail',
    tooltip: 'TravelInsurance.VisitorSecure.VI.Benefit.list.PremiumExample.tooltip'
  }
]


const stickyLeftMenu = [
  {
    href: '#why-should-buy-USA-insurance',
    title: 'TravelInsurance.WhyBuyLocal.Visitor.Japan.Title',
  },
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurance.USA.WhyNeed.Visitor.label',
  },
  {
    href: '#who-is-eligible-student-insurance',
    title: 'TravelInsurance.USA.WhoEligible.Visitor.label',
  },
  {
    href: '#benefit-summary',
    title: 'TravelInsurance.USA.Coverage.Visitor.label',
  },
  {
    href: '#how-to-purchase-recommendation',
    title: 'TravelInsurance.USA.PurchaseTip.Visitor.label',
  },
  // {
  //   href: '#stonewell-clients-real-claim-cases',
  //   title: 'Ads.TravelInsurance.Student.Section4.Title',
  // },
  {
    href: '#why-should-buy-canadian-insurance',
    title: 'TravelInsurance.USA.WhyBuyLocal.Visitor.Title',
  },
  {
    href: '#why-stonewell-number-one',
    title: 'Ads.TravelInsurance.Student.Section6.Title',
  },
  // {
  //   href: '#real-client-reviews',
  //   title: 'Ads.TravelInsurance.Student.Section8.Title',
  // },
  // {
  //   href: '#you-should-know-what-you-are-buying',
  //   title: 'TravelInsurance.FAQ.label',
  // },
  // {
  //   href: '#why-us-travel-insurance',
  //   title: 'Banner.Whyus.label',
  // },
]

const brochures = [
  {company:'Patriot',
    documents: [{"language" : "EN", "document_url" : "Brochures/usa/PatriotAmericaPlus-Visitor-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/usa/PatriotAmericaPlus-Visitor-Korean.pdf"}]
  },
  {company:'VisitorSecure',
    documents: [{"language" : "EN", "document_url" : "Brochures/usa/VisitorSecure-Visitor-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/usa/VisitorSecure-Visitor-Korean.pdf"}]
  }
]

//benefit detail table
const PremiumExamples = [
  {
    traveller: 'Age 30',
    destination: 'USA',
    plan: 'Safe Travels Elite (Fixed Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$48.60'
  },
  {
    traveller: 'Age 30',
    destination: 'USA',
    plan: 'Patriot America Plus (Comprehensive Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$95.25'
  },
  {
    traveller: 'Age 40',
    destination: 'USA',
    plan: 'Safe Travels Elite (Fixed Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$49.50'
  },
  {
    traveller: 'Age 40',
    destination: 'USA',
    plan: 'Patriot America Plus (Comprehensive Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$117.00'
  },
  {
    traveller: 'Age 50',
    destination: 'USA',
    plan: 'Safe Travels Elite (Fixed Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$70.20'
  },
  {
    traveller: 'Age 50',
    destination: 'USA',
    plan: 'Patriot America Plus (Comprehensive Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$190.13'
  },
  {
    traveller: 'Age 60',
    destination: 'USA',
    plan: 'Safe Travels Elite (Fixed Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$87.00'
  },
  {
    traveller: 'Age 60',
    destination: 'USA',
    plan: 'Patriot America Plus (Comprehensive Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$230.25'
  },
  {
    traveller: 'Age 70',
    destination: 'USA',
    plan: 'Safe Travels Elite (Fixed Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$133.80'
  },
  {
    traveller: 'Age 70',
    destination: 'USA',
    plan: 'Safe Travels USA Comprehensive (Comprehensive Plan)',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$537.90'
  }
]

// Claim List Accordion
// const claimLists = [
//   {
//     question: 'Ads.TravelInsurance.Student.Claims.Dental.Title',
//     answer: 
//     <>
//         <ul>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case1'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case2'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case3'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case4'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case5'} /></li>
//         </ul>
//     </>
//     ,
//   },
//   {
//     question: 'Ads.TravelInsurance.Student.Claims.Therapies.Title',
//     answer: 
//     <>
//         <ul>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case1'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case2'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case3'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case4'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case5'} /></li>
//         </ul>
//     </>
//   },
//   {
//     question: 'Ads.TravelInsurance.Student.Claims.WalkinClinic.Title',
//     answer: 
//     <>
//         <ul>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case1'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case2'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case3'} /></li>
//         </ul>
//     </>
//   },
//   {
//     question: 'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Title',
//     answer: 
//     <>
//         <ul>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case1'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case2'} /></li>
//             <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case3'} /></li>
//         </ul>
//     </>
//   },
// ]

const CardSection5 = [
  {
    title:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Visitor.Reason1.Title'} />,
    value:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Visitor.Reason1.Content'} />,
    icon: <HealthAndSafetySharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
    title:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Visitor.Reason2.Title'} />,
    value:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Visitor.Reason2.Content'} />,
    icon: <PaymentSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  }
]

const CardSection6 = [
  {
      title:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason1.Title'} />,
      value:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason1.Content'} />,
      icon: <LooksOneSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
      title:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason2.Title'} />,
      value:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason2.Content'} />,
      icon: <LooksTwoSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
      title:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason3.Title'} />,
      value:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason3.Content'} />,
      icon: <Looks3SharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  }
  ]

// const CardSection7 = [
//   {
//     title:  <>
//               <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>Y.K</Typography>
//               <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Toronto, ON</Typography>
//             </>,
//     value:  <Text tid={'Ads.TravelInsurance.Student.Review1.Content'} />,
//     icon:   <Rating
//               name="text-feedback"
//               value={5}
//               readOnly
//               precision={0.5}
//               emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
//             />
//   },
//   {
//     title:  <>
//               <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>K.J</Typography>
//               <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Montreal, QC</Typography>
//             </>,
//     value:  <Text tid={'Ads.TravelInsurance.Student.Review2.Content'} />,
//     icon:   <Rating
//               name="text-feedback"
//               value={5}
//               readOnly
//               precision={0.5}
//               emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
//             />
//   },
//   {
//     title:  <>
//               <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>P.N</Typography>
//               <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Surrey, BC</Typography>
//             </>,
//     value:  <Text tid={'Ads.TravelInsurance.Student.Review3.Content'} />,
//     icon:   <Rating
//               name="text-feedback"
//               value={5}
//               readOnly
//               precision={0.5}
//               emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
//             />
//   }
// ]


export default function TravelUSAVisitor({match}) {

  const metaData = {
    title: 'Meta.TravelInsurance.USA.Visitor.Title',
    description: 'Meta.TravelInsurance.USA.Visitor.Description',
    canonical: match.url
  }    

  const [company, setCompany] = useState("Patriot")

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  // set userLanguage if url incluede /language
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)

  useEffect(() => {
    if (match.params.language){
      userLanguageChange(match.params.language)
    }
  },[match.params.language, userLanguageChange, userLanguage])
  


  return (
    <>
    <MetaTags data={metaData} />
    <BannerUSA title = {bannerTitle}  links={links} quote_url="https://stonewell.brokersnexus.com/visitors-insurance/" />
      <Grid container justifyContent="center">
          <Hidden mdDown>
            <Grid item lg={2}>
              <StickyLeftMenu
                pageName={<Text tid={'Travel Insurance'} />}
                lists={stickyLeftMenu}
                quote_url="/travel-insurance/quote/trip-info"
                title={<Text tid={'Travel Insurance'}/>}
              />
            </Grid>
          </Hidden>
          <Grid item sm={12} lg={6}>

            
          <section id="why-should-buy-USA-insurance">
              <Grid container>
                  <Grid item xs={12}>
                    <SectionContent
                      label="TravelInsurance.WhyBuyLocal.Visitor.Japan.Title"
                      detail="TravelInsurance.WhyBuyLocal.Visitor.USA.detail"
                      subTitle="TravelInsurance.WhyBuyLocal.Visitor.USA.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12}  style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em'}}>
                       <img src={directPaymentFinder} alt="Direct Payment Facility Finder United States" width="100%" />
                  </Grid>
              </Grid>
            </section>
            
            <section className="target" id="why-buy-travel-insurance">
              <SectionContent
                label="TravelInsurance.USA.WhyNeed.Visitor.label"
                detail="TravelInsurance.USA.WhyNeed.Visitor.detail"
                subTitle="TravelInsurance.USA.WhyNeed.Visitor.Subtitle"
              />
              {/* Quote Box */}
              <Hidden mdDown>
                <Grid item container xs={12} style={{ margin:'5vh 2vh', background:'#f5f7f5', padding:'2vh'}}>
                  <Grid item container justifyContent='center'>
                    <Typography variant='h2' style={{ fontSize:'25px', fontWeight:'400'}}>
                        <Text tid={'TravelInsurance.USA.GetQuote.Label'}/>
                    </Typography>
                  </Grid>
                  <iframe width="100%" height="{HEIGHT}" frameBorder="0" title="Embedded Content from Stonewell USA" allowtransparency="true" src="https://stonewell.brokersnexus.com/widget2/visitors-insurance/"></iframe>
                </Grid>
              </Hidden>
            </section>
            <section id="who-is-eligible-student-insurance">
            <Grid container justifyContent="center">
              <Grid item xs={12} style={{ marginBottom:'-2rem'}}>
                <SectionContent
                  label="TravelInsurance.USA.WhoEligible.Visitor.label"
                  detail=""
                  subTitle="TravelInsurance.USA.WhoEligible.Visitor.subTitle"
                />
              </Grid>
              <Grid item xs={12}>
                <IconCard Content={whoIsVisitor} />
               </Grid>
            </Grid>
            </section>
            <section id="benefit-summary">
            <Grid container>
              <Grid item xs={12}>
              <SectionContent
                  label="TravelInsurance.USA.Coverage.Visitor.label"
                  detail="TravelInsurance.USA.Coverage.Visitor.detail"
                  subTitle="TravelInsurance.USA.Coverage.Visitor.Subtitle"
                />
               </Grid>
               <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', paddingBottom:'2vh'}}>
                <FeatureCard titles={coverages} />
               </Grid>
               
               {/* benefit summary table */}
               <Grid item container xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666', maxWidth:'1000px', margin:'auto'}}>
                {/* <Text tid={'TravelInsurance.VI.BenefitByPlan.detail'} /><br/><br/> */}
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="Patriot"? "#2a2f71": "#fff", color: company==="Patriot"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("Patriot")}>Comprehensive Plan</Button>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="VisitorSecure"? "#2a2f71": "#fff", color: company==="VisitorSecure"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("VisitorSecure")}>Fixed Plan</Button>
                <Grid item container style={{ padding:'2vh 2vh 0 2vh', fontWeight:'400', background:'#f5f3f7', marginTop:'2vh'}}>
                  {company==="Patriot" ? 
                      <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'TravelInsurance.USA.Coverage.ComprehensivePlan'}/></p>
                    : <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'TravelInsurance.USA.Coverage.FixedPlan'}/></p>
                  }
                </Grid>
               </Grid>
               <Grid item container xs={12} style={{ padding:'0 32px 16px 32px', maxWidth:'1000px', margin:'auto' }}>
                  {/* Logo Image and download brochure*/}
                  <Grid item xs={12} sm={12} md={3} lg={5}>
                    {/* <img
                      src={company==="Patriot"?PatriotLogo:VisitorSecureLogo}
                      alt='logo'
                      style={{width:'120px', display:'block', marginTop:'20px'}}
                    /> */}
                    <span style={{ fontSize:'1.5rem', fontWeight:'700', color:'#1c499f'}}>{company==="Patriot"?"Patriot America Plus":"VisitorSecure"}</span>
                  </Grid>
                  {/* Brochure */}
                  <Grid item xs={12} sm={12} md={9} lg={7}>
                    <IconButton aria-label="view" color="primary" 
                        onClick={() => {
                          let url = ''
                            const companyBrochure = brochures.filter(f => f.company.toLowerCase() === company.toLowerCase())
                            if (companyBrochure.length>0){
                              const brochure = companyBrochure[0].documents.filter(f => f.language === currentLanguage.toUpperCase())
                              if (brochure.length>0){
                                url = process.env.REACT_APP_S3_URL + brochure[0].document_url
                              }else{
                                const enBrochure = companyBrochure[0].documents.filter(f => f.language === 'EN')
                                if (enBrochure.length>0){
                                  url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url
                                }
                              }
                            }
                          window.open(url, '_blank')
                        }}
                    >
                      <DescriptionIcon />
                      <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                        <Text tid={'Quote.SeeMoreBenefit'}/>
                      </Typography>
                    </IconButton>
                  </Grid>
                  {/* Benefit summary */}
                  <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto' }}>
                    <CustomizedTables minRows={company==="Patriot"?PatriotBenefit:visitorSecureBenefit} />
                  </Grid>
               </Grid>

               <Grid item xs={12} style={{ padding:'0 32px', fontWeight:'600', fontSize:'12px', color:'red', maxWidth:'1000px', margin:'0 auto'}}>
               * <Text tid={'TravelInsurance.BenefitByPlan.policywording'} />
               </Grid>
               
            </Grid>
            </section>

            <Hidden mdDown>
              <section className="target" id="how-much-insurance-premium">
                <SectionContent
                  label="TravelInsurance.USA.HowMuchPremium.Visitor.label"
                  detail="TravelInsurance.USA.HowMuchPremium.Visitor.detail"
                  subTitle="TravelInsurance.USA.HowMuchPremium.Visitor.subTitle"
                />
                <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', padding:'0 32px 16px 32px' }}>
                  <CustomizedTables4Rows minRows={PremiumExamples} />
                </Grid>
              </section>
            </Hidden>
            
            <Grid container justifyContent="center"  >
            <Grid item xs={12} style={{maxWidth:"1000px"}}>
                <BannerQuote 
                  title = "TravelInsurance.USA.Coverage.Visitor.BannerQuote"
                  quote_Btn_Disable ="false" 
                  quote_url ='https://stonewell.brokersnexus.com/visitors-insurance/'/>
              </Grid>
            </Grid>

            <section className="target" id="how-to-purchase-recommendation">
              <SectionContent
                label="TravelInsurance.USA.PurchaseTip.Visitor.label"
                detail="TravelInsurance.USA.PurchaseTip.Visitor.detail"
                subTitle="TravelInsurance.USA.PurchaseTip.Visitor.subTitle"
              />
            </section>

            {/* <section id="stonewell-clients-real-claim-cases">
              <Grid item container xs={12}>
                <SectionContent
                  label="TravelInsurance.USA.ClaimStory.Visitor.Title"
                  detail="TravelInsurance.USA.ClaimStory.Visitor.Description3"
                  subTitle="TravelInsurance.USA.ClaimStory.Visitor.Subtitle"
                />
              </Grid>
              <Grid item container xs={12} justifyContent="center" style={{ maxWidth:'1000px', margin:'auto' }}>
                <Grid item container>
                  <AccordionFAQ faqLists={claimLists}/>
                </Grid>
              </Grid>
            </section> */}


            {/* Why USA Insurance */}
            <section id="why-should-buy-canadian-insurance">
              <Grid container>
                  <Grid item xs={12}>
                    <SectionContent
                      label="TravelInsurance.USA.WhyBuyLocal.Visitor.Title"
                      detail="TravelInsurance.USA.WhyBuyLocal.Visitor.detail"
                      subTitle="TravelInsurance.USA.WhyBuyLocal.Visitor.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12}  style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em'}}>
                      {CardSection5.map((con, index) => (
                          <Grid item key={index} xs={12} sm={12} md={6} lg={6}>
                              <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'0px 4px 20px rgba(0,0,0,.08)' }}>
                                  {con.icon}
                                  <CardContent>
                                      <div style={{ fontSize:'24px', fontWeight:'400', lineHeight:'30px', color:'#2a2f71', marginBottom:'3vh'}}>
                                          {con.title}
                                      </div>
                                      <Typography style={{ fontSize:'16px', fontWeight:'300' }}>
                                      {con.value}
                                      </Typography>
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))}
                  </Grid>
              </Grid>
            </section>

            {/* Why Stonewell */}
            <section id="why-stonewell-number-one">
              <Grid container style={{ marginBottom:'10vh' }}>
                  <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                    <SectionContent
                      label="Ads.TravelInsurance.Student.Section6.Title"
                      detail=""
                      subTitle="TravelInsurance.USA.Visitor.subTitle"
                    />
                  </Grid>
                  <Grid item container xs={12} style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em'}}>
                      {CardSection6.map((con, index) => (
                          <Grid item key={index} xs={12} sm={12}>
                              <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'none', background:'#F2F4F9', borderRadius:'10px' }}>
                                  {con.icon}
                                  <CardContent>
                                      <div style={{ fontSize:'24px', fontWeight:'400', lineHeight:'30px', color:'#2a2f71', marginBottom:'3vh'}}>
                                          {con.title}
                                      </div>
                                      <Typography style={{ fontSize:'16px', fontWeight:'300' }}>
                                      {con.value}
                                      </Typography>
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))}
                  </Grid>
              </Grid>
            </section>

            {/* Real Client Review */}
            {/* <section id="real-client-reviews">
              <Grid container>
                  <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                    <SectionContent
                      label="Ads.TravelInsurance.Student.Section8.Title"
                      detail=""
                      subTitle="Ads.TravelInsurance.Student.Section8.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12} style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em'}}>
                      {CardSection7.map((con, index) => (
                          <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                              <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'none' }}>
                                  {con.icon}
                                  <CardContent>
                                      <div style={{ fontSize:'24px', fontWeight:'400', lineHeight:'30px', color:'#2a2f71', marginBottom:'3vh'}}>
                                          {con.title}
                                      </div>
                                      <Typography style={{ fontSize:'16px', fontWeight:'300' }}>
                                      {con.value}
                                      </Typography>
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))}
                  </Grid>
              </Grid>
            </section> */}

            {/* FAQ */}
            {/* <section id="you-should-know-what-you-are-buying">
            <Grid container>
                <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                  <SectionContent
                    label="TravelInsurance.USA.FAQ.label"
                    detail=""
                    subTitle="TravelInsurance.USA.FAQ.subTitle"
                  />
                </Grid>
                <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto'}}>
                  <Accordion faqLists={faqLists} />
                </Grid>
              </Grid>
            </section> */}

            {/* <section id="why-us-travel-insurance">
              <Grid container justifyContent="center" >
                <Grid item xs={12}>
                  <SectionContent
                    label="Banner.Whyus.label"
                    detail="Banner.Whyus.detail"
                    subTitle="TravelInsurance.Section.Student.subTitle"
                  />
                </Grid>
                <Grid item xs={12} style={{maxWidth:"1000px"}}>
                  <WhyUs />
                </Grid>
              </Grid>
          </section> */}

            
          </Grid>
        </Grid>
        <CTA link={CTALinks}/>
    </>
  )
}

