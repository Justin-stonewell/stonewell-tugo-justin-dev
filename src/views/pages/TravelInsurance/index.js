import React, { useContext, useEffect, useState } from 'react'
// import { makeStyles } from '@material-ui/core/styles';
//components (common)
import { Grid, Typography, IconButton } from '@material-ui/core'
import { Rating } from '@mui/material';
import { Card, CardContent  } from '@mui/material';
import { Button } from '@material-ui/core';

import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner'
import SectionContent from '../../../components/common/SectionContent'
import { LanguageContext, Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
// import BannerQuote from '../../../components/common/BannerQuote'
import FeatureCard from '../../../components/common/IconCard/FeatureCard';
import CustomizedTables, { CustomizedTables4Rows } from '../../../components/common/Tables/basicTable';

//components
// import Selection from './Selection'
// import ProductLarge from '../../../components/common/Product/ProductLarge'
import Products from '../../../components/common/Product/Products'
//3rd library
import Hidden from '@material-ui/core/Hidden'
// import { Typography } from '@material-ui/core';
// image
import allianzLogo from '../../../../src/assets/imgs/logo/allianz-logo.png'
import imgLogo from '../../../assets/imgs/logo/img-logo2.png'
// GIF
import directPaymentFinder from '../../../../src/assets/imgs/gif/direct-payment-finder-USA.gif'

// icons
import StarIcon from '@mui/icons-material/Star';
import LooksOneSharpIcon from '@mui/icons-material/LooksOneSharp';
import LooksTwoSharpIcon from '@mui/icons-material/LooksTwoSharp';
import Looks3SharpIcon from '@mui/icons-material/Looks3Sharp';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';

// banner Title
const bannerTitle = ['TravelInsurace.BannerTitle']
const faqLists = [
  {
    question: 'TravelInsurace.FAQ.list.WhyNeedCanadianTI',
    answer: 'TravelInsurace.FAQ.list.WhyNeedCanadianTI.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.CanBuyTIWithPreExisting',
    answer: 'TravelInsurace.FAQ.list.CanBuyTIWithPreExisting.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.Pre-existing',
    answer: 'TravelInsurace.FAQ.list.Pre-existing.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WaitingPeriod',
    answer: 'TravelInsurace.FAQ.list.WaitingPeriod.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhoContact',
    answer: 'TravelInsurace.FAQ.list.WhoContact.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhenBuyTI',
    answer: 'TravelInsurace.FAQ.list.WhenBuyTI.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.HowToExtendTI',
    answer: 'TravelInsurace.FAQ.list.HowToExtendTI.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.CovidCovered',
    answer: 'TravelInsurace.FAQ.list.CovidCovered.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhatDeductible',
    answer: 'TravelInsurace.FAQ.list.WhatDeductible.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhatBeneficiary',
    answer: 'TravelInsurace.FAQ.list.WhatBeneficiary.detail',
  },

  {
    question: 'TravelInsurace.FAQ.list.HowToClaim',
    answer: 'TravelInsurace.FAQ.list.HowToClaim.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.HowRefund',
    answer: 'TravelInsurace.FAQ.list.HowRefund.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.OutofPocket',
    answer: 'TravelInsurace.FAQ.list.OutofPocket.detail',
  },
]
const stickyLeftMenu = [
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurace.Definition.label',
  },
  {
    href: '#selection-of-travel-insurance',
    title: 'TravelInsurace.Selection.label',
  },
  {
    href: '#real-client-reviews',
    title: 'TravelInsurance.Visitor.Reviews.Label',
  },
  {
    href: '#why-stonewell-number-one',
    title: 'Ads.TravelInsurance.Student.Section6.Title',
  },
  {
    href: '#you-should-know-what-you-are-buying',
    title: 'TravelInsurace.FAQ.label',
  },
  {
    href: '#why-us-travel-insurance',
    title: 'Banner.Whyus.label',
  },
]
// Breadcrumbs
const links = [
  {

      to: '/',
      name: 'Home'
  },
  {
 
      to: '/travel-insurance',
      name: 'Travel Insurance'
  },
  
] 
// Products
const travelProducts = [
  {
    title: <Text tid={`TravelInsurace.WhichPlan.list.USA`} />,
    description: <Text tid={`TravelInsurace.WhichPlan.list.USA.Who`} />,
    img: 'USAvisitor',
    url: 'usa/travel-insurance/visitor',
  },
  {
    title: <Text tid={`TravelInsurace.WhichPlan.list.Canada`} />,
    description: <Text tid={`TravelInsurace.WhichPlan.list.Canada.Who`} />,
    img: 'CanadaTravel',
    url: 'travel-insurance/visitor',
  },
  {
    title: <Text tid={`TravelInsurace.WhichPlan.list.Europe`} />,
    description: <Text tid={`TravelInsurace.WhichPlan.list.Europe.Who`} />,
    img: 'EuropeTravel',
    url: 'https://stonewell.brokersnexus.com/travel-health-insurance/',
  },
  {
    title: <Text tid={`TravelInsurace.WhichPlan.list.WorldWide`} />,
    description: <Text tid={`TravelInsurace.WhichPlan.list.WorldWide.Who`} />,
    img: 'travelIns2',
    url: 'https://stonewell.brokersnexus.com/travel-health-insurance/',
  },
  
]

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

const brochures = [
  {company:'PatriotExchangeProgram',
    documents: [{"language" : "EN", "document_url" : "Brochures/usa/PatriotExchangeProgram-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/usa/PatriotExchangeProgram-International-Student-Korean.pdf"}]
  },
  {company:'Allianz',
    documents: [{"language" : "EN", "document_url" : "Brochures/Allianz-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Allianz-International-Student-Korean.pdf"}, 
                {"language" : "AR", "document_url" : "Brochures/Allianz-International-Student-Arabic.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Allianz-International-Student-Chinese(Simplified).pdf"}, 
                {"language" : "CH_T", "document_url" : "Brochures/Allianz-International-Student-Chinese(Traditional).pdf"}, 
                {"language" : "PT_BR", "document_url" : "Brochures/Allianz-International-Student-Portuguese(Brazil).pdf"}, 
                {"language" : "ES", "document_url" : "Brochures/Allianz-International-Student-Spanish.pdf"}]
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

//benefit detail table
const allianzBenefit = [
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.SumInsured',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyHospital',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyHospital.detail',
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyMedical.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.ProfessionalServices.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.Drug',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.Drug.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.DentalEmergencies.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.DentalEmergencies.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.DentalAccident',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.DentalAccident.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.WisdomTeeth',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.WisdomTeeth.detail',
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EyeExamination',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EyeExamination.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.EyeExamination.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.PhysicalExamination',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.PhysicalExamination.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.PhysicalExamination.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.Maternity',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.Maternity.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.Maternity.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.TutorialServices',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.TutorialServices.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.TutorialServices.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.FamilyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.AccidentalDeath',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.AccidentalDeath.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.AccidentalDeath.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.ReturnofDeceased.detail',
  },  
]

//benefit detail table
const PremiumExamples = [
  {
    traveller: 'Age 20',
    destination: 'USA',
    plan: 'StudentSecure Smart',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$31.62 USD'
  },
  {
    traveller: 'Age 20',
    destination: 'Canada',
    plan: 'Allanz Student Plan',
    maxInsured: '$5M CAD',
    period: '30 days',
    premium: '$62.70 CAD'
  },
  {
    traveller: 'Age 25',
    destination: 'USA',
    plan: 'StudentSecure Smart',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$67.27 USD'
  },
  {
    traveller: 'Age 25',
    destination: 'Canada',
    plan: 'Tugo Student Plan',
    maxInsured: '$2M CAD',
    period: '30 days',
    premium: '$56.40 CAD'
  },
  {
    traveller: 'Age 30',
    destination: 'France',
    plan: 'StudentSecure Smart',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$67.27 USD'
  },
  {
    traveller: 'Age 30',
    destination: 'Europe',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$69.38 USD'
  },
  {
    traveller: 'Age 35',
    destination: 'Canada',
    plan: 'Allainz Visitor to Canada Plan',
    maxInsured: '$50,000 CAD',
    period: '30 days',
    premium: '$90.00 CAD'
  },
  {
    traveller: 'Age 35',
    destination: 'Vietnam',
    plan: 'BlueCross Canadian Travel Plan',
    maxInsured: '$5M CAD',
    period: '30 days',
    premium: '$111.20 CAD'
  },
  {
    traveller: 'Age 35',
    destination: 'Thailand',
    plan: 'BlueCross Canadian Travel Plan',
    maxInsured: '$5M CAD',
    period: '5 days',
    premium: '$20.00 CAD'
  },
  {
    traveller: 'Age 40',
    destination: 'Switzerland',
    plan: 'Safe Travels International Cost Saver',
    maxInsured: '$500,000 USD',
    period: '30 days',
    premium: '$103.20 USD'
  },
  {
    traveller: 'Age 40',
    destination: 'Philippines',
    plan: 'Safe Travels International Cost Saver',
    maxInsured: '$500,000 USD',
    period: '5 days',
    premium: '$17.20 USD'
  },
  {
    traveller: 'Age 40',
    destination: 'Singapore',
    plan: 'Beacon International',
    maxInsured: '$550,000 USD',
    period: '5 days',
    premium: '$12.75 USD'
  },
  {
    traveller: 'Age 45',
    destination: 'China',
    plan: 'Patriot International Lite',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$78.38 USD'
  },
  {
    traveller: 'Age 45',
    destination: 'USA',
    plan: 'Patriot America Plus',
    maxInsured: '$100,000 USD',
    period: '30 days',
    premium: '$93.38 USD'
  },
  {
    traveller: 'Age 50',
    destination: 'Japan',
    plan: 'Beacon International',
    maxInsured: '$110,000 USD',
    period: '30 days',
    premium: '$117.75 USD'
  },
  {
    traveller: 'Age 50',
    destination: 'Canada',
    plan: 'Tugo Student Companion Plan Canada',
    maxInsured: '$2M CAD',
    period: '365 days',
    premium: '$686.20 CAD'
  },
 
]

const clientReviews = [
  {
    title:  <>
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>C.J</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Canada</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Visitor.Review1.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
  },
  {
    title:  <>
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>Y.K</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>United States</Typography>
            </>,
    value:  <Text tid={'TravelInsurance.Visitor.Review2.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
  },
  {
    title:  <>
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>P.H</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Europe</Typography>
            </>,
    value:  <Text tid={'TravelInsurance.Visitor.Review3.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
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

export default function TravelInsurance({match}) { 
  const metaData = {
    title: 'Meta.TravelInsurace.Title',
    description: 'Meta.TravelInsurace.Description',
    canonical: match.url
  }

  // set userLanguage if url incluede /language
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)
  const [company, setCompany] = useState("PatriotExchangeProgram")

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  useEffect(() => {
    if (match.params.language){
      userLanguageChange(match.params.language)
    }
  },[match.params.language, userLanguageChange, userLanguage])
    
  return (
    <>
      <MetaTags data={metaData} />

      <Banner 
        title={bannerTitle} 
        quote_url ='' 
        links={links}
      />
      <Grid container justifyContent="center" spacing={0}>
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
        <Grid item container md={12} lg={8} xl={6}>
          <Grid item xs={12}>
          <section className="target" id="why-buy-travel-insurance">
            <SectionContent
              label="TravelInsurace.Definition.label"
              detail="TravelInsurace.Definition.detail"
              subTitle="TravelInsurace.Definition.subTitle"
            />
          </section>
          </Grid>

          <section id="selection-of-travel-insurance" >
            <Grid container >
              <Grid item xs={12}>
              <SectionContent
                label="TravelInsurace.Selection.label"
                detail="TravelInsurace.Selection.detail"
                subTitle="TravelInsurace.Selection.subTitle"
              />
              </Grid>
              <Grid item container xs={12} justifyContent='center'>
                {/* <Selection/> */}
                {/* <ProductLarge Products={travelProducts}/> */}
                <Grid item style={{ maxWidth:'1000px'}}>
                  <Products Products={travelProducts}/>
                </Grid>
              </Grid>
            </Grid>
          </section>

          <Grid item xs={12}>
            <section id="why-do-you-travel-insurance">
              <SectionContent
                label="TravelInsurance.IsScam.Visitor.label"
                detail="TravelInsurance.IsScam.Visitor.detail"
                subTitle="TravelInsurace.WhyNeed.subTitle"
              />
            </section>
          </Grid>

          <section id="benefit-summary">
            <Grid container>
              <Grid item xs={12}>
              <SectionContent
                  label="TravelInsurance.Benefits.Visitor.label"
                  detail="TravelInsurance.Benefits.Visitor.detail"
                  subTitle="TravelInsurance.Benefits.Visitor.Subtitle"
                />
               </Grid>
               <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', paddingBottom:'2vh'}}>
                <FeatureCard titles={coverages} />
               </Grid>
               
               {/* benefit summary table */}
               <Grid item container xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666', maxWidth:'1000px', margin:'auto'}}>
                {/* <Text tid={'TravelInsurance.ST.BenefitByPlan.detail'} /><br/><br/> */}
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="PatriotExchangeProgram"? "#2a2f71": "#fff", color: company==="PatriotExchangeProgram"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("PatriotExchangeProgram")}>Comprehensive USA <Text tid={'Visitor to Canada Plan'} /></Button>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="Allianz"? "#2a2f71": "#fff", color: company==="Allianz"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("Allianz")}>Allianz <Text tid={'Student Plan'} /></Button>
                <Grid item container style={{ padding:'2vh 2vh 0 2vh', fontWeight:'400', background:'#f5f3f7', marginTop:'2vh'}}>
                  {company==="PatriotExchangeProgram" ? 
                      <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'TravelInsurance.USA.Coverage.ComprehensivePlan'}/></p>
                    : <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'TravelInsurance.Canada.Coverage.AllianzStudent'}/></p>
                  }
                </Grid>
               </Grid>
               <Grid item container xs={12} style={{ padding:'0 32px 16px 32px', maxWidth:'1000px', margin:'auto' }}>
                  {/* Logo Image and download brochure*/}
                  <Grid item xs={12} sm={12} md={3} lg={5}>
                  <img
                      src={company==="Allianz"?allianzLogo:imgLogo}
                      alt='logo'
                      style={{width:'120px', display:'block'}}
                    />
                    {/* <span style={{ fontSize:'1.5rem', fontWeight:'700', color:'#1c499f'}}>{company==="PatriotExchangeProgram"?"Patriot Exchange Program":"Allianz Student Plan Canada"}</span> */}
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
                    <CustomizedTables minRows={company==="PatriotExchangeProgram"?patriotExchangeProgramBenefit:allianzBenefit} />
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
                      detail="TravelInsurance.WhyBuyLocal.Visitor.Worldwide.detail"
                      subTitle="TravelInsurance.WhyBuyLocal.Visitor.Worldwide.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12}  style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em'}}>
                      {/* {CardSection5.map((con, index) => (
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
                      ))} */}
                       <img src={directPaymentFinder} alt="Direct Payment Facility Finder Worldwide" width="100%" />
                  </Grid>
              </Grid>
            </section>

          <Hidden mdDown>
              <section className="target" id="how-much-insurance-premium">
                
                <Grid item container xs={12} justifyContent='center'>
                  <SectionContent
                    label="TravelInsurance.HowMuchPremium.Visitor.label"
                    detail="TravelInsurance.HowMuchPremium.Visitor.detail"
                    subTitle="TravelInsurance.HowMuchPremium.Visitor.subTitle"
                  />
                  <Grid item container style={{ maxWidth:'1000px', margin:'2vh'}}>
                    <CustomizedTables4Rows minRows={PremiumExamples} />
                  </Grid>
                </Grid>

              </section>
            </Hidden>

          {/* Client Reviews */}
          <section id="real-client-reviews">
              <Grid container>
                  <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                    <SectionContent
                      label="TravelInsurance.Visitor.Reviews.Label"
                      detail=""
                      subTitle="TravelInsurance.Visitor.Reviews.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12} style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em'}}>
                      {clientReviews.map((con, index) => (
                          <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
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
            <Grid container>
                <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                  <SectionContent
                    label="Ads.TravelInsurance.Student.Section6.Title"
                    detail=""
                    subTitle="TravelInsurance.Visitor.Services.subTitle"
                  />
                </Grid>
                <Grid item container xs={12} style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                    {CardSection6.map((con, index) => (
                        <Grid item key={index} xs={12}>
                            <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'none', background:'#F2F4F9', borderRadius:'10px' }}>
                                {con.icon}
                                <CardContent>
                                    <div style={{ fontSize:'1.3em', fontWeight:'400', lineHeight:'30px', color:'#2a2f71', marginBottom:'3vh'}}>
                                        {con.title}
                                    </div>
                                    <Typography style={{ fontSize:'1em', fontWeight:'300' }}>
                                    {con.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
          </section>

          <section id="you-should-know-what-you-are-buying">
         
            <Grid item container xs={12} justifyContent='center'>
                <SectionContent
                  label="TravelInsurace.FAQ.label"
                  detail=""
                  subTitle="TravelInsurace.FAQ.subTitle"
                />
                <Grid item style={{ maxWidth:'1000px'}}>
                  <Accordion faqLists={faqLists} />
                </Grid>
            </Grid>
            
          </section>

        
          {/* <BannerQuote title="TravelInsurace.BannerQuote" /> */}
          {/* <Grid container justifyContent="center"  >
              <Grid item xs={12} style={{maxWidth:"1000px"}}>
                <BannerQuote 
                  title = "TravelInsurace.BannerQuote"
                  quote_Btn_Disable ="false" 
                  quote_url ='/travel-insurance/quote/trip-info'/>
              </Grid>
          </Grid> */}

          <section id="why-us-travel-insurance">
          <Grid container justifyContent="center" >
            <Grid item xs={12}>
              <SectionContent
                label="Banner.Whyus.label"
                detail="Banner.Whyus.detail"
                subTitle=""
              />
            </Grid>
            <Grid item xs={12} style={{maxWidth:"1000px"}}>
              <WhyUs />
            </Grid>
          </Grid>
          </section>
          
        </Grid>
      </Grid>
    </>
  )
}