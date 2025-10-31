import React from 'react'
import { useState, useContext, useEffect } from 'react';
//3rd library
import { Grid, Typography, IconButton, Container } from '@material-ui/core'
//components
import MetaTags from '../../../components/common/MetaTags';
import Banner from '../../../components/common/Banner';
import SectionContent from '../../../components/common/SectionContent'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import AccordionFAQ from '../../ads/common/Accordion';
import BannerQuote from '../../../components/common/BannerQuote'
import IconCard from '../../../components/common/IconCard/IconCard';
import FeatureCard from '../../../components/common/IconCard/FeatureCard';
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
import CustomizedTables from '../../../components/common/Tables/basicTable';
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
//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import travelanceLogo from '../../../assets/imgs/logo/travelance-logo.png'


// banner Title
const bannerTitle = [<Text tid={`Visitor Plan`} />]
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
    to: '/travel-insurance/visitor',
    name: 'Visitor Plan'
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
const whoIsVisitor = [
  {
    title: 'Travelers',
    src: '/imgs/icon/traveler.svg',
    src2: '/imgs/icon/traveler-bk.svg'
  },
  {
    title: 'Working holiday',
    src: '/imgs/icon/workingHoliday.svg',
    src2: '/imgs/icon/workingHoliday-bk.svg'
  },
  {
    title: 'Foreign Workers',
    src: '/imgs/icon/foreignWorker.svg',
    src2: '/imgs/icon/foreignWorker-bk.svg'
  },
  {
    title: 'Super Visa',
    src: '/imgs/icon/superVisa.svg',
    src2: '/imgs/icon/superVisa-bk.svg'
  },
  
]  
//The reason Why need student Ins
const coverages = [
  {
    title: 'visitorSumInsured',
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
    title: 'TravelInsurance.Allianz.VI.Benefit.list.SumInsured',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.SumInsured.Detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.SumInsured.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.EmergencyMedical.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.NonEmergencyMedical.detail',
    // tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.NonEmergencyMedical.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.EmergencyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.ProfessionalServices.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.Drug',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.Drug.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.DentalEmergencies.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.DentalEmergencies.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.DentalAccident',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.DentalAccident.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.AirfareToReturnHome',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.AirfareToReturnHome.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.AirfareToReturnHome.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.OutOfPocket',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.OutOfPocket.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.OutOfPocket.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.FamilyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.AccidentalDeath',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.AccidentalDeath.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.AccidentalDeath.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.VI.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.Allianz.VI.Benefit.list.ReturnofDeceased.detail',
    tooltip: 'TravelInsurance.Allianz.VI.Benefit.list.AccidentalDeath.tooltip'
  },
  
]
const tugoBenefit = [
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.SumInsured',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.SumInsured.Detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.SumInsured.tooltip'
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.EmergencyMedical.tooltip'
  },

 
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.EmergencyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.NonEmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.NonEmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.ProfessionalServices.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.Drug',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.Drug.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.DentalEmergencies.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.DentalEmergencies.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.DentalAccident',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.DentalAccident.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.FractureTreatment',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.FractureTreatment.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.FractureTreatment.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.HospitalAllowance',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.HospitalAllowance.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.HospitalAllowance.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.OutOfPocket',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.OutOfPocket.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.OutOfPocket.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.Childcare',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.Childcare.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.Childcare.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.Maternity',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.Maternity.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.Maternity.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.FamilyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnOfVehicle',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnOfVehicle.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnOfVehicle.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnCompanion',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnCompanion.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnCompanion.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.24hrsAccident',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.24hrsAccident.detail',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnofDeceased.detail',
    tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnofDeceased.tooltip',
  },
  
]


const stickyLeftMenu = [
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurace.Visitor.Definition.label',
  },
  {
    href: '#who-is-eligible-student-insurance',
    title: 'TravelInsurace.Selection.Visitor.subTitle',
  },
  {
    href: '#benefit-summary',
    title: 'TravelInsurace.Coverage.Visitor.subTitle',
  },
  {
    href: '#is-scam',
    title: 'TravelInsurance.IsScam.Visitor.label',
  },
  {
    href: '#stonewell-clients-real-claim-cases',
    title: 'TravelInsurance.Visitor.Claim.Title',
  },
  {
    href: '#why-should-buy-canadian-insurance',
    title: 'TravelInsurance.whyCanadianInsurance.Visitor.Subtitle',
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
    title: 'TravelInsurance.Visitor.Reviews.Label',
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
    documents: [{"language" : "EN", "document_url" : "Brochures/Allianz-Visitor-to-Canada-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Allianz-Visitor-to-Canada-Korean.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Allianz-Visitor-to-Canada-Chinese(Simplified).pdf"}, 
                {"language" : "CH_T", "document_url" : "Brochures/Allianz-Visitor-to-Canada-Chinese(Traditional).pdf"}]
  },
  {company:'Tugo',
    documents: [{"language" : "EN", "document_url" : "Brochures/Tugo-Visitor-to-Canada-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Tugo-Visitor-to-Canada-Korean.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Tugo-Visitor-to-Canada-Chinese(Simplified).pdf"}, 
                {"language" : "DE", "document_url" : "Brochures/Tugo-Visitor-to-Canada-German.pdf"}, 
                {"language" : "ES", "document_url" : "Brochures/Tugo-Visitor-to-Canada-Spanish.pdf"}]
  }
]

const policy = [
  {company:'Allianz',
    documents: [{"language" : "EN", "document_url" : "Policy/Allianz-Visitor-to-Canada.pdf"}]
  },
  {company:'Tugo',
    documents: [{"language" : "EN", "document_url" : "Policy/TuGo-Visitor-to-Canada.pdf"}]
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

const CardSection5 = [
  {
    title:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason1.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason1.Content'} />,
    icon: <HealthAndSafetySharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
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
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>C.J</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>North York, ON</Typography>
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
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>M.G</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Saint Léonard, QC</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Visitor.Review2.Content'} />,
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
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>N.P</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Bedford, NS</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Visitor.Review3.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
  }
]


export default function TravelVisitor ({match}) {

  const metaData = {
    title: 'Meta.TravelInsurace.Visitor.Title',
    description: 'Meta.TravelInsurace.Visitor.Description',
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
                label="TravelInsurace.WhyNeed.Visitor.label"
                detail="TravelInsurace.WhyNeed.Visitor.detail"
                subTitle="TravelInsurace.WhyNeed.Visitor.subTitle"
              />
              <Container style={{ padding:'2em', maxWidth:'1000px',  fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif' }}>
                *<Text tid="TravelInsurace.WhyNeed.ByGovernmentCanada.label" /> :
                <a href="https://travel.gc.ca/travelling/documents/travel-insurance#why" title="Learn why travel health insurance is essential for your next trip" rel="nofollow">Travel Health Insurance: Why It's Essential</a>

              </Container>
            </section>
            <section id="who-is-eligible-student-insurance">
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <SectionContent
                  label="TravelInsurace.Selection.Visitor.label"
                  detail="TravelInsurace.Selection.Visitor.detail"
                  subTitle="TravelInsurace.Selection.Visitor.subTitle"
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
                  label="TravelInsurance.Coverage.Visitor.label"
                  detail="TravelInsurance.Coverage.Visitor.detail"
                  subTitle="TravelInsurace.Coverage.Visitor.subTitle"
                />
               </Grid>
               <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', paddingBottom:'2vh'}}>
                <FeatureCard titles={coverages} />
               </Grid>
               {/* <Grid item xs={12}  style={{ padding: '2em', maxWidth:'1000px'}}>
               <CollapsibleTable/>
               </Grid> */}
                {/* benefit summary table */}
                <Grid item xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666', maxWidth:'1000px', margin:'auto', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                <Text tid={'TravelInsurance.BenefitByPlan.detail'} /><br/><br/>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="Allianz"? "#2a2f71": "#fff", color: company==="Allianz"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("Allianz")}>Allianz <Text tid={'Visitor to Canada Plan'} /></Button>
               <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: company==="TuGo"? "#2a2f71": "#fff", color: company==="TuGo"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("TuGo")}>TuGo <Text tid={'Visitor to Canada Plan'} /></Button>
               </Grid>
               <Grid item container xs={12} style={{ padding:'0 32px 16px 32px', marginTop:'-32px', maxWidth:'1000px', margin:'auto' }}>
                  {/* Logo Image and download brochure*/}
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <img
                      src={company==="Allianz"?allianzLogo:company==="TuGo"?tugoLogo:travelanceLogo}
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
                  <Grid item xs={12}>
                    <CustomizedTables minRows={company==="Allianz"?allianzBenefit:tugoBenefit} />
                  </Grid> 
              </Grid>
             

               <Grid item xs={12} style={{ padding:'0 32px', fontWeight:'600', fontSize:'12px', color:'red', maxWidth:'1000px', margin:'0 auto'}}>
               * <Text tid={'TravelInsurance.BenefitByPlan.policywording'} />
               </Grid>
               
            </Grid>
            </section>

            <Grid container justifyContent="center"  >
              <Grid item xs={12} style={{maxWidth:'1000px'}}>
                <BannerQuote
                  title="TravelInsurace.BannerQuote"
                  quote_Btn_Disable="false"
                  quote_url="/travel-insurance/quote/trip-info"
                />
              </Grid>
            </Grid>

            <section className="target" id="is-scam">
              <SectionContent
                label="TravelInsurance.IsScam.Visitor.label"
                detail="TravelInsurance.IsScam.Visitor.detail"
                subTitle="TravelInsurance.Section.Visitor.subTitle"
              />
            </section>

            <section id="stonewell-clients-real-claim-cases">
            {/* Claim Case*/}
              <Grid item container xs={12}>
                <SectionContent
                  label="TravelInsurance.Visitor.Claim.Title"
                  detail="Ads.TravelInsurance.Student.Section3.Description3"
                  subTitle="TravelInsurance.Visitor.Claim.Subtitle"
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
                      subTitle="TravelInsurance.whyCanadianInsurance.Visitor.Subtitle"
                    />
                  </Grid>
                  <Grid item container xs={12}  style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                      {CardSection5.map((con, index) => (
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
                      subTitle="TravelInsurance.Section.Visitor.subTitle"
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
                      label="TravelInsurance.Visitor.Reviews.Label"
                      detail=""
                      subTitle="TravelInsurance.Visitor.Reviews.Subtitle"
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

            
            <section id="you-should-know-what-you-are-buying">
            <Grid container>
                <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                  <SectionContent
                    label="TravelInsurace.FAQ.label"
                    detail=""
                    subTitle="TravelInsurace.FAQ.Visitor.subTitle"
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
                    subTitle="TravelInsurance.Section.Visitor.subTitle"
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


