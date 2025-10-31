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
  const sellAllianzPolicyError = useSelector(state => state.travelApplicationReducer.sellAllianzPolicyError)

  console.log('sellAllianzPolicyResult:',sellAllianzPolicyResult)

  // const content = (!sellAllianzPolicyError && !sellAllianzPolicyLoading && sellAllianzPolicyResult) ? sellAllianzPolicyResult[0].content : null
  // const quotes = !sellAllianzPolicyError && !sellAllianzPolicyLoading && (sellAllianzPolicyResult.length>0 || sellAllianzPolicyResult.status === 'error') ? sellAllianzPolicyResult[0].offerCategories : null
  // console.log('sellAllianzPolicyResult[0].content:', sellAllianzPolicyResult.content)
  // console.log('sellAllianzPolicyResult.length:', sellAllianzPolicyResult.length)
  // console.log('sellAllianzPolicyResult.hasErrors:', sellAllianzPolicyResult.hasErrors)
  // console.log('content:',content)

  useEffect(()=>{
      dispatch(sellAllianzPolicy({application_id:id, data: formData})) 
  }, [dispatch, id, formData]);
    
  
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

      {!sellAllianzPolicyError && !sellAllianzPolicyLoading && sellAllianzPolicyResult[0].hasErrors === false &&
        <>
          <Grid item xs={12}>
   
              {/* If Policy purchased */}
              {/* {sellAllianzPolicyResult[0].content.policyIssued === true ? */}
                    <>
                      <React.Fragment>
                            <Grid item xs={12} style={{marginTop:'1vh'}}>
                                  <Alert severity= 'success' >
                                          <AlertTitle>{sellAllianzPolicyResult[0].content.userMessage} : {sellAllianzPolicyResult[0].content.coverage.policyNumber}</AlertTitle>  
                                        
                                          <Grid item container spacing={1}>                  
                                            {sellAllianzPolicyResult[0].content.length > 0 && 
                                              sellAllianzPolicyResult[0].content.coverage.map((coverage, coverageIndex) => (
                                                  <React.Fragment key ={coverageIndex}>
                                                        
                                                        {coverage.product.map((product, productIndex)=>(
                                                          <React.Fragment key ={productIndex}>
                                                            <Grid item container spacing={1}>
                                                              <Grid item xs={9}>
                                                                {product.name} - {product.productCode}
                                                              </Grid>
                                                              <Grid item xs={9}>
                                                                Total : ${`${coverage.total}`}
                                                              </Grid>
                                                            </Grid>
                                                          
                                                          </React.Fragment>
                                                        ))}

                                                        {coverage.insured.map((insured, insuredIndex)=>(
                                                              <React.Fragment key ={insuredIndex}>
                                                                <Grid item xs={12}>{insured.insured.dateOfBirth}</Grid>
                                                                <Grid item xs={3}>Premium : ${`${insured.premium}`}</Grid>
                                                              </React.Fragment>
                                                        ))}

                                                  </React.Fragment>
                                              ))
                                            }
                                          </Grid>
                                </Alert>
                            </Grid>
                      </React.Fragment> 
                    </>
            {/* :null} */}

            {sellAllianzPolicyResult[0].hasErrors === false&&
              <Alert severity='error' >
                <AlertTitle>Error</AlertTitle>
                Policy has not been issued!
              </Alert>
            }

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