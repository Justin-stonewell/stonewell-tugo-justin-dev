import React, {useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Text, LanguageContext } from "./LanguageProvider";
import { Breadcrumbs } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import Button from './CustomButtons/Button'
import { Hidden } from '@material-ui/core'

//styles
import bannerStyles from '../../assets/jss/styles/bannerStyle'

const useStyles = makeStyles(bannerStyles)

export default function Banner(props) {
  const { title, quote_url, links, buttonTitle } = props
  const classes = useStyles()

  // useEffect(() => {
  //   let path = window.location.pathname
  //   console.log(window.location.pathname)
  //   console.log(path.substring(path.lastIndexOf('/') + 1))
  // })
  //Responsive Design
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  let isMobile = (width <= 768);

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage
  // Construct the dynamic image URL with language condition
  let dynamicImageURL = `/imgs/banner${window.location.pathname}.png`;
  // Remove the language code if currentLanguage exists
  if (currentLanguage) {
    dynamicImageURL = dynamicImageURL.replace(`/${currentLanguage}`, '');
  }

  if (quote_url) {
    return (
      <>
        <Hidden lgDown>
          {/* Breadcrumbs */}
          <Grid container justifyContent="center">
            <Grid
              item
              container
              xs={8}
              justifyContent="flex-end"
              className={classes.BreadCrumbsWrapper}
            >
              <Breadcrumbs
                className={classes.NavigateNextIcon}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                {links.map((link) => (
                  <Link className={classes.link} to={link.to} key={link}>
                    <Text tid={link.name} />
                  </Link>
                ))}
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Hidden>

        <Grid
          container
          className={classes.bannerWrapper}
          style={{
            // background: `url(/imgs/banner${window.location.pathname}.png)`,
            background: `url(${dynamicImageURL})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          direction="row"
          justifyContent= {isMobile? "flex-start" : "center"}
          alignItems="center"
        >
          {/* <Grid item md={1}></Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={10} xl={8} className={classes.root}>
            {title.map((title) => (
              <Typography variant='h1' className={classes.headerSubTitle} key={title}>
                <Text tid={title} />
              </Typography>
            ))}
            <Link to={quote_url} style={{ textDecoration: 'none' }}>
              <Button className={classes.carouselBtn}>
               <Text tid={ buttonTitle ? buttonTitle : `Get a quote`} />
              </Button>
            </Link>
          </Grid>
          {/* <Hidden only="xs">
            <Grid item xs={12} sm={7} className={classes.headerBanner} />
          </Hidden> */}
        </Grid>
      </>
    )
  } else {
    return (
      <>
        {/* Breadcrumbs */}
        <Hidden lgDown>
          <Grid container justifyContent="center">
            <Grid
              item
              container
              xs={8}
              justifyContent="flex-end"
              className={classes.BreadCrumbsWrapper}
            >
              <Breadcrumbs
                className={classes.NavigateNextIcon}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                {links.map((link) => (
                  <Link className={classes.link} to={link.to} key={link}>
                    <Text tid={link.name} />
                  </Link>
                ))}
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Hidden>

        <Grid
          container
          className={classes.bannerWrapper}
          style={{
            // background: `url(/imgs/banner${window.location.pathname}.png)`,
            background: `url(${dynamicImageURL})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          direction="row"
          justifyContent= {isMobile? "flex-start" : "center"}
          alignItems="center"
        >
          {/* <Grid item md={1}></Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={8} className={classes.root}>
            {title.map((title) => (
              <Typography variant='h1' className={classes.headerSubTitle} key={title}>
                <Text tid={title} />
              </Typography>
            ))}
          </Grid>
          {/* <Hidden only="xs">
            <Grid item xs={12} sm={7} className={classes.headerBanner} />
          </Hidden> */}
        </Grid>
      </>
    )
  }
}
