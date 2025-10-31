import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Container } from '@material-ui/core'
import { Text } from '../common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 2em',
    maxWidth: '1000px',
    fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'
  },
  label: {
    color: theme.palette.primary.main,
    marginBottom:'2rem',
    fontWeight: '600',
    fontSize: '2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize:'1.4rem',
      textAlign:'center'
    },
  },
  detail: {
    marginTop: '16px',
    [theme.breakpoints.down('sm')]: {
      marginBottom:'16px'
    },
  },
  greenlineBox: {
    paddingBottom: '1em',
    [theme.breakpoints.down('sm')]: {
      textAlign: "center"
    },
  },
  greenline: {
    width: "2.5rem",
    height: "3px",
    background: "linear-gradient(to right, #8EC641, transparent)",
    display: "inline-block",
    borderRadius: '100px'
  },
  subTitle: {
    fontSize:'1rem', 
    fontWeight:'400', 
    color:'#bbb', 
    display:'inline-block', 
    marginLeft:'2vh'
  },

}))

export default function SectionContent(props) {
  const { label, detail, align, subTitle } = props
  const classes = useStyles()

  return (
    <>
      <Container className={classes.root}>
        <div className={classes.greenlineBox}>
          <span className={classes.greenline}></span>
          <h2 className={classes.subTitle}><Text tid={subTitle} /></h2>
        </div>
        <Typography
          className={classes.label}
          variant="h3"
          align={align ? align : 'inherit'}
        >
          <Text tid={label} />
        </Typography>
        <Typography className={classes.detail} variant="body1">
          <Text tid={detail} />
        </Typography>
      </Container>
    </>
  )
}
SectionContent.propTypes = {
  label: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  center: PropTypes.bool,
}
