import React, { useState, useEffect, useRef, useContext } from 'react'
//core components
import { Link } from 'react-router-dom'
import { Grid, IconButton, MenuItem, Typography, Box } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
// import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Alert, AlertTitle } from '@material-ui/lab';

//common components
import { Text } from '../../../components/common/LanguageProvider'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
import { RegularTextFieldSmall, SelectTextFieldSmall, SelectMenuTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import CustomButton from '../../../components/common/CustomButtons/Button'
import { CalculateAgeBaseEffectiveDate, CalculateAgeDays } from '../../../controllers/CalculateValue'
import { LanguageContext } from '../../../components/common/LanguageProvider';
import { CalculateTripDays, CalculateTripEndDate } from '../../../controllers/CalculateValue'
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'
import { dateFormat } from '../../../controllers/dataFormat'
import Button from '../../../components/common/CustomButtons/Button'
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'
//icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import User from '../../../assets/imgs/icons/user.svg'
// import MuiButton from '@material-ui/core/Button';


//setup form style
const useStyles = makeStyles(formStyle)

// Relationship to Primary Applicant  or Beneficiary relationship
const relationship = [
{ code: 'Estate', name: 'Estate', origin: false, groupType:['I'] },
{ code: 'Spouse', name: 'Spouse', origin: true, groupType:['F', 'I']  },
{ code: 'Child', name: 'Child', origin: true, groupType:['F', 'I'] },
{ code: 'Parent', name: 'Parent', origin: true, groupType:['I'] },
{ code: 'Siblings', name: 'Siblings', origin: true, groupType:['I'] },
{ code: 'Companion', name: 'Companion', origin: true, groupType:['I'] },
{ code: 'Guardian', name: 'Guardian', origin: true, groupType:['I'] },
]
// travel Type SS,SC means eligilbeStuent field is true
const travelType = [
    { code: 'SS', name: 'Study',insuredType:['STUDENT','PATRIOT INTERNATIONAL LITE','PATRIOT AMERICA PLUS'], applicationCompany:['Allianz', 'Tugo', 'Travelance', 'IMG']},
    { code: 'SF', name: 'StudentsFamily',insuredType:['STUDENT'], applicationCompany:['Allianz', 'Tugo', 'Travelance', 'IMG']} ,
    { code: 'WW', name: 'Working',insuredType:['VISITOR','PATRIOT INTERNATIONAL LITE','PATRIOT AMERICA PLUS'], applicationCompany:['Allianz', 'Tugo', 'GMS', 'Travelance', 'IMG']},
    { code: 'WH', name: 'WorkingHoliday',insuredType:['VISITOR','PATRIOT INTERNATIONAL LITE'], applicationCompany:['Allianz', 'Tugo', 'GMS', 'Travelance', 'IMG']},
    { code: 'TL', name: 'TravelingLeisure', insuredType:['VISITOR','PATRIOT INTERNATIONAL LITE','PATRIOT AMERICA PLUS'], applicationCompany:['Allianz', 'Tugo', 'GMS', 'Travelance', 'IMG']},
    { code: 'SV', name: 'SuperVisa', insuredType:['VISITOR'], applicationCompany:['Allianz', 'Tugo', 'GMS', 'Travelance', 'IMG']},
    { code: 'PW', name: 'PGWP', insuredType:['STUDENT'], applicationCompany:['Allianz', 'IMG']},
    { code: 'RH', name: 'ReturningHome', insuredType:['VISITOR'], applicationCompany:['Allianz', 'Tugo', 'GMS', 'Travelance', 'IMG']},
    { code: 'VC', name: 'Vacation', insuredType:['CANADIAN','PATRIOT INTERNATIONAL LITE'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
    { code: 'BT', name: 'BusinessTrip', insuredType:['CANADIAN','PATRIOT AMERICA PLUS'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
    { code: 'SA', name: 'StudyAbroad', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
    { code: 'CV', name: 'CruiseVacation', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
    { code: 'SB', name: 'SnowBird', insuredType:['CANADIAN','PATRIOT AMERICA PLUS'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
    { code: 'RT', name: 'RoadTrip', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
    { code: 'GT', name: 'GolfTrip', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
    { code: 'OT', name: 'Other', insuredType:['CANADIAN','PATRIOT INTERNATIONAL LITE','PATRIOT AMERICA PLUS'], applicationCompany:['Allianz', 'Tugo', 'BlueCross', 'IMG']},
  ]

export const Applicants = ({ 
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    errors,
    validMessage,
 }) => {

    //set to form style
    const classes = useStyles()

    const [index, setIndex] = useState(0)
    const [alterOpen, setAlterOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

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

    const scrollRef = useRef(null);
    const scrollToElement = () => scrollRef.current.scrollIntoView();

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

    // number of insured persons (safe count)
    const insuredCount = Array.isArray(values.insuredPersons) ? values.insuredPersons.length : 0;

    // add insured person
    function addinsuredPerson(insuredPersonNumber, insuredPersons = []) {
        const current = Array.isArray(insuredPersons) ? [...insuredPersons] : [];
        const delta = insuredPersonNumber - current.length;

        if (delta < 0) return current.slice(0, insuredPersonNumber);

        if (delta > 0) {
            const seed = current[0] || {};
            for (let j = 0; j < delta; j++) {
                current.push({
                    firstName: '',
                    lastName: '',
                    gender: '',
                    birthDate: null,
                    age: 0,
                    relationship: '',
                    passportNumber: '',
                    beneficiaryName: '',
                    beneficiaryRelationship: '',
                    attendSchoolName: '',
                    sameDate: true,
                    tripStartDate: seed.tripStartDate || null,
                    tripEndDate: seed.tripEndDate || null,
                    tripPeriod: seed.tripPeriod || 0,
                    arrivalDate: seed.arrivalDate || null,
                    graduatedDate: null,
                    yearDateAfterGraduated: null,
                    travelType: '',
                    tripType: seed.tripType || '',
                    destCountry: seed.destCountry || '',
                    tripDepartureDate: null,
                    tripOtherCoverageDays: 0,
                    multiTripDays: seed.multiTripDays || 0,
                    preExistCond: false,
                    coverCond: false,
                    maternity: false,
                    mentalIllness: false,
                    eligilbeIns: seed.eligilbeIns || false,
                    physicalCard: false,
                    insurancePlans: [],
                    selectedPlan: [],
                    selectedMedQuesAnswer: [],
                    optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
                    optionalAddOnPlans: [],
                    renewalInsurance: false,
                });
            }
        }
        return current;
    }

    // Family plan: ensure min 3 applicants and sync array length
    useEffect(() => {
        if (values.insuredGroupType === 'Family') {
            const target = Math.max(Number(values.insuredNumber || 3), 3);

            if (Number(values.insuredNumber) !== target) {
                setFieldValue('insuredNumber', target);
            }

            const cur = Array.isArray(values.insuredPersons) ? values.insuredPersons : [];
            if (cur.length !== target) {
                setFieldValue('insuredPersons', addinsuredPerson(target, cur));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        values.insuredGroupType,
        values.tripStartDate,
        values.tripEndDate,
        values.tripPeriod,
        values.insuredNumber,
        insuredCount,
        setFieldValue,
    ]);

    // Activation conditions
    const canEnableEligibility = (
        values.insuredGroupType === 'Family'
            ? Number(values.insuredNumber) >= 3
            : (values.tripStartDate && values.tripPeriod > 0 && Number(values.insuredNumber) >= 1)
    );
    const canActivate = (
        (values.insuredGroupType === 'Family'
            ? Number(values.insuredNumber) >= 3
            : Number(values.insuredNumber) >= 1)
        && values.eligilbeAgrement === true
    );


    const companion = (values) => {
    
        return (
            <>
            {/* insuredPerson Information */}
            <Grid item container ref={scrollRef}>
            
                <Grid item xs={12}>
                    <div className={classes.companionSection}>
                        {errorMsg && index?
                            <Grid item container xs={12} justifyContent="center">
                                <Grid item xs={12} style={{ marginBottom: '1.5vh' }}>     
                                    <Alert
                                        severity='error'
                                        onClose={() => setErrorMsg('')}
                                    >
                                        {errorMsg}
                                    </Alert>
                                </Grid>
                            </Grid>
                        :null}

                        {/* start of fully expanded companion form list */}
                        {values.insuredPersons && values.insuredPersons.length > 0
                            && values.insuredPersons.map((insuredPerson, pIndex) => (
                                <div key={pIndex}>
                                    {personInfo(pIndex)}
                                    <br />
                                </div>
                        ))}

                    </div>
                </Grid>

                <div style={{ display: 'none' }}>
                    <CustomButton
                        id = 'isInsuredPersonVaild'
                        color="primary"
                        className={classes.button}
                        onClick={() => {
                            errors&&!!errors.insuredPersons&&
                            errors.insuredPersons.every((err, i) => {
                                if (err){setIndex(i); 
                                            scrollToElement();
                                            return false}
                                return true;
                            })
                            setAlterOpen(true);
                        }}
                    >
                        Check InsuredPerson Vaild
                    </CustomButton>
                </div>

            </Grid>
            </>
        );
    }

    const personInfo = (index) => {
        return (
            <>
                {/* <Grid container ref={scrollRef}  style={{ border:'1px solid #ddd' }}> */}
                <Grid container style={{ border:'1px solid #ddd' }}>
                    <Grid item xs={12}>
                        <div className={classes.titleSmall_sub} style={{ fontSize: '18px', fontWeight:'400', textAlign: 'left', color:'#2a2f71', marginBottom: isMobile ? '2vh' : '0', padding:'1vh', background:'#ECEEF6' }}>
                            
                            {/* <Text tid={'Quote.Family'}/> {index} */}
                            {index===0 
                                ? 
                                    <span className={classes.sectionSubTitle}>
                                            <img
                                                src={User}
                                                alt="Companion icon"
                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                            />
                                            {/* {`Primary`} */}
                                            {/* <Text tid={'Quote.Primary'}/> */}
                                            <Text tid={'Quote.Applicants'}/> {` ${index+1} `}
                                    </span>
                                : 
                                    <span className={classes.sectionSubTitle}>
                                        <img
                                            src={User}
                                            alt="Companion icon"
                                            style={{marginRight:'10px', paddingBottom:'3px'}} 
                                        />
                                            {/* <Text tid={'Quote.Family'}/> {`${index}`} */}
                                            <Text tid={'Quote.Applicants'}/> {` ${index+1} `}
                                    </span>
                            }
                            

                            {/* delete button */}
                            {index!==0 && 
                                <IconButton style={{ float: 'right' }} size='small' disableFocusRipple={true} disableRipple={true} 
                                    onClick={(e) => {
                                        if (!e) e = window.event;
                                        e.cancelBubble = true;
                                        if (e.stopPropagation) e.stopPropagation();

                                        if (values.insuredPersons.length > 1) {
                                                setIndex(index - 1)
                                                setFieldValue('insuredPersons', values.insuredPersons.filter(person => person !== values.insuredPersons[index]))
                                                setFieldValue('insuredNumber', values.insuredNumber - 1)
                                                setErrorMsg('')
                                        }
                                    }}>
                                    <HighlightOffIcon />
                                </IconButton>
                            }
                    
                        </div>
                    </Grid>

                    <Grid item xs={12} >
                        {errors && !!errors.insuredPersons && alterOpen &&
                            !!errors.insuredPersons[index] &&
                            
                                <Grid item container xs={12} justifyContent="center">
                                    <Grid item xs={12} style={{ marginTop: isMobile ? '-1vh':'1vh', marginBottom: isMobile ? '1vh' : '0' }}>                                                    
                                        <Alert
                                            severity='error'
                                            onClose={() => setAlterOpen(false)}
                                        >
                                            <Text tid={'Quote.Applicants'}/> {` ${index+1} `} : 
                                            <Text tid={'Quote.Error.CompleteInformation'}/>
                                        </Alert>

                                    </Grid>
                                </Grid>
                        }
                    </Grid>

                    <Grid container className={classes.row_input}>
                        <Grid item container spacing={2}>

                            <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.FirstName'}
                                        name={`insuredPersons.${index}.firstName`}
                                        value={values.insuredPersons[index].firstName}
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`insuredPersons.${index}.firstName`)}
                                </Grid>

                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.LastName'}
                                        name={`insuredPersons.${index}.lastName`}
                                        value={values.insuredPersons[index].lastName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`insuredPersons.${index}.lastName`)}
                                </Grid>

                                <Grid item xs={12} sm={3} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Quote.Gender'}/></label>
                                    <ToggleButtonGroup
                                        className={classes.toggleButtonGroup}
                                        name={`insuredPersons.${index}.gender`}
                                        value={values.insuredPersons[index].gender}
                                        exclusive
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.gender`, e.currentTarget.value)
                                        }}
                                    >
                                        <ToggleButton value="Male" className={classes.toggleButton}>
                                            <Text tid={'Quote.Male'}/>
                                        </ToggleButton>
                                        <ToggleButton value="Female" className={classes.toggleButton}>
                                            <Text tid={'Quote.Female'}/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    {validMessage(`insuredPersons.${index}.gender`)}
                                </Grid>

                                <Grid item xs={12} sm={4} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Quote.BirthDate'}/></label>
                                
                                    <KeyboardDatePickerField 
                                        name={`insuredPersons.${index}.birthDate`}
                                        value={values.insuredPersons[index].birthDate}
                                        maxDate={new Date()}
                                        onChange={(e) => {
                                            values.insuredPersons[index].birthDate = e
                                            setFieldValue(`insuredPersons.${index}.birthDate`, e)
                                            // setFieldValue(`insuredPersons.${index}.age`, CalculateAge(e))
                                            setFieldValue(`insuredPersons.${index}.age`, 
                                                values.insuredPersons[index].tripStartDate 
                                                    ? CalculateAgeBaseEffectiveDate(e, values.insuredPersons[index].tripStartDate )
                                                    : 0
                                            )
                                            setFieldValue(`insuredPersons.${index}.ageDays`, 
                                                values.insuredPersons[index].tripStartDate 
                                                    ? CalculateAgeDays(e, values.insuredPersons[index].tripStartDate )
                                                    : 0
                                            )
                                            values.insuredPersons[index].selectedPlan = {}
                                            setFieldValue(`insuredPersons.${index}.selectedPlan`,{})
                                        }}
                                        onBlur={handleBlur}
                                        style={{ width:'100%', margin:'4px 0 4px 0' }}
                                    />
                                    {validMessage(`insuredPersons.${index}.birthDate`)}
                                </Grid>

                                <Grid item xs={12} sm={2} md={4}>
                                    <RegularTextFieldSmall
                                        name={`insuredPersons.${index}.age`}
                                        label= {'Quote.Age'}
                                        type='text'
                                        value={values.insuredPersons[index].age}
                                        disabled
                                    />
                                    <div style={{ display: 'none' }}>
                                        {values.insuredPersons[index].ageDays} days old
                                    </div>
                                </Grid>

                                {/* relationship */}
                                {index > 0 
                                ?(
                                    <Grid item xs={12} sm={4} md={4}>
                                        <SelectMenuTextFieldSmall
                                            // label={'Relationship to Primary'}
                                            label = {currentLanguage !== 'ko'
                                                        ?(`${values.insuredPersons[index].firstName} is ${values.insuredPersons[0].firstName}'s`)
                                                        :(`${values.insuredPersons[index].firstName} 님은 ${values.insuredPersons[0].firstName} 님의`)
                                                    }
                                            value={values.insuredPersons[index].relationship}
                                            name={`insuredPersons.${index}.relationship`}
                                            // disabled={index === 0 ? true : false}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            >
                                            {relationship
                                                .filter(f=>f.origin===true && f.groupType.find(f=>f===values.insuredGroupType.charAt(0)))
                                                .map((item) => (
                                                    <MenuItem key={item.code} value={item.code}>
                                                    <Text tid={`Quote.${item.name}`}/>
                                            </MenuItem>
                                            ))}
                                        </SelectMenuTextFieldSmall>
                                        {validMessage(`insuredPersons.${index}.relationship`)}
                                    </Grid>
                                )
                                :
                                    <Grid item xs={12} sm={4} md={4}></Grid>
                                }

                                <Grid item xs={12} sm={5} md={4}>
                                    <RegularTextFieldSmall
                                        name={`insuredPersons.${index}.beneficiaryName`}
                                        label={'Quote.BeneficiaryName'}
                                        tooltipTitle={'Tooltip.Beneficiary'}
                                        value={values.insuredPersons[index].beneficiaryName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.beneficiaryName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                        }}
                                        onBlur={handleBlur}
                                    />                                    
                                    {validMessage(`insuredPersons.${index}.beneficiaryName`)}
                                </Grid>
                        
                                <Grid item xs={12} sm={5} md={4}>
                                    <SelectMenuTextFieldSmall
                                        label= {currentLanguage !== 'ko'
                                        ?(`Beneficiary is ${values.insuredPersons[index].firstName}'s`)
                                        :(`수혜자는 ${values.insuredPersons[index].firstName} 님의`)} 
                                        name={`insuredPersons.${index}.beneficiaryRelationship`}
                                        value={values.insuredPersons[index].beneficiaryRelationship}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {relationship.map((item) => (
                                            <MenuItem key={item.code} value={item.code}>
                                                <Text tid={`Quote.${item.name}`}/>
                                            </MenuItem>
                                        ))}
                                        {/* {beneficiaryRelationships.map((value) => (
                                            <option key={value.key} value={value.value}>{value.label}</option>
                                        ))} */}
                                    </SelectMenuTextFieldSmall>
                                    {validMessage(`insuredPersons.${index}.beneficiaryRelationship`)}
                                </Grid>
                                
                                {/* Travel Purpose */}
                                <Grid item container xs={12} sm={6} md={4}  className={classes.row_input}>
                                    <div style={{ display: 'none' }}>
                                        {/* 'Primary insured */}
                                        {index === 0 && values.insuredPersons[index].travelType === 'SV' && values.tripPeriod !== 365 
                                            ? values.insuredPersons[index].travelType = '': null }
                                    </div>
                                    <SelectMenuTextFieldSmall
                                        label= {'Quote.TravelPurpose'}
                                        value={values.insuredPersons[index].travelType}
                                        name={`insuredPersons.${index}.travelType`}
                                        onChange={(e)=>{
                                            handleChange(e)
                                            setFieldValue(`insuredPersons.${index}.graduatedDate`, null)  
                                            setFieldValue(`insuredPersons.${index}.yearDateAfterGraduated`, null) 
                                            // rest when selected super visa
                                            if (e.target.value === 'SV'){
                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, 365) 
                                                setFieldValue(`insuredPersons.${index}.tripEndDate`, CalculateTripEndDate(values.insuredPersons[index].tripStartDate, 365 )) 
                                                // set sameDate
                                                if (index !== 0 && values.tripPeriod !== 365){
                                                    setFieldValue(`insuredPersons.${index}.sameDate`, false) 
                                                } 
                                                // set header trip period
                                                if (values.insuredPersons[index].relationship === 'Primary'){
                                                    setFieldValue(`tripPeriod`, 365) 
                                                    setFieldValue(`tripEndDate`, CalculateTripEndDate(values.tripStartDate, 365 )) 
                                                }
                                            }
                                        }}
                                        onBlur={handleBlur}
                                    >
                                        <MenuItem value={""}><Text tid={'Quote.SelectTravelPurpose'}/></MenuItem>
                                            {travelType.map((t)=> ({code: t.code, name: t.name, company: t.applicationCompany, includedType: t.insuredType.filter(f => f === values.insuranceType).length}))
                                                .filter( i => i.includedType > 0 && i.company.find(f=>f===values.application.applicationCompany))
                                                .map((item) => (
                                                    <MenuItem key={item.code} value={item.code}>
                                                        <Text tid={`Quote.${item.name}`}/>
                                                    </MenuItem>
                                            ))}
                                    </SelectMenuTextFieldSmall>
                                    {validMessage(`insuredPersons.${index}.travelType`)}

                                </Grid>

                                {/* Passport Number required only when working holiday or supervisa  */}
                                {(values.insuredPersons[index].travelType === 'WH' || values.insuredPersons[index].travelType === 'SV') &&
                                    <Grid item xs={12} sm={4} md={4}>
                                        <RegularTextFieldSmall
                                            label= {'Quote.passportNumber'}
                                            name={`insuredPersons.${index}.passportNumber`}
                                            value={values.insuredPersons[index].passportNumber}
                                            onChange={(e) => {
                                                setFieldValue(`insuredPersons.${index}.passportNumber`, e.currentTarget.value)
                                            }}
                                            onBlur={handleBlur}
                                        />
                                        {validMessage(`insuredPersons.${index}.passportNumber`)}
                                    </Grid>
                                }

                                {/* If PGWP Student */}
                                <Grid item xs={12} sm={4} md={4} lg={4} >
                                    {values.tripDirection === 'InBound' && 
                                        values.insuredPersons[index].travelType === 'PW' && 
                                        <>
                                        <label className={classes.inputLabel} style={{ paddingBottom:'6px' }}><Text tid={'Quote.WhenDidYouGraduate'}/></label> 
                                        <KeyboardDatePickerField
                                            name={`insuredPersons.${index}.graduatedDate`}
                                            value={values.insuredPersons[index].graduatedDate}
                                            style={{ width: '100%' }}
                                            maxDate={new Date()}
                                            minDate={new Date(new Date().setDate(new Date().getDate() - (365 - 1)))}
                                            onChange={(e) => {
                                                values.insuredPersons[index].graduatedDate = e
                                                values.insuredPersons[index].yearDateAfterGraduated = CalculateTripEndDate(e, 365)
                                                setFieldValue(`insuredPersons.${index}.graduatedDate`, e)                                
                                                setFieldValue(`insuredPersons.${index}.yearDateAfterGraduated`, CalculateTripEndDate(e, 365))   
                                            }}
                                        />
                                        {validMessage(`insuredPersons.${index}.graduatedDate`)}
                                    </> 
                                    }
                            
                                </Grid>
                                {/* PW */}
                                {values.insuredPersons[index].travelType === 'PW' && 
                                    values.insuredPersons[index].graduatedDate  && (
                            
                                    <Grid container spacing={1} justifyContent="center">
                                        <Grid item container xs={12} sm={12} md={12} className={classes.textFieldWrapper}>
                                            <Box style={{ background:'#f9f9f9', marginTop:'3vh', width:'100%'}}>
                                                {CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated) > 0 ?
                                                    <>
                                                    {(values.insuredPersons[index].yearDateAfterGraduated < values.insuredPersons[index].tripEndDate) && (
                                                        <>
                                                        <Typography variant="h5" style={{margin:'2vh'}}>
                                                            {currentLanguage === 'ko' 
                                                                ? (<div>
                                                                    {values.insuredPersons[index].firstName}님은  {dateFormat(values.insuredPersons[index].tripStartDate)} 부터 {dateFormat(values.insuredPersons[index].yearDateAfterGraduated)} 까지 총 {CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated)}일 동안의 유학생 보험을 가입 하실 수 있습니다.
                                                                    <br/>
                                                                    <strong>보험 만료일이 {dateFormat(CalculateTripEndDate(values.insuredPersons[0].graduatedDate, 365))} 로 변경되어야 가입이 가능합니다. 변경 하시겠습니까?</strong>
                                                                    </div>) 
                                                                : (<div>
                                                                    You can purchase international student insurance for a total
                                                                    of {CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated)} days from {dateFormat(values.insuredPersons[index].tripStartDate)} to {dateFormat(values.insuredPersons[index].yearDateAfterGraduated)}. 
                                                                    <br/>
                                                                    <strong> Expiry data as {dateFormat(values.insuredPersons[index].yearDateAfterGraduated)} will be changed for apply. Would you like to continue?</strong>
                                                                    </div>)
                                                            }
                                                        </Typography>
                                                        <Grid container spacing={1} justifyContent="center">
                                                            <Grid item xs={6} sm={6} md={3} lg={3}>
                                                                <Button
                                                                    color="dark" 
                                                                    className={classes.next_button}
                                                                    style={{ marginBottom:'3vh'}}
                                                                    onClick={()=>{
                                                                        if(index === 0){
                                                                            values.tripEndDate = values.insuredPersons[index].yearDateAfterGraduated
                                                                            values.tripPeriod = CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated)
                                                                        }
                                                                        setFieldValue(`insuredPersons.${index}.tripEndDate`, values.insuredPersons[index].yearDateAfterGraduated )
                                                                        setFieldValue(`insuredPersons.${index}.tripPeriod`,CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated))
                                                                        for (const i in values.insuredPersons) { 
                                                                                if (index === 0 && values.insuredPersons[i].sameDate === true){
                                                                                    setFieldValue(`insuredPersons.${i}.tripEndDate`, values.insuredPersons[index].yearDateAfterGraduated )
                                                                                    setFieldValue(`insuredPersons.${i}.tripPeriod`, CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated))
                                                                                }
                                                                            } 
                                                                    }}
                                                                >
                                                                    <Text tid={'Button.Yes'}/>
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                </>
                                                    )}    
                                                    </>
                                                    :
                                                    <>
                                                        <Typography variant="h5" style={{margin:'2vh'}}>
                                                            <Text tid={'TravelApplication.NotEligibleStudent'}/>
                                                        </Typography>
                                                        <Link to="/travel-insurance/quote/trip-info" target='_blank' style={{ textDecoration: 'none', margin:'0 10px 20px 10px', display:'inline-block' }}>
                                                            <Button variant="outlined" color='primary'>
                                                                <Text tid={`Get a quote`} />
                                                            </Button>
                                                        </Link>
                                                    </>
                                                }
                                            </Box>


                                        </Grid>
                                    </Grid>
                                )}

                                {values.tripDirection === 'InBound' &&
                                    (index>0 || 
                                        (index=== 0 && 
                                            (values.insuredPersons[0].travelType === 'SV' || 
                                                (values.insuredPersons[0].travelType === 'PW' &&  CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated) > 0)) )) 
                                    
                                    &&
                                    // values.insuredPersons[index].travelType !== 'PW' && 
                                    (
                                    <>
                                        {/* samedate */}
                                        {index>0 &&
                                            <Grid item container xs={12} style={{ marginBottom: isMobile ? '15px' : '0', marginTop:isMobile ? '0': '2vh' }}>
                                                
                                                <Grid item xs={12} sm={12} md={10} lg={4} >
                                                    <span className={classes.inputLabel} style={{ marginBottom: '7px', paddingTop:'0', fontSize:'14px', fontWeight:'600'}}>
                                                        {currentLanguage !== 'ko'
                                                            ?(`Is travel date same as ${values.insuredPersons[0].firstName}'s?`)
                                                            :(`여행 기간이 ${values.insuredPersons[0].firstName} 와 동일 한가요?`)
                                                        }
                                                    </span>
                                                    <ToggleButtonGroup
                                                        className={classes.toggleButtonGroup}
                                                        name={`insuredPersons.${index}.sameDate`}
                                                        value={values.insuredPersons[index].sameDate}
                                                        exclusive
                                                        onChange={(e) => {
                                                            const val = e.currentTarget.value === 'true' ? true : false
                                                            values.insuredPersons[index].sameDate = val
                                                            setFieldValue(`insuredPersons.${index}.sameDate`, val)
                                                            values.insuredPersons[index].tripStartDate = values.tripStartDate
                                                            values.insuredPersons[index].tripEndDate = values.tripEndDate
                                                            values.insuredPersons[index].tripPeriod = values.tripPeriod
                                                            setFieldTouched(`insuredPersons.${index}.tripStartDate`)
                                                            setFieldTouched(`insuredPersons.${index}.tripEndDate`)
                                                            setFieldTouched(`insuredPersons.${index}.tripPeriod`)
                                                        }}
                                                    >
                                                        <ToggleButton value={true} className={classes.toggleButton}>
                                                            <Text tid={'Button.Yes'}/>
                                                        </ToggleButton>
                                                        <ToggleButton value={false} className={classes.toggleButton}>
                                                        <Text tid={'Button.No'}/>
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                    {validMessage(`insuredPersons.${index}.sameDate`)}
                                                </Grid>
                                            </Grid>
                                        }

                                        {/* this is conditional based on if all info is the same or not*/}
                                        {(values.insuredPersons[index].sameDate === true ||
                                            values.insuredPersons[index].sameDate === false) && (
                                            <>
                                                <Grid item container className={classes.row_input} spacing={2}>

                                                    <Grid item xs={12} md={4} >
                                                        <label className={classes.inputLabel}><Text tid={'Quote.TripStartDate'}/></label>
                                                        <KeyboardDatePickerField
                                                            name={`insuredPersons.${index}.tripStartDate`}
                                                            value={values.insuredPersons[index].tripStartDate}
                                                            disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                                            minDate={new Date()}
                                                            fullWidth
                                                            onChange={(e) => {
                                                                setFieldValue(`insuredPersons.${index}.tripStartDate`, e)
                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(e, values.insuredPersons[index].tripEndDate))
                                                            }}
                                                        />
                                                        {validMessage(`insuredPersons.${index}.tripStartDate`)}
                                                    </Grid>

                                                    <Grid item xs={12} md={4}>
                                                        <label className={classes.inputLabel}><Text tid={'Quote.TripEndDate'}/></label>
                                                        <KeyboardDatePickerField
                                                            name={`insuredPersons.${index}.tripEndDate`}
                                                            value={values.insuredPersons[index].tripEndDate}
                                                            minDate={new Date()}
                                                            disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                                            fullWidth
                                                            onChange={(e) => {
                                                                setFieldValue(`insuredPersons.${index}.tripEndDate`, e)
                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(values.insuredPersons[index].tripStartDate, e,))
                                                            }}
                                                        />
                                                        {validMessage(`insuredPersons.${index}.tripEndDate`)}
                                                    </Grid>

                                                    <Grid item xs={12} md={4} >
                                                        <RegularTextField
                                                            label= {'Quote.CoverageDays'}
                                                            name={`insuredPersons.${index}.tripPeriod`}
                                                            value={values.insuredPersons[index].tripPeriod ? values.insuredPersons[index].tripPeriod : ''}
                                                            disabled={values.insuredPersons[index].sameDate === true
                                                                ? true
                                                                : (values.insuredPersons[index].tripStartDate ? false : true)}
                                                            onChange={(e) => {
                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, e.currentTarget.value)
                                                                setFieldValue(`insuredPersons.${index}.tripEndDate`,
                                                                    CalculateTripEndDate(values.insuredPersons[index].tripStartDate, e.currentTarget.value
                                                                    ))
                                                            }}
                                                            onBlur={handleBlur}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                                            }}
                                                            // fullWidth
                                                        />
                                                        {validMessage(`insuredPersons.${index}.tripPeriod`)}
                                                    </Grid>
                                                </Grid>
                                            </>
                                            )}
                                    </>
                                )}

                        </Grid>


                    </Grid>
                </Grid>
            </>
        );
    };

    return (
        <>
            <Grid container spacing={2} style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-120px' : '0' }}>
                <Grid item container xs={12}>
                    <Grid item xs={12} sm={12} md={12} style={{ marginBottom:'2vh' }}>
                        {/* <span className={classes.spanTitle}><Text tid={'Applicants'}/></span> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} >
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Grid item container>
                                    {/* Number of insuredPersons */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <SelectTextFieldSmall
                                            label={'Number of applicants'}
                                            name='insuredNumber'
                                            disabled={values.insuredGroupType === 'Family' ? false : (values.tripStartDate && values.tripPeriod > 0 ? false : true)}
                                            value={values.insuredNumber}
                                            onChange={(e) => {
                                                const next = Number(e.currentTarget.value);
                                                setFieldTouched('insuredNumber')
                                                setFieldValue('insuredNumber', next)
                                                const current = Array.isArray(values.insuredPersons) ? values.insuredPersons : []
                                                setFieldValue('insuredPersons', addinsuredPerson(next, current))                                        
                                            }}
                                            onBlur={handleBlur}
                                        >
                                            {[...Array(10).keys()].map(i => i + 1).map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </SelectTextFieldSmall>
                                        {validMessage('insuredNumber')}
                                    </Grid>
                                    {/* Auto-sync insuredPersons with insuredNumber on initial load/deep link */}
                                    <div style={{ display: 'none' }}>
                                        {parseInt(values.insuredNumber || 0, 10) > 0 
                                            && values.insuredPersons.length !== parseInt(values.insuredNumber, 10)
                                            && setFieldValue('insuredPersons', addinsuredPerson(parseInt(values.insuredNumber, 10), values.insuredPersons))}
                                    </div>
                                    {/* Applicant Eligibilty Confirmation  */}
                                    <Grid item container xs={12} sm={12} md={12} spacing={1} justifyContent="center">
                                        <Grid item xs={12} style={{ margin:'2vh 0' }}>
                                            {(values.application.applicationCompany==='IMG' && values.application.applicationType==='PATRIOT INTERNATIONAL LITE') &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity'}/></AlertTitle>
                                                    <ul>
                                                        <li><Text tid={'TravelApplication.TerminalIllness'}/></li>
                                                        <li><Text tid={'TravelApplication.Cancer'}/></li>
                                                        <li><Text tid={'TravelApplication.CancerTreatment'}/></li>
                                                    </ul>

                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.List2.IMGPIL'}/></AlertTitle>
                                                    <ul>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List2.Sub1.IMGPIL'}/></li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List2.Sub2.IMGPIL'}/></li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List2.Sub3.IMGPIL'}/></li>
                                                    </ul>
                                                </Alert>
                                            }
                                            {/* Eligiblity - Allianz Student Plan  */}
                                            {values.application.applicationCompany==='Allianz' && values.application.applicationType==='STUDENT' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.Title.AllianzST'}/></AlertTitle>
                                                    <ul>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.AllianzST'}/></li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.AllianzST'}/></li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.AllianzST'}/></li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.AllianzST'}/></li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub5.AllianzST'}/></li>
                                                    </ul>
                                                </Alert>
                                            }

                                            {/* Eligiblity - Allianz Visitor Plan  */}
                                            {values.application.applicationCompany==='Allianz' && values.application.applicationType==='VISITOR' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.Title.TravelanceVI'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List1.AllianzVI'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.AllianzVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.AllianzVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.AllianzVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.AllianzVI'}/></li>
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List2.AllianzVI'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List2.Sub1.AllianzVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List2.Sub2.AllianzVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List2.Sub3.AllianzVI'}/></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </Alert>
                                            }
                                            
                                            {/* Eligiblity - Allianz Canadian Plan  */}
                                            {values.application.applicationCompany==='Allianz' && values.application.applicationType==='CANADIAN' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.Title.AllianzCAN'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List1.AllianzCAN'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.AllianzCAN'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.AllianzCAN'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.AllianzCAN'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.AllianzCAN'}/></li>
                                                            </ul>
                                                        </li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List2.AllianzCAN'}/></li>
                                                        <li><Text tid={'TravelApplication.Eligiblity.List3.AllianzCAN'}/></li>
                                                    </ul>
                                                    <p style={{ marginBottom:'0', fontWeight:'600'}}><Text tid={'TravelApplication.Eligiblity.Note.Title.AllianzCAN'}/></p>
                                                    <p>*<Text tid={'TravelApplication.Eligiblity.Note.Sub.AllianzCAN'}/></p>
                                                </Alert>
                                            }

                                            {/* Eligiblity - TuGo Student Plan  */}
                                            {values.application.applicationCompany==='Tugo' && values.application.applicationType==='STUDENT' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.List1.Title.TugoST'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List1.TugoST'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.TugoST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.TugoST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.TugoST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.TugoST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub5.TugoST'}/></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.List2.Title.TugoST'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List2.TugoST'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List2.Sub1.TugoST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List2.Sub2.TugoST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List2.Sub3.TugoST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List2.Sub4.TugoST'}/></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <p style={{ marginBottom:'0', fontWeight:'600'}}><Text tid={'TravelApplication.Eligiblity.Note.Title.TugoST'}/></p>
                                                    <p>*<Text tid={'TravelApplication.Eligiblity.Note.Sub.TugoST'}/></p>
                                                </Alert>
                                            }

                                            {/* Eligiblity - TuGo Visitor Plan  */}
                                            {values.application.applicationCompany==='Tugo' && values.application.applicationType==='VISITOR' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.Title.TugoVI'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List1.TugoVI'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.TugoVI'}/></li>
                                                                <li>
                                                                    <Text tid={'TravelApplication.Eligiblity.List1.Sub2.TugoVI'}/>
                                                                    <ul>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.Sub1.TugoVI'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.Sub2.TugoVI'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.Sub3.TugoVI'}/></li>
                                                                    </ul>
                                                                </li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub5.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub6.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub7.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub8.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub9.TugoVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub10.TugoVI'}/></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                              
                                                </Alert>
                                            }

                                             {/* Eligiblity - TuGo Canadian Plan  */}
                                             {values.application.applicationCompany==='Tugo' && values.application.applicationType==='CANADIAN' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.Title.TugoCAN'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List1.TugoCAN'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.TugoCAN'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.TugoCAN'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.TugoCAN'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.TugoCAN'}/></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </Alert>
                                            }

                                            {/* Eligiblity - BlueCross Canadian Plan  */}
                                            {values.application.applicationCompany==='BlueCross' && values.application.applicationType==='CANADIAN' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.List1.Title.BluecrossCAN'}/></AlertTitle>
                                                        <p><Text tid={'TravelApplication.Eligiblity.List1.BluecrossCAN'}/></p>
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.List2.Title.BluecrossCAN'}/></AlertTitle>
                                                        <ul>
                                                            <li>
                                                                <p><Text tid={'TravelApplication.Eligiblity.List2.BluecrossCAN'}/></p>
                                                                <ul>
                                                                    <li><Text tid={'TravelApplication.Eligiblity.List2.Sub1.BluecrossCAN'}/></li>
                                                                    <li><Text tid={'TravelApplication.Eligiblity.List2.Sub2.BluecrossCAN'}/></li>
                                                                    <li><Text tid={'TravelApplication.Eligiblity.List2.Sub3.BluecrossCAN'}/></li>
                                                                    <li><Text tid={'TravelApplication.Eligiblity.List2.Sub4.BluecrossCAN'}/></li>
                                                                    <li><Text tid={'TravelApplication.Eligiblity.List2.Sub5.BluecrossCAN'}/></li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.List3.Title.BluecrossCAN'}/></AlertTitle>
                                                        <p><Text tid={'TravelApplication.Eligiblity.List3.BluecrossCAN'}/></p>
                                                </Alert>
                                            }

                                            {/* Eligiblity - Travelance Visitor Essential Plan  */}
                                            {values.application.applicationCompany==='Travelance' && values.application.applicationType==='VISITOR' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.Title.TravelanceVI'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List1.TravelanceVI'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.TravelanceVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.TravelanceVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.TravelanceVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.TravelanceVI'}/></li>
                                                                <li>
                                                                    <Text tid={'TravelApplication.Eligiblity.List1.Sub4.TravelanceVI'}/>
                                                                    <ul>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.Sub1.TravelanceVI'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.Sub2.TravelanceVI'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.Sub3.TravelanceVI'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.Sub4.TravelanceVI'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.Sub5.TravelanceVI'}/></li>
                                                                    </ul>
                                                                </li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub5.TravelanceVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub6.TravelanceVI'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub7.TravelanceVI'}/></li>
                                                                <li>
                                                                    <Text tid={'TravelApplication.Eligiblity.List1.Sub8.TravelanceVI'}/>
                                                                    <ul>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub8.Sub1.TravelanceVI'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub8.Sub2.TravelanceVI'}/></li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <p style={{ marginBottom:'0' }}>* <Text tid={'TravelApplication.Eligiblity.Note.TravelanceVI'}/></p>
                                                </Alert>
                                            }

                                            {/* Eligiblity - Travelance Student Plan  */}
                                            {values.application.applicationCompany==='Travelance' && values.application.applicationType==='STUDENT' &&
                                                <Alert severity="success">
                                                    <AlertTitle><Text tid={'TravelApplication.Eligiblity.Title.TravelanceST'}/></AlertTitle>
                                                    <ul>
                                                        <li>
                                                            <Text tid={'TravelApplication.Eligiblity.List1.TravelanceST'}/>
                                                            <ul>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub1.TravelanceST'}/></li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub2.TravelanceST'}/></li>
                                                                <li>
                                                                    <Text tid={'TravelApplication.Eligiblity.List1.Sub3.TravelanceST'}/>
                                                                    <ul>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.Sub1.TravelanceST'}/></li>
                                                                        <li><Text tid={'TravelApplication.Eligiblity.List1.Sub3.Sub2.TravelanceST'}/></li>
                                                                    </ul>
                                                                </li>
                                                                <li><Text tid={'TravelApplication.Eligiblity.List1.Sub4.TravelanceST'}/></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <p style={{ marginBottom:'0', fontWeight:'600'}}><Text tid={'TravelApplication.Eligiblity.Note.Title.TravelanceST'}/></p>
                                                    <p><Text tid={'TravelApplication.Eligiblity.Note.Sub.TravelanceST'}/></p>
                                                </Alert>
                                            }


                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{ marginTop: isMobile ? '2vh' : '0' }}>
                                        <label style={{ display:'block'}} className={classes.inputLabel_manualForm}><Text tid={'Application.Applicant.Eligible'}/></label>
                                        <ToggleButtonGroup
                                            className={classes.toggleButtonGroup}
                                            name="eligilbeAgrement"
                                            value={values.eligilbeAgrement}
                                            exclusive
                                            style={{ width: isMobile ? '100%': '50%' }}
                                            onChange={(e) => {
                                                const val = e.currentTarget.value === 'true' ? true : false
                                                setFieldValue(`eligilbeAgrement`, val)
                                            }}
                                            >
                                                <ToggleButton 
                                                    disabled={!canEnableEligibility}
                                                    value={true} 
                                                    className={classes.toggleButton}
                                                >
                                                    <Text tid={'Button.Yes'}/>
                                                </ToggleButton>
                                                <ToggleButton 
                                                    disabled={!canEnableEligibility}
                                                    value={false} 
                                                    className={classes.toggleButton}
                                                >
                                                    <Text tid={'Button.No'}/>
                                                </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage('eligilbeAgrement')}
                                    {/* </FormControl> */}
                                    </Grid>
                                    {values.eligilbeAgrement===false&&
                                        <Alert severity='error' style={{ marginTop: '2vh' }}>
                                            <Text tid={'Quote.Error.NoEligibilityAgreement'}/>
                                        </Alert>
                                    }
                                </Grid>
                            </Grid>

                            <Grid item xs>
                                {canActivate ? companion(values) : null}
                            </Grid>

                        </Grid>
                    </Grid>            
                </Grid>

            </Grid>


        </>
    )
}


export default Applicants
