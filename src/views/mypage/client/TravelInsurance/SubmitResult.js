import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
// import { postContactUs } from '../../../redux/actions/contactUsAction';
import { postClaimRequest } from '../../../../redux/actions/claimAction';
//
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../../components/common/Submission';
import ErrorPage from '../../../../components/common/ErrorPage'
import WarningPage from '../../../../components/common/WarningPage'

const SubmitResult = (props) => {
  const { formData } = props;

  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  const dispatch = useDispatch();
  const result = useSelector(state => state.claimReducer.result)
  const loading = useSelector(state => state.claimReducer.loading)
  const error = useSelector(state => state.claimReducer.error)

  useEffect(()=>{
    dispatch(postClaimRequest(formData))     
  }, [dispatch,formData]);

  if(loading) return (
    <div>
      <CircularProgress />
    </div>
    )
  if(error && !loading) return(<ErrorPage/>)

  if(!error && !loading && result){
    return(
      <>
        { result && result.status && 
          (result.status === 'success' || result.status === 'warning')
            ?
              (result.status === 'success' 
                ?
                <Submission
                  confirmationNo={result.data}
                  submissionType={'request'}
                />
                :
                <WarningPage
                  warningCode= {result.warningCode}
                  message={result.message}
                />
              )
            :
              <ErrorPage/>  
        }
      </>
    );
  }
};

export default SubmitResult;