import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../Validation'
// core components
import { Grid, TextField } from '@material-ui/core'
import InputMask from 'react-input-mask'
import Typography from '@mui/material/Typography';
// common components
import { RegularTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import Button from '../../../components/common/CustomButtons/Button';
import { Text } from '../../../components/common/LanguageProvider';
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2'
import SubmitResult from './SubmitResult';

// icons
import InputAdornment from '@mui/material/InputAdornment'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa'

//style
import formStyle from '../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle)

// const queryString = new URLSearchParams(window.location.search).get('value')

const VALIDATION_SCHEMA = Yup.object().shape({
    cardHolderName : Validation.validRequiredField(),
    creditCardNumber : Validation.validCreditCardNumber(),
    cardExpired : Validation.validCardEexpirationDate(),
    cardcvv : Yup.string().when('creditCardType', (creditCardType) => {
      return Yup.string().required("FieldIsRequired")
          .min(3, 'Enter correct digits number')
          .test('Card CVV', function(value) {
              if (!value) {
              return this.createError({ message: `FieldIsRequired` })
              }
              else{
              // MasterCard Visa - 3 digit number code
              // AMEX  - 4 digit number code
              const regEx = /^\d{3}$/;
              const amxRegEx = /^\d{4}$/;
              if (creditCardType === 'AmericanExpress' && amxRegEx.test(value.replace(/\s/g, ''))) {
                  return true;
              }else if ((creditCardType === 'Visa' || creditCardType === 'MasterCard') && regEx.test(value.replace(/\s/g, ''))){
                  return true;
              }
              else {
                  return this.createError({ message: `InvalidSecretCode` })
              }
              }
          })
  })
})

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
    // get credit card icon
    function getCrditCardIcon(cardNumber) {
      switch(cardNumber) {
      case '4':
      return <FaCcVisa style={{ marginLeft:'1vh' }} />
      case '5':
      return <FaCcMastercard style={{ marginLeft:'1vh' }} />
      case '3':
      return <FaCcAmex style={{ marginLeft:'1vh' }} />
      default:
      return <CreditCardIcon style={{ marginLeft:'1vh' }} />
      }
  }


const Payment = (props) => {
  // const { } = props;
  const classes = useStyles()

  const queryString = new URLSearchParams(props.location.search);

  // URL에서 'application' 쿼리 파라미터의 값을 가져와 JSON 객체로 파싱합니다.
  const applicationData = queryString.get('application');
  const applicationJson = applicationData ? JSON.parse(decodeURIComponent(applicationData)) : {};

  console.log(applicationJson)

  // inintal values
  const INITIAL_VALUES = {
    confirmationNo: queryString.get('confirmationNo'),
    contactName : queryString.get('contactName').replace(/[\W_]/g, ' '),
    paymentAmount : queryString.get('paymentAmount'),
    creditCardType : '',
    cardHolderName : '',
    creditCardNumber : '',
    cardExpired: '',
    cardcvv : '',
    // paymentMethod: applicationJson.payment.paymentMethod,
    insuredpersons: applicationJson.insuredpersons
}




const [submitted, setSubmitted] = useState(false);
const [formData, setFormData] = useState([]);

// handleSubmit
const handleSubmit = async (values) => {
    setFormData(values)
    setSubmitted(true)
}

if (submitted === false) {
  return (
    <>
      <QuoteBanner2 title={'Payment'} subTitle={''} links={[]}/>

      <Grid container justifyContent="center">
        <Grid item container xs={12} sm={12} md={11} lg={8}>
          {/* <main className={classes.form} style={{ marginBottom:'8vh', padding:isMobile?'0':'0 2vh', border: isMobile ? 'none': '1px solid #efefef', boxShadow: isMobile?'none':'5px 5px 20px #efefef' }}> */}
          <main className={classes.form} style={{ marginBottom:'4vh', padding:'0 5vh', border: '1px solid #efefef', boxShadow: '5px 5px 20px #efefef' }}>
            <Formik
                initialValues={INITIAL_VALUES}
                validationSchema={VALIDATION_SCHEMA}
                onSubmit={(values) => {
                    // console.log(values)
                    handleSubmit(values)
                }} 
            >
                {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
                <Form>
                    {/* {console.log(errors)} */}
                    <Grid item container className={classes.formWrapper2}>

                    <Grid item container spacing={2} xs={12} sm={12} md={12} lg={8} xl={7}>
                            
                                
                                {applicationJson.insuredpersons
                                    .filter(person => person.travelQuote60Id && person.travelQuote60Id.trim() !== '') // travelQuote60Id가 '' 또는 null이 아닌 요소만 필터링
                                    .map((person, pIndex) => (
                                    <>
                                        <Grid item container>
                                            {person.firstName} {person.lastName} ({person.birthdate}, {person.age} yrs)
                                        </Grid>

                                        <Grid item container spacing={1}>
                                            {person.allianz !== 0 &&
                                                <Grid item xs={12} md={4}>
                                                    <Button
                                                        color={person.selectedProduct === 'allianz' ? 'primary' : "secondary"}
                                                        className={classes.button}
                                                        style={{padding:'1vh', width:'100%', margin:'0', height:'10vh'}}
                                                        onClick={() => {
                                                            setFieldValue(`insuredpersons[${pIndex}].selectedProduct`, 'allianz');
                                                            setFieldValue(`insuredpersons[${pIndex}].compnayName`, 'Allianz');
                                                            setFieldValue(`insuredpersons[${pIndex}].coverage`, '10000000');
                                                            setFieldValue(`insuredpersons[${pIndex}].insuranceAmount`, person.allianz);
                                                            setFieldValue(`insuredpersons[${pIndex}].totalAmount`, person.allianz);
                                                            setFieldValue(`insuredpersons[${pIndex}].plan_price`, person.allianz);
                                                            
                                                            if(person.destCountryCode === 'US'){
                                                                setFieldValue(`insuredpersons[${pIndex}].planId`, 'PLCSMED002');
                                                                setFieldValue(`insuredpersons[${pIndex}].planName`, 'Canadian Single Trip (60-89) - Worldwide');
                                                                person.planId = 'PLCSMED002'
                                                                person.planName = 'Canadian Single Trip (60-89) - Worldwide'
                                                            }else {
                                                                setFieldValue(`insuredpersons[${pIndex}].planId`, 'PLCSMED004');
                                                                setFieldValue(`insuredpersons[${pIndex}].planName`, 'Canadian Single Trip (60-89) - Non USA');
                                                                person.planId = 'PLCSMED004'
                                                                person.planName = 'Canadian Single Trip (60-89) - Non USA'
                                                            }

                                                            person.selectedProduct = 'allianz'
                                                            person.compnayName = 'Allianz'
                                                            person.coverage = '10000000'
                                                            person.insuranceAmount = person.allianz
                                                            person.totalAmount = person.allianz
                                                            person.plan_price = person.allianz

                                                            // 총 결제 금액을 계산합니다.
                                                            const totalPaymentAmount = person.reduce((acc, currentPerson) => {
                                                            return acc + parseFloat(currentPerson.totalAmount || 0);
                                                            }, 0);
    
                                                            // Formik의 paymentAmount를 업데이트합니다.
                                                            setFieldValue('paymentAmount', parseFloat(totalPaymentAmount.toFixed(2)));
    


                                                        }}
                                                        fullWidth
                                                    >
                                                    <div>
                                                        Allianz
                                                        {/* Single trip */}
                                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color:person.selectedProduct === 'allianz' ?'#eee':'#666'}}>
                                                            $ {person.allianz}
                                                        </Typography>
                                                    </div>
                                                    </Button>
                                                </Grid>
                                            }

                                            {person.bluecross !== 0 &&
                                                <Grid item xs={12} md={4}>
                                                    <Button
                                                        color={person.selectedProduct === 'bluecross' ? 'primary' : "secondary"}
                                                        className={classes.button}
                                                        style={{padding:'1vh', width:'100%', margin:'0', height:'10vh'}}
                                                        onClick={(e) => {
                                                            setFieldValue(person.selectedProduct, 'bluecross')

                                                            setFieldValue(person.planId, 'PLCSMED007')
                                                            setFieldValue(person.planName, 'Emergency Medical Care')

                                                            setFieldValue(`insuredpersons[${pIndex}].selectedProduct`, 'bluecross');
                                                            setFieldValue(`insuredpersons[${pIndex}].compnayName`, 'BlueCross');
                                                            setFieldValue(`insuredpersons[${pIndex}].coverage`, '5000000');
                                                            setFieldValue(`insuredpersons[${pIndex}].insuranceAmount`, person.bluecross);
                                                            setFieldValue(`insuredpersons[${pIndex}].totalAmount`, person.bluecross);
                                                            setFieldValue(`insuredpersons[${pIndex}].plan_price`, person.bluecross);
                                                            
                                                            setFieldValue(`insuredpersons[${pIndex}].planId`, 'PLCSMED007');
                                                            setFieldValue(`insuredpersons[${pIndex}].planName`, 'Emergency Medical Care');
                                                            person.planId = 'PLCSMED007'
                                                            person.planName = 'Emergency Medical Care'

                                                            person.selectedProduct = 'bluecross'
                                                            person.compnayName = 'BlueCross'
                                                            person.coverage = '5000000'
                                                            person.insuranceAmount = person.bluecross
                                                            person.totalAmount = person.bluecross
                                                            person.plan_price = person.bluecross

                                                            // 총 결제 금액을 계산합니다.
                                                            const totalPaymentAmount = person.reduce((acc, currentPerson) => {
                                                            return acc + parseFloat(currentPerson.totalAmount || 0);
                                                            }, 0);
    
                                                            // Formik의 paymentAmount를 업데이트합니다.
                                                            setFieldValue('paymentAmount', parseFloat(totalPaymentAmount.toFixed(2)));
    

                                                           
                                                        }}
                                                        fullWidth
                                                    >
                                                    <div>
                                                        Blue Cross
                                                        {/* Single trip */}
                                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color:person.selectedProduct === 'bluecross' ?'#eee':'#666'}}>
                                                            $ {person.bluecross}
                                                        </Typography>
                                                    </div>
                                                    </Button>
                                                </Grid>
                                            }

                                            {person.tugo !== 0 &&
                                                <Grid item xs={12} md={4}>
                                                    <Button
                                                        color={person.selectedProduct === 'tugo' ? 'primary' : "secondary"}
                                                        className={classes.button}
                                                        style={{padding:'1vh', width:'100%', margin:'0', height:'10vh'}}
                                                        onClick={(e) => {
                                                            setFieldValue(person.selectedProduct, 'tugo')

                                                            //Set insured Insurance Plan
                                                            setFieldValue(person.compnayName, 'Tugo')
                                                            setFieldValue(person.coverage, '5000000')
                                                            setFieldValue(person.insuranceAmount, person.tugo)
                                                            setFieldValue(person.totalAmount, person.tugo)
                                                            setFieldValue(person.plan_price, person.tugo)

                                                            if(person.destCountryCode === 'US'){
                                                                setFieldValue(person.planId, 'PLCSMED005')
                                                                setFieldValue(person.planName, 'Traveller - Medical Worldwide - Single Trip (SW)')
                                                                person.planId = 'PLCSMED005'
                                                                person.planName = 'Traveller - Medical Worldwide - Single Trip (SW)'
                                                            }else {
                                                                setFieldValue(person.planId, 'PLCSMED006')
                                                                setFieldValue(person.planName, 'Traveller - Medical Worldwide xUSA - Single Trip (SX)')
                                                                person.planId = 'PLCSMED006'
                                                                person.planName = 'Traveller - Medical Worldwide xUSA - Single Trip (SX)'
                                                            }

                                                            person.selectedProduct = 'tugo'
                                                            person.compnayName = 'Tugo'
                                                            person.coverage = '5000000'
                                                            person.insuranceAmount = person.tugo
                                                            person.totalAmount = person.tugo
                                                            person.plan_price = person.tugo

                                                            // 총 결제 금액을 계산합니다.
                                                            const totalPaymentAmount = person.reduce((acc, currentPerson) => {
                                                            return acc + parseFloat(currentPerson.totalAmount || 0);
                                                            }, 0);
    
                                                            // Formik의 paymentAmount를 업데이트합니다.
                                                            setFieldValue('paymentAmount', parseFloat(totalPaymentAmount.toFixed(2)));

                                                        }}
                                                        fullWidth
                                                    >
                                                    <div>
                                                        TuGo
                                                        {/* Single trip */}
                                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color:person.selectedProduct === 'tugo' ?'#eee':'#666'}}>
                                                            $ {person.tugo}
                                                        </Typography>
                                                    </div>
                                                    </Button>
                                                </Grid>
                                            }
                                        </Grid>
                                    </>
                                ))}
                                
                    </Grid>
                        
                      <Grid item container spacing={2}>
                          {/* applicant info */}
                          <Grid item container spacing={1} style={{padding:'2vh 0'}}>
                              <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                  <span className={classes.spanTitle}>
                                      {/* <Text tid={'TravelApplication.CreditCardInfo'}/> */}
                                      Application
                                  </span>
                              </Grid>
                              
                              <Grid item xs={12} sm={4} md={4}>   
                                  <RegularTextFieldSmall
                                      name={`confirmationNo`}
                                      readOnly={true}
                                      type="text"
                                      value={values.confirmationNo}
                                      // label= {'Quote.ConfirmationNo'}
                                      label= {'Confirmation No.'}
                                  />
                              </Grid>

                              <Grid item xs={12} sm={4} md={4}>   
                                  <RegularTextFieldSmall
                                      name={`contactName`}
                                      readOnly={true}
                                      type="text"
                                      value={values.contactName}
                                      label= {'Quote.FullName'}
                                  />
                              </Grid>

                              <Grid item xs={6} sm={4} md={2}>   
                                  <RegularTextFieldSmall
                                      name={`paymentMethod`}
                                      readOnly={true}
                                      type="text"
                                      value={Text({tid:'Quote.CreditCard'})}
                                      label= {'Quote.PaymentMethod'}
                                  />
                              </Grid>

                              <Grid item xs={6} sm={4} md={2}>   
                                  <RegularTextFieldSmall
                                      name={`paymentAmount`}
                                      readOnly={true}
                                      value={values.paymentAmount}
                                      label= {'Quote.TotalPaymentAmount'}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                      }}
                                  />

                              </Grid>

                              <Grid item xs={6} sm={4} md={2}>   
                              </Grid>

                              
                          </Grid>                            

                          {/* credit card info */}
                          <Grid item container spacing={1} style={{padding:'2vh 0'}}>
                              <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                      <span className={classes.spanTitle}>
                                          <Text tid={'TravelApplication.CreditCardInfo'}/>
                                      </span>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>   
                                  <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CreditCardNumber'}/></label>
                                  <InputMask
                                      name={`creditCardNumber`}
                                      mask= {values.creditCardNumber.substr(0,1) === '3'?"9999 999999 99999":"9999 9999 9999 9999" }
                                      value={values.creditCardNumber}
                                      // style={{ width: '100%' }}
                                      placeholder="MM/YY"
                                      onChange={(e, val)=>{
                                        setFieldValue(`creditCardNumber`,e.target.value )
                                        if (values.creditCardNumber){
                                            let cardType = values.creditCardNumber.substr(0,1)
                                            if (cardType === '4'){
                                            setFieldValue(`creditCardType`,'Visa')
                                            } else if (cardType === '5'){
                                            setFieldValue(`creditCardType`,'MasterCard')
                                            } else if (cardType === '3'){
                                            setFieldValue(`creditCardType`,'AmericanExpress')
                                            } else {
                                            setFieldValue(`creditCardType`,'' )
                                            }
                                        }
                                        console.log(values)
                                      }}
                                      onPaste={(e) => {
                                        const pastedValue = e.clipboardData.getData('Text');
                                        setFieldValue(`creditCardNumber`, pastedValue);
                                        if (pastedValue) {
                                          let cardType = pastedValue.substr(0, 1);
                                          if (cardType === '4') {
                                            setFieldValue(`creditCardType`, 'Visa');
                                          } else if (cardType === '5') {
                                            setFieldValue(`creditCardType`, 'MasterCard');
                                          } else if (cardType === '3') {
                                            setFieldValue(`creditCardType`, 'AmericanExpress');
                                          } else {
                                            setFieldValue(`creditCardType`, '');
                                          }
                                        }
                                      }}
                                      onBlur={handleBlur}                    >
                                      {() => (
                                      <TextField
                                          type="text"
                                          name="creditCardNumber"
                                          variant="outlined"
                                          size="small" 
                                          style={{ width:'100%' }}
                                          InputProps={{
                                          startAdornment: (
                                              <InputAdornment position="start">
                                                  {getCrditCardIcon(values.creditCardNumber.substr(0,1))}
                                              </InputAdornment>
                                          ),
                                          }}
                                      />
                                      )}
                                  </InputMask>
                                  {validMessage(`creditCardNumber`)}
                              </Grid>
                              
                              <Grid item xs={6} sm={4} md={2}>   
                                  <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CardExpiration'}/></label>
                                  <br/>
                                  <InputMask
                                      name={`cardExpired`}
                                      mask="99/99"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.cardExpired}
                                      placeholder="MM/YY"
                                      >
                                      {() => (
                                          <TextField
                                          type="text"
                                          name="cardExpired"
                                          variant="outlined"
                                          size="small"
                                          />
                                      )}
                                  </InputMask>
                                  {validMessage(`cardExpired`)}
                              </Grid>
                              
                              <Grid item xs={6} sm={4} md={2}>   
                                  <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CardCVV'}/></label>
                                  <br/>
                                  <InputMask
                                      name={`cardcvv`}
                                      mask= {values.creditCardNumber.substr(0,1) === '3'?"9999":"999" }
                                      onChange={handleChange}                      
                                      onBlur={handleBlur}
                                      value={values.cardcvv}
                                      placeholder="MM/YY"
                                      >
                                      {() => (
                                          <TextField
                                          type="text"
                                          name="cardcvv"
                                          variant="outlined"
                                          size="small" 
                                          />
                                      )}
                                  </InputMask>
                                  {validMessage(`cardcvv`)}
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>   
                                  <RegularTextFieldSmall
                                      name={`cardHolderName`}
                                      type="text"
                                      value={values.cardHolderName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      label= {'Quote.CardHolderName'}
                                      autoComplete="name"
                                      // style={{ width: '100%' }}
                                  />
                                  {validMessage(`cardHolderName`)}
                              </Grid>
                              
                          </Grid>                            

                      </Grid>

                    </Grid>

                    <Grid item container style={{ justifyContent:'end', marginBottom:'3vh' }}>
                      <Button type='submit' color="dark">
                          <Text tid={"Button.ProceedApplication"}/>
                      </Button>
                    </Grid>

                </Form>
                )}
            </Formik>
          </main>
        </Grid>
      </Grid>
    </>
    )
} else {
    return( 
        <SubmitResult
            formData={formData}
        />   
    )
  
}}

export default Payment
