import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
// core components 
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
// components
import SubmitResult from './SubmitResult';
import ClaimModal from './ClaimModal';

const useStyles = makeStyles((theme) => ({
  form: {
    width: 'auto',
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    boxShadow: '0 3px 15px #00000014',
    border: '1px solid #dadada',
    borderRadius: '0',
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));


export default function ClaimRequest(props) {

  const { application, insuranceClaim, selectedPerson, open, handleClose } = props;

  const classes = useStyles();

  const [openSuccessSubmit, setOpenSuccessSubmit] = useState(false)
  const [claimFormData, setClaimFormData] = useState([])

  const isSubmited = () => {
    setOpenSuccessSubmit(true)
  }

  return (
    <>
    {/* <QuoteBanner title={bannerTitle} subTitle={subTitle} links={links} /> */}
    <Grid container justifyContent="center" >
      <Grid item xs={12} sm={10} md={8} lg={6}>
      <main className={classes.form}>
          <Paper className={classes.paper}>
          {openSuccessSubmit === false 
            ?
              <ClaimModal 
                  application = {application}
                  insuranceClaim = {insuranceClaim}
                  selectedPerson = {selectedPerson}
                  open={open}
                  handleClose={handleClose}

                  isSubmited={isSubmited}
                  claimFormData={setClaimFormData} // 상태 자체를 전달합니다.
                  // setClaimFormData={setClaimFormData} // 상태를 업데이트하는 함수를 전달합니다.
              />
            :
              <SubmitResult
                  formData={claimFormData}
              />
            }
          </Paper>
      </main>
      </Grid>
    </Grid>
    </>
  )
}
