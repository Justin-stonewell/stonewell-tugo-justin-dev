import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles'
// form & validation
import { Formik, Form } from 'formik'
// import * as yup from 'yup'
// import * as Validation from '../../../Validation'

// redux
// import { useSelector } from 'react-redux';
// core components
import {
  Dialog, DialogContent, 
  Typography, Grid
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

import { MdClose } from 'react-icons/md'
import { IconButton } from "@material-ui/core";
// components
import { Text } from "../../../../components/common/LanguageProvider";
import Button from '../../../../components/common/CustomButtons/Button';
// import { SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall';
// import { Alert } from '@material-ui/lab';
// import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField';
//style
import formStyle from "../../../../assets/jss/styles/formStyle";
import SubmitResult from './SubmitResult';


const useStyles = makeStyles(formStyle)

// Validation
// const validationSchema = yup.object({
//   ghipNumber: Validation.validRequiredField().nullable(),
//   //   effectiveDate: Validation.validRequiredDateField().nullable(),
//   claimFormFiles: Validation.validRequiredChooseFile().nullable(),
//   medicalDocuments: Validation.validRequiredChooseFile().nullable(),
//   arrivalProofFiles: Validation.validRequiredChooseFile().nullable(),
// })

// ValidMessage
// function validMessage(fieldName) {
//     return (
//         <ErrorMessage
//             name={fieldName}
//             render={(msg) => 
//                 <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
//                     <Text tid={`Validation.${msg}`}></Text>
//                 </div>
//             }
//         />
//     );
// }


const ClaimModal = (props) => {
  const { application, selectedPerson, open, handleClose } = props;

  // var today = new Date().toISOString().substring(2, 10).replace(/-/g, '');
console.log('selectedPerson', selectedPerson)
console.log('application', application)

const crypto = require('crypto')

const initialData = {
  application: application,
  selectedPerson: selectedPerson,
  applicationId: application.application_id,
  insuredPersonId: selectedPerson.insuredPersonID,
  claimNumber: '',
  submitDate: new Date().toISOString().split('T')[0],
  resultDate: '',
  claimStatus: 'Open',
  ghipNumber: '',
  vendorId: application.vendor_id
  // selectedPerson이 단일 객체라면 배열이 아닌 객체를 직접 사용합니다.
  // attachments: {
  //   insuredPersonId: selectedPerson.insuredPersonID,
  //   claimFormFiles: [],
  //   medicalDocuments: [],
  //   arrivalProofFiles: []
  // }
};


  const classes = useStyles()

  // console.log(insuranceClaim, application, selectedPerson)
  
  const claimTypeOpt = [
    {name:'Medical'},
    {name:'Dental'},
    {name:'Prescription Glasses'}
  ]

  const [claimFormData, setClaimFormData] = useState([])

  const [claimType, setClaimType] = useState('Medical')

  // const claimForm= selectedPerson.documents.filter(f=>f.document_type === 'Claim')
  let claimForm = [];

  if (selectedPerson.compnayName === "Tugo") {
      // Tugo 회사일 때의 로직
      if (["PLCSMED005", "PLCSMED006", "PLCMMED003"].includes(selectedPerson.planId)) {
          // planId가 특정 값 중 하나일 때
          if (claimType === 'Medical') {
              // Medical 클레임 타입일 때
              const matchingProvinceDocuments = selectedPerson.documents.filter(f =>
                  f.document_type === 'Claim' && f.province === selectedPerson.originProvince
              );
  
              if (matchingProvinceDocuments.length > 0) {
                  // originProvince와 일치하는 문서가 있을 경우
                  claimForm = matchingProvinceDocuments;
              } else {
                  // 일치하는 문서가 없을 경우, 'Other'인 문서를 선택
                  claimForm = selectedPerson.documents.filter(f =>
                      f.document_type === 'Claim' && f.province === 'Other'
                  );
              }
          } else if (claimType === 'Dental') {
              // Dental 클레임 타입일 때
              claimForm = selectedPerson.documents.filter(f =>
                  f.document_type === 'Claim' && f.document_url === "Claim-Form/TuGo-Canadian-Travel-Dental.pdf"
              );
          } else if (claimType === 'Prescription Glasses') {
              // Prescription Glasses 클레임 타입일 때
              claimForm = selectedPerson.documents.filter(f =>
                  f.document_type === 'Claim' && f.document_url === "Claim-Form/TuGo-Canadian-Travel-Glasses.pdf"
              );
          }
      } else {
          // planId가 특정 조건에 해당하지 않을 때는 모든 Claim 문서를 선택
          claimForm = selectedPerson.documents.filter(f => f.document_type === 'Claim');
      }
  } else {
      // Tugo 회사가 아닐 때의 로직
      claimForm = selectedPerson.documents.filter(f => f.document_type === 'Claim');
  }
  
  const claimFormLink = process.env.REACT_APP_S3_URL+claimForm[0].document_url

  const [openSuccessSubmit, setOpenSuccessSubmit] = useState(false)

  const isSubmited = () => {
    setOpenSuccessSubmit(true)
  }

  const handleSubmit = async (values) => {
    const formData = Object.keys(values).reduce((formData, key) => {
      formData.append(key, values[key])
      return formData
  }, new FormData())



    // 파일 이름에서 확장자를 추출하는 정규식
  var reg = /(?:\.([^.]+))?$/;
  // 현재 날짜를 'YYMMDD' 형식으로 변환
  var today = new Date().toISOString().substring(2, 10).replace(/-/g, '');

  const confirmationNo = crypto.createHash('md5').update(new Date().toISOString()).digest('hex').toString().substring(0,10);

  // requiredFiles 배열을 초기화
  const requiredFiles = [];

  // claimFormFiles 처리
  formData.delete('claimFormFiles')
  if (values.claimFormFiles) {
      const fileName = `ClaimDocument/Claim_Form-${today}-${confirmationNo}.${reg.exec(values.claimFormFiles.name)[1]}`;
      requiredFiles.push(fileName);
      formData.append('claimFormFiles', values.claimFormFiles, fileName);
  }

  // medicalDocuments 처리
  formData.delete('medicalDocuments')
  if (values.medicalDocuments) {
      const fileName = `ClaimDocument/Med_Receipt-${selectedPerson.firstName}_${selectedPerson.lastName}-${today}-${confirmationNo}.${reg.exec(values.medicalDocuments.name)[1]}`;
      requiredFiles.push(fileName);
      formData.append('medicalDocuments', values.medicalDocuments, fileName);
  }

  // arrivalProofFiles 처리
  formData.delete('arrivalProofFiles')
  if (values.arrivalProofFiles) {
    const fileName = `ClaimDocument/ArrivalProof-${selectedPerson.firstName}_${selectedPerson.lastName}-${today}-${confirmationNo}.${reg.exec(values.arrivalProofFiles.name)[1]}`;
    requiredFiles.push(fileName);
    formData.append('arrivalProofFiles', values.arrivalProofFiles, fileName);
}

  // selectedPerson 객체에 requiredFiles 배열을 JSON 문자열로 추가
  const selectedPersonData = {
    selectedPerson: selectedPerson,
    insuredPersonId: values.selectedPerson.insuredPersonID, // 예시로 적용된 필드 이름
    requiredFiles: requiredFiles
  };

  formData.delete('selectedPerson')
  formData.append('selectedPerson', JSON.stringify([selectedPersonData]));


    console.log('formData', formData)
    // 로그 출력
    for (let value of formData.entries()) {
      console.log(value)
    }
    
    // 상태 설정 및 액션 dispatch
    setClaimFormData(formData);
    isSubmited(true);
  };

  // For claimType Radio
  const handleChange = (event) => {
    setClaimType(event.target.value);
  };

  return (
    <>
      <Dialog 
        fullWidth={true}
        // maxWidth="md"
        open={open} 
        onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
            {/* {values.paymentMethod === 'Creditcard'? 'Credit Card': 'E-transfer'}  */}
            {/* <Text tid={'Dashboard.HowToClaim'}/> */}
            청구하기
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {handleClose(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>

        <DialogContent>

              <Formik
                  initialValues={initialData}
                  // validationSchema={validationSchema}
                  onSubmit={handleSubmit}
              >
                  {({ values, setFieldValue, handleBlur }) => (
                      <Form>

                        <Grid item container>

                          <Grid item container style={{ margin:'2vh 0' }}>

                            <Typography variant="h4" gutterBottom>
                                <Text tid={'1. 청구하실 의료비용의 종류를 선택하세요.'} />
                            </Typography>

                            <Grid item container>
                              {claimTypeOpt.map((item) => (
                                <Grid item container key={item.name}>
                                  <input
                                    type="radio"
                                    id={item.name}
                                    name="claimType"
                                    value={item.name}
                                    checked={claimType === item.name}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor={item.name} style={{ marginLeft:'10px', paddingTop:'5px' }}>{item.name}</label>
                                </Grid>
                              ))}
                            </Grid>

                        </Grid>

                          <Grid item container style={{ margin:'2vh 0' }}>

                            <Typography variant="h4" gutterBottom>
                                <Text tid={'2. 아래 버튼을 클릭하여 클레임폼을 다운로드 후 영문으로 작성하세요.'} />
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                // disabled = {values.insuranceCompany && values.insuranceType ? false : true}
                                target="_blank"
                                href={claimFormLink}
                            >
                              Download Claim Form
                            </Button>  

                          </Grid>

                          <Grid item container style={{ margin:'2vh 0' }}>

                            <Typography variant="h4" gutterBottom>
                              <Text tid={'3. 작성하신 클레임폼을 업로드 하세요.'} />
                            </Typography>

                            <input
                              type="file"
                              name="claimFormFiles"
                              onChange={(e) => {
                                  setFieldValue('claimFormFiles',e.currentTarget.files[0])
                              }}
                            />
                            {/* {validMessage('claimFormFiles')} */}

                          </Grid>

                          <Grid item container style={{ margin:'2vh 0' }}>

                            <Typography variant="h4" gutterBottom>
                              <Text tid={'4. 병원 인보이스, 영수증, Medical Report 등을 한번에 업로드 하세요.'} />
                            </Typography>

                            <input
                              type="file"
                              name="medicalDocuments"
                              onChange={(e) => {
                                  setFieldValue('medicalDocuments',e.currentTarget.files[0])
                              }}
                            />
                            {/* {validMessage('medicalDocuments')} */}

                          </Grid>

                          <Grid item container style={{ margin:'2vh 0' }}>

                            <Typography variant="h4" gutterBottom>
                              <Text tid={'5. 가장 최근 캐나다 입국을 증명할 수 있는 서류를 업로드 하세요. (예.전자항공권 이미지, 여권 도장)'} />
                            </Typography>

                            <input
                              type="file"
                              name="arrivalProofFiles"
                              onChange={(e) => {
                                  setFieldValue('arrivalProofFiles',e.currentTarget.files[0])
                              }}
                            />
                            {/* {validMessage('arrivalProofFiles')} */}

                          </Grid>

                          {/* {selectedPerson.eligilbeIns === "CANADIAN" ?

                            <Grid item container style={{ margin:'2vh 0' }}>
                              
                              <Typography variant="h4" gutterBottom>
                                <Text tid={'6. Provincial Health Card Number(OHIP,MSP,MSI,RAMQ 등) 를 입력하세요.'} />
                              </Typography>

                              <Grid item xs={12} sm={12} md={6} lg={4}>
                              <RegularTextField
                                  name="ghipNumber"
                                  value={values.ghipNumber}
                                  onChange={(e) => {
                                      setFieldValue(`ghipNumber`, e.currentTarget.value)
                                  }}
                                  onBlur={handleBlur}
                              />
                              </Grid>
                            </Grid>

                          :null} */}

                          <Grid item container xs={12} style={{ margin:'2vh 0' }}>
                            <div className={classes.textEnd}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    disabled={
                                      !values.claimFormFiles ||
                                      !values.medicalDocuments ||
                                      !values.arrivalProofFiles ||
                                      (application.travel_direction_type === 'Outbound' && !values.ghipNumber)
                                    }
                                    className={classes.button}
                                    >
                                    Submit
                                </Button>
                            </div>
                          </Grid>

                        </Grid>
                      </Form>
                  )}
           
              </Formik>

        </DialogContent>

        
        {openSuccessSubmit === true &&
          <SubmitResult
            formData={claimFormData}
            // result = {handleUpdateResult}
          />
        }

      </Dialog>


    </>
  );
  
}

export default ClaimModal;