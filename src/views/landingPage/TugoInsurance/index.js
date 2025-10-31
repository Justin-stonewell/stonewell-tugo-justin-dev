import React from 'react'
import { useState, useContext, useEffect } from 'react';
//3rd library
import { Grid, Typography, IconButton } from '@material-ui/core'
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
import CustomizedTables, { CustomizedTables4Rows } from '../../../components/common/Tables/basicTable';
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
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'


// banner Title
const bannerTitle = [<Text tid={`LandingPgs.TugoTravelInsurance.BannerTitle`} />]
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
    to: '/tugo-travel-insurance-canada-quote',
    name: 'TuGo Travel Insurance'
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
const whoIsCanadian = [
  {
    title: 'pr',
    src: '/imgs/icon/companion.svg',
    src2: '/imgs/icon/companion-bk.svg'
  },
  {
    title: 'canadian',
    src: '/imgs/icon/canadianCitizen.svg',
    src2: '/imgs/icon/canadianCitizen-bk.svg'
  },
] 
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
const canadianCoverages = [
  {
    title: 'tugoCanadianSumInsured',
    src: '/imgs/icon/dollar.svg',
    desc: 'We really don’t know when, where and how we’ll pass away but it will certainly happen in our life, having life insurance plan will bring you and your family peace of mind.',
  },
  {
    title: 'Dental',
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
const studentCoverages = [
  {
    title: 'tugoStudentSumInsured',
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
const visitorCoverages = [
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
const canadianBenefit = [
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.SumInsured',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyAirTransportation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyAirTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyAirTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.NonEmergencyMedical.detail',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.FollowUpCanada',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.FollowUpCanada.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.FollowUpCanada.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ProfessionalServices.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.Drug',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.Drug.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalEmergencies.detail',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalAccident',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalAccident.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.FractureTreatment',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.FractureTreatment.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.FractureTreatment.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.UnexpectedNewborn',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.UnexpectedNewborn.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.UnexpectedNewborn.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.hospitalAllowrance',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.hospitalAllowrance.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.hospitalAllowrance.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ChildCare',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ChildCare.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ChildCare.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnToDestination',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnToDestination.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnToDestination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DelayFlight',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DelayFlight.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.DelayFlight.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DomesticServicesCanada',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DomesticServicesCanada.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.DomesticServicesCanada.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.AirfareToReturnHome',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.AirfareToReturnHome.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.AirfareToReturnHome.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnCompanion',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnCompanion.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnCompanion.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnDependent',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnDependent.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnDependent.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnPet',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnPet.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnPet.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnVehicle',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnVehicle.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnVehicle.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.FamilyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.OutOfPocket',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.OutOfPocket.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.OutOfPocket.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.VisitOriginCountry',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.VisitOriginCountry.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.VisitOriginCountry.tooltip',
  },
  
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.tooltip',
  },
 
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.VisionHearingAids',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.VisionHearingAids.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.VisionHearingAids.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnofDeceased.detail',
  },
  
]

const studentBenefit = [
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
const visitorBenefit = [
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
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.FractureTreatment.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.HospitalAllowance',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.HospitalAllowance.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.HospitalAllowance.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.OutOfPocket',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.OutOfPocket.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.OutOfPocket.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.Childcare',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.Childcare.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.Childcare.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.Maternity',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.Maternity.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.Maternity.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.FamilyTransportation.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.FamilyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnOfVehicle',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnOfVehicle.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnOfVehicle.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnCompanion',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnCompanion.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnCompanion.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.24hrsAccident',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.24hrsAccident.detail',
  },
  {
    title: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnofDeceased.detail',
    // tooltip: 'TravelInsurance.TuGo.VI.Benefit.list.ReturnofDeceased.tooltip',
  },
  
]


const stickyLeftMenu = [
  {
    href: '#what-is-tugo',
    title: 'LandingPgs.TugoTravelInsurance.WhatTugo.label',
  },
  {
    href: '#who-is-eligible-tugo-insurance',
    title: 'LandingPgs.TugoTravelInsurance.Eligible.label',
  },
  {
    href: '#benefit-summary',
    title: 'LandingPgs.TugoTravelInsurance.Coverage.label',
  },
  {
    href: '#how-much-insurance-premium',
    title: 'LandingPgs.TugoTravelInsurance.HowMuchPremium.label',
  },
  {
    href: '#is-scam',
    title: 'LandingPgs.TugoTravelInsurance.Support.label',
  },
  {
    href: '#how-to-claim',
    title: 'LandingPgs.TugoTravelInsurance.HowToClaim.label',
  },
  {
    href: '#stonewell-clients-real-claim-cases',
    title: 'LandingPgs.TugoTravelInsurance.ClaimCase.label',
  },
  {
    href: '#why-should-buy-canadian-insurance',
    title: 'LandingPgs.TugoTravelInsurance.WhyTugo.label',
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
  {plan:'Canadian',
    documents: [{"language" : "EN", "document_url" : "Brochures/Tugo-Canadian-Travel-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Tugo-Canadian-Travel-Korean.pdf"}, 
                {"language" : "FR", "document_url" : "Brochures/Tugo-Canadian-Travel-French.pdf"}]
  },
  {plan:'Visitor',
    documents: [{"language" : "EN", "document_url" : "Brochures/Tugo-Visitor-to-Canada-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Tugo-Visitor-to-Canada-Korean.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Tugo-Visitor-to-Canada-Chinese(Simplified).pdf"}, 
                {"language" : "DE", "document_url" : "Brochures/Tugo-Visitor-to-Canada-German.pdf"}, 
                {"language" : "ES", "document_url" : "Brochures/Tugo-Visitor-to-Canada-Spanish.pdf"}]
  },
  {plan:'Student',
   documents: [{"language" : "EN", "document_url" : "Brochures/Tugo-International-Student-English.pdf"}, 
              {"language" : "KO", "document_url" : "Brochures/Tugo-International-Student-Korean.pdf"}, 
              {"language" : "AR", "document_url" : "Brochures/Tugo-International-Student-Arabic.pdf"}, 
              {"language" : "CH_S", "document_url" : "Brochures/Tugo-International-Student-Chinese(Simplified).pdf"}, 
              {"language" : "JA", "document_url" : "Brochures/Tugo-International-Student-Japanese.pdf"}, 
              {"language" : "ES", "document_url" : "Brochures/Tugo-International-Student-Spanish.pdf"}]
  }
]

const policy = [
  {plan:'Canadian',
    documents: [{"language" : "EN", "document_url" : "Policy/TuGo-Canadian-Travel.pdf"}]
  },
  {plan:'Student',
    documents: [{"language" : "EN", "document_url" : "Policy/TuGo-International-Student.pdf"}]
  },
  {plan:'Visitor',
    documents: [{"language" : "EN", "document_url" : "Policy/TuGo-Visitor-to-Canada.pdf"}]
  }
]

const canadianPremiumExamples = [
  {
    traveller: 'Age 10',
    destination: 'USA',
    plan: 'TuGo Canadian Medical Plan',
    maxInsured: '$5M',
    period: '5 days',
    premium: '$20.30'
  },
  {
    traveller: 'Age 20',
    destination: 'Mexico',
    plan: 'TuGo Canadian Medical Plan',
    maxInsured: '$5M',
    period: '7 days',
    premium: '$24.07'
  },
  {
    traveller: 'Age 30',
    destination: 'China',
    plan: 'TuGo Canadian Medical Plan',
    maxInsured: '$5M',
    period: '14 days',
    premium: '$48.14'
  },
  {
    traveller: 'Age 40',
    destination: 'France',
    plan: 'TuGo Canadian Medical Plan',
    maxInsured: '$5M',
    period: '7 days',
    premium: '$24.07'
  },
  {
    traveller: 'Age 50',
    destination: 'USA',
    plan: 'TuGo Canadian Medical Plan',
    maxInsured: '$5M',
    period: '7 days',
    premium: '$37.19'
  },
  {
    traveller: 'Age 60',
    destination: 'Europe',
    plan: 'TuGo Canadian Medical Plan',
    maxInsured: '$5M',
    period: '14 days',
    premium: '$72.45'
  },
  {
    traveller: 'Age 70',
    destination: 'Japan',
    plan: 'TuGo Canadian Medical Plan',
    maxInsured: '$5M',
    period: '30 days',
    premium: '$272.90'
  }
]
const visitorPremiumExamples = [
  {
    traveller: 'Age 10',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$10,000',
    period: '14 days',
    premium: '$24.36'
  },
  {
    traveller: 'Age 20',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$25,000',
    period: '14 days',
    premium: '$31.50'
  },
  {
    traveller: 'Age 30',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$10,000',
    period: '90 days',
    premium: '$165.60'
  },
  {
    traveller: 'Age 40',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$25,000',
    period: '90 days',
    premium: '$270.90'
  },
  {
    traveller: 'Age 50',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$50,000',
    period: '30 days',
    premium: '$102.60'
  },
  {
    traveller: 'Age 60',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$50,000',
    period: '14 days',
    premium: '$72.10'
  },
  {
    traveller: 'Age 70',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$25,000',
    period: '14 days',
    premium: '$102.62'
  },
  {
    traveller: 'Age 80',
    destination: 'Canada',
    plan: 'TuGo Visitor Plan',
    maxInsured: '$100,000',
    period: '14 days',
    premium: '$195.16'
  }
]

const studentPremiumExamples = [
  {
    traveller: 'Age 10',
    destination: 'Canada',
    plan: 'TuGo Student Plan',
    maxInsured: '$2M',
    period: '30 days',
    premium: '$58.28'
  },
  {
    traveller: 'Age 20',
    destination: 'Canada',
    plan: 'TuGo Student Plan',
    maxInsured: '$2M',
    period: '30 days',
    premium: '$58.28'
  },
  {
    traveller: 'Age 30',
    destination: 'Canada',
    plan: 'TuGo Student Plan',
    maxInsured: '$2M',
    period: '180 days',
    premium: '$338.40'
  },
  {
    traveller: 'Age 40',
    destination: 'Canada',
    plan: 'TuGo Student Plan',
    maxInsured: '$2M',
    period: '180 days',
    premium: '$338.40'
  },
  {
    traveller: 'Age 50',
    destination: 'Canada',
    plan: 'TuGo Student Plan',
    maxInsured: '$2M',
    period: '365 days',
    premium: '$686.20'
  },
  {
    traveller: 'Age 60',
    destination: 'Canada',
    plan: 'TuGo Student Plan',
    maxInsured: '$2M',
    period: '365 days',
    premium: '$686.20'
  },
  {
    traveller: 'Age 69',
    destination: 'Canada',
    plan: 'TuGo Student Plan',
    maxInsured: '$2M',
    period: '365 days',
    premium: '$686.20'
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


export default function TugoInsurance ({match}) {

  const metaData = {
    title: 'Meta.LandingPgs.TugoTravelInsurance.Title',
    description: 'Meta.LandingPgs.TugoTravelInsurance.Description',
    canonical: match.url
  }

  const [plan, setPlan] = useState("Canadian")
  const [eligiblity, setEligiblity] = useState("Canadian") 
  const [planForRate, setPlanForRate] = useState("Canadian")

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
            
            <section className="target" id="what-is-tugo">
              <SectionContent
                label="LandingPgs.TugoTravelInsurance.WhatTugo.label"
                detail="LandingPgs.TugoTravelInsurance.WhatTugo.detail"
                subTitle="LandingPgs.TugoTravelInsurance.WhatTugo.subTitle"
              />
              <Grid item container justifyContent='center'>
                <Grid item container style={{ padding: '0 2em', maxWidth:'1000px' }}>
                <a href="https://shop.tugo.com/store/SFS200/coverages" target="_blank" rel="noreferrer" alt="Why get Tugo travel insurance?">
                  <img
                    src={tugoLogo}
                    alt='Tugo-travel-insurance-logo'
                    style={{width:'200px', display:'block', marginTop:'20px'}}
                  />
                </a>
                </Grid>
              </Grid>
            </section>
            <section id="who-is-eligible-tugo-insurance">
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <SectionContent
                  label="LandingPgs.TugoTravelInsurance.Eligible.label"
                  detail="LandingPgs.TugoTravelInsurance.Eligible.detail"
                  subTitle="LandingPgs.TugoTravelInsurance.Eligible.subTitle"
                />
              </Grid>
              <Grid item container justifyContent='center'>

                <Grid item container style={{ padding: '2em 2em 0 2em', maxWidth:'1000px' }}>
                  <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: eligiblity==="Canadian"? "#00c7b1": "#fff", color: eligiblity==="Canadian"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setEligiblity("Canadian")}>TuGo <Text tid={'Canadian Plan'} /></Button>
                  <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: eligiblity==="Student"? "#00c7b1": "#fff", color: eligiblity==="Student"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setEligiblity("Student")}>TuGo <Text tid={'Student Plan'} /></Button>
                  <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: eligiblity==="Visitor"? "#00c7b1": "#fff", color: eligiblity==="Visitor"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setEligiblity("Visitor")}>TuGo <Text tid={'Visitor to Canada Plan'} /></Button>
                </Grid>

                {eligiblity === "Canadian"? 
                  <IconCard Content={whoIsCanadian} />
                    :eligiblity === "Student"? 
                      <IconCard Content={whoIsStudent} />
                        : <IconCard Content={whoIsVisitor} />
                }

               </Grid>
            </Grid>
            </section>

            <section id="benefit-summary">
            <Grid container>
              <Grid item xs={12}>
              <SectionContent
                  label="LandingPgs.TugoTravelInsurance.Coverage.label"
                  detail="LandingPgs.TugoTravelInsurance.Coverage.detail"
                  subTitle="LandingPgs.TugoTravelInsurance.Coverage.subTitle"
                />
               </Grid>
               <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', paddingBottom:'2vh'}}>
                {plan==="Canadian"?
                  <FeatureCard titles={canadianCoverages} />
                    : plan==="Student"?
                    <FeatureCard titles={studentCoverages} />
                      : <FeatureCard titles={visitorCoverages} />
                }
               </Grid>
               {/* <Grid item xs={12}  style={{ padding: '2em', maxWidth:'1000px'}}>
               <CollapsibleTable/>
               </Grid> */}
                {/* benefit summary table */}
                <Grid item xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666', maxWidth:'1000px', margin:'auto', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                <Text tid={'TravelInsurance.BenefitByPlan.detail'} /><br/><br/>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: plan==="Canadian"? "#00c7b1": "#fff", color: plan==="Canadian"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setPlan("Canadian")}>TuGo <Text tid={'Canadian Plan'} /></Button>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: plan==="Student"? "#00c7b1": "#fff", color: plan==="Student"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setPlan("Student")}>TuGo <Text tid={'Student Plan'} /></Button>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: plan==="Visitor"? "#00c7b1": "#fff", color: plan==="Visitor"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setPlan("Visitor")}>TuGo <Text tid={'Visitor to Canada Plan'} /></Button>
               </Grid>
               <Grid item container xs={12} style={{ padding:'0 32px 16px 32px', marginTop:'-32px', maxWidth:'1000px', margin:'auto' }}>
                  {/* Logo Image and download brochure*/}
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <img
                      src={tugoLogo}
                      alt='tugo-travel-insurance-logo'
                      style={{width:'120px', display:'block', marginTop:'20px'}}
                    />
                  </Grid>
                  {/* Brochure */}
                  <Grid item xs={12} sm={12} md={9} lg={9} style={{ paddingTop:'32px' }}>
                    <IconButton aria-label="view" color="primary" 
                       onClick={() => {
                        let url = ''
                          const planBrochure = brochures.filter(f => f.plan.toLowerCase() === plan.toLowerCase())
                          if (planBrochure.length>0){
                            const brochure = planBrochure[0].documents.filter(f => f.language === currentLanguage.toUpperCase())
                            if (brochure.length>0){
                              url = process.env.REACT_APP_S3_URL + brochure[0].document_url
                            }else{
                              const enBrochure = planBrochure[0].documents.filter(f => f.language === 'EN')
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
                          const companyPolicy = policy.filter(f => f.plan.toLowerCase() === plan.toLowerCase());
                      
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
                    <CustomizedTables minRows={plan==="Canadian"?canadianBenefit:plan==="Student"?studentBenefit:visitorBenefit} />
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
                  label="LandingPgs.TugoTravelInsurance.HowMuchPremium.label"
                  detail="LandingPgs.TugoTravelInsurance.HowMuchPremium.detail"
                  subTitle="LandingPgs.TugoTravelInsurance.HowMuchPremium.subTitle"
                />
                <Grid item container justifyContent='center'>

                  <Grid item container style={{ padding: '2em', maxWidth:'1000px' }}>
                    <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: planForRate==="Canadian"? "#00c7b1": "#fff", color: planForRate==="Canadian"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setPlanForRate("Canadian")}>TuGo <Text tid={'Canadian Plan'} /></Button>
                    <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: planForRate==="Student"? "#00c7b1": "#fff", color: planForRate==="Student"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setPlanForRate("Student")}>TuGo <Text tid={'Student Plan'} /></Button>
                    <Button variant="outlined" style={{textTransform:'capitalize', margin:'5px', background: planForRate==="Visitor"? "#00c7b1": "#fff", color: planForRate==="Visitor"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setPlanForRate("Visitor")}>TuGo <Text tid={'Visitor to Canada Plan'} /></Button>
                  </Grid>

                  <Grid item xs={12} style={{ maxWidth:'1000px', margin:'auto', padding:'0 32px 16px 32px' }}>
                    {planForRate === 'Canadian' ?
                      <>
                        <Grid item container style={{ padding:'2vh 2vh 1vh 2vh', fontWeight:'400', fontSize: '0.9em', background:'#f5f3f7'}}>
                          <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'LandingPgs.TugoTravelInsurance.HowMuchPremium.Canadian'} /></p>
                        </Grid>
                        <CustomizedTables4Rows minRows={canadianPremiumExamples} />
                      </>
                      : planForRate === 'Student' ?
                        <>
                          <Grid item container style={{ padding:'2vh 2vh 1vh 2vh', fontWeight:'400', fontSize: '0.9em', background:'#f5f3f7'}}>
                            <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'LandingPgs.TugoTravelInsurance.HowMuchPremium.Student'} /></p>
                          </Grid>
                          <CustomizedTables4Rows minRows={studentPremiumExamples} />
                        </>
                          : 
                          <>
                            <Grid item container style={{ padding:'2vh 2vh 1vh 2vh', fontWeight:'400', fontSize: '0.9em', background:'#f5f3f7'}}>
                              <p style={{fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}><Text tid={'LandingPgs.TugoTravelInsurance.HowMuchPremium.Visitor'} /></p>
                            </Grid>
                            <CustomizedTables4Rows minRows={visitorPremiumExamples} />
                          </>
                    }
                  </Grid>

                </Grid>
              </section>
            </Hidden>

            <Grid container justifyContent="center"  >
              <Grid item xs={12} style={{maxWidth:'1000px'}}>
                <BannerQuote
                  title="TravelInsurace.BannerQuote"
                  quote_Btn_Disable="false"
                  quote_url="https://shop.tugo.com/store/SFS200"
                />
              </Grid>
            </Grid>

            <section className="target" id="is-scam">
              <SectionContent
                label="LandingPgs.TugoTravelInsurance.Support.label"
                detail="TravelInsurance.IsScam.Visitor.detail"
                subTitle="LandingPgs.TugoTravelInsurance.Support.subTitle"
              />
            </section>

            <section className="target" id="how-to-claim">
              <SectionContent
                label="LandingPgs.TugoTravelInsurance.HowToClaim.label"
                detail="LandingPgs.TugoTravelInsurance.HowToClaim.detail"
                subTitle="LandingPgs.TugoTravelInsurance.HowToClaim.subTitle"
              />

              <Grid item container justifyContent='center' style={{ margin:'2em' }}>
                <Grid item container style={{ padding: '2em 0', maxWidth:'1000px', fontWeight:'400', fontSize: '0.9em', background:'#f5f3f7' }}>
                  <ol>
                    <li style={{ marginBottom:'1em' }}><strong><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Phone.Title'} /></strong>
                      <ol type="a">
                        <li><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Phone.Detail1'} /></li>
                        <li><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Phone.Detail2'} /></li>
                      </ol>
                    </li>
                    <li style={{ marginBottom:'1em' }}><strong><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Online.Title'} /></strong>
                      <ol type="a">
                        <li><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Online.Detail1'} /></li>
                        <li><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Online.Detail2'} /></li>
                      </ol>
                    </li>
                    <li><strong><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Email.Title'} /></strong>
                      <ol type="a">
                        <li><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Email.Detail1'} /></li>
                        <li><Text tid={'LandingPgs.TugoTravelInsurance.HowToClaim.Email.Detail2'} /></li>
                      </ol>
                    </li>
                  </ol>
                </Grid>
              </Grid>

            </section>

            <section id="stonewell-clients-real-claim-cases">
            {/* Claim Case*/}
              <Grid item container xs={12}>
                <SectionContent
                  label="LandingPgs.TugoTravelInsurance.ClaimCase.label"
                  detail="LandingPgs.TugoTravelInsurance.ClaimCase.detail"
                  subTitle="LandingPgs.TugoTravelInsurance.ClaimCase.subTitle"
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
                      label="LandingPgs.TugoTravelInsurance.WhyTugo.label"
                      detail="TravelInsurance.whyCanadianInsurance.Student.detail"
                      subTitle="LandingPgs.TugoTravelInsurance.WhyTugo.Subtitle"
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


