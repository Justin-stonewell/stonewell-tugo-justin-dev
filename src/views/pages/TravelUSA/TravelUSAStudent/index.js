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
// import VisitorSecureLogo from '../../../../assets/imgs/logo/StudentSecure-logo.png'

// banner Title
const bannerTitle = [<Text tid={`TravelInsurance.USA.Student.PageTitle`} />]

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
    to: '/usa/travel-insurance/student',
    name: 'TravelInsurance.USA.Student.PageTitle'
},  
] 

// Call To Action Banner Link
const CTALinks = 'https://stonewell.brokersnexus.com/international-student-insurance/'
      
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
const whoIsStudent = [
  {
    title: 'f1Student',
    src: '/imgs/icon/student.svg',
    src2: '/imgs/icon/student-bk.svg'
  },
  {
    title: 'f2Family',
    src: '/imgs/icon/companion.svg',
    src2: '/imgs/icon/companion-bk.svg'
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
const patriotExchangeProgramBenefit = [
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.SumInsured',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Deductible',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Deductible.detail',
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Physician',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.UrgentCare',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.WalkinClinic',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.WalkinClinic.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyRoom',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyRoom.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Hospitalization',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.IntensiveCare',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.BedsideVisit',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.BedsideVisit.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.OutPatient',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Examination',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Radiology',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PreAdmissionTesting',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Surgery',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ReconstructiveSurgery',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ReconstructiveSurgery.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.AssistantSurgeon',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.AssistantSurgeon.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Anesthesia',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.MedicalDevice',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ChiropracticCare',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ChiropracticCare.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PhysicalTherapy',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PhysicalTherapy.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ExtendedCareFacility',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ExtendedCareFacility.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.HomeNursingCare',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.HomeNursingCare.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PrescriptionDrug',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PrescriptionDrug.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PrescriptionDrug.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.SubstanceAbuseInPatient',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.SubstanceAbuseInPatient.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.SubstanceAbuseOutPatient',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.SubstanceAbuseOutPatient.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyLocalAmbulance',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum2.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyLocalAmbulance.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyMedicalEvacuation',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum2.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyMedicalEvacuation.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.DentalTreatment',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.DentalTreatment.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.DentalTreatment.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.TraumaticDentalInjury',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.TraumaticDentalInjury.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyReunion',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum2.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.EmergencyReunion.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.InterfacilityAmbulanceTransfer',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.InterfacilityAmbulanceTransfer.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.InterfacilityAmbulanceTransfer.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.RepatriationforMedicalTreatment',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum2.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.RepatriationforMedicalTreatment.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ReturnofMortalRemains',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum2.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ReturnofMortalRemains.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ADandD',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ADandD.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.ADandD.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.IncidentalTrip',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum1.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.IncidentalTrip.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PersonalLiability',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum3.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.PersonalLiability.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.LostPersonalProperty',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum3.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.LostPersonalProperty.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.LimitedHighSchoolandCollegeSports',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.Maximum3.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.LimitedHighSchoolandCollegeSports.tooltip'
  },
  {
    title: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.LegalAssistance',
    details: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.LegalAssistance.detail',
    tooltip: 'TravelInsurance.PatriotExchangeProgram.ST.Benefit.list.LegalAssistance.tooltip'
  },
 
 
]

const studentSecureSmartBenefit = [
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.SumInsured',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.DeductibleNoEmergencyRoom',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.DeductibleNoEmergencyRoom.Detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.DeductibleEmergencyRoomUSA',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.DeductibleEmergencyRoomUSA.Detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.CoinsuranceUSA',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.CoinsuranceUSA.Detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.CoinsuranceNotUSA',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.CoinsuranceNotUSA.Detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyHospital',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyHospital.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.LocalAmbulance',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.LocalAmbulance.detail'
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.IntensiveCare',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.IntensiveCare.detail'
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.Outpatient',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.Outpatient.detail'
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.OutpatientPrescriptionDrugs',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.OutpatientPrescriptionDrugs.detail'
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.Vaccinations',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.Vaccinations.detail'
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.Mentalhealthdisorders',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.Mentalhealthdisorders.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.DentalTreatmentAccident',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.DentalTreatmentAccident.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyDental',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyDental.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.PreExistingCondition',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.PreExistingCondition.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.Therapy',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.Therapy.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.Sports',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.Sports.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.SchoolSports',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.SchoolSports.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyReunion',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyReunion.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyMedicalEvacuation',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.EmergencyMedicalEvacuation.detail',
  },
  {
    title: 'TravelInsurance.StudentSecure.ST.Benefit.list.RepatriationofRemains',
    details: 'TravelInsurance.StudentSecure.ST.Benefit.list.RepatriationofRemains.detail',
  },
]


const stickyLeftMenu = [
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurance.USA.WhyNeed.Student.label',
  },
  {
    href: '#who-is-eligible-student-insurance',
    title: 'TravelInsurance.USA.WhoEligible.Student.label',
  },
  {
    href: '#benefit-summary',
    title: 'TravelInsurance.USA.Coverage.Student.label',
  },
  {
    href: '#why-should-buy-USA-insurance',
    title: 'TravelInsurance.WhyBuyLocal.Visitor.Japan.Title',
  },
  {
    href: '#how-much-insurance-premium',
    title: 'TravelInsurance.USA.HowMuchPremium.Student.label',
  },
  {
    href: '#is-scam',
    title: 'TravelInsurance.IsScam.Student.label',
  },
  // {
  //   href: '#stonewell-clients-real-claim-cases',
  //   title: 'Ads.TravelInsurance.Student.Section4.Title',
  // },
  {
    href: '#why-should-buy-canadian-insurance',
    title: 'TravelInsurance.USA.WhyBuyLocal.Student.Title',
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
  {company:'PatriotExchangeProgram',
    documents: [{"language" : "EN", "document_url" : "Brochures/usa/PatriotExchangeProgram-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/usa/PatriotExchangeProgram-International-Student-Korean.pdf"}]
  },
  {company:'StudentSecure',
    documents: [{"language" : "EN", "document_url" : "Brochures/usa/StudentSecure-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/usa/StudentSecure-International-Student-Korean.pdf"}]
  }
]

//benefit detail table
const PremiumExamples = [
  {
    traveller: 'Age 20',
    destination: 'USA',
    plan: 'StudentSecure Smart',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$31.62'
  },
  {
    traveller: 'Age 20',
    destination: 'USA',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$51.38'
  },
  {
    traveller: 'Age 25',
    destination: 'USA',
    plan: 'StudentSecure Smart',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$67.27'
  },
  {
    traveller: 'Age 25',
    destination: 'USA',
    plan: 'Patriot Exchange Program',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$97.50'
  },
  {
    traveller: 'Age 30',
    destination: 'USA',
    plan: 'StudentSecure Smart',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$67.27'
  },
  {
    traveller: 'Age 30',
    destination: 'USA',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$69.38'
  },
  {
    traveller: 'Age 35',
    destination: 'USA',
    plan: 'ExchangeGuard Essential',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$85.50'
  },
  {
    traveller: 'Age 35',
    destination: 'USA',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$69.38'
  },
  {
    traveller: 'Age 40',
    destination: 'USA',
    plan: 'ExchangeGuard Essential',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$89.70'
  },
  {
    traveller: 'Age 40',
    destination: 'USA',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$93.38'
  },
  {
    traveller: 'Age 45',
    destination: 'USA',
    plan: 'ExchangeGuard Essential',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$89.70'
  },
  {
    traveller: 'Age 45',
    destination: 'USA',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$93.38'
  },
  {
    traveller: 'Age 50',
    destination: 'USA',
    plan: 'ExchangeGuard Essential',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$171.90'
  },
  {
    traveller: 'Age 50',
    destination: 'USA',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$151.13'
  },
 
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
    title:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Student.Reason1.Title'} />,
    value:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Student.Reason1.Content'} />,
    icon: <HealthAndSafetySharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
    title:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Student.Reason2.Title'} />,
    value:  <Text tid={'TravelInsurance.USA.WhyBuyLocal.Student.Reason2.Content'} />,
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


export default function TravelUSAStudent({match}) {

  const metaData = {
    title: 'Meta.TravelInsurance.USA.Student.Title',
    description: 'Meta.TravelInsurance.USA.Student.Description',
    canonical: match.url
  }    

  const [company, setCompany] = useState("PatriotExchangeProgram")

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
    <BannerUSA title = {bannerTitle}  links={links} quote_url="https://stonewell.brokersnexus.com/international-student-insurance/" />
      <Grid container justifyContent="center">
          <Hidden mdDown>
            <Grid item lg={2}>
              <StickyLeftMenu
                pageName={<Text tid={'Travel Insurance'} />}
                lists={stickyLeftMenu}
                // quote_url="/travel-insurance/quote/trip-info"
                title={<Text tid={'Travel Insurance'}/>}
              />
            </Grid>
          </Hidden>
          <Grid item sm={12} lg={6}>
            
            <section className="target" id="why-buy-travel-insurance">
              <SectionContent
                label="TravelInsurance.USA.WhyNeed.Student.label"
                detail="TravelInsurance.USA.WhyNeed.Student.detail"
                subTitle="TravelInsurance.USA.WhyNeed.Student.Subtitle"
              />
              <Hidden mdDown>
                {/* Quote Box */}
                <Grid item container xs={12} style={{ margin:'5vh 2vh', background:'#f5f7f5', padding:'2vh 0'}}>
                  <Grid item container justifyContent='center'>
                    <Typography variant='h2' style={{ fontSize:'25px', fontWeight:'400'}}>
                        <Text tid={'TravelInsurance.USA.GetQuote.Label'}/>
                    </Typography>
                  </Grid>
                  <iframe width="100%" height="400px" frameborder="0"title="Embedded Content from Stonewell USA"  allowtransparency="true" src="https://stonewell.brokersnexus.com/widget3/international-student-insurance/"></iframe>
                </Grid>
              </Hidden>
            </section>
            <section id="who-is-eligible-student-insurance">
            <Grid container justifyContent="center">
              <Grid item xs={12} style={{ marginBottom:'-2rem'}}>
                <SectionContent
                  label="TravelInsurance.USA.WhoEligible.Student.label"
                  detail=""
                  subTitle="TravelInsurance.USA.WhoEligible.Student.subTitle"
                />
              </Grid>
              <Grid item xs={12}>
                <IconCard Content={whoIsStudent} />
               </Grid>
            </Grid>
            </section>
            <section id="benefit-summary">
            <Grid container>
              <Grid item xs={12}>
              <SectionContent
                  label="TravelInsurance.USA.Coverage.Student.label"
                  detail="TravelInsurance.USA.Coverage.Student.detail"
                  subTitle="TravelInsurance.USA.Coverage.Student.Subtitle"
                />
               </Grid>
               <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', paddingBottom:'2vh'}}>
                <FeatureCard titles={coverages} />
               </Grid>
               
               {/* benefit summary table */}
               <Grid item container xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666', maxWidth:'1000px', margin:'auto'}}>
                {/* <Text tid={'TravelInsurance.ST.BenefitByPlan.detail'} /><br/><br/> */}
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="PatriotExchangeProgram"? "#2a2f71": "#fff", color: company==="PatriotExchangeProgram"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("PatriotExchangeProgram")}>Comprehensive Plan</Button>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="StudentSecure"? "#2a2f71": "#fff", color: company==="StudentSecure"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("StudentSecure")}>Fixed Plan</Button>
                <Grid item container style={{ padding:'2vh 2vh 0 2vh', fontWeight:'400', background:'#f5f3f7', marginTop:'2vh'}}>
                  {company==="PatriotExchangeProgram" ? 
                      <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'TravelInsurance.USA.Coverage.ComprehensivePlan'}/></p>
                    : <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'TravelInsurance.USA.Coverage.FixedPlan'}/></p>
                  }
                </Grid>
               </Grid>
               <Grid item container xs={12} style={{ padding:'0 32px 16px 32px', maxWidth:'1000px', margin:'auto' }}>
                  {/* Logo Image and download brochure*/}
                  <Grid item xs={12} sm={12} md={3} lg={5}>
                    {/* <img
                      src={company==="PatriotExchangeProgram"?PatriotLogo:VisitorSecureLogo}
                      alt='logo'
                      style={{width:'120px', display:'block', marginTop:'20px'}}
                    /> */}
                    <span style={{ fontSize:'1.5rem', fontWeight:'700', color:'#1c499f'}}>{company==="PatriotExchangeProgram"?"Patriot Exchange Program":"StudentSecure Smart"}</span>
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
                    <CustomizedTables minRows={company==="PatriotExchangeProgram"?patriotExchangeProgramBenefit:studentSecureSmartBenefit} />
                  </Grid>
               </Grid>

               <Grid item xs={12} style={{ padding:'0 32px', fontWeight:'600', fontSize:'12px', color:'red', maxWidth:'1000px', margin:'0 auto'}}>
               * <Text tid={'TravelInsurance.BenefitByPlan.policywording'} />
               </Grid>
               
            </Grid>
            </section>

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
            
            <Hidden mdDown>
              <section className="target" id="how-much-insurance-premium">
                <SectionContent
                  label="TravelInsurance.USA.HowMuchPremium.Student.label"
                  detail="TravelInsurance.USA.HowMuchPremium.Student.detail"
                  subTitle="TravelInsurance.USA.HowMuchPremium.Student.subTitle"
                />
                <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', padding:'0 32px 16px 32px' }}>
                  <CustomizedTables4Rows minRows={PremiumExamples} />
                </Grid>
              </section>
            </Hidden>

            <Grid container justifyContent="center"  >
            <Grid item xs={12} style={{maxWidth:"1000px"}}>
                <BannerQuote 
                  title = "TravelInsurance.USA.Coverage.Student.BannerQuote"
                  quote_Btn_Disable ="false" 
                  quote_url ='https://stonewell.brokersnexus.com/international-student-insurance/'/>
              </Grid>
            </Grid>

            <section className="target" id="is-scam">
              <SectionContent
                label="TravelInsurance.IsScam.Student.label"
                detail="TravelInsurance.IsScam.Student.detail"
                subTitle="TravelInsurance.USA.IsScam.Student.subTitle"
              />
            </section>

            {/* <section id="stonewell-clients-real-claim-cases">
              <Grid item container xs={12}>
                <SectionContent
                  label="TravelInsurance.USA.ClaimStory.Student.Title"
                  detail="TravelInsurance.USA.ClaimStory.Student.Description3"
                  subTitle="TravelInsurance.USA.ClaimStory.Student.Subtitle"
                />
              </Grid>
              <Grid item container xs={12} justifyContent="center" style={{ maxWidth:'1000px', margin:'auto' }}>
                <Grid item container>
                  <AccordionFAQ faqLists={claimLists}/>
                </Grid>
              </Grid>
            </section> */}

            {/* Why Canadian Insurance */}
            <section id="why-should-buy-canadian-insurance">
              <Grid container>
                  <Grid item xs={12}>
                    <SectionContent
                      label="TravelInsurance.USA.WhyBuyLocal.Student.Title"
                      detail="TravelInsurance.USA.WhyBuyLocal.Student.detail"
                      subTitle="TravelInsurance.USA.WhyBuyLocal.Student.Subtitle"
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
                      subTitle="TravelInsurance.USA.Student.subTitle"
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

