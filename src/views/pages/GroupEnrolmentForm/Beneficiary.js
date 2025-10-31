import React, { useEffect, useState } from 'react'
//core components
// import { Grid, RadioGroup, Radio, FormControl, FormControlLabel } from '@material-ui/core'
import { Grid, MenuItem } from '@material-ui/core'
// import { Autocomplete } from '@material-ui/lab';

//common components
import { Text } from '../../../components/common/LanguageProvider';
import { RegularTextFieldSmall, SelectTextFieldSmall, SelectMenuTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall' 
// import Button from '../../../components/common/CustomButtons/Button'
// import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
// import { CalculateAgeDays  
//         } from '../../../controllers/CalculateValue'
import InputAdornment from '@material-ui/core/InputAdornment';
// import TooltipInfo from '../../../components/common/TooltipInfo';

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'

//setup form style
const useStyles = makeStyles(formStyle)

// const multiDaysOption = [
//   {companyName: 'Allianz', daysOpt: 4},
//   {companyName: 'Allianz', daysOpt: 8},
//   {companyName: 'Allianz', daysOpt: 15},
//   {companyName: 'Allianz', daysOpt: 35},
  
// ]

const relationship = [
    { code: 'Estate', name: 'Estate' },
    { code: 'Spouse', name: 'Spouse' },
    { code: 'Child', name: 'Child' },
    { code: 'Parent', name: 'Parent' },
    { code: 'Siblings', name: 'Siblings' },
    { code: 'Relatives', name: 'Relatives' },
    { code: 'Friends', name: 'Friends' },
    { code: 'Other', name: 'Other' }
]


export const Beneficiary = ({
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

    // add beneficiary
    function addbeneficiary(beneficiaryNumber, beneficiary){

        const applied = beneficiaryNumber - beneficiary.length;
        // console.log(beneficiaryNumber, beneficiary.length)
        if (applied <= 0)
        {
            for (var i = 0; i < (applied * -1); i++) {
                beneficiary.pop()
            }
        }
        else{
            for (var j = 0; j < applied; j++) {
                beneficiary.push({
                    firstName: '',
                    lastName: '',
                    relationship: '',
                    percentage: ''
                })
            }
        }
        return beneficiary;
    }

    const beneficiaryInfo = (index) => {
        return (
            <>
                    <Grid item container xs={12} sm={12} md={12}>
                         <Grid item container className={classes.spanSubTitle} style={{ margin:'2vh 0'}}>
                            <span><Text tid={'Quote.Beneficiary'}/> # {index+1}</span>
                         </Grid>

                         <Grid item container spacing={1}>

                                {/* Last Name */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.LastName'}
                                        name={`beneficiary.${index}.lastName`}
                                        value={values.beneficiary[index].lastName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`beneficiary.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`beneficiary.${index}.lastName`)}
                                </Grid>

                                {/* First Name */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.FirstName'}
                                        name={`beneficiary.${index}.firstName`}
                                        value={values.beneficiary[index].firstName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`beneficiary.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`beneficiary.${index}.firstName`)}
                                </Grid>

                                {/* Relationship */}
                                <Grid item xs={12} sm={8} md={4}>
                                  <SelectMenuTextFieldSmall
                                    label={'Relationship to Plan Member'}
                                    // label = {currentLanguage !== 'ko'
                                    //             ?(`${values.insuredPersons[index].firstName} is ${values.insuredPersons[0].firstName}'s`)
                                    //             :(`${values.insuredPersons[index].firstName} 는 ${values.insuredPersons[0].firstName} 님의`)
                                    //         }
                                    value={values.beneficiary[index].relationship?values.beneficiary[index].relationship:''}
                                    name={`beneficiary.${index}.relationship`}
                                    // disabled={index === 0 ? true : false}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    >
                                    {relationship
                                        .map((item) => (
                                            <MenuItem key={item.code} value={item.code}>
                                            <Text tid={`Quote.${item.name}`}/>
                                    </MenuItem>
                                    ))}
                                    </SelectMenuTextFieldSmall>
                                    {validMessage(
                                        `beneficiary.${index}.relationship`
                                    )}
                                </Grid>
                                
                                {/* Percentage */}
                                <Grid item xs={12} sm={8} md={4}>
                                    <RegularTextFieldSmall
                                        name={`beneficiary.${index}.percentage`}
                                        type="number"
                                        value={values.beneficiary[index].percentage}
                                        InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                  %
                                              </InputAdornment>
                                            ),
                                            inputProps: {
                                                min: 1,
                                                max: 100
                                            }
                                        }}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            let inputValue = parseInt(e.target.value, 10);
                                            if (inputValue > 100) {
                                                inputValue = 100;
                                            } else if (inputValue < 1 || isNaN(inputValue)) {
                                                inputValue = 1;
                                            }
                                            // If using Formik or another form library, you may need to adjust the next line:
                                            e.target.value = inputValue.toString(); 
                                            handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        label="Percentage"
                                    />
                                    {validMessage(`beneficiary.${index}.percentage`)}
                                </Grid>
                                
                               
                        </Grid>
                    </Grid>
            </>
        );
    };

    return (
        <div>
                <Grid container style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-50px' : '0' }}>
                    <Grid item container xs={12} sm={12} md={12}>
                                <Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                                        <span className={classes.spanTitle}>
                                          <Text tid={'Quote.Beneficiary'}/>
                                        </span>
                                </Grid>

                                {/* Number of children */}
                                <Grid item xs={12} sm={6} md={4}>
                                        <SelectTextFieldSmall
                                            label={'Number of Beneficiary'}
                                            name='beneficiaryNumber'
                                            value={values.beneficiaryNumber}
                                            onChange={(e) => {
                                                values.beneficiaryNumber = e.currentTarget.value
                                                setFieldTouched('beneficiaryNumber')
                                                setFieldValue('beneficiaryNumber', e.currentTarget.value)
                                                setFieldValue('beneficiary', addbeneficiary(e.currentTarget.value, values.beneficiary))  
                                            //    console.log(values)
                                            }}
                                            onBlur={handleBlur}
                                        >
                                            {/* <option value='' hidden>Select</option> */}
                                            {[0,1,2,3]
                                                // .filter(f=>f > (values.insuredGroupType === 'Family'? 2:0))
                                                .map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                            ))}
                                        </SelectTextFieldSmall>
                                </Grid>

                                {values.beneficiaryNumber > 0 && values.beneficiary.length > 0
                                    && values.beneficiary.map((beneficiary, pIndex) => (
                                        <div key={pIndex}>
                                            {beneficiaryInfo(pIndex)}
                                            <br />
                                        </div>
                                ))}
                    </Grid>

                </Grid>
        </div>
    )
}

export default Beneficiary
