import React, { useState, useEffect }  from 'react'

//core components
import { Grid } from '@material-ui/core'

//common components
import EnrolmentForm from './EnrolmentForm';

//style
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    width: 'auto',
    // border:'1px solid #efefef', 
    // boxShadow:'5px 5px 20px #efefef',
    // padding: '0 2vh'
  },
}));

export const GroupEnrollmentForm = (props) => {
    const classes = useStyles();
    // console.log(props)
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
    
    let isMobile = (width < 769);

    // from where parameter in url
    // const queryString = new URLSearchParams(props.location.search);
    // const sourceChnnel = queryString.get('channel')
    // const renewal = queryString.get('renewal')
    // const insured = queryString.get('insured')
    // const contact = queryString.get('contact')



    return (
        <>
        <Grid container justifyContent="center" style={{margin: isMobile?'0':'1vh 0'}}>
            <Grid item xs={12} sm={12} md={11} lg={ width > 1400 ? 8 : 7 } xl={ width > 1400 ? 8 : 6 }>
                <main className={classes.form} style={{ padding:isMobile?'0':'0 2vh' }}>
                    <EnrolmentForm 
                        vendorAccessCode = {props.match.params.vendorAccessCode}
                        // insuraceCompany = {props.match.params.company}
                        // insuraceType = {props.match.params.type}
                        // applyType = {props.match.params.applyType}
                        // sourceChnnel = {sourceChnnel}
                        // renewal = {renewal}
                        // insured = {JSON.parse(insured)}
                        // contact= {JSON.parse(contact)}
                    />
                </main>
            </Grid>
        </Grid>
        </>
    )
}

export default GroupEnrollmentForm
