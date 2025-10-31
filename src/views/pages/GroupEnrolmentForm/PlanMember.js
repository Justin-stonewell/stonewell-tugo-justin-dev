import React, { useEffect, useState } from 'react'
//core components
// import { Grid, RadioGroup, Radio, FormControl, FormControlLabel } from '@material-ui/core'
import { Grid, TextField, MenuItem, Tooltip } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import InputMask from 'react-input-mask'
import { Field } from 'formik'
import MuiPhoneInput from 'material-ui-phone-number'

//common components
import { Text } from '../../../components/common/LanguageProvider';
import { RegularTextFieldSmall, SelectTextFieldSmall, SelectMenuTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall' 
import TooltipInfo from '../../../components/common/TooltipInfo';
// import Button from '../../../components/common/CustomButtons/Button'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
import { CalculateAge  
        } from '../../../controllers/CalculateValue'
// import InputAdornment from '@material-ui/core/InputAdornment';
//icon
import HelpIcon from '@mui/icons-material/Help'
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



const maritalStatus = [
    { code: 'Single', name: 'Single'},
    { code: 'Married', name: 'Married'},
    { code: 'CommonLaw', name: 'CommonLaw'},
    { code: 'CivilUnion', name: 'CivilUnion'},
    { code: 'Divorced', name: 'Divorced'},
    { code: 'Separated', name: 'Separated'},
    { code: 'Widowed', name: 'Widowed'}
]


export const PlanMember = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    setTouched,
    provinces,
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
    
    let isMobile = (width < 768);

    // add children
    function addchildren(childrenNumber, children){

        // If childrenNumber is 0, return an empty array
        if (childrenNumber === 0) {
            return [];
        }

        const applied = childrenNumber - children.length;
        if (applied <= 0)
        {
            for (var i = 0; i < (applied * -1); i++) {
                children.pop()
            }
        }
        else{
            for (var j = 0; j < applied; j++) {
                children.push({
                    firstName: '',
                    lastName: '',
                    birthDate: null,
                    age: 0,
                    gender: '',
                    isStudent: '',
                    isOverAgeDisabledChild: ''
                })
            }
        }
        return children;
    }

    // const initialProvince = values.planMember[0].provinceOfEmployment 
    // ? provinces.find(c => c.country_code === 'CA' && c.province_name === values.planMember[0].provinceOfEmployment) 
    // : null;

    const childrenInfo = (index) => {
        return (
            <>
                    <Grid item container xs={12} sm={12} md={12}>
                         <Grid item container className={classes.spanSubTitle} style={{ margin:'2vh 0'}}>
                            <span><Text tid={'Quote.Child'}/> # {index+1}</span>
                         </Grid>

                         <Grid item container spacing={1}>
                                {/* Last Name */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.LastName'}
                                        name={`children.${index}.lastName`}
                                        value={values.children[index].lastName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`children.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`children.${index}.lastName`)}
                                </Grid>
                                {/* middle Name */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.MiddleName'}
                                        name={`children.${index}.middleName`}
                                        value={values.children[index].middleName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`children.${index}.middleName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                </Grid>
                                {/* First Name */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.FirstName'}
                                        name={`children.${index}.firstName`}
                                        value={values.children[index].firstName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`children.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`children.${index}.firstName`)}
                                </Grid>
                                
                                {/* Gender */}
                                <Grid item xs={12} sm={3} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}><Text tid={'Quote.Gender'}/></label>
                                    <ToggleButtonGroup
                                        className={classes.toggleButtonGroup}
                                        name={`children.${index}.gender`}
                                        value={values.children[index].gender}
                                        exclusive
                                        onChange={(e) => {
                                            setFieldValue(`children.${index}.gender`, e.currentTarget.value)
                                        }}
                                    >
                                        <ToggleButton value="Male" className={classes.toggleButton}>
                                            <Text tid={'Quote.Male'}/>
                                        </ToggleButton>
                                        <ToggleButton value="Female" className={classes.toggleButton}>
                                            <Text tid={'Quote.Female'}/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    {validMessage(`children.${index}.gender`)}
                                </Grid>    

                                {/* Date of Birth */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Quote.BirthDate'}/></label>
                                
                                    <KeyboardDatePickerField 
                                        name={`children.${index}.birthDate`}
                                        value={values.children[index].birthDate}
                                        maxDate={new Date()}
                                        onChange={(e) => {
                                            values.children[index].birthDate = e
                                            setFieldValue(`children.${index}.birthDate`, e)
                                            setFieldValue(`children.${index}.age`, CalculateAge(e))
                                        }}
                                        onBlur={handleBlur}
                                        style={{ width:'100%', margin:'4px 0 4px 0' }}
                                    />
                                    {validMessage(`children.${index}.birthDate`)}
                                </Grid>

                                {/* Age */}
                                <Grid item xs={12} sm={2} md={4}>
                                    <RegularTextFieldSmall
                                        name={`children.${index}.age`}
                                        label= {'Quote.Age'}
                                        type='text'
                                        value={values.children[index].age}
                                        disabled
                                    />
                                </Grid>
                                
                                {/* Is Student? */}
                                {values.children[index].age > 20 && values.children[index].age < 25?
                                    <Grid item xs={12} sm={3} md={4}>
                                        <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}>
                                            <Text tid={'GroupEnrolmentForm.Children.IsStudent'}/>
                                            <Tooltip title={<Text tid={'A student is a child age 21 or over but under age 25, who is a full-time student attending an educational institution recognized by Canada Revenue Agency, as long as the child is not married or in any other formal union and is entirely dependent on you for financial support. (For Quebec plan members, please check with your plan administrator for dependent student age limit.)'}/>} placement="right-end" color="primary" enterTouchDelay={0}>
                                                <HelpIcon/>
                                            </Tooltip>
                                        </label>
                                        <ToggleButtonGroup
                                            className={classes.toggleButtonGroup}
                                            name={`children.${index}.isStudent`}
                                            value={values.children[index].isStudent}
                                            exclusive
                                            onChange={(e) => {
                                                setFieldValue(`children.${index}.isStudent`, e.currentTarget.value)
                                            }}
                                        >
                                            <ToggleButton value="true" className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value="false" className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`children.${index}.gender`)}
                                    </Grid>  
                                :null} 

                                {values.children[index].age > 19 ?
                                <>
                                {/* Is Over-age disabled child? */}
                                    <Grid item xs={12} sm={3} md={4}>
                                        <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}>
                                            <Text tid={'GroupEnrolmentForm.Children.IsOverAgeDisabledChild'}/>
                                            <Tooltip title={<Text tid={'To enrol an over-age disabled child, complete a Disabled Child Coverage form, and send it to us within 31 days of the date the dependent reaches the age limit.)'}/>} placement="right-end" color="primary" enterTouchDelay={0}>
                                                <HelpIcon/>
                                            </Tooltip>
                                        </label>
                                        <ToggleButtonGroup
                                            className={classes.toggleButtonGroup}
                                            name={`children.${index}.isOverAgeDisabledChild`}
                                            value={values.children[index].isOverAgeDisabledChild}
                                            exclusive
                                            onChange={(e) => {
                                                setFieldValue(`children.${index}.isOverAgeDisabledChild`, e.currentTarget.value)
                                            }}
                                        >
                                            <ToggleButton value="true" className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value="false" className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`children.${index}.gender`)}
                                    </Grid>  
                                </>
                                :null}
                                {/* Refusal of Benefits  */}
                                <Grid item xs={12} sm={6} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                                        <Text tid={'GroupEnrolmentForm.RefusalExtendedHealth.Label'}/>
                                        <TooltipInfo info={<Text tid={'Tooltip.RefusalofBenefits'}/>}/>
                                    </label>
                                    <ToggleButtonGroup
                                        className={classes.toggleButtonGroup}
                                        name={`children.extendedHealth`}
                                        value={values.children[index].extendedHealth}
                                        exclusive
                                        onChange={(e) => {
                                            setFieldValue(`children.${index}.extendedHealth`, e.currentTarget.value)
                                        }}
                                    >
                                        <ToggleButton value="true" className={classes.toggleButton}>
                                            <Text tid={'Button.Yes'}/>
                                        </ToggleButton>
                                        <ToggleButton value="false" className={classes.toggleButton}>
                                            <Text tid={'Button.No'}/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    {validMessage(`children.${index}.extendedHealth`)}
                                </Grid>  

                                <Grid item xs={12} sm={6} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                                        <Text tid={'GroupEnrolmentForm.RefusalDental.Label'}/>
                                        <TooltipInfo info={<Text tid={'Tooltip.RefusalofBenefits'}/>}/>
                                    </label>
                                    <ToggleButtonGroup
                                        className={classes.toggleButtonGroup}
                                        name={`children.dental`}
                                        value={values.children[index].dental}
                                        exclusive
                                        onChange={(e) => {
                                            setFieldValue(`children.${index}.dental`, e.currentTarget.value)
                                        }}
                                    >
                                        <ToggleButton value="true" className={classes.toggleButton}>
                                            <Text tid={'Button.Yes'}/>
                                        </ToggleButton>
                                        <ToggleButton value="false" className={classes.toggleButton}>
                                            <Text tid={'Button.No'}/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    {validMessage(`children.${index}.dental`)}
                                </Grid>
                        </Grid>
                    </Grid>
            </>
        );
    };

    return (
        <div>
                <Grid container style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-50px' : '0' }}>

                     <Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                        <span className={classes.spanTitle}>
                            <Text tid={'Dashboard.PersonalInformation'}/>
                        </span>
                     </Grid>
                    {/* <Grid item container xs={12} sm={12} md={10} spacing={2}> */}
                    <Grid item container xs={12} sm={12} md={12}>

                      {/* plan Member Info  */}
                      <Grid item container xs={12} sm={12} md={12} spacing={1}>
                          {/* Last Name */}
                          <Grid item xs={12} sm={4} md={4}>
                            <RegularTextFieldSmall
                                label= {'Quote.LastName'}
                                name={`planMember.${0}.lastName`}
                                value={values.planMember[0].lastName}
                                // onChange={handleChange}
                                onChange={(e) => {
                                    setFieldValue(`planMember.${0}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                }}
                                onBlur={handleBlur}
                            />
                            {validMessage(`planMember.${0}.lastName`)}
                          </Grid>
                          {/* middle Name */}
                          <Grid item xs={12} sm={4} md={4}>
                            <RegularTextFieldSmall
                                label= {'Quote.MiddleName'}
                                name={`planMember.${0}.middleName`}
                                value={values.planMember[0].middleName}
                                // onChange={handleChange}
                                onChange={(e) => {
                                    setFieldValue(`planMember.${0}.middleName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                }}
                                onBlur={handleBlur}
                            />
                          </Grid>
                          {/* First Name */}
                          <Grid item xs={12} sm={4} md={4}>
                            <RegularTextFieldSmall
                                label= {'Quote.FirstName'}
                                name={`planMember.${0}.firstName`}
                                value={values.planMember[0].firstName}
                                // onChange={handleChange}
                                onChange={(e) => {
                                    setFieldValue(`planMember.${0}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                }}
                                onBlur={handleBlur}
                            />
                            {validMessage(`planMember.${0}.firstName`)}
                          </Grid>
                        
                        {/* Gender */}
                          <Grid item xs={12} sm={3} md={4}>
                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}><Text tid={'Quote.Gender'}/></label>
                            <ToggleButtonGroup
                                className={classes.toggleButtonGroup}
                                name={`planMember.${0}.gender`}
                                value={values.planMember[0].gender}
                                exclusive
                                onChange={(e) => {
                                    setFieldValue(`planMember.${0}.gender`, e.currentTarget.value)
                                    // console.log(values)
                                }}
                            >
                                <ToggleButton value="Male" className={classes.toggleButton}>
                                    <Text tid={'Quote.Male'}/>
                                </ToggleButton>
                                <ToggleButton value="Female" className={classes.toggleButton}>
                                    <Text tid={'Quote.Female'}/>
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {validMessage(`planMember.${0}.gender`)}
                        </Grid>    

                        {/* Date of Birth */}
                        <Grid item xs={12} sm={4} md={4}>
                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Quote.BirthDate'}/></label>
                        
                            <KeyboardDatePickerField 
                                name={`planMember.${0}.birthDate`}
                                value={values.planMember[0].birthDate}
                                maxDate={new Date()}
                                onChange={(e) => {
                                    values.planMember[0].birthDate = e
                                    setFieldValue(`planMember.${0}.birthDate`, e)
                                    setFieldValue(`planMember.${0}.age`, CalculateAge(e))
                                }}
                                onBlur={handleBlur}
                                style={{ width:'100%', margin:'4px 0 4px 0' }}
                            />
                            {validMessage(`planMember.${0}.birthDate`)}
                        </Grid>

                        {/* Age */}
                        <Grid item xs={12} sm={2} md={4}>
                            <RegularTextFieldSmall
                                name={`planMember.${0}.age`}
                                label= {'Quote.Age'}
                                type='text'
                                value={values.planMember[0].age}
                                disabled
                            />
                        </Grid>

                        {/* province Of Employment */}
                        <Grid item xs={12} sm={5} md={4}>
                            <Autocomplete
                                name={`planMember.${0}.provinceOfEmployment`}
                                options={provinces.filter(i => i.country_code === 'CA')}
                                value={values.planMember[0].provinceOfEmployment ? provinces.find(c => c.country_code === 'CA' && c.province_name === values.planMember[0].provinceOfEmployment) : null}
                                // value={initialProvince}
                                getOptionLabel={(option) => option.province_name}
                                //getOptionLabel={(option) => option.province_name} //to display full province names
                                // getOptionDisabled={(option) => option.province_code === values.originProvince}
                                size="small"
                                renderInput={(params) => 
                                    <RegularTextFieldSmall {...params}
                                        label= {'GroupEnrolmentForm.provinceOfEmployment.Label'}
                                        style={{ paddingRight:'1vh'}}
                                    />
                                }
                                onChange={(event, selectedVal) => {
                                    values.planMember[0].provinceOfEmployment = selectedVal ? selectedVal.province_name : null
                                    // const selectedProvinceOfEmployment = selectedVal ? selectedVal.province_name : null;
                                    setFieldValue(`planMember.${0}.provinceOfEmployment`, selectedVal ?selectedVal.province_name:null);
                                }}
                            />
                            {validMessage(`planMember.${0}.provinceOfEmployment`)}
                        </Grid>

                         {/* Marital Status */}
                        <Grid item xs={12} sm={6} md={4}>
                            <SelectMenuTextFieldSmall
                                label={'GroupEnrolmentForm.PlanMember.MaritalStatus.Label'}
                                value={values.planMember[0].maritalStatus}
                                name={`planMember.${0}.maritalStatus`}
                                // disabled={values.sourceChnnel? true : false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                >
                                {maritalStatus
                                        .map((item) => (
                                            <MenuItem key={item.code} value={item.code}>
                                                <Text tid={`${item.name}`}/>
                                            </MenuItem>
                                ))}
                                    
                            </SelectMenuTextFieldSmall>
                            {validMessage(`planMember.${0}.maritalStatus`)}
                        </Grid>

                        {/* Language */}
                        <Grid item xs={12} sm={6} md={4}>
                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Vendor.Language'}/></label>
                            <ToggleButtonGroup
                                className={classes.toggleButtonGroup}
                                name={`planMember.language`}
                                value={values.planMember[0].language}
                                exclusive
                                onChange={(e) => {
                                    setFieldValue(`planMember.${0}.language`, e.currentTarget.value)
                                }}
                            >
                                <ToggleButton value="English" className={classes.toggleButton}>
                                    {/* <Text tid={'GroupEnrolmentForm.CoverageSelection.Single'}/> */}
                                    English
                                </ToggleButton>
                                <ToggleButton value="French" className={classes.toggleButton}>
                                    {/* <Text tid={'GroupEnrolmentForm.CoverageSelection.Family'}/> */}
                                    French
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {validMessage(`planMember.${0}.language`)}
                        </Grid> 

                        {/* Coverage Selection */}
                        <Grid item xs={12} sm={6} md={4}>
                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'GroupEnrolmentForm.CoverageSelection.Label'}/></label>
                            <ToggleButtonGroup
                                className={classes.toggleButtonGroup}
                                name={`planMember.coverageSelection`}
                                value={values.planMember[0].coverageSelection}
                                exclusive
                                onChange={(e) => {
                                    values.planMember[0].coverageSelection = e.currentTarget.value
                                    setFieldValue(`planMember.${0}.coverageSelection`, e.currentTarget.value)
                                    // init spouse data
                                    setFieldValue(`spouse.${0}.firstName`, '')
                                    setFieldValue(`spouse.${0}.lastName`, '')
                                    setFieldValue(`spouse.${0}.middleName`, '')
                                    setFieldValue(`spouse.${0}.birthDate`, null)
                                    setFieldValue(`spouse.${0}.age`, 0)
                                    setFieldValue(`spouse.${0}.gender`, '')
                                    setFieldValue(`spouse.${0}.hasOwnBenefits`, '')
                                    setFieldValue(`spouse.${0}.ownExtendedHealth`, '')
                                    setFieldValue(`spouse.${0}.ownDental`, '')
                                    setFieldValue(`spouse.${0}.ownBenefitsCarrier`, '')
                                    setFieldValue(`spouse.${0}.extendedHealth`, '')
                                    setFieldValue(`spouse.${0}.dental`, '')
                                    
                                    // init children data
                                    setFieldValue(`childrenNumber`, '0')
                                    for (let i = 0; i < values.children.length; i++) {
                                        setFieldValue(`children.${i}.firstName`, '');
                                        setFieldValue(`children.${i}.lastName`, '');
                                        setFieldValue(`children.${i}.middleName`, '');
                                        setFieldValue(`children.${i}.birthDate`, null);
                                        setFieldValue(`children.${i}.age`, 0);
                                        setFieldValue(`children.${i}.gender`, '');
                                        setFieldValue(`children.${i}.isStudent`, '');
                                        setFieldValue(`children.${i}.isOverAgeDisabledChild`, '');
                                        setFieldValue(`children.${i}.extendedHealth`, '');
                                        setFieldValue(`children.${i}.dental`, '');
                                    }

                                }}
                            >
                                <ToggleButton value="Single" className={classes.toggleButton}>
                                    {/* <Text tid={'GroupEnrolmentForm.CoverageSelection.Single'}/> */}
                                    Single
                                </ToggleButton>
                                <ToggleButton value="Family" className={classes.toggleButton}>
                                    {/* <Text tid={'GroupEnrolmentForm.CoverageSelection.Family'}/> */}
                                    Family
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {validMessage(`planMember.${0}.coverageSelection`)}
                        </Grid>  

                        {/* Refusal of Benefits  */}
                        <Grid item xs={12} sm={6} md={4}>
                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                                <Text tid={'GroupEnrolmentForm.RefusalExtendedHealth.Label'}/>
                                <TooltipInfo info={<Text tid={'Tooltip.RefusalofBenefits'}/>}/>
                            </label>
                            <ToggleButtonGroup
                                className={classes.toggleButtonGroup}
                                name={`planMember.extendedHealth`}
                                value={values.planMember[0].extendedHealth}
                                exclusive
                                onChange={(e) => {
                                    setFieldValue(`planMember.${0}.extendedHealth`, e.currentTarget.value)
                                }}
                            >
                                <ToggleButton value="true" className={classes.toggleButton}>
                                    <Text tid={'Button.Yes'}/>
                                </ToggleButton>
                                <ToggleButton value="false" className={classes.toggleButton}>
                                    <Text tid={'Button.No'}/>
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {validMessage(`planMember.${0}.extendedHealth`)}
                        </Grid>  

                        <Grid item xs={12} sm={6} md={4}>
                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                                <Text tid={'GroupEnrolmentForm.RefusalDental.Label'}/>
                                <TooltipInfo info={<Text tid={'Tooltip.RefusalofBenefits'}/>}/>
                            </label>
                            <ToggleButtonGroup
                                className={classes.toggleButtonGroup}
                                name={`planMember.dental`}
                                value={values.planMember[0].dental}
                                exclusive
                                onChange={(e) => {
                                    setFieldValue(`planMember.${0}.dental`, e.currentTarget.value)
                                }}
                            >
                                <ToggleButton value="true" className={classes.toggleButton}>
                                    <Text tid={'Button.Yes'}/>
                                </ToggleButton>
                                <ToggleButton value="false" className={classes.toggleButton}>
                                    <Text tid={'Button.No'}/>
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {validMessage(`planMember.${0}.dental`)}
                        </Grid>  

                      </Grid>

                      {/* Family */}
                      {values.planMember[0].coverageSelection === 'Family' ?
                      <>
                        <Grid item container xs={12} sm={12} md={12}>
                                <Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                                        <span className={classes.spanTitle}>
                                            <Text tid={'Quote.Spouse'}/> - <Text tid={'GroupEnrolmentForm.FamilyTitle.Description'}/>
                                        </span>
                                </Grid>

                                <Grid item container spacing={1}>
                                    {/* Last Name */}
                                    <Grid item xs={12} sm={4} md={4}>
                                        <RegularTextFieldSmall
                                            label= {'Quote.LastName'}
                                            name={`spouse.${0}.lastName`}
                                            value={values.spouse[0].lastName}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                                setFieldValue(`spouse.${0}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                            }}
                                            onBlur={handleBlur}
                                        />
                                        {validMessage(`spouse.${0}.lastName`)}
                                    </Grid>
                                    {/* middle Name */}
                                    <Grid item xs={12} sm={4} md={4}>
                                        <RegularTextFieldSmall
                                            label= {'Quote.MiddleName'}
                                            name={`spouse.${0}.middleName`}
                                            value={values.spouse[0].middleName}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                                setFieldValue(`spouse.${0}.middleName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                            }}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    {/* First Name */}
                                    <Grid item xs={12} sm={4} md={4}>
                                        <RegularTextFieldSmall
                                            label= {'Quote.FirstName'}
                                            name={`spouse.${0}.firstName`}
                                            value={values.spouse[0].firstName}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                                setFieldValue(`spouse.${0}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                            }}
                                            onBlur={handleBlur}
                                        />
                                        {validMessage(`spouse.${0}.firstName`)}
                                    </Grid>
                                    
                                    {/* Gender */}
                                    <Grid item xs={12} sm={3} md={4}>
                                        <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}><Text tid={'Quote.Gender'}/></label>
                                        <ToggleButtonGroup
                                            className={classes.toggleButtonGroup}
                                            name={`spouse.${0}.gender`}
                                            value={values.spouse[0].gender}
                                            exclusive
                                            onChange={(e) => {
                                                setFieldValue(`spouse.${0}.gender`, e.currentTarget.value)
                                            }}
                                        >
                                            <ToggleButton value="Male" className={classes.toggleButton}>
                                                <Text tid={'Quote.Male'}/>
                                            </ToggleButton>
                                            <ToggleButton value="Female" className={classes.toggleButton}>
                                                <Text tid={'Quote.Female'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`spouse.${0}.gender`)}
                                    </Grid>    

                                    {/* Date of Birth */}
                                    <Grid item xs={12} sm={4} md={4}>
                                        <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Quote.BirthDate'}/></label>
                                    
                                        <KeyboardDatePickerField 
                                            name={`spouse.${0}.birthDate`}
                                            value={values.spouse[0].birthDate}
                                            maxDate={new Date()}
                                            onChange={(e) => {
                                                values.spouse[0].birthDate = e
                                                setFieldValue(`spouse.${0}.birthDate`, e)
                                                setFieldValue(`spouse.${0}.age`, CalculateAge(e))
                                            }}
                                            onBlur={handleBlur}
                                            style={{ width:'100%', margin:'4px 0 4px 0' }}
                                        />
                                        {validMessage(`spouse.${0}.birthDate`)}
                                    </Grid>

                                    {/* Age */}
                                    <Grid item xs={12} sm={2} md={4}>
                                        <RegularTextFieldSmall
                                            name={`spouse.${0}.age`}
                                            label= {'Quote.Age'}
                                            type='text'
                                            value={values.spouse[0].age}
                                            disabled
                                        />
                                    </Grid>

                                    {/* Refusal of Benefits  */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                                            <Text tid={'GroupEnrolmentForm.RefusalExtendedHealth.Label'}/>
                                            <TooltipInfo info={<Text tid={'Tooltip.RefusalofBenefits'}/>}/>
                                        </label>
                                        <ToggleButtonGroup
                                            className={classes.toggleButtonGroup}
                                            name={`spouse.extendedHealth`}
                                            value={values.spouse[0].extendedHealth}
                                            exclusive
                                            onChange={(e) => {
                                                setFieldValue(`spouse.${0}.extendedHealth`, e.currentTarget.value)
                                            }}
                                        >
                                            <ToggleButton value="true" className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value="false" className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`spouse.${0}.extendedHealth`)}
                                    </Grid>  

                                    <Grid item xs={12} sm={6} md={4}>
                                        <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                                            <Text tid={'GroupEnrolmentForm.RefusalDental.Label'}/>
                                            <TooltipInfo info={<Text tid={'Tooltip.RefusalofBenefits'}/>}/>
                                        </label>
                                        <ToggleButtonGroup
                                            className={classes.toggleButtonGroup}
                                            name={`spouse.dental`}
                                            value={values.spouse[0].dental}
                                            exclusive
                                            onChange={(e) => {
                                                setFieldValue(`spouse.${0}.dental`, e.currentTarget.value)
                                            }}
                                        >
                                            <ToggleButton value="true" className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value="false" className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`spouse.${0}.dental`)}
                                    </Grid>

                                </Grid>

                                <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }} className={classes.spanSubTitle}>  
                                        <span>
                                        <Text tid={'Quote.Spouse'}/>'s Employer's Plan
                                        </span>
                                </Grid>

                                <Grid item container spacing={1}>

                                        <Grid item xs={12} sm={12} md={6} lg={4}>
                                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}><Text tid={'GroupEnrolmentForm.Spouse.HaveOwnGroup'}/></label>
                                            <ToggleButtonGroup
                                                className={classes.toggleButtonGroup}
                                                name={`spouse.${0}.hasOwnBenefits`}
                                                value={values.spouse[0].hasOwnBenefits}
                                                exclusive
                                                onChange={(e) => {
                                                    setFieldValue(`spouse.${0}.hasOwnBenefits`, e.currentTarget.value)
                                                    setFieldValue(`spouse.${0}.ownExtendedHealth`, null)
                                                    setFieldValue(`spouse.${0}.ownDental`, null)
                                                    setFieldValue(`spouse.${0}.ownBenefitsCarrier`,'')
                                                }}
                                            >
                                                <ToggleButton value="true" className={classes.toggleButton}>
                                                    <Text tid={'Button.Yes'}/>
                                                </ToggleButton>
                                                <ToggleButton value="false" className={classes.toggleButton}>
                                                    <Text tid={'Button.No'}/>
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                            {validMessage(`spouse.${0}.hasOwnBenefits`)}
                                        </Grid> 

                                        {/* For Design */}
                                        <Grid item xs={12} sm={12} md={6} lg={4}></Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={4}></Grid>

                                        {values.spouse[0].hasOwnBenefits === 'true' ? 
                                        <>
                                            <Grid item xs={12} sm={12} md={6} lg={4}>
                                                <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}>Spouse’s coverage: Extended Health Care</label>
                                                <ToggleButtonGroup
                                                    className={classes.toggleButtonGroup}
                                                    name={`spouse.${0}.ownExtendedHealth`}
                                                    value={values.spouse[0].ownExtendedHealth}
                                                    exclusive
                                                    onChange={(e) => {
                                                        setFieldValue(`spouse.${0}.ownExtendedHealth`, e.currentTarget.value)
                                                    }}
                                                >
                                                    <ToggleButton value="Single" className={classes.toggleButton}>
                                                        Single
                                                    </ToggleButton>
                                                    <ToggleButton value="Family" className={classes.toggleButton}>
                                                        Family
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                {validMessage(`spouse.${0}.ownExtendedHealth`)}
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={6} lg={4}>
                                                <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'13px'}}>Spouse’s coverage: Dental Care</label>
                                                <ToggleButtonGroup
                                                    className={classes.toggleButtonGroup}
                                                    name={`spouse.${0}.ownDental`}
                                                    value={values.spouse[0].ownDental}
                                                    exclusive
                                                    onChange={(e) => {
                                                        setFieldValue(`spouse.${0}.ownDental`, e.currentTarget.value)
                                                    }}
                                                >
                                                    <ToggleButton value="Single" className={classes.toggleButton}>
                                                        Single
                                                    </ToggleButton>
                                                    <ToggleButton value="Family" className={classes.toggleButton}>
                                                        Family
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                {validMessage(`spouse.${0}.ownDental`)}
                                            </Grid>

                                            {/* Carrier Name */}
                                            <Grid item xs={12} sm={4} md={4}>
                                                <RegularTextFieldSmall
                                                    label= {'Name of benefits carrier'}
                                                    name={`spouse.${0}.ownBenefitsCarrier`}
                                                    value={values.spouse[0].ownBenefitsCarrier}
                                                    // onChange={handleChange}
                                                    onChange={(e) => {
                                                        setFieldValue(`spouse.${0}.ownBenefitsCarrier`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                                {validMessage(`spouse.${0}.ownBenefitsCarrier`)}
                                            </Grid>
                                        </>
                                        :null}
                                </Grid>
                        </Grid>
                        <Grid item container xs={12} sm={12} md={12}>
                                <Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                                        <span className={classes.spanTitle}>
                                          <Text tid={'Quote.Child'}/> - <Text tid={'GroupEnrolmentForm.FamilyTitle.Description'}/>
                                        </span>
                                </Grid>

                                {/* Number of children */}
                                <Grid item xs={12} sm={6} md={4}>
                                        <SelectTextFieldSmall
                                            label={'GroupEnrolmentForm.HowManyChildren'}
                                            name='childrenNumber'
                                            value={values.childrenNumber}
                                            onChange={(e) => {
                                                values.childrenNumber = e.currentTarget.value
                                                setFieldTouched('childrenNumber')
                                                setFieldValue('childrenNumber', e.currentTarget.value)
                                                setFieldValue('children', addchildren(e.currentTarget.value, values.children))                             
                                            }}
                                            onBlur={handleBlur}
                                        >
                                            {/* <option value='' hidden>Select</option> */}
                                            {[0,1,2,3,4,5,6]
                                                // .filter(f=>f > (values.insuredGroupType === 'Family'? 2:0))
                                                .map((item) => (
                                                        <option key={item} value={item} 
                                                                // disabled = {item < (values.insuredGroupType === 'Family'? 2:0)?true:false}
                                                                >
                                                            {item}
                                                        </option>
                                            ))}
                                        </SelectTextFieldSmall>
                                        {validMessage(`childrenNumber`)}
                                </Grid>

                                {values.childrenNumber > 0 && values.children.length > 0
                                    && values.children.map((children, pIndex) => (
                                        <div key={pIndex}>
                                            {childrenInfo(pIndex)}
                                            <br />
                                        </div>
                                ))}
                        </Grid>
                      </>
                      :null}

                        <Grid item container xs={12} sm={12} md={12}>
                            < Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                                    <span className={classes.spanTitle}>
                                        <Text tid={'Quote.Address'}/>
                                    </span>
                            </Grid>

                            <Grid item container spacing={1}>
                                {/* Street */}
                                <Grid item xs={12} sm={5} md={5}>
                                    <RegularTextFieldSmall
                                        name={`planMember.${0}.address`}
                                        label={'Quote.Street'}
                                        style={{ width: !isMobile ? '100%' : '102%' }}
                                        value={values.planMember[0].address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`planMember.${0}.address`)}
                                </Grid>
                                {/* Unit Number */}
                                <Grid item xs={5} sm={3} md={3}>
                                    <RegularTextFieldSmall
                                        name={`planMember.${0}.aptNumber`}
                                        label={'Quote.UnitNumber'}
                                        style={{ width: !isMobile ? '100%' : '102%' }}
                                        value={values.planMember[0].aptNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>
                                {/* City */}
                                <Grid item xs={7} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        name={`planMember.${0}.city`}
                                        label={'Quote.City'}
                                        style={{ width: !isMobile ? '100%' : '103%' }}
                                        value={values.planMember[0].city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`planMember.${0}.city`)}
                                </Grid>

                                {/* Province */}
                                <Grid item xs={12} sm={5} md={5}>
                                    <Autocomplete
                                        name={`planMember.${0}.province`}
                                        options={provinces.filter(i => i.country_code === 'CA')}
                                        value={values.planMember[0].province ? provinces.find(c => c.country_code === 'CA' && c.province_name === values.planMember[0].province) : null}
                                        getOptionLabel={(option) => option.province_name}
                                        size="small"
                                        renderInput={(params) => 
                                            <RegularTextFieldSmall {...params}
                                                label= {'Quote.Province'}
                                                style= {{ paddingRight:'1vh' }}
                                            />
                                        }
                                        onChange={(event, selectedVal) => {
                                            const selectedProvince = selectedVal ? selectedVal.province_name : null;
                                            setFieldValue(`planMember.${0}.province`, selectedProvince);
                                        }}
                                        // onBlur={() => setTouched({ 'planMember[0].province': true })}
                                    />
                                    {validMessage(`planMember.${0}.province`)}
                                </Grid>
                                {/* Postal Code */}
                                <Grid item xs={12} sm={3} md={3}>
                                    <label className={classes.inputLabel_manualForm}><Text tid={'Quote.PostalCode'}/></label>
                                    <InputMask
                                        name={`planMember.${0}.postalCode`}
                                        mask= {"a9a 9a9" }
                                        value={values.planMember[0].postalCode}
                                        onChange={(e)=>setFieldValue(`planMember.${0}.postalCode`,e.target.value.toUpperCase())}
                                        onBlur={handleBlur}                    
                                        >
                                        {() => (
                                        <TextField
                                            type="text"
                                            name="planMember.postalCode"
                                            variant="outlined"
                                            size="small" 
                                            style={{ width: !isMobile ? '100%' : '102%' }}
                                        />
                                        )}
                                    </InputMask>
                                    {validMessage(`planMember.${0}.postalCode`)}
                                </Grid>
                            </Grid>                
                        </Grid>

                        {/* Contact Info */}
                        <Grid item container xs={12} sm={12} md={12}>
                            <Grid  item xs={12} sm={12} md={12} className={classes.spanTitleBox}>  
                                    <span className={classes.spanTitle}>
                                        <Text tid={'Quote.Contact'}/>
                                    </span>
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12} sm={6} md={6} lg={4}>
                                <RegularTextFieldSmall
                                    name={`planMember.${0}.email`}
                                    type="text"
                                    label={'Quote.Email'}
                                    style={{ width: !isMobile ? '100%' : '102%' }}
                                    value={values.planMember[0].email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {validMessage(`planMember.${0}.email`)}
                            </Grid>  
                            
                            {/* Phone */}
                            <Grid item xs={12} sm={6} md={6} lg={4}>
                                <div>
                                <label className={classes.inputLabel_manualForm}>
                                <Text tid={'Quote.Phone'}/>
                                </label>
                                </div>
                                <Field
                                    id = "phone"
                                    name={`planMember.${0}.phone`}
                                    variant="outlined"
                                    style={{ width: !isMobile ? '100%' : '102%' }}
                                    value={values.planMember[0].phone}
                                    type="tel"
                                    as={MuiPhoneInput}
                                    defaultCountry={'ca'}
                                    onlyCountries={['ca']}
                                    disableAreaCodes={true}
                                    countryCodeEditable={false}
                                    onChange={(value) => setFieldValue(`planMember.${0}.phone`, value)}
                                    // label="Phone Number"
                                />
                                {validMessage(`planMember.${0}.phone`)}
                            </Grid> 

                        </Grid>

                    </Grid>

                </Grid>
        </div>
    )
}

export default PlanMember
