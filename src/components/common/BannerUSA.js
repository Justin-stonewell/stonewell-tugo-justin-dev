import React, { useContext } from "react";
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

export default function BannerUSA(props) {
  const { title, links, quote_url } = props
  const classes = useStyles()

  // useEffect(() => {
  //   let path = window.location.pathname
  //   console.log(window.location.pathname)
  //   console.log(path.substring(path.lastIndexOf('/') + 1))
  // })

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage
  // Construct the dynamic image URL with language condition
  let dynamicImageURL = `/imgs/banner/${window.location.pathname}.png`;
  // Remove the language code if currentLanguage exists
  if (currentLanguage) {
    dynamicImageURL = dynamicImageURL.replace(`/${currentLanguage}`, '');
  }

  
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
            // marginBottom:'-5vh'
          }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {/* <Grid item md={1}></Grid> */}
          <Grid item container xs={8} className={classes.root}>
            {title.map((title) => (
              <Typography variant='h1' className={classes.headerSubTitle} key={title}>
                <Text tid={title} />
              </Typography>
            ))}
            {/* {quoteBox} */}
            <Grid item container>
              <a href={quote_url} style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
                <Button className={classes.carouselBtn}>
                <Text tid={`Get a quote`} />
                </Button>
              </a>
            </Grid>
          </Grid>

            

          {/* <Hidden only="xs">
            <Grid item xs={12} sm={7} className={classes.headerBanner} />
          </Hidden> */}
        </Grid>
      </>
    )
  }

