import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Text } from '../../../../components/common/LanguageProvider'
import WindowDimension from '../../../../components/common/WindowDimension'


const useStyles = makeStyles((theme) => ({
  // Slide
  carouselImg: {
    height: '450px',
    maxWidth: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '300px',
    },
  },
  carouselText: {
    fontSize: '3.5rem',
    fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif',
    fontWeight: '700',
    color: '#fff',
    textShadow: '1px 1px #00000070',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  carouselSubTitle: {
    fontSize: '1rem',
    color: '#fff',
    textShadow: '1px 1px #00000070',
  },
  carouselTextWrapper: {
    marginTop: 120,
    marginLeft: '15%',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginLeft: '10%',
      marginRight: '10%',
      marginTop:60
    },
  },
  carouselBtn: {
    marginTop: 50,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border:'3px solid #fff',
    borderRadius: '0',
    '&:hover': {
      backgroundColor: '#2a2f71',
      boxSshadow: '0px 2px 2px lightgray',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop:'30px'
    },
  },
}))


const bannerslide = [
    { img: "f1-f2-student.png", title: "Student Insurance USA", description: 'TravelInsurance.USA.Banner.F1Student', linkQuote:"/usa/travel-insurance/f1-f2-student" },
    { img: "visitor.png", title: "Visitor Insurance USA", description: 'TravelInsurance.USA.Banner.Visitor', linkQuote: "/usa/travel-insurance/visitor"},
    { img: "amerian.png", title: "Travel Insurance USA", description: 'TravelInsurance.USA.Banner.Amercian', linkQuote: "https://stonewell.brokersnexus.com/multi-trip-travel-insurance/"},
]


export default function Banner() { 

  const classes = useStyles()

  const { width } = WindowDimension();
  let isMobile = (width <= 959);

  var settings = {
  dots: true,
  arrows: isMobile ? false : true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  }


  return (
    <div className={'carousel-header'} style={{ position:'relative', top: isMobile? '0':'37px' }}>
    <h1 style={{ display:'none' }}><Text tid={`Meta.Home.Title`}/></h1>
      <Slider id="bannerSlider" {...settings}>
        {bannerslide.map((item, i) => (
            <div key={i}>
                <div className={classes.carouselImg} style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/imgs/banner/usa/travel-insurance/" + item.img + ")" }}>
                  <div className={classes.carouselTextWrapper}>
                    <Typography variant="h2" className={classes.carouselText}>
                    {/* <h1 className={classes.carouselText}> */}
                      <Text tid={item.title} />
                    {/* </h1> */}
                    </Typography>
                    <Typography className={classes.carouselSubTitle} variant="h3">
                      {/* <Text tid={`Travel Insurance Subtitle`} /> */}
                      <Text tid={item.description}/>
                    </Typography>

                    {/* Button */}
                    {item.linkQuote.includes('brokersnexus') ? (
                      <a href={item.linkQuote} style={{ textDecoration: 'none' }}>
                        <Button
                          className={classes.carouselBtn}
                          variant="contained"
                          size="large"
                        >
                          <Text tid={`See Detail`} />
                        </Button>
                      </a>
                    ) : (
                      <Link to={item.linkQuote} onClick={()=>{window.dataLayer.push({'event': 'Request quote'})}} style={{textDecoration:'none'}}>
                        <Button
                          className={classes.carouselBtn}
                          variant="contained"
                          size="large"
                        >
                          <Text tid={`See Detail`} />
                        </Button>
                     </Link>
                    )}
                    
                  </div>
                </div>
            </div>
        ))}
      </Slider>
    </div>
  )
}
