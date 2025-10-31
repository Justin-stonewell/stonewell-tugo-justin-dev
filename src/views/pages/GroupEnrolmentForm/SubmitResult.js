import React, { useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { postGroupEnrolment } from '../../../redux/actions/groupEnrolmentAction';
//core component
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'


const SubmitResult = (props) => {
  const { formData } = props;

  const dispatch = useDispatch();
  const result = useSelector(state => state.groupEnrolmentReducer.result)
  const error = useSelector(state => state.groupEnrolmentReducer.error)
  const loading = useSelector(state => state.groupEnrolmentReducer.loading)



  useEffect(()=>{
    dispatch(postGroupEnrolment(formData))     
  }, [dispatch,formData]);

  if(loading) return (
    <div>
      <CircularProgress />
    </div>
    )
  if(error && !loading) return(<ErrorPage/>)

  return(
    <>
      { result && 
        result.status === 'success'
        ? (
          <Submission
            confirmationNo={result.data}
            submissionType={'enrolment'}
          />
        ):(
          <ErrorPage/>
        ) 
      } 
    </>
  );

};

export default SubmitResult;