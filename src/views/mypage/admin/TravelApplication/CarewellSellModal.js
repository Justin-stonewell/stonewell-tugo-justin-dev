import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, DialogContent, Grid, Typography } from '@material-ui/core'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// import { blue } from '@material-ui/core/colors'
import Button from '../../../../components/common/CustomButtons/Button'
import { Text } from '../../../../components/common/LanguageProvider'
import CarewellSellSubmitResult from './CarewellSellSubmitResult'
import { amountFormat } from '../../../../controllers/dataFormat'

import API_URL from '../../../../utils/api_url'

// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
//stripe
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import dotenv from 'dotenv';

// dotenv.config();

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const useStyles = makeStyles((theme) => ({
  // 스타일 정의
}));

const CarewellSellModal = (props) => {
  const { sellCarewellData, user, open, setOpen } = props
  const classes = useStyles()
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')
  const [sellFormData, setSellFormData] = useState([])
  const [clientSecret, setClientSecret] = useState(null)
  // const [clientSecret, ] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sellResult, setSellResult] = useState({ status: 'loading', message: '' });
  const [errorMessage, setErrorMessage] = useState(null);

  const stripe = useStripe();
  const elements = useElements();
  
  const handleClose = () => {
    setOpen(false)
  }

  // const handleSellCarewellResult = (result) => {
  //   setSubmitted(false)
  //   setApplicationId('')
  //   setSellFormData([])
  //   onConfirm(result)
  //   setOpen(false)
  // }

  // // handleSubmit
  // const handleSubmit = async () => {
  //   // request update data to backend
  //   sellCarewellData.userID = user;
  //   setSubmitted(true)
  //   setSellFormData(sellCarewellData)
  //   setApplicationId(sellCarewellData.application_id)
  // }
 
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      sellCarewellData.userID = user;
      console.log('sellCarewellData', sellCarewellData);
  
      // Stripe에서 paymentMethodId 생성
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: sellCarewellData.payment[0].cardHolderName,
          address: {
            postal_code: '12312',
          },
        },
      });
  
      if (error) {
        console.error('Error creating payment method:', error);
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }
  
      sellCarewellData.payment[0].paymentMethodId = paymentMethod.id;
  
      const response = await fetch(`${API_URL}api/v1/travel_applications/sell/carewell/application_id=${sellCarewellData.application_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellCarewellData),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // 에러 메시지를 텍스트로 읽기
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const result = await response.json();
  
      console.log('result', result);
  
      if (result.status === 'success') {
        setApplicationId(sellCarewellData.application_id);
        setSellFormData(sellCarewellData);
        setClientSecret(result.clientSecret); // clientSecret 설정
  
        console.log('Payment requested or no payment required.');
  
        setSubmitted(true);
        setSellResult({ status: 'success', message: 'Carewell Stripe Payment processed' })
      } else {
        console.error('Carewell Stripe Payment request failed:', result.message);
        if (result.error) console.error('Error details:', result.error);
        setSellResult({ status: 'error', message: result.message });
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error Carewell Stripe request payment :', error);
      setSellResult({ status: 'error', message: error.message });
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
    <Dialog
      fullScreen
      open={open}
      fullWidth={true}
      aria-labelledby="max-width-dialog-title"
    >
      <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#ffbb00'}}>
        <Typography style={{color:'#fff', fontSize:'18px'}}>
          Sell Carewell - {sellCarewellData.application_id}
        </Typography>
        <Typography style={{color:'#fff', fontSize:'18px'}}>
          {`( ${sellCarewellData.vendor_name} )`}
        </Typography>
      </MuiDialogTitle>

      <DialogContent style={{ padding:'1' }}>
        <Grid container>
          <div className={classes.paper}>
            <Grid item container spacing={2} style={{ padding:'0 5vh' }}>
              <Grid item sm={7}>
                {sellCarewellData.application_id && (
                  <>
                    {sellCarewellData.insuredpersons.map(row => (
                      <React.Fragment key={row.insuredPersonID}>                      
                        <Grid item container style={{ border:'1px solid #ddd', height:'fit-content', marginTop:'1vh', marginBottom:'1vh', padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                        <Grid item container xs={12} sm={12} md={4} lg={4}>
                              {row.originCountryCode === 'CA' 
                                ? (
                                  <>
                                    <Grid item xs={6}>
                                      <span style={{ color:'#666' }}><Text tid={'TravelApplication.OriginProvince'} /></span>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <span style={{ fontWeight:'700' }}>{row.originProvince}</span>
                                    </Grid>
                                  </>
                                ) : null
                              }
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'TravelApplication.Destination'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.destCountry}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'TravelApplication.DestinationState'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.destProvince}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.TripArrivalDate'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.arrivalDate}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.TripStartDate'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.tripStartDate}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.TripEndDate'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.tripEndDate}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.CoverageDays'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.tripPeriod} <Text tid={'Quote.Days'}/></span>
                              </Grid>
                            </Grid>

                            <Grid item container xs={12} sm={12} md={4} lg={4}>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.FullName'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.lastName}, {row.firstName}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.Gender'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.gender}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.BirthDate'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.birthdate}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.Age'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.age}</span>
                              </Grid>
                            </Grid>

                            <Grid item container xs={12} sm={12} md={4} lg={4}>
                              <Grid item xs={12}>
                                <span style={{ fontWeight:'700' }}>{`${row.compnayName} ${row.planName}`}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'TravelApplication.Coverage'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{amountFormat(row.coverage, 0)}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.Deductible'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{amountFormat((parseFloat(row.deductible)),2)}</span>
                              </Grid>
                              {row.tripType === "MULTI" ? (
                                <>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#666' }}><Text tid={'TravelApplication.MultiDays'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700' }}>{row.multiTripDays}</span>
                                  </Grid>
                                </>
                              ) : null}
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Vendor.Step3.TotalPremium'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{amountFormat(row.insuranceAmount, 2)}</span>
                              </Grid>

                              {row.optionPlan.map((op, index) => (
                                <Grid item container key={index} style={{ marginBottom:'1vh' }}>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#666' }}>{op.optionPlanName}</span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700' }}>{amountFormat(op.optionPlanCoverage, 0)}</span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#666' }}><Text tid={'Vendor.Step3.TotalPremium'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700' }}>{amountFormat((parseFloat(op.optionPlanPrice)),2)}</span>
                                  </Grid>
                                </Grid>
                              ))}
                              {row.carewellService ? (
                                <>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#ffbb00' }}><Text tid={'Vendor.Step4.CarewellSelection'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700', color:'#ffbb00' }}>{row.carewellService}</span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#ffbb00' }}><Text tid={'Vendor.Step3.TotalCarewellAmount'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700', color:'#ffbb00' }}>{amountFormat((parseFloat(row.carewellServiceAmount)),2)}</span>
                                  </Grid>
                                </>
                              ) : null}
                            </Grid>
                        </Grid>
                      </React.Fragment>
                    ))}
                    <Grid item container style={{display: 'flex',justifyContent: 'flex-end', padding:'1vh', fontSize:'12px', fontWeight:'500', color:'#ffbb00' }}>
                      Total Service Fee : {amountFormat((sellCarewellData.total_amount - sellCarewellData.insuredpersons.reduce((a, v) => a = a + parseFloat(v.insuranceAmount + v.optionPlanPrice), 0) - (sellCarewellData.familyGroup ? sellCarewellData.familyGroup.discountPremium : 0)), 2)}
                    </Grid>
                    <Grid item container style={{ border:'1px solid #ddd', height:'fit-content', padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid item container>
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'Quote.PaymentMethod'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{sellCarewellData.payment[0].paymentMethod}</span>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Grid item container>
                          {sellCarewellData.payment[0].paymentMethod === 'Creditcard' && sellCarewellData.payment[0].creditCardNumber && (
                            <>
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid item container>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.CardHolderName'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700' }}>{sellCarewellData.payment[0].cardHolderName}</span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.CardExpiration'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700' }}>{sellCarewellData.payment[0].cardExpired}</span>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid item container>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.CreditCardNumber'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700' }}> {sellCarewellData.payment[0].creditCardNumber} </span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.CardCVV'} /></span>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <span style={{ fontWeight:'700' }}> {sellCarewellData.payment[0].cardcvv} </span>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>

                    </Grid>

                    <Grid item xs={12} style={{ margin:'2vh' }}>
                      <CardElement />
                    </Grid>

                    {errorMessage && sellResult.status !== 'success'&& (
                      <Grid item xs={12} style={{ margin:'2vh 0' }}>
                        <Alert severity='error'>
                          <AlertTitle>Error</AlertTitle>
                          {errorMessage}
                        </Alert>
                      </Grid>
                    )}

              {submitted === false && (
                <div className={classes.submitArea}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '2vh' }}
                    className={classes.submit}
                    disabled={isSubmitting || !(sellCarewellData.app_status === 'Pending' || sellCarewellData.app_status === 'Accepted')}
                    // onClick={handleSellCarewellResult}
                    onClick={() => {handleSubmit()}}
                  >
                    Sell
                  </Button>
                  <Button
                    color="secondary"
                    className={classes.submit}
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Close
                  </Button>
                </div>
              )}

                  </>
                )}
              </Grid>

              

              <Grid item sm={5}>
                {submitted === true && applicationId && (
                  <CarewellSellSubmitResult
                    id={applicationId}
                    formData={sellFormData}
                    result={sellResult}
                    clientSecret={clientSecret}
                  />
                )}
              </Grid>
            </Grid>

            
          </div>
        </Grid>
        
      </DialogContent>
    </Dialog>
    </>
  );
};

export default CarewellSellModal;