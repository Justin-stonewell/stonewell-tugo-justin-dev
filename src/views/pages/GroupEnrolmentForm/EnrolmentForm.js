import React, { useCallback, useEffect, useState, useContext } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';

import { getProvince } from '../../../redux/actions/countries';
import { getVendorAccountByAccessCode } from '../../../redux/actions/vendorAccountAction';
//Formik
import { Formik, Form, ErrorMessage } from 'formik'
//validation
import * as Yup from 'yup'
import * as Validation from '../../Validation'
//core components
import { Grid } from '@material-ui/core'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import WindowDimension from '../../../components/common/WindowDimension'
// controllers
// import { CalculateAgeBaseEffectiveDate, CalculateAgeDays } from '../../../controllers/CalculateValue'

// Form initial data
import { groupEnrolmentFormInit } from '../../layouts/InitFormData';
//logos
// import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
// import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
// import blueCrossLogo from '../../../assets/imgs/logo/blueCross-logo.png'
// import gmsLogo from '../../../assets/imgs/logo/gms-logo.png'
//icons
// import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'
import PlanMember from './PlanMember';
import Beneficiary from './Beneficiary';
import Banking from './Banking';
import SubmitResult from './SubmitResult';

//setup form style
const useStyles = makeStyles(formStyle)

// const current = new Date()

// const companyName = [
//     {name:'sunlife', value:'Sunlife'},
//     {name:'canadaLife', value:'canadaLife'},
//     {name:'desjardins', value:'Desjardins'}
// ]

// validation Schema
const validationSchema = Yup.object({
  childrenNumber: Yup.string(),
  beneficiaryNumber: Yup.string(),
  planMemberSignature: Validation.validSignature(),
  planMember: Yup.array().of(
      Yup.object().shape({
          firstName: Validation.validRequiredField(),
          lastName: Validation.validRequiredField(),
          middleName: Yup.string(),
          birthDate: Validation.validRequiredDateField(),
          age: Yup.number().required(),
          gender: Validation.validRequiredField(),
          language: Validation.validRequiredField(),
          address: Validation.validRequiredField(),
          aptNumber: Yup.string(),
          city: Validation.validRequiredField(),
          province: Validation.validRequiredField(),
          postalCode: Validation.validPostalCode(),
          email: Validation.validEmail(),
          phone: Validation.validPhoneNumber(),
          provinceOfEmployment: Validation.validRequiredField(),
          maritalStatus: Validation.validRequiredField(),
          coverageSelection: Validation.validRequiredField(),
          extendedHealth: Validation.validRequiredField(),
          dental: Validation.validRequiredField(),
      })
  ),
  banking: Yup.array().of(
      Yup.object().shape({
          transitNumber: Validation.validRequiredField(),
          institutionNumber: Validation.validRequiredField(),
          accountNumber: Validation.validRequiredField(),
      })
  ),
  // spouse: Yup.array().of(
  //     Yup.object().shape({
  //         firstName: Validation.validRequiredField(),
  //         lastName: Validation.validRequiredField(),
  //         middleName: Yup.string(),
  //         birthDate: Validation.validRequiredDateField(),
  //         age: Yup.number().required(),
  //         gender: Validation.validRequiredField(),
  //         hasOwnBenefits: Validation.validRequiredField(),
  //         ownExtendedHealth: Validation.validRequiredField(),
  //         ownDental: Validation.validRequiredField(),
  //         ownBenefitsCarrier: Validation.validRequiredField(),
  //         extendedHealth: Validation.validRequiredField(),
  //         dental: Validation.validRequiredField(),
  //     })
  // ),
  // children: Yup.array().of(
  //     Yup.object().shape({
  //         firstName: Validation.validRequiredField(),
  //         lastName: Validation.validRequiredField(),
  //         middleName: Yup.string(),
  //         birthDate: Validation.validRequiredDateField(),
  //         age: Yup.number().required(),
  //         gender: Validation.validRequiredField(),
  //         isStudent: Yup.string(),
  //         isOverAgeDisabledChild: Yup.string(),
  //         extendedHealth: Validation.validRequiredField(),
  //         dental: Validation.validRequiredField(),
  //     })
  // ),
  beneficiary: Yup.array().of(
      Yup.object().shape({
          firstName: Validation.validRequiredField(),
          lastName: Validation.validRequiredField(),
          relationship: Validation.validRequiredField(),
          percentage: Validation.validRequiredField(),
      })
  )
});


// ValidMessage
function validMessage(fieldName) {
    return (
        <ErrorMessage
        name={fieldName}
        render={(msg) => (
            <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
              <Text tid={`Validation.${msg}`}></Text>
            </div>
        )}
        />
    )
}


function getSteps() {
  return ['GroupEnrolmentForm.Step1.Title.PlanMember', 'GroupEnrolmentForm.Step2.Title.Beneficiary', 'GroupEnrolmentForm.Step3.Title.Banking'];
}

function getStepContent(step, 
                        values, 
                        handleChange, 
                        handleBlur,
                        setFieldValue, 
                        setFieldTouched, 
                        provinces,
                        errors
                        ) {
  switch (step) {
    case 0:
      return (
              <PlanMember
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                validMessage={validMessage}
                provinces={provinces}
              />
            );
    case 1:
      return (
              <Beneficiary
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors = {errors}
                  validMessage={validMessage}
              />
            );
    case 2:
      return (
              <Banking
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  errors = {errors}
                  validMessage={validMessage}
              />
            );            


  default:
      return '';
  }
}



export default function EnrolmentForm({vendorAccessCode}) {
  const classes = useStyles();

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  const dispatch = useDispatch();
  const provinces = useSelector(state => state.countryReducer.provinces)
  const vendor = useSelector(state => state.vendorAccountReducer.vendor)

  // get Resource Data
  const getResourceData = useCallback(() => {
      dispatch(getProvince())
      dispatch(getVendorAccountByAccessCode(vendorAccessCode))
  }, [dispatch, vendorAccessCode]);

  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      getResourceData()
      setIsLoaded(true)
    }
  }, [getResourceData, isLoaded]);


  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  const [formData, setFormData] = useState(groupEnrolmentFormInit());

  const [submitted, setSubmitted] = useState(false);

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  // get Resource Data
//   const getResourceData = useCallback(() => {
//       dispatch(getVendorAccountByAccessCode(vendorAccessCode))
//   }, [dispatch,insuraceType,vendorAccessCode]);

  // run useEffect only once when first render
//   useEffect(() => {
//     if(isLoaded === false){
//       getResourceData()
//       setIsLoaded(true)
//     }
//   }, [getResourceData, isLoaded]);

  const vendorName = vendor && vendor.length > 0 ? vendor[0].vendor_name:'';

  const { width } = WindowDimension();
  let isMobile = (width < 768);



  //set vendor information if formData.vendorID is null
  if ( vendor && vendor.length > 0 && formData.vendorID===''){
    formData.vendorID = vendor[0].vendor_id;
    formData.vendorAddress = {
      street: vendor[0].street?vendor[0].street:'',
      suiteNo: vendor[0].suite_no?vendor[0].suite_no:'',
      city: vendor[0].city?vendor[0].city:'',
      province: vendor[0].province?vendor[0].province:'',
      postalCode: vendor[0].postalcode?vendor[0].postalcode:''
    }
  }

  // validate by step
  function IsStepValidated(values, setFieldTouched, errors) {
    let result = false;

    switch (activeStep) {
        case 0:
            // Plan Member, Spouse, Children 
            const isValidPlanMember = Boolean(
              values.planMember[0].firstName && values.planMember[0].lastName && 
              values.planMember[0].gender && values.planMember[0].birthDate && 
              values.planMember[0].language && values.planMember[0].address && 
              values.planMember[0].city && values.planMember[0].province && 
              values.planMember[0].postalCode && values.planMember[0].email && 
              values.planMember[0].phone && values.planMember[0].extendedHealth && 
              values.planMember[0].dental && values.planMember[0].address &&
              values.planMember[0].city && values.planMember[0].postalCode &&
              values.planMember[0].email && values.planMember[0].phone
            );
          
            // const isValidSpouse = Boolean(
            //     !values.spouse[0] || (
            //         values.spouse[0].firstName && values.spouse[0].lastName && 
            //         values.spouse[0].gender && values.spouse[0].birthDate
            //     )
            // );

            // const isValidChildren = !values.children || values.children.every(child => {
            //     return child.firstName && child.lastName && child.gender && child.birthDate && child.extendedHealth && child.dental
            // });

            // console.log(isValidPlanMember)
            // console.log(values.spouse[0])
            // console.log(isValidChildren)

            if (isValidPlanMember) {
                result = true;
            } else {
              
                setFieldTouched(`planMember.${0}.firstName`)
                setFieldTouched(`planMember.${0}.lastName`)
                setFieldTouched(`planMember.${0}.gender`)
                setFieldTouched(`planMember.${0}.birthDate`)
                setFieldTouched(`planMember.${0}.language`)
                setFieldTouched(`planMember.${0}.maritalStatus`)
                setFieldTouched(`planMember.${0}.provinceOfEmployment`)
                setFieldTouched(`planMember.${0}.coverageSelection`)
                setFieldTouched(`planMember.${0}.extendedHealth`)
                setFieldTouched(`planMember.${0}.dental`)
                setFieldTouched(`planMember.${0}.address`)
                setFieldTouched(`planMember.${0}.city`)
                setFieldTouched(`planMember.${0}.postalCode`)
                setFieldTouched(`planMember.${0}.email`)
                setFieldTouched(`planMember.${0}.phone`)

                // if(values.planMember[0].coverageSelection === 'Family' && values.spouse[0]){
                //   setFieldTouched(`spouse.${0}.hasOwnBenefits`)
                //   setFieldTouched(`spouse.${0}.extendedHealth`)
                //   setFieldTouched(`spouse.${0}.dental`)
                // }
                // if(values.planMember[0].coverageSelection === 'Family' && values.spouse[0] && values.spouse[0].hasOwnBenefits === 'true'){
                //   setFieldTouched(`spouse.${0}.ownExtendedHealth`)
                //   setFieldTouched(`spouse.${0}.ownDental`)
                //   setFieldTouched(`spouse.${0}.ownBenefitsCarrier`)
                // }
                // if(values.childrenNumber > 0) {
                //   values.children.every(child => {
                //     setFieldTouched(child.extendedHealth)
                //     setFieldTouched(child.dental)
                //   })
                // }
               
            }
            break;

        case 1:
            // Beneficiary 
            const isValidBeneficiary = values.beneficiary.every(bf => {
                return bf.firstName && bf.lastName && bf.relationship && bf.percentage;
            });

            if (isValidBeneficiary) {
                result = true;
            } else {
                values.beneficiary.forEach((_, index) => {
                    ["firstName", "lastName", "relationship", "percentage"]
                        .forEach(field => setFieldTouched(`beneficiary.${index}.${field}`));
                });
            }
            break;

        case 2:
            // Banking 
            const isValidBanking = values.banking.every(bank => {
                return bank.transitNumber && bank.institutionNumber && bank.accountNumber 
            });

            const signature = 'iVBORw0KGgoAAAANSUhEUgAAAfQAAADICAYAAAAeGRPoAAAAAXNSR0IArs4c6QAACHNJREFUeF7t1QENAAAIwzDwbxodLMXBe5LvOAIECBAgQOC9wL5PIAABAgQIECAwBt0TECBAgACBgIBBD5QoAgECBAgQMOh+gAABAgQIBAQMeqBEEQgQIECAgEH3AwQIECBAICBg0AMlikCAAAECBAy6HyBAgAABAgEBgx4oUQQCBAgQIGDQ/QABAgQIEAgIGPRAiSIQIECAAAGD7gcIECBAgEBAwKAHShSBAAECBAgYdD9AgAABAgQCAgY9UKIIBAgQIEDAoPsBAgQIECAQEDDogRJFIECAAAECBt0PECBAgACBgIBBD5QoAgECBAgQMOh+gAABAgQIBAQMeqBEEQgQIECAgEH3AwQIECBAICBg0AMlikCAAAECBAy6HyBAgAABAgEBgx4oUQQCBAgQIGDQ/QABAgQIEAgIGPRAiSIQIECAAAGD7gcIECBAgEBAwKAHShSBAAECBAgYdD9AgAABAgQCAgY9UKIIBAgQIEDAoPsBAgQIECAQEDDogRJFIECAAAECBt0PECBAgACBgIBBD5QoAgECBAgQMOh+gAABAgQIBAQMeqBEEQgQIECAgEH3AwQIECBAICBg0AMlikCAAAECBAy6HyBAgAABAgEBgx4oUQQCBAgQIGDQ/QABAgQIEAgIGPRAiSIQIECAAAGD7gcIECBAgEBAwKAHShSBAAECBAgYdD9AgAABAgQCAgY9UKIIBAgQIEDAoPsBAgQIECAQEDDogRJFIECAAAECBt0PECBAgACBgIBBD5QoAgECBAgQMOh+gAABAgQIBAQMeqBEEQgQIECAgEH3AwQIECBAICBg0AMlikCAAAECBA71UQDJ6RV1xQAAAABJRU5ErkJggg=='

            if (isValidBanking && !values.planMemberSignature.includes(signature)) {
                result = true;
            } else {
                values.banking.forEach((_, index) => {
                    ["transitNumber", "institutionNumber", "accountNumber"]
                        .forEach(field => setFieldTouched(`banking.${index}.${field}`));
                });
            }
            break;

        default:
            break;
    }

    return result;
}

  if (submitted === false) {
    return (
        <Formik
          initialValues={formData}
          // initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
              values.preferLanguage = currentLanguage
              setFormData(values);
              setSubmitted(true);
          }} 
        >
          {({ values, handleChange, handleBlur, setFieldValue, setTouched, setFieldTouched, touched, errors}) => (
            <Form  style={{ margin: '2vh'}}>
                {/* {console.log('errors', errors)} */}

                <Grid container direction='column' spacing={4}>
                   
                    <Grid item container xs={12} style={{textAlign:'center', fontWeight:400, fontSize:isMobile ? '20px':'1.6em', margin: isMobile ? '0':'20px 0', borderBottom:'1px solid #f3f3f3', background: isMobile ? '#f9f9f9':"none", marginTop:isMobile?'-5px':'0'}}>
                        <Grid item xs={12} style={{  fontSize:'14px', margin:isMobile ?'10px 0':'30px 0', color:'#555'}}>
                            Your Company <span style={{ fontWeight:'600', marginLeft:'10px' }}>{vendorName}</span>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign:'center' }}>
                          {/* <img
                              src={values.application.applicationCompany === 'Tugo' 
                                      ? tugoLogo : values.application.applicationCompany === 'Allianz' 
                                      ? allianzLogo : values.application.applicationCompany === 'BlueCross'
                                          ? blueCrossLogo : values.application.applicationCompany === 'GMS'
                                             ? gmsLogo : null }
                              alt='logo'
                              style={{width: values.application.applicationCompany === 'Allianz' ? '110px' : values.application.applicationCompany ==='Tugo' ? '120px' : values.application.applicationCompany === 'GMS' ? '100px' : 'auto', height: values.application.applicationCompany ==='BlueCross' ? '70px' : 'auto', padding:'1vh'}}
                          /> */}
                          <span style={{ alignSelf:'center' }}>
                              {/* {`${values.application.applicationType.charAt(0).toUpperCase() + values.application.applicationType.slice(1).toLowerCase()}  Plan Application `} */}
                              Group Benefits Enrolment Form
                          </span>
                        </Grid>
                        
                    </Grid>
                  
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((label, index) => (
                        <Step key={label}>
                          {/* <StepLabel>{label}</StepLabel> */}
                          <StepLabel><Text tid={label}/></StepLabel>
                          <StepContent>
                            {getStepContent(
                              index, 
                              values, 
                              handleChange, 
                              handleBlur,
                              setFieldValue, 
                              setFieldTouched, 
                              provinces,
                              errors 
                            )}
                            
                            <Grid container style={{ margin: '4vh 0 1vh 0', marginLeft: width > 1400 ? '22vh' : '0' }} spacing={1}>
                                {activeStep !== 0 &&
                                <Grid item xs={6} sm={6} md={3} lg={3}>
                                  <Button 
                                    color="secondary" 
                                    className={classes.back_button} 
                                    onClick={handleBack}
                                  >
                                    <Text tid={'Button.Previous'}/>
                                  </Button>
                                  </Grid>
                                }
                                <Grid item xs={6} sm={6} md={3} lg={3}>
                                  {activeStep < 2 &&
                                    <Button 
                                      color="dark" 
                                      className={classes.next_button}
                                      // disabled = {(activeStep <= 1 || (activeStep > 1 && values.eligilbeAgrement))?false:true}
                                      disabled = {(activeStep <= 1 )?false:true}
                                      onClick={()=>{
                                        if(IsStepValidated(values, setFieldTouched, errors) === true){
                                            handleNext() } else {
                                              setFieldTouched(`planMember.${0}.province`, true)

                                            }

                                      }}
                                    >
                                      <Text tid={'Button.Next'}/>
                                    </Button>
                                  }
                                  {activeStep === 2 &&
                                    <Button 
                                      type='submit' 
                                      color="dark" 
                                      className={classes.next_button} 
                                      // onClick={console.log(formData)}
                                    >
                                      <Text tid={'Button.Apply'}/>
                                    </Button>
                                  }
                                </Grid>
                            
                            </Grid>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                
                </Grid>

              </Form>
          )}
        </Formik>

    );
  } else {
    return( 
        <SubmitResult
          formData={formData}
        />
    )

  }
}