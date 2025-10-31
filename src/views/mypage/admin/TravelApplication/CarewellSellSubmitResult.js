import React from 'react';
// import { useSelector } from 'react-redux';

//custom component
import Button from '../../../../components/common/CustomButtons/Button';
import { Grid } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const CarewellSellSubmitResult = (props) => {
  const { result } = props;

  console.log('result 2', result)

  return (
      <Grid container style={{ margin: '2vh 0 3vh 0' }} spacing={3}>
      {result.status === 'loading' && (
        <Grid item xs={12}>
          <Alert severity='info'>
            <AlertTitle>Processing</AlertTitle>
            Selling Carewell by Stripe API..
          </Alert>
        </Grid>
      )}
      {result.status === 'error' && (
        <Grid item xs={12}>
          <Alert severity='error'>
            <AlertTitle>Error</AlertTitle>
            Payment failed : {result.message}
          </Alert>
        </Grid>
      )}
      {result.status === 'success' && (
        <>
          <Grid item xs={12}>
            Result from Carewell Stripe API
            <React.Fragment>
              <Grid item xs={12} style={{ marginTop: '1vh' }}>
                <Alert severity='success'>
                  <AlertTitle>{result.message}</AlertTitle>
                </Alert>
              </Grid>
            </React.Fragment>
          </Grid>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {window.location.reload()}}
            >
              OK
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CarewellSellSubmitResult;
