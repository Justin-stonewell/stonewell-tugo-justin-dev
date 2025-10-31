import React, {useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'

import MetaTags from '../../../../components/common/MetaTags'
import { LanguageContext, Text } from '../../../../components/common/LanguageProvider'

//Components
import WhyUs from '../../../../components/common/WhyUs'
import Banner from './Banner'
// import Partner from './Partner'
import Product from '../../../../components/common/Product/Products';
// import Process from './Process'
// import Process from './Process'
import CTA from '../../../../components/common/Footers/CallToAction';
// import Platform from './Platform'

const useStyles = makeStyles(theme => ({
  greenlineBox: {
    padding: 0,
  },
  greenline: {
    width: '2.5rem',
    height: '3px',
    background: '#8EC641',
    display: 'inline-block',
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize:'1.6rem'
    },
  },
  subTitle: {
    color: '#666',
    fontSize:'1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize:'14px',
      fontWeight:'300',
      paddingLeft:'32px',
      paddingRight:'32px',
      color: '#000',
    },
  },
}))


const homeProducts = [
  {
    title: <Text tid={`Student Insurance USA`} />,
    description:
    <Text tid={`HomeProduct.StudentInsuranceUSA.Description`} />,
    img: 'USAstudent',
    url: 'usa/travel-insurance/f1-f2-student',
  },
  {
    title: <Text tid={`Visitor Insurance USA`} />,
    description:
    <Text tid={`HomeProduct.VisitorInsuranceUSA.Description`} />,
    img: 'USAvisitor',
    url: 'usa/travel-insurance/visitor',
  },
  {
    title: <Text tid={`Exchange Visitor Insurance USA`} />,
    description:
    <Text tid={`HomeProduct.ExchangeVisitorInsuranceUSA.Description`} />,
    img: 'USAexchangeVisitor',
    url: 'https://stonewell.brokersnexus.com/exchange-visitor-insurance/',
  },
  {
    title: <Text tid={`Travel Insurance USA`} />,
    description:
    <Text tid={`HomeProduct.TravelInsuranceUSA.Description`} />,
    img: 'USAtraveler',
    url: 'https://stonewell.brokersnexus.com/multi-trip-travel-insurance/',
  }
]

const newImmigrantsProducts = [
  {
    title: <Text tid={`New Immigrants`} />,
    description:
    <Text tid={`TravelProducts.TravelInsuranceUSA.NewImmigrants.Description`} />,
    img: 'USAnewImmigrant',
    url: 'https://stonewell.brokersnexus.com/new-immigrant-insurance/',
  },
  {
    title: <Text tid={`Visiting with Greencard`} />,
    description:
    <Text tid={`TravelProducts.TravelInsuranceUSA.VisitingwithGreencard.Description`} />,
    img: 'USAgreenCard',
    url: 'https://stonewell.brokersnexus.com/green-card-holders-visiting-usa-insurance/',
  },
  {
    title: <Text tid={`Fiance Visa`} />,
    description:
    <Text tid={`TravelProducts.TravelInsuranceUSA.FianceVisa.Description`} />,
    img: 'USAFiance',
    url: 'https://stonewell.brokersnexus.com/fiance-visa-medical-insurance/',
  }
]

const studentProducts = [
  {
    title: <Text tid={`Student Insurance USA`} />,
    description:
    <Text tid={`HomeProduct.StudentInsuranceUSA.Description`} />,
    img: 'USAstudent',
    url: 'usa/travel-insurance/f1-f2-student',
  },
  {
    title: <Text tid={`OPT`} />,
    description:
    <Text tid={`TravelProducts.TravelInsuranceUSA.OPT.Description`} />,
    img: 'USAopt',
    url: 'https://stonewell.brokersnexus.com/opt-medical-insurance/',
  },
  {
    title: <Text tid={`Evacuation and Repatriation`} />,
    description:
    <Text tid={`TravelProducts.TravelInsuranceUSA.EvacuationRepatriation.Description`} />,
    img: 'USAevacuation',
    url: 'https://stonewell.brokersnexus.com/medical-evacuation-and-repatriation-insurance/',
  }
]

const americanProducts = [
  {
    title: <Text tid={`Travel Insurance Worldwide Multi Trip`} />,
    description:
    <Text tid={`HomeProduct.TravelInsuranceWorldwideMulti.Description`} />,
    img: 'USAworldwideTravelMulti',
    url: 'https://stonewell.brokersnexus.com/multi-trip-travel-insurance/',
  },
  {
    title: <Text tid={`Travel Insurance Worldwide Group Travel`} />,
    description:
    <Text tid={`HomeProduct.TravelInsuranceWorldwideGroup.Description`} />,
    img: 'USAworldwideTravelGroup',
    url: 'https://stonewell.brokersnexus.com/group-travel-medical-insurance/',
  },
  {
    title: <Text tid={`Travel Insurance Worldwide Missionary Travel`} />,
    description:
    <Text tid={`HomeProduct.TravelInsuranceWorldwideMissionary.Description`} />,
    img: 'USAworldwideTravelMissionary',
    url: 'https://stonewell.brokersnexus.com/missionary-travel-insurance/',
  },
  {
    title: <Text tid={`Travel Insurance Worldwide Expatriates`} />,
    description:
    <Text tid={`HomeProduct.TravelInsuranceWorldwideExpatriates.Description`} />,
    img: 'USAworldwideTravelExpatriates',
    url: 'https://stonewell.brokersnexus.com/expatriate-health-insurance/',
  },
]

export default function TravelUSAHome({match}) {     

  const classes = useStyles()

  const metaData = {
    title: "Meta.TravelUSA.Home.Title",
    description: "Meta.TravelUSA.Home.Description",
    canonical: match.url
  }

  // set userLanguage if url incluede /language
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)

  // useEffect(() => {
  //   if (match.params.language){
  //     userLanguageChange(match.params.language)
  //   }
  // },[match.params.language, userLanguageChange, userLanguage])

  //Responsive Design
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  let isMobile = (width <= 768);

  // Call To Action Banner Link
  const CTALinks = 'https://stonewell.brokersnexus.com/visitors-insurance/'

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    if (match.params.language) {
      userLanguageChange(match.params.language);
    }
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [match.params.language, userLanguageChange, userLanguage]);


  return (
    <>
      <MetaTags data={metaData} />
      <Banner />
      <Box my={10}>
        <Container>
          <Grid container style={{ justifyContent: 'center', marginTop: isMobile ? '0': '120px' }}>
            <Typography variant="h2" align="center" gutterBottom>
              <div className={classes.title}>
                <h3 className={classes.subTitle}>
                  <Text tid={`Home.Section1.Subtitle`} />
                </h3>
                <Text tid={`USAHome.Section1.Title`} />
              </div>
              <div className={classes.greenlineBox}>
                <span className={classes.greenline}></span>
              </div>
            </Typography>
            <Typography variant="body1" align="center"></Typography>
            <Product Products={homeProducts}/>
          </Grid>
        </Container>
      </Box>
      <Box py={1} style={{ backgroundColor: '#f7f7f7' }}>
        <Container style={{ marginTop: 80, marginBottom: 80 }}>
          <Typography variant="h2" align="center" gutterBottom>
            <div className={classes.title}>
              <h3 className={classes.subTitle}>
                <Text tid={`Home.Section2.Subtitle`} />
              </h3>
              <Text tid={`Home.Section2.Title`} />
            </div>
            
            <div className={classes.greenlineBox}>
              <span className={classes.greenline}></span>
            </div>
          </Typography>
          <WhyUs />
        </Container>
      </Box>
      <Box my={10}>
        <Container style={{ marginTop: 80, marginBottom: 80 }}>
          <Typography variant="h2" align="center" gutterBottom>
            <div className={classes.title}>
              <h3 className={classes.subTitle}>
              <Text tid={`USAHome.Section3.Subtitle`} />
              </h3>
              <Text tid={`USAHome.Section3.Title`} />
            </div>
           
            <div className={classes.greenlineBox}>
              <span className={classes.greenline}></span>
            </div>
          </Typography>

          <Product Products={newImmigrantsProducts} />
          {/* <TravelInsurance/> */}
        </Container>
      </Box>

      <Box my={10}>
        <Container style={{ marginTop: '20vh', marginBottom: '20vh' }}>
          <Typography variant="h2" align="center" gutterBottom>
            <div className={classes.title}>
              <h3 className={classes.subTitle}>
              <Text tid={`USAHome.Section4.Subtitle`} />
              </h3>
              <Text tid={`USAHome.Section4.Title`} />
            </div>
           
            <div className={classes.greenlineBox}>
              <span className={classes.greenline}></span>
            </div>
          </Typography>

          <Product Products={studentProducts} />
          {/* <TravelInsurance/> */}
        </Container>
      </Box>

      <Box my={10}>
        <Container style={{ marginTop: '20vh', marginBottom: '20vh' }}>
          <Typography variant="h2" align="center" gutterBottom>
            <div className={classes.title}>
              <h3 className={classes.subTitle}>
              <Text tid={`USAHome.Section5.Subtitle`} />
              </h3>
              <Text tid={`USAHome.Section5.Title`} />
            </div>
           
            <div className={classes.greenlineBox}>
              <span className={classes.greenline}></span>
            </div>
          </Typography>

          <Product Products={americanProducts} />
          {/* <TravelInsurance/> */}
        </Container>
      </Box>

      <CTA link={CTALinks}/>
      {/* <Box py={5}>
        <Container style={{ marginBottom: 80 }}>
          <Partner />
        </Container>
      </Box> */}
    </>
  )
}
