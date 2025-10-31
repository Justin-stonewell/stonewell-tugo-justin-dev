import { useState, useContext, useEffect } from 'react';
// core components
import { Grid, Typography, IconButton } from '@material-ui/core';
//components
import MetaTags from '../../../components/common/MetaTags';
import Banner from '../../../components/common/Banner';
import SectionContent from '../../../components/common/SectionContent'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import BannerQuote from '../../../components/common/BannerQuote'
import IconCard from '../../../components/common/IconCard/IconCard';
import FeatureCard from '../../../components/common/IconCard/FeatureCard';
import CustomizedTables from '../../../components/common/Tables/basicTable';
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
import AccordionFAQ from '../../ads/common/Accordion';
import Hidden from '@material-ui/core/Hidden'
import { Button } from '@material-ui/core';
import { Card, CardContent  } from '@mui/material';
import { Rating } from '@mui/material';

//icons
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import HealthAndSafetySharpIcon from '@mui/icons-material/HealthAndSafetySharp';
import PaymentSharpIcon from '@mui/icons-material/PaymentSharp';
import LooksOneSharpIcon from '@mui/icons-material/LooksOneSharp';
import LooksTwoSharpIcon from '@mui/icons-material/LooksTwoSharp';
import Looks3SharpIcon from '@mui/icons-material/Looks3Sharp';
import StarIcon from '@mui/icons-material/Star';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import GavelIcon from '@mui/icons-material/Gavel';
import SupportIcon from '@mui/icons-material/Support';

//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
// import travelanceLogo from '../../../assets/imgs/logo/travelance-logo.png'

// banner Title
const bannerTitle = [<Text tid={`Student and Companion Plan`} />]
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
  {
    to: '/travel-insurance/student',
    name: 'Student and Companion Plan'
},  
] 
const faqLists = [
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
// Products
const whoIsStudent = [
  {
    title: 'students',
    src: '/imgs/icon/student.svg',
    src2: '/imgs/icon/student-bk.svg'
  },
  {
    title: 'graduates',
    src: '/imgs/icon/graduate.svg',
    src2: '/imgs/icon/graduate-bk.svg'
  },
  {
    title: 'companions',
    src: '/imgs/icon/companion.svg',
    src2: '/imgs/icon/companion-bk.svg'
  },
  
]  
//The reason Why need student Ins
const coverages = [
  {
    title: 'studentSumInsured',
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

const tugoBenefit = [
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.SumInsured',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyHospital',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyHospital.detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.OnlineDoctor',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.OnlineDoctor.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.OnlineDoctor.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.NonEmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.NonEmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.ProfessionalServices.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.Drug',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.Drug.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.DentalEmergencies.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.DentalEmergencies.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.DentalAccident',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.DentalAccident.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.WisdomTeeth',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.WisdomTeeth.detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EyeExamination',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EyeExamination.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.EyeExamination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.PhysicalExamination',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.PhysicalExamination.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.PhysicalExamination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.Maternity',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.Maternity.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.Maternity.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.FamilyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.Fracture',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.Fracture.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.Fracture.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.vaccination',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.vaccination.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.vaccination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.AccidentalDeath',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.AccidentalDeath.detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.ReturnofDeceased.detail',
  },
]


const stickyLeftMenu = [
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurace.Student.Definition.label',
  },
  {
    href: '#who-is-eligible-student-insurance',
    title: 'TravelInsurace.Student.WhoEligible.label',
  },
  {
    href: '#benefit-summary',
    title: 'Ads.TravelInsurance.Student.Section2.Title',
  },
  {
    href: '#why-canadian-school-require-1M-insurance',
    title: 'TravelInsurance.Student.Why1M.Title',
  },
  {
    href: '#how-to-buy-travel-insurance',
    title: 'TravelInsurace.Student.HowToBuy.label',
  },
  {
    href: '#is-scam',
    title: 'TravelInsurance.IsScam.Student.label',
  },
  {
    href: '#stonewell-clients-real-claim-cases',
    title: 'Ads.TravelInsurance.Student.Section4.Title',
  },
  {
    href: '#why-should-buy-canadian-insurance',
    title: 'Ads.TravelInsurance.Student.Section5.Title',
  },
  {
    href: '#refund-policy',
    title: 'TravelInsurance.Refund.Student.subTitle',
  },
  {
    href: '#why-stonewell-number-one',
    title: 'Ads.TravelInsurance.Student.Section6.Title',
  },
  {
    href: '#real-client-reviews',
    title: 'Ads.TravelInsurance.Student.Section8.Title',
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

const brochures = [
  {company:'Allianz',
    documents: [{"language" : "EN", "document_url" : "Brochures/Allianz-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Allianz-International-Student-Korean.pdf"}, 
                {"language" : "AR", "document_url" : "Brochures/Allianz-International-Student-Arabic.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Allianz-International-Student-Chinese(Simplified).pdf"}, 
                {"language" : "CH_T", "document_url" : "Brochures/Allianz-International-Student-Chinese(Traditional).pdf"}, 
                {"language" : "PT_BR", "document_url" : "Brochures/Allianz-International-Student-Portuguese(Brazil).pdf"}, 
                {"language" : "ES", "document_url" : "Brochures/Allianz-International-Student-Spanish.pdf"}]
  },
  {company:'Tugo',
    documents: [{"language" : "EN", "document_url" : "Brochures/Tugo-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Tugo-International-Student-Korean.pdf"}, 
                {"language" : "AR", "document_url" : "Brochures/Tugo-International-Student-Arabic.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Tugo-International-Student-Chinese(Simplified).pdf"}, 
                {"language" : "JA", "document_url" : "Brochures/Tugo-International-Student-Japanese.pdf"}, 
                {"language" : "ES", "document_url" : "Brochures/Tugo-International-Student-Spanish.pdf"}]
  }
]

const policy = [
  {company:'Allianz',
    documents: [{"language" : "EN", "document_url" : "Policy/Allianz-International-Student.pdf"}]
  },
  {company:'Tugo',
    documents: [{"language" : "EN", "document_url" : "Policy/TuGo-International-Student.pdf"}]
  }
]

// Claim List Accordion
const claimLists = [
  {
    question: 'Ads.TravelInsurance.Student.Claims.Dental.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case3'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case4'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case5'} /></li>
        </ul>
    </>
    ,
  },
  {
    question: 'Ads.TravelInsurance.Student.Claims.Therapies.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case3'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case4'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case5'} /></li>
        </ul>
    </>
  },
  {
    question: 'Ads.TravelInsurance.Student.Claims.WalkinClinic.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case3'} /></li>
        </ul>
    </>
  },
  {
    question: 'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case3'} /></li>
        </ul>
    </>
  },
]

const CardWhy1M = [
  {
    title:  <Text tid={'TravelInsurance.Student.Why1M.Reason1.Title'} />,
    value:  <Text tid={'TravelInsurance.Student.Why1M.Reason1.Content'} />,
    icon: <FlightTakeoffIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
    title:  <Text tid={'TravelInsurance.Student.Why1M.Reason2.Title'} />,
    value:  <Text tid={'TravelInsurance.Student.Why1M.Reason2.Content'} />,
    icon: <GavelIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  }
]

const CardSection5 = [
  {
    title:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason1.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason1.Content'} />,
    icon: <HealthAndSafetySharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
    title:  <Text tid={'TravelInsurance.Student.NoRegret.Reason3.Title'} />,
    value:  <Text tid={'TravelInsurance.Student.NoRegret.Reason3.Content'} />,
    icon: <SupportIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
    title:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason2.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason2.Content'} />,
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

const CardSection7 = [
  {
    title:  <>
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>Y.K</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Toronto, ON</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Student.Review1.Content'} />,
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
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>K.J</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Montreal, QC</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Student.Review2.Content'} />,
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
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>P.N</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Surrey, BC</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Student.Review3.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
  }
]


export default function TravelStudent({match}) {

  const metaData = {
    title: 'Meta.TravelInsurace.Student.Title',
    description: 'Meta.TravelInsurace.Student.Description',
    canonical: match.url
  }    

  const [company, setCompany] = useState("Allianz")

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
    <Banner title = {bannerTitle}  links={links} quote_url ='/travel-insurance/quote/trip-info' />
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
          <Grid item sm={12} lg={8} xl={6}>
            
            <section className="target" id="why-buy-travel-insurance">
                <SectionContent
                  label="TravelInsurace.WhyNeed.Student.label"
                  detail="TravelInsurace.WhyNeed.Student.detail"
                  subTitle="Ads.TravelInsurance.Student.Section1.Subtitle"
                />
            </section>
            <section id="who-is-eligible-student-insurance">
              <Grid container justifyContent="center">
                <Grid item xs={12} style={{ marginBottom:'-2rem'}}>
                  <SectionContent
                    label="TravelInsurace.Selection.Student.label"
                    detail=""
                    subTitle="TravelInsurance.Section.Student.subTitle1"
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
                  label="TravelInsurance.Coverage.label"
                  detail="TravelInsurance.Coverage.detail"
                  subTitle="Ads.TravelInsurance.Student.Section2.Subtitle"
                />
               </Grid>
               <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', paddingBottom:'2vh'}}>
                <FeatureCard titles={coverages} />
               </Grid>
               
               {/* benefit summary table */}
               <Grid item xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666', maxWidth:'1000px', margin:'auto', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                <Text tid={'TravelInsurance.ST.BenefitByPlan.detail'} /><br/><br/>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="Allianz"? "#2a2f71": "#fff", color: company==="Allianz"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("Allianz")}>Allianz <Text tid={'Student Plan'} /></Button>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="TuGo"? "#2a2f71": "#fff", color: company==="TuGo"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("TuGo")}>TuGo <Text tid={'Student Plan'} /></Button>
               </Grid>
               <Grid item container xs={12} style={{ padding:'0 32px 16px 32px', maxWidth:'1000px', margin:'auto' }}>
                  {/* Logo Image and download brochure*/}
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <img
                      // src={company==="Allianz"?allianzLogo:company==="Tugo"?tugoLogo:travelanceLogo}
                      src={company==="Allianz"?allianzLogo:tugoLogo}
                      alt='logo'
                      style={{width:'120px', display:'block', marginTop:'20px'}}
                    />
                  </Grid>
                  {/* Brochure */}
                  <Grid item xs={12} sm={12} md={9} lg={9} style={{ paddingTop:'32px' }}>
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

                    {/* Policy Wording */}
                    <IconButton aria-label="view" color="primary" 
                        onClick={() => {
                          let url = '';
                          const companyPolicy = policy.filter(f => f.company.toLowerCase() === company.toLowerCase());
                      
                          if (companyPolicy.length > 0) {
                              const enBrochure = companyPolicy[0].documents.filter(f => f.language === 'EN');
                      
                              if (enBrochure.length > 0) {
                                  url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url;
                              }
                          }
                      
                          if (url) {
                              window.open(url, '_blank');
                          }
                      }}
                    >
                      <DescriptionIcon />
                      <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                        <Text tid={'Quote.SeePolicyWording'}/>
                      </Typography>
                    </IconButton>

                  </Grid>
                  {/* Benefit summary */}
                  <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto' }}>
                    <CustomizedTables minRows={company==="Allianz"?allianzBenefit:tugoBenefit} />
                  </Grid>
               </Grid>

               <Grid item xs={12} style={{ padding:'0 32px', fontWeight:'600', fontSize:'12px', color:'red', maxWidth:'1000px', margin:'0 auto'}}>
               * <Text tid={'TravelInsurance.BenefitByPlan.policywording'} />
               </Grid>
               
            </Grid>
            </section>

            <section id="why-canadian-school-require-1M-insurance">
              <Grid container>
                  <Grid item xs={12}>
                    <SectionContent
                      label="TravelInsurance.Student.Why1M.Title"
                      detail="TravelInsurance.Student.Why1M.detail"
                      subTitle="TravelInsurance.Student.Why1M.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12}  style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                      {CardWhy1M.map((con, index) => (
                          <Grid item key={index} xs={12} sm={12} md={6} lg={6}>
                              <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'0px 4px 20px rgba(0,0,0,.08)' }}>
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

            {/* How to Purchase */}
            <section className="target" id="how-to-buy-travel-insurance">
                <SectionContent
                  label="TravelInsurace.Student.HowToBuy.label"
                  detail="TravelInsurace.Student.HowToBuy.detail"
                  subTitle="TravelInsurance.Student.HowToBuy.Subtitle"
                />
            </section>


           {/* Get a Quote */}
            <Grid container justifyContent="center"  >
              <Grid item xs={12} style={{maxWidth:"1000px"}}>
                <BannerQuote 
                  title = "TravelInsurace.BannerQuote"
                  quote_Btn_Disable ="false" 
                  quote_url ='/travel-insurance/quote/trip-info'/>
              </Grid>
            </Grid>

            <section className="target" id="is-scam">
              <SectionContent
                label="TravelInsurance.IsScam.Student.label"
                detail="TravelInsurance.IsScam.Student.detail"
                subTitle="TravelInsurance.Section.Student.subTitle"
              />
            </section>

            <section id="stonewell-clients-real-claim-cases">
            {/* Claim Case*/}
              <Grid item container xs={12}>
                <SectionContent
                  label="Ads.TravelInsurance.Student.Section4.Title"
                  detail="Ads.TravelInsurance.Student.Section3.Description3"
                  subTitle="Ads.TravelInsurance.Student.Section4.Subtitle"
                />
              </Grid>
              <Grid item container xs={12} justifyContent="center" style={{ maxWidth:'1000px', margin:'auto' }}>
                <Grid item container style={{ padding:'16px' }}>
                  <AccordionFAQ faqLists={claimLists}/>
                </Grid>
              </Grid>
            </section>

            {/* Why Canadian Insurance */}
            <section id="why-should-buy-canadian-insurance">
              <Grid container>
                  <Grid item xs={12}>
                    <SectionContent
                      label="Ads.TravelInsurance.Student.Section5.Title"
                      detail="TravelInsurance.whyCanadianInsurance.Student.detail"
                      subTitle="Ads.TravelInsurance.Student.Section5.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12}  style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                      {CardSection5.map((con, index) => (
                          <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                              <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'0px 4px 20px rgba(0,0,0,.08)' }}>
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

            <section className="target" id="refund-policy" style={{ marginBottom:'5vh' }}>
              <SectionContent
                label="TravelInsurance.Refund.Student.label"
                detail="TravelInsurance.Refund.Student.detail"
                subTitle="TravelInsurance.Refund.Student.subTitle"
              />
            </section>


            {/* Why Stonewell */}
            <section id="why-stonewell-number-one">
              <Grid container>
                  <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                    <SectionContent
                      label="Ads.TravelInsurance.Student.Section6.Title"
                      detail=""
                      subTitle="TravelInsurance.Section.Student.subTitle"
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

            {/* Real Client Review */}
            <section id="real-client-reviews">
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

            {/* FAQ */}
            <section id="you-should-know-what-you-are-buying">
            <Grid container>
                <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                  <SectionContent
                    label="TravelInsurace.FAQ.label"
                    detail=""
                    subTitle="TravelInsurace.Student.FAQ.subTitle"
                  />
                </Grid>
                <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto'}}>
                  <Accordion faqLists={faqLists} />
                </Grid>
              </Grid>
            </section>

            <section id="why-us-travel-insurance">
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
          </section>

            
          </Grid>
        </Grid>

    </>
  )
}

