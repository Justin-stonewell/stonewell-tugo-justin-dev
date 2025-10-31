import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { sellAllianzPolicy } from '../../../../redux/actions/travelApplicationAction';
//custom component
import Button from '../../../../components/common/CustomButtons/Button'
import { Grid } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// functionalities
// import { amountFormat } from '../../../../controllers/dataFormat';

const AllianzSellSubmitResult = (props) => {
  const { id, formData, result } = props;

  const dispatch = useDispatch();
  const sellAllianzPolicyResult  = useSelector((state) => state.travelApplicationReducer.sellAllianzPolicyResult)
  const sellAllianzPolicyLoading = useSelector(state => state.travelApplicationReducer.sellAllianzPolicyLoading)
  // const sellAllianzPolicyError = useSelector(state => state.travelApplicationReducer.sellAllianzPolicyError)

 
  useEffect(()=>{
      dispatch(sellAllianzPolicy({application_id:id, data: formData})) 
  }, [dispatch, id, formData]);



  // const contents = (!sellAllianzPolicyError && !sellAllianzPolicyLoading ) ? sellAllianzPolicyResult[0].content : null
  // const quotes = !sellAllianzPolicyError && !sellAllianzPolicyLoading && (sellAllianzPolicyResult.length>0 || sellAllianzPolicyResult.status === 'error') ? sellAllianzPolicyResult[0].offerCategories : null
  
  // console.log('sellAllianzPolicyResult.content:', sellAllianzPolicyResult[0].content)
  // console.log('sellAllianzPolicyResult.length:', sellAllianzPolicyResult.length)
  // console.log('sellAllianzPolicyResult.hasErrors:', sellAllianzPolicyResult[0].hasErrors)
  // console.log('contents:',contents)  
  
  return(
    <Grid container style={{ margin: '2vh 0 3vh 0' }} spacing={3}>
      {sellAllianzPolicyLoading 
        ?
        <Grid item xs={12}>
          <Alert severity='info'>   
              <AlertTitle>Processing Allianz API</AlertTitle>
                Selling Policies... 
          </Alert>
        </Grid>
        :null
      }

      { !sellAllianzPolicyLoading && (sellAllianzPolicyResult.length>0 || sellAllianzPolicyResult.status === 'error') &&
        <>
          <Grid item xs={12}>
                  <>
                  {/* If Policy purchased */}
                  {!sellAllianzPolicyResult.status && sellAllianzPolicyResult[0].content.policyNumber ?
                        <>
                          <React.Fragment>
                                <Grid item xs={12} style={{marginTop:'1vh'}}>
                                      <Alert severity= 'success' >
                                              <AlertTitle>Policy Number : {sellAllianzPolicyResult[0].content.policyNumber}</AlertTitle>  
                                            {console.log('sellAllianzPolicyResult:',sellAllianzPolicyResult[0].content.policyNumber)}
                                              <Grid item container spacing={1}>                  
                                                {sellAllianzPolicyResult[0].content && (
                                                  <React.Fragment>
                                                    <Grid item container spacing={1} style={{ marginBottom:'5vh', fontWeight:'700' }}>
                                                      <Grid item xs={12} sm={12} md={6}>
                                                        {sellAllianzPolicyResult[0].content.coverage.product.name} - 
                                                        {sellAllianzPolicyResult[0].content.coverage.product.productCode}
                                                      </Grid>
                                                      <Grid item xs={12} sm={12} md={6}>
                                                        Total: ${sellAllianzPolicyResult[0].content.coverage.total}
                                                      </Grid>
                                                    </Grid>

                                                    {sellAllianzPolicyResult[0].content.coverage.insured.map((insured, insuredIndex)=>(
                                                            <React.Fragment key ={insuredIndex}>
                                                              <Grid item xs={12} sm={12} md={6}>{insured.insured.dateOfBirth} ({insured.insured.age} yrs)</Grid>
                                                              <Grid item xs={12} sm={12} md={6}>Premium : ${`${insured.premium}`}</Grid>
                                                            </React.Fragment>
                                                      ))}
                                                  </React.Fragment>
                                                )}

                                              </Grid>
                                    </Alert>
                                </Grid>
                          </React.Fragment> 
                        </>
               
                  :null
                  }

                {sellAllianzPolicyResult.status === "error" ?
                  <Grid item xs={12} style={{marginTop:'1vh'}}>
                    <Alert severity='error' >
                      <AlertTitle>Error</AlertTitle>
                      Policy has not been issued!
                    </Alert>
                  </Grid>
                :null}
                
</>
            
          </Grid>
          <Grid container justifyContent="center" >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                var sellingResult = '' 
                if(sellAllianzPolicyResult.length > 0 ){
                  sellingResult = sellAllianzPolicyResult[0].content.policyIssued === true ? 'success' : 'error';
                }                 
                result(sellingResult)
              }}
            >
              OK
            </Button>
          </Grid>
        </>
      }

    </Grid>
  );

};

export default AllianzSellSubmitResult;