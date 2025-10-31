import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Text } from '../common/LanguageProvider'
// import { Link } from 'react-router-dom'
// import Button from '../common/CustomButtons/Button'
// import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles((theme) => ({
  stickyLeftMenu: {
    position: 'sticky',
    top: '120px',
    marginTop: '80px',
    marginRight: '3vw',
    fontFamily:'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif',
    // [theme.breakpoints.up('xl')]: {
    //   paddingLeft: '24px',
    // },
    [theme.breakpoints.down('lg')]: {
      marginLeft:'-5vh'
    },
    '& h2': {
      fontWeight: 700,
      fontSize: '1em',
      color:'#2a2f71',
      // paddingLeft: '16px',
      // borderBottom: '1px solid #eee',
      padding: '1em 0.5em',
      marginBottom:'0',
      // background:'#2a2f71'
    }
  },
  label: {
    marginBottom: '16px',
    color: theme.palette.primary.main,
    fontWeight: '500',
    fontSize: '1.8em',
    marginTop: '0.6em',
  },
  leftMenuUl: {
    listStyle: 'none',

    paddingLeft: '0',
  },
  leftMenuLi: {
    // borderLeft: '3px solid',
    // borderColor: theme.palette.primary.light,
    // background:'#EBEDED',
    // borderBottom:'1px solid #fff',
    margin: '0',
    padding: '10px',
    '&:hover': {
      // borderLeft: '3px solid rgb(163, 201, 84)',
      background: '#EBEDED'
    }
  },
  leftMenuLink: {
    color: theme.palette.neutral.dark,
    fontWeight: 400,
    fontSize: '0.9em',
    fontFamily:'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif',
    '&:hover': {
      textDecoration: 'none',
      fontWeight: 700,
      color: theme.palette.primary.main,
    },
    subtitle: {
      letterSpacing: '-0.2em',
    },
  },
  quoteBox: {
    background: '#f5f5f5',
    color: '#222',
    textAlign: "center",
    // margin: '0 10px 0 16px',
    padding: '20px',
    '& h2': {
      fontSize: '1em',
      fontWeight: '600'
    },
  },
  quoteLink: {
    textDecoration: 'none',
    color: "#222",
    fontWeight: "600",
    '&:hover,&:focus': {
      color: theme.palette.primary.dark,
    },
  }
}))

export default function StickyLeftMenu(props) {
  // const { lists, quote_url, title } = props
  const { lists, quote_url } = props
  const classes = useStyles()

  if (quote_url) {
    return (
      <>
        <div className={classes.stickyLeftMenu}>
          <h2><Text tid={'Contents'} /></h2>
          <nav>
            <ul className={classes.leftMenuUl}>
              {lists.map((el, index) => (
                <li className={classes.leftMenuLi} key={index}>
                  <a className={classes.leftMenuLink} href={el.href}>
                    <Text tid={el.title} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    )
  } else if (!quote_url) {
    return (
      <>
        <div className={classes.stickyLeftMenu}>
          <h2><Text tid={'Contents'} /></h2>
          <nav>
            <ul className={classes.leftMenuUl}>
              {lists.map((el, index) => (
                <li className={classes.leftMenuLi} key={index}>
                  <a className={classes.leftMenuLink} href={el.href}>
                    <Text tid={el.title} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    )
  }
}
