import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { updateTravelQuoteOver60 } from '../../../../redux/actions/travelQuotesOver60';
//custom component
import Button from '../../../../components/common/CustomButtons/Button'
import { Grid } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const SubmitResultQuote = (props) => {
  const { id, updateFormData, result } = props;

  const dispatch = useDispatch();
  const updatedTravelQuoteOver60  = useSelector((state) => state.travelQuotesOver60Reducer.updatedTravelQuoteOver60)
  const UpdatedLoading = useSelector(state => state.travelQuotesOver60Reducer.UpdatedLoading)
  const UpdatedError = useSelector(state => state.travelQuotesOver60Reducer.UpdatedError)


  useEffect(()=>{
    dispatch(updateTravelQuoteOver60({quote_id:id, data: updateFormData})) 
  }, [dispatch, id, updateFormData]);
    
  
  return(
    <Grid container style={{ margin: '2vh 0 3vh 0' }} spacing={3}>

      {UpdatedLoading 
        ?
        <Grid item xs={12}>
          <Alert severity='info'>   
              <AlertTitle>Processing</AlertTitle>
                The Travel Quote is updating... 
          </Alert>
        </Grid>
        :null
      }

      {!UpdatedError && !UpdatedLoading && updatedTravelQuoteOver60.status &&
        <>
          <Grid item xs={12}>
              <Alert severity={updatedTravelQuoteOver60.status} >
                <AlertTitle>{updatedTravelQuoteOver60.status}</AlertTitle>
                {updatedTravelQuoteOver60.message }
              </Alert>
          </Grid>
          <Grid container justifyContent="center" >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                result(updatedTravelQuoteOver60.status)
              }}
            >
              OK
            </Button>
          </Grid>
        </>
      }
    </Grid>
  );
  // }
};

export default SubmitResultQuote;