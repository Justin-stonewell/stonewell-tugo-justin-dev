import React from 'react'
import { Grid, Typography } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles'
import { Text } from '../../../components/common/LanguageProvider'
//components
import Hidden from '@material-ui/core/Hidden'
import { Card, CardContent  } from '@mui/material';

import BannerQuote from '../../../components/common/BannerQuote'
import Banner from '../../../components/common/Banner'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import SectionContent from '../../../components/common/SectionContent'
import IconCard from '../../../components/common/IconCard/IconCard';
// icons
import LooksOneSharpIcon from '@mui/icons-material/LooksOneSharp';
import LooksTwoSharpIcon from '@mui/icons-material/LooksTwoSharp';
import Looks3SharpIcon from '@mui/icons-material/Looks3Sharp';

// banner Title
const bannerTitle = ['Partner with us']
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/partner',
    name: 'Partner with us',
  },
]

const buttonTitle = ['Request partnership']

const stickyLeftMenu = [
  {
    href: '#who-we-are',
    title: 'Partner.WhyShouldPartner.Label',
  },
  {
    href: '#who-is-partner',
    title: 'Partner.WhoIdealPartner.Label',
  },
  {
    href: '#become-partner-process',
    title: 'Partner.Process.Label',
  },
  {
    href: '#register-partner',
    title: 'Partner.BecomePartner.Label',
  },
]

// partners
const whoIsPartner = [
  {
    title: 'agency',
    src: '/imgs/icon/student.svg',
    src2: '/imgs/icon/student-bk.svg'
  },
  {
    title: 'school',
    src: '/imgs/icon/graduate.svg',
    src2: '/imgs/icon/graduate-bk.svg'
  },
  {
    title: 'brokers',
    src: '/imgs/icon/companion.svg',
    src2: '/imgs/icon/companion-bk.svg'
  },
  
]

const partnerProcess = [
  {
      title:  <Text tid={'Partner.Process.Step1.Title'} />,
      value:  <Text tid={'Partner.Process.Step1.Content'} />,
      icon: <LooksOneSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
      title:  <Text tid={'Partner.Process.Step2.Title'} />,
      value:  <Text tid={'Partner.Process.Step2.Content'} />,
      icon: <LooksTwoSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  },
  {
      title:  <Text tid={'Partner.Process.Step3.Title'} />,
      value:  <Text tid={'Partner.Process.Step3.Content'} />,
      icon: <Looks3SharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
  }
]

export default function Partner() {  

  // const classes = useStyles()
  return (
    <>
      <Banner title={bannerTitle} links={links} quote_url ='/register-partner' buttonTitle={buttonTitle} />
  
      <Grid container justifyContent="center" spacing={0}>
        {/* Side menu */}
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
        {/* Contents */}
        <Grid item sm={12} lg={8} xl={6}>
          <section className="target" id="who-we-are">
            <SectionContent
              label="Partner.WhyShouldPartner.Label"
              detail="Partner.WhyShouldPartner.Content"
              subTitle="Partner.WhyShouldPartner.subTitle"
            />
          </section>

          <section id="who-is-partner">
            <Grid container justifyContent="center">
              <Grid item xs={12} style={{ marginBottom:'-2rem'}}>
                <SectionContent
                  label="Partner.WhoIdealPartner.Label"
                  detail=""
                  subTitle="Partner.WhoIdealPartner.subTitle"
                />
              </Grid>
              <Grid item xs={12}>
                <IconCard Content={whoIsPartner} />
               </Grid>
            </Grid>
          </section>

          {/* Why Stonewell */}
          <section id="become-partner-process">
              <Grid container>
                  <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                    <SectionContent
                      label="Partner.Process.Label"
                      detail=""
                      subTitle="Partner.Process.subTitle"
                    />
                  </Grid>
                  <Grid item container xs={12} style={{ maxWidth:'1000px', margin:'3vh auto', padding:'0 2em', fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'}}>
                      {partnerProcess.map((con, index) => (
                          <Grid item key={index} xs={12} sm={12} md={12} lg={4}>
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

          <section className="target" id="register-partner">
            {/* <SectionContent
              label="Partner.BecomePartner.Label"
              detail="Partner.BecomePartner.Content"
            /> */}
               <Grid item xs={12} style={{maxWidth:"1000px", marginTop:'-10vh', marginBottom:'10vh' }}>
                <BannerQuote  
                  title = "Partner.BecomePartner.Label"
                  quote_Btn_Disable ="false" 
                  buttonTitle={buttonTitle}
                  quote_url ='/register-partner'/>
              </Grid>
          </section>
          {/* <section id="why-us">
              <Grid container justifyContent="center" >
                <Grid item xs={12}>
                  <SectionContent
                    label="Banner.Whyus.label"
                    detail="Banner.Whyus.detail"
                  />
                </Grid>
                <Grid item xs={12} style={{maxWidth:"1000px"}}>
                  <WhyUs />
                </Grid>
              </Grid>
          </section> */}
        </Grid>
      </Grid>
    </>
  )
}
