import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form } from 'formik'
// import * as Yup from 'yup'
// import * as Validation from '../../../Validation'
// core components
// import { MdClose } from 'react-icons/md'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, Container, CssBaseline,
          Grid, Typography, Checkbox, FormControlLabel
          // IconButton,
} from '@material-ui/core'
import {blue} from '@material-ui/core/colors'
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField'
// import { Text } from '../../../../components/common/LanguageProvider' 
import SubmitResultQuote from './SubmitResultQuote'
// icon
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    padding: theme.spacing(1)
  },
  label: { 
    marginTop: theme.spacing(2),
    fontWeight:"700"
  },
  searchFileIcon: {
    color: blue[900],
    marginTop: theme.spacing(2),
    fontWeight:"1000"
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(3, 0, 2),
  },
}))




const UpdateQuoteModal = (props) => {
  // const { updateData, statusProcess, statusCodes, open, setOpen, onConfirm } = props
  const { updateTravelQuote, open, setOpen, onConfirm } = props
  // console.log(props)
  // console.log(updateTravelQuote)
  const classes = useStyles()

  const [submitted, setSubmitted] = useState(false)
  const [quoteId, setQuoteId] = useState('')
  const [updateFormData, setUpdateFormData] = useState([])
  
  // console.log('updateTravelQuote', updateTravelQuote[0])
  // formik - initialValues
  function initialValues(){
    const data = {
      ...updateTravelQuote[0],
      emailTravelQuote: false
    }
    return data
  }


  function handleUpdateResult(result){
    setSubmitted(false)
    setQuoteId()
    onConfirm(result)
    setOpen(false)
  }
  
  // handleSubmit
  const handleSubmit = async (values) => {
    setSubmitted(true)
    setUpdateFormData(values)
    setQuoteId(values.quote_id)
}

const handleClose = () => {
  setOpen(false)
}


  return (
    <>
      <Dialog
        open={open}
        // onClose={() => setOpen(false)}
        // onClose={handleClose}
        // maxWidth="md"
        fullWidth={true}
        aria-labelledby="max-width-dialog-title"
      >
        {/* <MuiDialogTitle disableTypography className={classes.root}> */}
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            Update Quote - {updateTravelQuote[0].application_id}
          </Typography>
          {/* <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <MdClose />
          </IconButton> */}
        </MuiDialogTitle>

        <Container component="main" maxWidth="md">
          <CssBaseline />
          <div className={classes.paper}>

            <Formik
              initialValues={initialValues()}
              // validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
                <Form className={classes.form}>
                  {/* {console.log('errors',errors)} */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {/* {updatedApplication.message} */}
                    </Grid>
                      {/* {console.log(updateTravelQuote)} */}

                        <Grid item container>
                            <React.Fragment>

                              {/* Insured Name */}
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle1" style={{paddingTop:'2vh', paddingLeft:'1vh'}}>
                                  <strong>{`${values.firstname} ${values.lastname} `}</strong>
                                </Typography>
                              </Grid> 

                              {/* Quote By Company  - Allianz, TuGo, BlueCross */}
                                <Grid item xs={12} md={9}>
                                    <RegularTextField
                                      name="allianz"
                                      defaultValue={values.allianz}
                                      // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                                      label= {'Allianz'}
                                      placeholder = '$'
                                      onChange={handleChange}
                                      onBlur={(e)=>{
                                        setFieldValue('allianz', e.currentTarget.value)
                                      }}
                                    />
                                  {/* {validMessage(`insuredpersons.${index}.quoteAllianz`)} */}
                                </Grid>

                                <Grid item xs={12} md={3}></Grid>
                                
                                <Grid item xs={12} md={9}>
                                    <RegularTextField
                                      name="tugo"
                                      defaultValue={values.tugo}
                                      // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                                      label= {'TuGo'}
                                      placeholder = '$'
                                      onChange={handleChange}
                                      onBlur={(e)=>{
                                        setFieldValue('tugo', e.currentTarget.value)
                                      }}
                                    />
                                  {/* {validMessage(`insuredpersons.${index}.quoteAllianz`)} */}
                                </Grid>

                                <Grid item xs={12} md={3}></Grid>

                                <Grid item xs={12} md={9}>
                                    <RegularTextField
                                      name="bluecross"
                                      defaultValue={values.bluecross}
                                      // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                                      label= {'BlueCross'}
                                      placeholder = '$'
                                      onChange={handleChange}
                                      onBlur={(e)=>{
                                        setFieldValue('bluecross', e.currentTarget.value)
                                        console.log(values)
                                      }}
                                    />
                                  {/* {validMessage(`insuredpersons.${index}.quoteAllianz`)} */}
                                </Grid>
                                
                                
                            </React.Fragment>
                        </Grid>

                        <Grid item container>
                               
                        <FormControlLabel
                          style={{ marginRight: '2vh'}}
                          value={values.emailTravelQuote}
                          control={
                            <Checkbox
                              checked={values.emailTravelQuote}
                              onChange={(event) => {
                                setFieldValue('emailTravelQuote', event.target.checked);
                              }}
                              icon={<CircleUnchecked />}
                              checkedIcon={<CircleCheckedFilled />}
                            />
                          }
                          label="Send Vendor Email with Travel Quote"
                        />

                              
                        </Grid>


                  </Grid>
                  
                  {submitted === false &&
                    <div className={classes.submitArea}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '2vh' }}
                        className={classes.submit}
                        // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                      >
                        Update
                        {/* <Text tid={'Button.Save'}/> */}
                      </Button>
                      <Button
                        color="secondary"
                        className={classes.submit}
                        onClick={() => {handleClose(false)}}
                      >
                        Close
                        {/* <Text tid={'Button.Close'}/> */}
                      </Button>
                    </div>
                  }

                </Form>
              )}
            </Formik>

            {submitted === true && quoteId &&
              <SubmitResultQuote
                id={quoteId}
                updateFormData={updateFormData}
                result = {handleUpdateResult}
              />
            }

          </div>
        </Container>
      </Dialog>
    </>
  )
}

export default UpdateQuoteModal