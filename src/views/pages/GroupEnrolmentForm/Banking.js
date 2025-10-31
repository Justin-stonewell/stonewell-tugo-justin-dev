import React, { useEffect, useState } from 'react'
//core components
// import { Grid, RadioGroup, Radio, FormControl, FormControlLabel } from '@material-ui/core'
import { Grid } from '@material-ui/core'
// import { Autocomplete } from '@material-ui/lab';

//common components
import { Text } from '../../../components/common/LanguageProvider';
import { RegularTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall' 

// import Button from '../../../components/common/CustomButtons/Button'
// import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
// import { CalculateAgeDays  
//         } from '../../../controllers/CalculateValue'
// import InputAdornment from '@material-ui/core/InputAdornment';
// import TooltipInfo from '../../../components/common/TooltipInfo';

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'
import SignaturePad from '../../../components/common/SignaturePad';

//setup form style
const useStyles = makeStyles(formStyle)

// const multiDaysOption = [
//   {companyName: 'Allianz', daysOpt: 4},
//   {companyName: 'Allianz', daysOpt: 8},
//   {companyName: 'Allianz', daysOpt: 15},
//   {companyName: 'Allianz', daysOpt: 35},
  
// ]


export const Banking = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validMessage
}) => {
    // set form style
    const classes = useStyles();

    //Mobile responsive
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
    
    // let isMobile = (width < 768);

    // Signature Pad
    const [signatureData, setSignatureData] = useState(null);

    const handleSignatureSave = (data) => {
        setSignatureData(data);
        values.planMemberSignature = data
    };

    return (
        <div>
                <Grid container style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-50px' : '0' }}>

                    <Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                            <span className={classes.spanTitle}>
                                <Text tid={'GroupEnrolmentForm.Banking.Title'}/>
                            </span>
                    </Grid>

                    <Grid item container xs={12} sm={12} md={12} spacing={2}>

                      <Grid item container xs={12} sm={12} md={12} spacing={2}>

                            <Grid item xs={12} sm={4} md={4}>
                                <RegularTextFieldSmall
                                    label= {'Transit Number'}
                                    name={`banking.${0}.transitNumber`}
                                    value={values.banking[0].transitNumber}
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                        setFieldValue(`banking.${0}.transitNumber`, e.currentTarget.value)
                                        console.log(values.planMemberSignature)
                                    }}
                                    onBlur={handleBlur}
                                />
                                {validMessage(`banking.${0}.transitNumber`)}
                            </Grid>
                       
                            <Grid item xs={12} sm={4} md={4}>
                                <RegularTextFieldSmall
                                    label= {'Institution Number'}
                                    name={`banking.${0}.institutionNumber`}
                                    value={values.banking[0].institutionNumber}
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                        setFieldValue(`banking.${0}.institutionNumber`, e.currentTarget.value)
                                    }}
                                    onBlur={handleBlur}
                                />
                                {validMessage(`banking.${0}.institutionNumber`)}
                            </Grid>

                            <Grid item xs={12} sm={4} md={4}>
                                <RegularTextFieldSmall
                                    label= {'Account Number'}
                                    name={`banking.${0}.accountNumber`}
                                    value={values.banking[0].accountNumber}
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                        setFieldValue(`banking.${0}.accountNumber`, e.currentTarget.value)
                                    }}
                                    onBlur={handleBlur}
                                />
                                {validMessage(`banking.${0}.accountNumber`)}
                            </Grid>
                            
                      </Grid>

                      <Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                            <span className={classes.spanTitle}>
                                {/* <Text tid={'GroupEnrolmentForm.Banking.Title'}/> */}
                                Authorization and signature – you must sign and date the form
                            </span>
                      </Grid>
                      
                      <Grid item container xs={12} sm={12} md={12} spacing={2}>
                        <SignaturePad signatureData={signatureData} onSave={handleSignatureSave} />
                        {validMessage(`planMemberSignature`)}
                      </Grid>


                    </Grid>

                </Grid>
        </div>
    )
}

export default Banking
