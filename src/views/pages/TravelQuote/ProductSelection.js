import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getMedicalQuestion } from '../../../redux/actions/medicalQuestions'
// form & Validation
import { Formik, Form, useFormikContext } from 'formik';

// allianz api
import { quoteAllianz } from '../../../redux/actions/travelApplicationAction';
import LoadingModal from '../TravelApplication/LoadingModal';
import store from '../../../redux/store';
// core components
import {
  Grid, Typography, Box, IconButton
  // RadioGroup, Radio,FormControlLabel, 
} from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import FormControl from '@material-ui/core/FormControl';
// import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';

// common components
import { Text } from '../../../components/common/LanguageProvider';
import { LanguageContext } from "../../../components/common/LanguageProvider";
import Button from '../../../components/common/CustomButtons/Button';
import { SelectTextField } from '../../../components/common/CustomTextFields/TextField'
//
// import StepHeader from './StepHeader';
// import {pathDirection} from './Progress';
// controllers
import { CalculateTripDays } from '../../../controllers/CalculateValue'
import { dateFormat, amountFormat } from '../../../controllers/dataFormat'
// import { calculatePackageAmount } from '../../../controllers/CalculateValue';
import { isMedicalQuestionAnswered, 
        calculateSurchargeTugoMedicalQuestion } from '../../../functionalities/MedicalQuestion';
// medical questionniar
import MedQuestionTugoForm from '../../../components/common/MedicalQuestion/MedQuestionTugoForm';
// import MedQuestionAllianzForm from '../../../components/common/MedicalQuestion/MedQuestionAllianzForm';
import MedQuestionAllianzCAN from "../../../components/common/MedicalQuestion/MedQuestionAllianzCAN";
// medical eligibility confirm
import MedEligibilityAllianzForm from '../../../components/common/MedicalQuestion/MedEligibilityAllianzForm'
// PDF Viewer
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";

// style
import formStyle from '../../../assets/jss/styles/formStyle';

//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import gmsLogo from '../../../assets/imgs/logo/gms-logo.png'
import blueCrossLogo from '../../../assets/imgs/logo/blueCross-logo.png'
import travelanceLogo from '../../../assets/imgs/logo/travelance-logo.png'

//icons
import EditIcon from '@material-ui/icons/Edit';
// import UserGreen from '../../../assets/imgs/icons/userGreen.svg'
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
// import HelpIcon from '@material-ui/icons/Help';
// import SelectedMark from '../../../assets/imgs/icons/checkMark.svg'
import TickInsideCircle from '../../../assets/imgs/icons/tickInsideCircle.svg'
import Checked from '../../../assets/imgs/icons/checked.svg'
import Insurance from '../../../assets/imgs/icons/insurance.svg'
import Add from '../../../assets/imgs/icons/add.svg'
import Support from '../../../assets/imgs/icons/support.svg'
// import ErrorIcon from '@material-ui/icons/Error';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RecommendIcon from '@mui/icons-material/Recommend';


// Style
const useStyles = makeStyles(formStyle)


// const carewellService = [
//   { name: 'Package', dayValue: 0.2, yearValue: 64, minValue: 30, boundType:['InBound', 'OutBound'] },
//   { name: 'Package + Plus', dayValue: 0.4, yearValue: 120, minValue: 60, boundType:['InBound'] }
// ]

const FormObserver = ({ formData }) => {
  const { setValues } = useFormikContext();

  useEffect(() => {
    setValues(formData);
  }, [formData, setValues]);

  return null;
};


const ProductSelection = ({
      formData,
      setFormData,
      nextStep,
      prevStep,
    }) => {

  const classes = useStyles();
  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage


  const [direction, setDirection] = useState('back');
  const [errormsg, setErrormsg] = useState('')
  const [alterOpen, setAlterOpen] = useState(false)

  const dispatch = useDispatch();
  const questions = useSelector(state => state.medicalQuestionReducer.questions)

  const [expandAll, setExpandAll] = useState(false)
  const [index, setIndex] = useState(0)

  // get Quotes from Allianz API
  const [, setForceRender] = useState(false); // 강제 리렌더링을 위한 상태 추가

  const quoteAllianzResult  = useSelector((state) => state.travelApplicationReducer.quoteAllianzResult)
  const quoteAllianzLoading = useSelector(state => state.travelApplicationReducer.quoteAllianzLoading)
  const quoteAllianzError = useSelector(state => state.travelApplicationReducer.quoteAllianzError)
  

  // allianz api 모달 상태와 보험료를 관리하는 state
  // const [isLoaded, setIsLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setIsHideModalOpen] = useState(false);

  // getQuotesAllianz 함수를 Promise를 사용하여 정의
  const getQuotesAllianz = useCallback((values) => {
    return new Promise((resolve, reject) => {
      dispatch(quoteAllianz({ data: values }));

      // 상태 감시를 위한 함수
      const unsubscribe = store.subscribe(() => {
        const state = store.getState();
        // quoteAllianzResult 상태 확인
        if (state.travelApplicationReducer.quoteAllianzLoading === false) {
          unsubscribe(); // 더 이상 상태 감시가 필요하지 않으므로 구독 해제
          if (state.travelApplicationReducer.quoteAllianzError) {
            reject(state.travelApplicationReducer.quoteAllianzError);
          } else {
            resolve(state.travelApplicationReducer.quoteAllianzResult);
          }
        }
      });
    });
  }, [dispatch]);

  // callAllianzAPI 함수 정의
  const callAllianzAPI = useCallback(async (values) => {
    if (formData.tripType === 'SINGLE' && formData.tripDirection === 'OutBound' && 
        (formData.originProvince === 'ON' || formData.originProvince === 'QC')) { 
      try {
        // getQuotesAllianz 함수 호출 시 await 키워드 사용
        await getQuotesAllianz(values);
        // setApiResult(quoteAllianzResult);
      } catch (error) {
        // 오류 처리
        console.error('An error occurred:', error);
      }
    }
  }, [formData, getQuotesAllianz]); // getQuotesAllianz를 의존성으로 추가

  useEffect(() => {
    dispatch(getMedicalQuestion());
  
    // Allianz API Quote
    const shouldOpenModal = formData.tripType === 'SINGLE' && formData.tripDirection === 'OutBound' &&
      (formData.originProvince === 'ON' || formData.originProvince === 'QC') &&
      formData.insuredPersons.some(person => person.age < 65);
  
    const shouldHideModal = formData.tripType === 'SINGLE' && formData.tripDirection === 'OutBound' &&
      formData.insuredPersons.some(person => person.age > 64);
  
    if (shouldOpenModal) {
      setIsModalOpen(true);
    } else if (shouldHideModal) {
      setIsHideModalOpen(true);
    }

  
    // Call Allianz API if formData changes
    if (formData.tripType === 'SINGLE' && formData.tripDirection === 'OutBound' && 
        (formData.originProvince === 'ON' || formData.originProvince === 'QC') &&
        formData.insuredPersons.length > 0) {
        const callAllianz = async () => {
          try {
            await callAllianzAPI(formData);
            // console.log('Async operation completed successfully.');
          } catch (error) {
            console.error('Async operation failed:', error);
          }
        };
        callAllianz();
    }
  
  }, [dispatch, formData, callAllianzAPI]); // callAllianzAPI를 의존성 배열에 추가

  // useEffect for Allianz API
  useEffect(() => {
    if (quoteAllianzResult.length > 0 && !quoteAllianzLoading && !quoteAllianzError) {
      // 나머지 코드 실행
    
      const sagaResult = quoteAllianzResult[0];
    
      // Medical 카테고리 내의 products 배열에서 Medical 상품을 찾습니다.
      const medicalCategories = sagaResult.offerCategories.find(category => category.name === "Medical");
    
      const medicalProductNoDeductible = medicalCategories.products[0];
      const medicalProductDeductible = medicalCategories.products[1];
    
      if (medicalProductNoDeductible) {
        // Medical 상품의 insured 배열에서 해당하는 premium 값을 찾아 values에 할당합니다.
        formData.insuredPersons.forEach((person, index) => {
          const premiumValue = medicalProductNoDeductible.insured[index]?.premium;
          const medicalProductDeductValue = medicalProductDeductible.insured[index]?.premium;
    
          // 새로운 객체 생성을 통한 불변성 유지, Update premium from Allianz API Call 
          const newInsuredPersons = [...formData.insuredPersons];
          
          // Allianz의 insurancePlans 항목을 업데이트
          const updatedInsurancePlans = newInsuredPersons[index].insurancePlans.map(plan => {
            if (plan.compnayName === "Allianz") {
              return {
                ...plan,
                insuranceAmount: premiumValue,
                calculatedInsuranceAmount: premiumValue,
                // insurance premium for each plan
                medicalProductNoDeductValue: premiumValue,
                medicalProductDeductValue: medicalProductDeductValue
              };
            }
            return plan;
          });
    
          newInsuredPersons[index] = {
            ...newInsuredPersons[index],
            insurancePlans: updatedInsurancePlans
          };

          formData.insuredPersons = newInsuredPersons;

          // console.log('formData.insuredPersons', formData.insuredPersons)
        });
       

        setForceRender(prev => !prev); // 상태 업데이트 후 강제 리렌더링
      }
      
    
      // 모달 닫기
      setIsHideModalOpen(false);
      setIsModalOpen(false);
    }
    
  }, [quoteAllianzResult, quoteAllianzLoading, quoteAllianzError, formData]);
  
  

  // formData가 변경될 때 Allianz API Quote 을 위한 모달을 다시 열도록 설정
  useEffect(() => {
    // 모든 insuredPersons 중 한 명이라도 65세 이상인지 검사
    const hasSenior = formData.insuredPersons.some(person => {
      const birthDate = new Date(person.birthDate);
      let age = new Date().getFullYear() - birthDate.getFullYear();
      const m = new Date().getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 65;
    });
  
    // 모든 조건이 충족되고, 65세 이상인 사람이 없을 때만 모달을 열기
    if (formData.insuredPersons.length > 0 && 
        formData.tripType === 'SINGLE' && 
        formData.tripDirection === 'OutBound' && 
        (formData.originProvince === 'ON' || formData.originProvince === 'QC') &&
        !hasSenior) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false); // 그 외 경우에는 모달을 닫음
    }
  }, [formData]);
  

  // assign Recommand company To InitialData
  function assignRecommandToInitialData(){
    let recommend_company = ''

    //reset recommed as false
    formData.insuredPersons.map(p=>p.insurancePlans.map(i=> i.recommended = false))

    // pick recomanded comapny
    formData.insuredPersons.forEach(p => {
      // Inboud 
      if (formData.tripDirection === 'InBound'){
          // eligilbeIns === 'STUDENT'
          if (p.eligilbeIns === 'STUDENT'){
            if(p.preExistCond === true
              ||p.mentalIllness === true
              || p.maternity === true)
            {
            recommend_company = 'Tugo'
            }else{
            recommend_company = 'Allianz'
            }
          }else{
            // eligilbeIns === 'VISITOR'
            recommend_company = 'Tugo'
          }
      }else {
         // OutBound 
          recommend_company = 'Allianz'
      }

        // set recommended plan
        p.insurancePlans.filter(f=>f.compnayName===recommend_company).map(i=> i.recommended = true)
        
        // sort
        p.insurancePlans.sort((a,b)=> b.recommended - a.recommended)

      });

    return( formData )
  }

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  // const handleOpenPDFViewer = (kind, insurance) => {
  //   let url = ''
  //   if (kind === 'plan'){
  //     const brochure = insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()))
  //     if (brochure.length > 0){
  //       url = process.env.REACT_APP_S3_URL + brochure[0].document_url
  //     }else{
  //       const enBrochure = insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === 'EN'))
  //       if (enBrochure.length > 0){
  //         url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url
  //       } 
  //     }
  //   } else {
  //     // set carewell brochure url
  //     url = ''
  //   }
  //   setPdfOption({
  //           brochures_url : url,
  //           title : kind === 'plan'? `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}` : 'Carewell Services'
  //       })
  //   setOpenPDFViewer(true)
  // }
  const handleOpenPDFViewer = (kind, insurance) => {
    let url = '';

    if (kind === 'plan') {
        const brochure = insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()));
        if (brochure.length > 0) {
            url = process.env.REACT_APP_S3_URL + brochure[0].document_url;
        } else {
            const enBrochure = insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === 'EN'));
            if (enBrochure.length > 0) {
                url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url;
            }
        }
    } else if (kind === 'policy') {
        const enPolicy = insurance.coverages[0].documents.filter(f => (f.document_type === 'Policy' && f.language === 'EN'));
        if (enPolicy.length > 0) {
            url = process.env.REACT_APP_S3_URL + enPolicy[0].document_url;
        }
    } else {
        // set url
        url = '';
    }

    setPdfOption({
        brochures_url: url,
        title: kind === 'plan' ? 
                `Brochures - ${insurance.coverages[0].generic_name}` :
              (kind === 'policy' ? 
                `Policy Wording - ${insurance.coverages[0].generic_name}` :
                'Carewell Services')
    });

    setOpenPDFViewer(true);
  }
  
  // Medical Question & Answer
  const [medQuestion, setMedQuestion] = useState([]);

  // Tugo Medical Question Modal Form
  const [openTugoQuestion, setOpenTugoQuestion] = useState(false);
  const handleOpenTugoQuestion = (insuredPerson) => {
    // console.log(insuredPerson)
    setMedQuestion(insuredPerson.insurancePlans.filter(i => (i.compnayName === 'Tugo')).map(pi => {
      return {
        planMedQuestion: pi,
        // travelType: insuredPerson.travelType,
        eligilbeIns: insuredPerson.eligilbeIns,
        insuredBirthDate: insuredPerson.birthDate,
        isSelectedPlan: insuredPerson.selectedPlan.compnayName === 'Tugo' ?'Y':'N'
      }
    }))
    setOpenTugoQuestion(true)
  }



  // Allianz Medical Question Modal Form
  const [openAllianzQuestion, setOpenAllianzQuestion] = useState(false);
  // const handleOpenAllianzQuestion = (insuredPerson) => {
  //   // console.log(insuredPerson)
  //   setMedQuestion(insuredPerson.insurancePlans.filter(i => (i.compnayName === 'Allianz')).map(pi => {
  //     return {
  //       planMedQuestion: pi,
  //       // travelType: insuredPerson.travelType,
  //       eligilbeIns: insuredPerson.eligilbeIns,
  //       insuredBirthDate: insuredPerson.birthDate,
  //       isSelectedPlan: insuredPerson.selectedPlan.compnayName === 'Allianz' ?'Y':'N'
  //     }
  //   }))
  //   setOpenAllianzQuestion(true)
  // }
  const [selectedInsuredPerson, setSelectedInsuredPerson] = useState();

    const handleOpenAllianzQuestion = (insuredPerson) => {
      // console.log(insuredPerson)
      const selectedInsuredPerson = {
        ...insuredPerson,
        // 추가적인 데이터 처리가 필요한 경우 여기에 로직 추가
      };
    
      // 상태 업데이트
      setSelectedInsuredPerson(selectedInsuredPerson);

      setMedQuestion(insuredPerson.insurancePlans.filter(i => (i.compnayName === 'Allianz')).map(pi => {
        return {
          planMedQuestion: pi,
          // travelType: insuredPerson.travelType,
          eligilbeIns: insuredPerson.eligilbeIns,
          insuredBirthDate: insuredPerson.birthDate,
          isSelectedPlan: insuredPerson.selectedPlan.compnayName === 'Allianz' ?'Y':'N'
        }
      }))
      // console.log(medQuestion)
      setOpenAllianzQuestion(true)
    }

  // Allianz Medical Eligibility Modal Form
  const [openAllianzEligibility, setOpenAllianzEligibility] = useState(false);
  const handleOpenAllianzEligibility = (insuredPerson) => {
    // console.log(insuredPerson.insurancePlans.filter(i=>(i.compnayName ==='Allianz')).map( pi => pi))
    setMedQuestion(insuredPerson.insurancePlans.filter(i => (i.compnayName === 'Allianz')).map(pi => {
      return {
        planMedQuestion: pi,
        // travelType: insuredPerson.travelType,
        eligilbeIns: insuredPerson.eligilbeIns,
        insuredBirthDate: insuredPerson.birthDate,
        isSelectedPlan: insuredPerson.selectedPlan.compnayName === 'Allianz' ?'Y':'N'
      }
    }))
    setOpenAllianzEligibility(true)
  }


  function showError(index, msg) {
      setIndex(index);
      scrollToElement();
      setAlterOpen(true)
      setErrormsg(msg) 
      setTimeout(() => {
          setAlterOpen(false)
          setErrormsg('')
      }, 10000);
    
  }

  function validate(insuredPersons) {                                      

    if (insuredPersons.filter(p=> (p.eligilbeIns === 'VISITOR' || p.eligilbeIns === 'CANADIAN') && p.age > 59)
          .map(i => i.insurancePlans.filter(f=> ((f.compnayName === 'Allianz' || f.compnayName === 'Tugo') && f.medicalQuestion.answered===true)
                                                     // No medical for BlueCross, GMS, Travelance
                                                    || (f.compnayName !== 'BlueCross' || f.compnayName !== 'GMS' || f.compnayName !== 'Travelance')
              ).length)[0] === 0 ){
        return (   
          <Button
            // variant='contained'
            color="dark"
            className={classes.next_button}
            onClick={() => {
                insuredPersons.every((person, i) => {
                    if ((person.eligilbeIns === 'VISITOR' || person.eligilbeIns === 'CANADIAN') && person.age > 59) {
                          person.insurancePlans.map( plan => {
                              // No medical for BlueCross, GMS, Travelance
                              if (((plan.compnayName === 'Allianz' || plan.compnayName === 'Tugo' || plan.compnayName !== 'BlueCross' || plan.compnayName !== 'GMS' || plan.compnayName !== 'Travelance') 
                                  && plan.medicalQuestion.answered===true) === false ){
                                  showError(i,'CompleteMedicalQuestionnare' )
                                  return false
                                }
                                return true;
                          })
                    }
                    return true;
                })
            }}
          >
            {/* <Text tid={'Button.Purchase'} /> */}
            <Text tid={'Button.Next'} />
          </Button>
        )
    } else if ((insuredPersons.filter(person => person.selectedPlan.length === 0)).length > 0) {
        return (   
          <Button
            // variant='contained'
            color="dark"
            className={classes.next_button}
            onClick={() => {
                insuredPersons.every((person, i) => {
                  if (person.selectedPlan.length === 0 ){
                      showError(i,'SelectPlansAllApplicants' )
                      return false
                    }
                    return true;
                })
            }}
          >
            {/* <Text tid={'Button.Purchase'} /> */}
            <Text tid={'Button.Next'} />
          </Button>
        )
    } else if (insuredPersons.filter(person => ((person.selectedPlan.length !== 0) 
                                                  && (person.eligilbeIns === 'VISITOR' || person.eligilbeIns === 'CANADIAN') 
                                                  && person.age > 59
                                                  && (person.selectedPlan.compnayName === 'Allianz' || person.selectedPlan.compnayName === 'Tugo')) 
                                                  && (person.selectedPlan.medicalQuestion.answered === false)).length > 0) {
        return (
          <Button
            // variant='contained'
            color="dark"
            className={classes.next_button}
            onClick={() => {
              insuredPersons.every((person, i) => {
                  if(person.selectedPlan.length !== 0 
                      && (person.eligilbeIns === 'VISITOR' || person.eligilbeIns === 'CANADIAN') 
                      && person.age > 59
                      && (person.selectedPlan.compnayName === 'Allianz' || person.selectedPlan.compnayName === 'Tugo')
                      && (person.selectedPlan.medicalQuestion.answered === false)){
                          showError(i,'CompleteMedicalQuestionnare' )
                          return false
                  }
                  return true;
              })
          }}
          >
            {/* <Text tid={'Button.Purchase'} /> */}
            <Text tid={'Button.Next'} />
          </Button>
        )
    } else if (insuredPersons.filter(f=> f.selectedPlan.insuranceAmount===0).length > 0) {
        return (
          <Button
            // variant='contained'
            color="dark"
            className={classes.next_button}
            onClick={() => {
              setAlterOpen(true)
              setErrormsg('NotEligibleToPurchase')
          }}
          >
            {/* <Text tid={'Button.Purchase'} /> */}
            <Text tid={'Button.Next'} />
          </Button>
        )
    } else {

        return (
          <Button
            type='submit'
            // variant='contained'
            color="dark"
            className={classes.next_button}
            onClick={() => {
              setDirection('forward')
            }}
          >
            {/* <Text tid={'Button.Purchase'} /> */}
            <Text tid={'Button.Next'} />
          </Button>
        )
    }
  }

  
  function studentSelectTugo(index, insuredPersons){

    return (
      insuredPersons[index].eligilbeIns === 'STUDENT' &&
        insuredPersons[index].travelType !== 'SS' && 
        !(insuredPersons[index].travelType === 'PW' && insuredPersons[index].yearDateAfterGraduated >= insuredPersons[index].tripEndDate) &&
        insuredPersons.filter(f=> f.travelType==='SS' && f.selectedPlan.compnayName === 'Tugo').length > 0
    )

  }


  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  
  var total = 0

  let isMobile = (width <= 768);

  const scrollRef = useRef(null);
  const scrollToElement = () => scrollRef.current.scrollIntoView();


  return (
    <>
      <Formik
        // initialValues={formData}
        initialValues={assignRecommandToInitialData()}
        onSubmit={values => {
          window.scrollTo(0, 0)//scroll to top after submit
          
          setFormData(values);
          window.scrollTo(0, 0)//scroll to top after submit
          direction === 'back' ? prevStep() : nextStep();

          // props.updateFormData(values);
          // direction === 'back' 
          // ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
          // : props.history.push(pathDirection(props.location.pathname, values).nextStep);            

        }}
      >
        {({ values, setValues, handleChange, setFieldValue }) => (
          
          <Form className={classes.formWrapper}>
            <Grid container justifyContent='center'>
            {isModalOpen === true && <LoadingModal />} 
              <Grid item container xs={12} justifyContent="center" >
                <Grid item container xs={12} justifyContent="center" ref={scrollRef}>
                  <Typography variant="h5" gutterBottom className={classes.title_question} style={{ textAlign: 'center' }}>
                      <Text tid={'Quote.LetsBuildCoverage'}/>
                      <span className={classes.title_question_sub2} style={{ textAlign: 'center' }}>
                      <Text tid={'Quote.SelectCoverage'}/>
                    </span>
                  </Typography>
                </Grid>
                <FormObserver formData={formData} />
                
                <Grid item container xs={12} sm={11} md={11} lg={9} xl={7}> {/*new layout cards*/}
                
                  {values.insuredPersons[index].insurancePlans &&
                    <>
                      <Grid item container>

                      {/* Applicant Side index card - mobile */}
                        <Grid item container className={classes.stickyTopMenu}>
                      
                            {isMobile && values.insuredPersons && values.insuredPersons.length > 0 &&
                              <>
                                  <Grid item container style={{ boxShadow: '0 3px 15px #00000014', border:'1px solid #ddd', background:'#fafafa' }} >
                                  <span className={classes.stickyTopMenuTitle}>
                                    <Text tid={'Quote.Applicants'}/>
                                    {/* Applicants */}
                                    {/* 가입자 */}
                                  </span>
                                    {values.insuredPersons.map((insuredPerson, i) => (
                                      index === i && expandAll === false ?
                                        <Grid item  xs={1} className={classes.stickyTopMenuItem} key={i} style={{float:'left'}}
                                          onClick={() => { setIndex(i); 
                                                            scrollToElement();
                                                            // window.scrollTo(0, 90);
                                                            return expandAll === true ? setExpandAll(false) : null }}
                                        >
                                          <div style={{ fontWeight: '600' }}>
                                            {`${i + 1}`}
                                          </div>
                                        </Grid>
                                        :
                                        <Grid item xs={1} className={classes.stickyTopMenuItem} key={i} style={{float:'left'}}
                                          onClick={() => { setIndex(i); 
                                                            // window.scrollTo(0, 90);
                                                            scrollToElement();
                                                            return expandAll === true ? setExpandAll(false) : null }}
                                        >
                                          <div style={{ fontWeight: '600' }}>
                                            {`${i + 1}`}
                                          </div>
                                        </Grid>
                                    ))}

                                  </Grid>
                              </>
                            }
                        </Grid>
              
                        {/* Applicant Side index card - Not mobile */}
                        <Grid item xs={4}>
                          <div className={classes.stickyLeftMenuCompanion}>
                            {!isMobile && values.insuredPersons && values.insuredPersons.length > 0 &&
                              <ul className={classes.leftMenuUlCompanion}>
                                {values.insuredPersons.map((insuredPerson, i) => (
                                  index === i && expandAll === false ?
                                    <li className={classes.leftMenuLiCompanion2} key={i}
                                      onClick={() => { setIndex(i); 
                                                        // window.scrollTo(0, 200)
                                                        scrollToElement();
                                                        return expandAll === true ? setExpandAll(false) : null }}
                                    >
                                      <div style={{ fontWeight: '400', fontSize:'12px', color:"#666" }}>
                                        {/* Applicant {`${i + 1}`} */}
                                        <span style={{ fontWeight:'500', color:'#2a2f71'}}>
                                                {`${insuredPerson.relationship}`}
                                        </span>
                                        <div style={{ fontWeight: '500', color:"#1c1c1c", fontSize:'16px' }} > 
                                          {`${insuredPerson.firstName} ${insuredPerson.lastName}  ( ${insuredPerson.age} yrs)`} 
                                        </div>
                                      </div>

                                    </li>
                                    :
                                    <li id= "indexId"
                                    className={classes.leftMenuLiCompanion} key={i}
                                      onClick={() => { setIndex(i); 
                                                        // window.scrollTo(0, 200)
                                                        scrollToElement();
                                                        return expandAll === true ? setExpandAll(false) : null }}
                                    >
                                      <div style={{ fontWeight: '400', fontSize:'12px', color:"#666" }}>
                                        {/* Applicant {`${i + 1}`}  */}
                                        <span style={{fontWeight:'500', color:'#2a2f71'}}>
                                                {`${insuredPerson.relationship}`}
                                        </span>
                                        <div style={{ fontWeight: '500', color:"#1c1c1c", fontSize:'16px' }} > 
                                          {`${insuredPerson.firstName}  ${insuredPerson.lastName} `} 
                                        </div>
                                      </div>
                                    </li>
                                ))}

                              </ul>
                            }

                            {/* Sub total */}
                            <div style={{ display: 'none' }}>
                              {total = 0}
                              {
                                values.insuredPersons.map(person => (
                                  total += Math.round(((person.selectedPlan.calculatedInsuranceAmount ? person.selectedPlan.calculatedInsuranceAmount : 0)) * 100) / 100
                                ))
                              }
                            </div>
                      
                            
                          {/* You selected - Not mobile */}
                          {!isMobile && values.insuredPersons[index].selectedPlan.length !== 0 && (
                            <>
                          
                              <Grid item xs={12} style={{margin:'1vh 1vh 1vh 0'}}>
                              
                                <Card style={{ textAlign: 'left', border:'1px solid #cfcfcf', borderRadius:'0', boxShadow:'0 3px 15px #00000014' }}>
                                  <CardContent className={classes.cardContentBox}>
                                    <Grid container>
                                      
                                      <Grid item xs={12} style={{textAlign: 'center', marginBottom: isMobile ? '3vh' : '2vh', paddingBottom:'1vh' }}>
                                        <Typography style={{fontWeight:600, fontSize:'18px', color:'#000000DE', marginBottom:'1vh'}}>
                                          <Text tid={'Quote.YourCoverage'}/>
                                        </Typography>
                                        <Typography style={{background:'rgb(240, 245, 255)', paddingTop:'2vh', color:'#1c1c1c' }}>
                                          {`${values.insuredPersons[index].firstName}  ${values.insuredPersons[index].lastName} `}
                                        </Typography>
                                        <Typography variant="body2" style={{color:'#3f51b5', fontSize:'2em', fontWeight:'700', background:'rgb(240, 245, 255)', padding:'1.5vh', paddingTop:'0'}}>
                                            {values.insuredPersons[index].selectedPlan.insuranceAmount !== 0
                                              ? amountFormat(values.insuredPersons[index].selectedPlan.calculatedInsuranceAmount, 2)
                                              : <AttachMoneyIcon />}
                                            {/* {amountFormat(values.insuredPersons[index].selectedPlan.calculatedInsuranceAmount, 2)} */}
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                        <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                        <img
                                            src={Insurance}
                                            alt="Insurance icon"
                                            style={{marginRight:'10px', paddingBottom:'3px'}} 
                                          />
                                          {values.insuredPersons[index].selectedPlan.compnayName + ' ' + values.insuredPersons[index].selectedPlan.coverages[0].generic_name}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                        {/* Insurance Premium */}
                                        <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                          {values.insuredPersons[index].selectedPlan.insuranceAmount !== 0
                                              ? amountFormat(values.insuredPersons[index].selectedPlan.insuranceAmount, 2)
                                              : <AttachMoneyIcon />}
                                          {/* {amountFormat(values.insuredPersons[index].selectedPlan.insuranceAmount, 2)} */}
                                        </Typography>
                                      </Grid>
                                      
                                        {values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName)&&
                                          values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName).planTypes.filter(plan => plan.isSelected === true).map((plan, idx) => (
                                          <Grid container key={idx}>
                                            <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                              <img
                                              src={Add}
                                              alt="Insurance icon"
                                              style={{marginRight:'10px', paddingBottom:'3px'}} 
                                              />
                                                {plan.planName}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                              {/* Optional Fee */}
                                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                {amountFormat(plan.calculatedAddOnAmount)}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        ))}

                                        {/* {values.insuredPersons[index].optionalCarewellService.isSelected && (
                                          <>
                                            <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                              <img
                                                src={Support}
                                                alt="Insurance icon"
                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                />
                                                Carewell {values.insuredPersons[index].optionalCarewellService.packageName}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                {amountFormat(values.insuredPersons[index].optionalCarewellService.packageAmount, 2)}
                                              </Typography>
                                            </Grid>
                                          </>
                                        )} */}

                                    </Grid>

                                  </CardContent>
                                </Card>
                              </Grid>
                        
                            </>
                          )}
                          
                          </div>

                          
                        </Grid>
                  

                        {/* coverage selection box */}
                        <Grid item xs={!isMobile ? 8 : 12} >
                          <div className={classes.productSection}>
                            <Grid container>
                            
                              <Grid item xs></Grid>
                              <Grid item xs={12} md={11}>
                                {alterOpen && (
                                    <Grid item xs={12} style={{ margin: '1vh' }}>
                                      
                                      <Alert
                                          severity='error'
                                          onClose={() => setAlterOpen(false)}
                                      >
                                          <Text tid={`Quote.Error.${errormsg}`}/>
                                      </Alert>
                                    </Grid>
                                  )}
                                <div style={{ fontWeight: '400', fontSize: '20px', textAlign: !isMobile ? 'left' : 'center' }} > {`${values.insuredPersons[index].firstName}  ${values.insuredPersons[index].lastName} `}</div>
                                <Typography style={{ fontWeight: '300', fontSize: !isMobile ? '16px' : '14px', textAlign: !isMobile ? 'left' : 'center' }}>
                                  <Text tid={'Quote.EligibleToPurchase'}/> 
                                </Typography>
                              </Grid>
                              <Grid item xs></Grid>
                            </Grid>
                            {values.insuredPersons[index].insurancePlans.map((insurance, insIndex) => (
                              <Grid container key={insIndex} style={{ margin: '2vh 0' }}>
                                <Grid item xs={12}>
                                  {insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).length > 0 &&
                                    insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).map((coverage, i) => (
                                      <div key={index}>

                                        <Grid container>
                                          <Grid item xs></Grid>
                                          <Grid item xs={11}>
                                            <div style={{ display: (values.insuredPersons[index].selectedPlan.length !== 0 && values.insuredPersons[index].selectedPlan !== insurance)?'none':null }}>

                                              {/* recommend */}
                                              {insurance.recommended === true
                                                        ?<div style={{ background: '#1261C9', color:'#fff', padding:'3px 8px', width:'fit-content'}}>
                                                          Best Overall<RecommendIcon style={{ color: '#fff', height: '1em', marginLeft:'3px'}} />
                                                          {/* 추천상품 */}
                                                          </div>
                                                        :null}
                                              <Grid item container style={{ alignItems: 'center', border: values.insuredPersons[index].selectedPlan === insurance ? '3px solid #2a2f71' : '1px solid #dadadb', backgroundColor: 'white' }}>
                                                {/* Insurance Product */}
                                                
                                                <Grid item container alignItems='center' 
                                                  style={{ 
                                                    textAlign: !isMobile ? 'left' : 'center', 
                                                    margin: '0', 
                                                    padding: '10px 20px', 
                                                    backgroundColor: values.insuredPersons[index].selectedPlan === insurance ? '#f0f5ff' : '#f8fafb'
                                                  }}
                                                  >
                                                  <Grid item xs={12} md={9}>
                                                  
                                                    {values.insuredPersons[index].selectedPlan === insurance ? 
                                                    (<img
                                                        src={TickInsideCircle}
                                                        alt="Selected mark"
                                                        style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                      />)
                                                    : null}
                                                    <span style={{ fontSize: '20px', fontWeight: '600' }}>
                                                      {insurance.compnayName + ' ' + 
                                                        (currentLanguage === 'ko' 
                                                            ? (coverage.generic_name_kr ? coverage.generic_name_kr : coverage.generic_name) 
                                                            : coverage.generic_name)
                                                      } 
                                                    </span>
                                                  </Grid>
                                                  <Grid item xs={12} md={3} style={{ textAlign: !isMobile ? 'right' : 'center' }}>
                                                    {/* <img
                                                      src={insurance.compnayName === 'Tugo' ? tugoLogo : insurance.compnayName === 'Allianz' ? allianzLogo : null}
                                                      alt='logo'
                                                      style={{width:'50%'}}
                                                    /> */}
                                                    <span style={{ color: '#2a2f71', fontSize:'14px', fontWeight:'600' }}><Text tid={'Quote.MainInsurance'}/></span>
                                                  </Grid>
                                                </Grid>


                                                <Grid item container spacing={2} style={{ padding: '20px' }}>

                                                {/* logo */}
                                                {!isMobile ? (
                                                    <Grid item xs={12} md={3} style={{textAlign:'center'}}>
                                                      <img
                                                        // src={insurance.compnayName === 'Tugo' ? tugoLogo : insurance.compnayName === 'Allianz' ? allianzLogo : null}
                                                        src={insurance.compnayName === 'Tugo' 
                                                              ? tugoLogo : insurance.compnayName === 'Allianz' 
                                                                ? allianzLogo : insurance.compnayName === 'GMS'
                                                                  ? gmsLogo : insurance.compnayName === 'BlueCross' 
                                                                    ? blueCrossLogo : travelanceLogo}
                                                        alt='logo'
                                                        style={{width: insurance.compnayName === 'Allianz' ? '110px' : '120px', padding:'1vh'}}
                                                      />
                                                    </Grid>
                                                  )
                                                  : (
                                                    <Grid item xs={12} md={3} style={{textAlign:'center'}}>
                                                      <img
                                                        src={insurance.compnayName === 'Tugo' 
                                                              ? tugoLogo : insurance.compnayName === 'Allianz' 
                                                                ? allianzLogo : insurance.compnayName === 'GMS'
                                                                  ? gmsLogo : insurance.compnayName === 'BlueCross' 
                                                                    ? blueCrossLogo : travelanceLogo}
                                                        alt='logo'
                                                        style={{width: insurance.compnayName === 'Allianz' ? '40%' : '45%', padding:'2vh'}}
                                                      />
                                                    </Grid>
                                                  ) }
                                                  {/* Product Details */}
                                                  <Grid item xs={12} md={3} style={{ fontSize: '14px', fontWeight: '600' }}>
                                                    <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                                      <Text tid={'Quote.Coverage'}/>
                                                    </span>
                                                    <Typography color="textSecondary" style={{ marginLeft: '13px', marginTop:'5px' }}>
                                                      <Text tid={'Quote.MainInsuranceAbout'}/>
                                                    </Typography>
                                                    {values.tripDirection === 'OutBound'
                                                      ? <Typography color="textSecondary" style={{ marginLeft: '13px' }}>
                                                          {insurance.compnayName === 'Allianz'?  
                                                          'COVID Covered':  'COVID Covered'}
                                                        </Typography>
                                                      : null }
                                                  </Grid>

                                                  {/* coverage up to */}
                                                  <Grid item xs={6} md={3} >
                                                    <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                                      <Text tid={'Quote.SumInsured'}/>
                                                    </span>
                                                    {insurance.coverages.length > 1 ?
                                                      <SelectTextField
                                                        //label="Coverage"
                                                        name={`insuredPersons.${index}.insurancePlans.${insIndex}.selectedCoverage`}
                                                        value={insurance.selectedCoverage}
                                                        onChange={(e) => {
                                                          insurance.selectedCoverage = e.currentTarget.value
                                                          setFieldValue(`insuredPersons.${index}.insurancePlans.${insIndex}.selectedCoverage`, e.currentTarget.value)
                                                        }}
                                                      >
                                                        {
                                                          values.insuredPersons[index].eligilbeIns === 'VISITOR' ?
                                                            <>
                                                              {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                                <option key={coverage.plan_id} value={coverage.price_code}>
                                                                  {amountFormat(coverage.price_code, 0)}
                                                                </option>
                                                              ))}
                                                            </>
                                                            :
                                                            <>
                                                              {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                                <option key={coverage.plan_id} value={coverage.price_code}>
                                                                  {amountFormat(coverage.price_code, 0)}
                                                                </option>
                                                              ))[0]}
                                                            </>
                                                        }
                                                      </SelectTextField>
                                                      :
                                                      <Typography color="textSecondary" gutterBottom style={{ marginLeft: '13px' }}>
                                                        {amountFormat(insurance.coverages[0].price_code, 0)}
                                                      </Typography>
                                                    }
                                                  </Grid>

                                                  {/* Deductible */}
                                                  {coverage.type_deduct.length > 0 ?
                                                    <>
                                                      <Grid item xs={6} md={3}>
                                                        <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                                          <Text tid={'Quote.Deductible'}/>
                                                        </span>
                                                        <SelectTextField
                                                          //label="Deductible"
                                                          name='insurance.coverage.deduct'
                                                          //defaultValue={coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                          value={coverage.deduct ? coverage.deduct : coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                          onChange={(e) => {
                                                            coverage.deduct = e.currentTarget.value
                                                            setFieldValue('insurance.coverage.deduct', e.currentTarget.value)
                                                            // setFieldValue(`insuredPersons.${index}.insurancePlans.${insIndex}.coverages.${i}.deduct`, e.currentTarget.value)
                                                            // setFieldValue(`insuredPersons.${index}.insurancePlans.${insIndex}.coverage.deduct`, e.currentTarget.value)
                                                            // console.log(insurance)
                                                            
                                                            // When Allianz Canadian Plan, Apply Deductible 
                                                            const allianzPlanIndex = values.insuredPersons[index].insurancePlans.findIndex(plan => plan.compnayName === 'Allianz');
                                                            // console.log('allianzPlanIndex', allianzPlanIndex)
                                                            if (insurance.compnayName === 'Allianz' && allianzPlanIndex !== -1) {
                                                              if (e.currentTarget.value > 0) {
                                                                setFieldValue(`values.insuredPersons[${index}].insurancePlans[${allianzPlanIndex}].insuranceAmount`, values.insuredPersons[index].insurancePlans[allianzPlanIndex].medicalProductDeductValue);
                                                                values.insuredPersons[index].insurancePlans[allianzPlanIndex].insuranceAmount = values.insuredPersons[index].insurancePlans[allianzPlanIndex].medicalProductDeductValue;
                                                                // console.log('values.insuredPersons[index].insurancePlans[allianzPlanIndex]', values.insuredPersons[index].insurancePlans[allianzPlanIndex])
                                                              } else {
                                                                setFieldValue(`values.insuredPersons[${index}].insurancePlans[${allianzPlanIndex}].insuranceAmount`, values.insuredPersons[index].insurancePlans[allianzPlanIndex].medicalProductNoDeductValue);
                                                                values.insuredPersons[index].insurancePlans[allianzPlanIndex].insuranceAmount = values.insuredPersons[index].insurancePlans[allianzPlanIndex].medicalProductNoDeductValue;
                                                                // console.log('values.insuredPersons[index].insurancePlans[allianzPlanIndex]', values.insuredPersons[index].insurancePlans[allianzPlanIndex])
                                                              }
                                                            }
                                                          }}
                                                        >
                                                          {/* Show all deductible option - original*/}
                                                          {/* {coverage.type_deduct.sort((a,b)=> a.value - b.value).map((deduct) => (
                                                            <option key={deduct.price_code} value={deduct.discount}>
                                                              {amountFormat(deduct.lable, 0)}
                                                            </option>
                                                          ))} */}

                                                          {/* Show deductible only $0 and $500 when Allianz - updated*/}
                                                          {insurance.compnayName === 'Allianz' ?
                                                            coverage.type_deduct
                                                              .filter(deduct => (deduct.price_code === 'PAVDM-0000' || deduct.price_code === 'PAVDM-0500' || deduct.price_code === 'PACDM-0000' || deduct.price_code === 'PACDM-0500'))
                                                              .sort((a, b) => a.value - b.value)
                                                              .map(deduct => (
                                                                <option key={deduct.price_code} value={deduct.discount}>
                                                                  {amountFormat(deduct.lable, 0)}
                                                                </option>
                                                              ))
                                                            :
                                                            coverage.type_deduct.sort((a,b)=> a.value - b.value).map((deduct) => (
                                                              <option key={deduct.price_code} value={deduct.discount}>
                                                                {amountFormat(deduct.lable, 0)}
                                                              </option>
                                                            ))
                                                          }
                                                        </SelectTextField>
                                                      </Grid>
                                                    </>
                                                    :
                                                    <Grid item xs={6} md={3}>
                                                      <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                                        <Text tid={'Quote.Deductible'}/>
                                                      </span>
                                                      <Typography color="textSecondary" gutterBottom style={{ marginLeft: '13px' }}>
                                                        $0.00
                                                      </Typography>
                                                    </Grid>
                                                  }

                                                  {/*  */}
                                                  { (values.insuredPersons[index].eligilbeIns === 'CANADIAN' || values.insuredPersons[index].eligilbeIns === 'VISITOR') &&
                                                    <div style={{ display: 'none' }}>
                                                      {/* coverage.value_rate */}
                                                      {/* {insurance.compnayName === 'Allianz' ? coverage.value_rate = insurance.medicalQuestion.chargeRate : null} */}
                                                      {/* If Travelance, No medical */}

                                                      {/* coverage.value */}
                                                      {coverage.value = (insurance.coverages.filter((c) => c.trip_type === coverage.trip_type && c.price_code === coverage.price_code && c.generic_name === coverage.generic_name)[0]
                                                        .rate).filter(r => r.rate === (insurance.medicalQuestion.chargeRate !== '0'? insurance.medicalQuestion.chargeRate: '1') 
                                                                            && r.period_code === coverage.period_code)[0].value}
                                                      
                                                    </div>
                                                  }

                                                  <div style={{ display: 'none' }}>
                                                    {
                                                      /* insuranceAmount at least 
                                                        Tugo : amount of 10 days for STUDENT 
                                                        Travelance : amount of 14 days for STUDENT 
                                                      */
                                                      // values.insuredPersons[index].tripPeriodDays 
                                                      //     = (values.insuredPersons[index].tripPeriod <= 10 && insurance.compnayName === 'Tugo' && values.insuredPersons[index].eligilbeIns === 'STUDENT' )
                                                      //                                                 ? 10
                                                      //                                                 : values.insuredPersons[index].tripPeriod

                                                      values.insuredPersons[index].tripPeriodDays = 
                                                      (insurance.compnayName === 'Tugo' && values.insuredPersons[index].eligilbeIns === 'STUDENT' && values.insuredPersons[index].tripPeriod <= 10) 
                                                          ? 10
                                                          : (insurance.compnayName === 'Travelance' && values.insuredPersons[index].eligilbeIns === 'STUDENT' && values.insuredPersons[index].tripPeriod <= 14)
                                                              ? 14
                                                              : values.insuredPersons[index].tripPeriod
                                                                                                  
                                                    }
                                                   

                                                    {/* {
                                                      insurance.insuranceAmount =
                                                      (coverage.calculate_rate === 'D'
                                                        ? (coverage.value * values.insuredPersons[index].tripPeriodDays) 
                                                            - (coverage.value * values.insuredPersons[index].tripPeriodDays * coverage.deduct) 
                                                            - ((values.insuredPersons[index].tripPeriod === '365' && coverage.insured_type) ? coverage.discount : 0)
                                                        : (coverage.value * 1) - (coverage.value * 1 * coverage.deduct))
                                                      + (insurance.compnayName === 'Tugo' ? insurance.medicalQuestion.surcharge : 0)
                                                    } */}
                                                    
                                                    {/* Insurance Amount */}
                                                    {/* No Calculation for Allianz Canadian API */}
                                                    {!(insurance.compnayName === 'Allianz' && formData.tripDirection === 'OutBound' && formData.tripType === 'SINGLE') && (
                                                      insurance.insuranceAmount =
                                                      (coverage.calculate_rate === 'D'
                                                        ? (coverage.value * values.insuredPersons[index].tripPeriodDays) 
                                                        : (coverage.value * 1))
                                                    )}
                                                    


                                                    {
                                                      /* add surcharge after recalculated if Tugo Medical question is answered and then chanaged coverage */
                                                        insurance.compnayName === 'Tugo' 
                                                          && insurance.medicalQuestion.surcharge > 0 
                                                          && insurance.medicalQuestion.answered === true
                                                          ? (values.insuredPersons[index].eligilbeIns === 'VISITOR'
                                                              ? insurance.insuranceAmount += calculateSurchargeTugoMedicalQuestion(insurance)
                                                              : insurance.insuranceAmount += insurance.medicalQuestion.surcharge 
                                                            )
                                                          : null
                                                    }

                                                    {/* No Calculation for Allianz Canadian API */}
                                                    {!(insurance.compnayName === 'Allianz' && formData.tripDirection === 'OutBound' && formData.tripType === 'SINGLE' ) && (
                                                      /*  insuranceAmount - deduct amount */
                                                      insurance.insuranceAmount =
                                                      (coverage.calculate_rate === 'D'
                                                        ? insurance.insuranceAmount 
                                                            - (insurance.insuranceAmount * coverage.deduct) 
                                                            // - ((values.insuredPersons[index].eligilbeIns === 'STUDENT' &&
                                                            //     parseInt(values.insuredPersons[index].tripPeriod) === 365 && 
                                                            //     coverage.insured_type) 
                                                            //     ? coverage.discount 
                                                            //     : 0
                                                            //   )
                                                        : insurance.insuranceAmount - (insurance.insuranceAmount * coverage.deduct))
                                                    )}
                                                    
                                                    {
                                                      /* insuranceAmount at least 
                                                        Allianz : $30 for STUDENT. $20 for VISITOR and CANADIAN  */
                                                      insurance.compnayName === 'Allianz' && insurance.insuranceAmount > 0
                                                        ? values.insuredPersons[index].eligilbeIns === 'STUDENT' 
                                                          ? (insurance.insuranceAmount < 30 ? insurance.insuranceAmount = 30 :null)
                                                          : (insurance.insuranceAmount < 20 ? insurance.insuranceAmount = 20 :null)
                                                        : null
                                                    }

                                                    {
                                                      /* insuranceAmount at least 
                                                        Tugo : $20 for VISITOR and CANADIAN  */
                                                        insurance.compnayName === 'Tugo' && insurance.insuranceAmount > 0 && values.insuredPersons[index].eligilbeIns !== 'STUDENT' 
                                                          ? (insurance.insuranceAmount < 20 ? insurance.insuranceAmount = 20 :null)
                                                          : null
                                                    }

                                                    {
                                                      /* insuranceAmount at least 
                                                        BlueCross : $25 for CANADIAN  */
                                                        insurance.compnayName === 'BlueCross' && insurance.insuranceAmount > 0 && values.insuredPersons[index].eligilbeIns !== 'STUDENT' 
                                                          ? (insurance.insuranceAmount < 25 ? insurance.insuranceAmount = 25 :null)
                                                          : null
                                                    }
                                                    
                                                    {
                                                      (values.insuredPersons[index].eligilbeIns === 'CANADIAN' && values.insuredPersons[index].age > 60 && insurance.compnayName === 'Allianz' && 
                                                        (insurance.medicalQuestion.surcharge !== 0 || insurance.medicalQuestion.discount !== 0 )
                                                          ?
                                                          (<>
                                                              {/* surcharge rate */}
                                                              {insurance.insuranceAmount = (insurance.insuranceAmount + Math.ceil(insurance.insuranceAmount *  insurance.medicalQuestion.surcharge)) }
                                                              {/* discount rate */}
                                                              {insurance.insuranceAmount = insurance.insuranceAmount - Math.floor(insurance.insuranceAmount * insurance.medicalQuestion.discount)}
                                                          </>)
                                                          : null
                                                      )
                                                    } 

                                                    {
                                                      insurance.calculatedInsuranceAmount = insurance.insuranceAmount
                                                        + (values.insuredPersons[index].optionalAddOnPlans
                                                                  .find(plan => plan.compnayName === insurance.compnayName)
                                                            ? values.insuredPersons[index].optionalAddOnPlans
                                                                  .find(plan => plan.compnayName === insurance.compnayName).planTypes
                                                                  .filter(plan => plan.isSelected === true).reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                                            :0)
                                                        + (values.insuredPersons[index].optionalCarewellService.isSelected ? values.insuredPersons[index].optionalCarewellService.packageAmount : 0)
                                                    }

                                                  </div>

                                                </Grid>      

                                                {/*  */}
                                                <Grid item container style={{backgroundColor: values.insuredPersons[index].selectedPlan === insurance ? '#f0f5ff' : '#f8fafb', padding:'2vh', }}>
                                                  <Grid item xs={12} md={6} lg={5} className={classes.priceBox} style={{backgroundColor: values.insuredPersons[index].selectedPlan === insurance ? '#f0f5ff' : '#f8fafb'}}>
                                                      
                                                      <IconButton aria-label="view" color="primary" 
                                                          onClick={() => handleOpenPDFViewer('plan',insurance)}
                                                      >
                                                        <DescriptionIcon />
                                                        <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '300'  }}>
                                                          <Text tid={'Quote.SeeMoreBenefit'}/>
                                                        </Typography>
                                                      </IconButton>

                                                      {/* Policy Wording */}
                                                      <IconButton aria-label="view" color="primary" 
                                                        onClick={() => handleOpenPDFViewer('policy',insurance)}
                                                      >
                                                        <DescriptionIcon />
                                                        <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '300'  }}>
                                                          <Text tid={'Quote.SeePolicyWording'}/>
                                                        </Typography>
                                                      </IconButton> 
                                                      
                                                      <div style={{fontStyle:'italic', fontSize:'12px', color:'#1c1c1c', marginTop:'1.5vh'}}>
                                                        <Text tid={'Quote.IncludeTax'}/>
                                                      </div>
                                                    </Grid>
                                                  
                                                    {/* Total Premium insurance Amount and Days */}
                                                    <Grid item xs={12} md={6} lg={7}>

                                                        {/* {insurance.insuranceAmount !== 0 */}
                                                        {isMedicalQuestionAnswered(values.insuredPersons[index].age, insurance) === true 
                                                          ? <Typography variant="body2" className={classes.price}>
                                                              {insurance.insuranceAmount > 0 ? amountFormat(insurance.insuranceAmount, 2) : 'Not Available'}
                                                              {/* {console.log('insurance', insurance, formData.insuredPersons)} */}
                                                              {/* {console.log('insurance.insuranceAmount:', insurance.insuranceAmount)}
                                                              {console.log('insurance:', insurance)}
                                                              {console.log('values.insuredPersons:', values.insuredPersons)}
                                                              {console.log('formData.insuredPersons:', formData.insuredPersons)}
                                                              {console.log('isMedicalQuestionAnswered:', isMedicalQuestionAnswered(values.insuredPersons[index].age, insurance))} */}

                                                              </Typography>
                                                          : 
                                                          // <AttachMoneyIcon />
                                                            <div>
                                                              {(values.insuredPersons[index].eligilbeIns !== 'STUDENT' 
                                                                  && (insurance.compnayName !== 'BlueCross' && insurance.compnayName !== 'GMS'&& insurance.compnayName !== 'Travelance') 
                                                                  && values.insuredPersons[index].age >= 60 
                                                                  && insurance.medicalQuestion.answered===false) &&
                                                                      <Typography variant="body2" style={{color:'#3f51b5', paddingBottom:'1vh', textAlign:'right', fontWeight:'500'}} >
                                                                        <Text tid={'Quote.MedicalQuestionnaire.Instruction'}/>
                                                                        {/* {`정확한 견적을 위해 건강질문에 답변 해 주세요`} */}
                                                                      </Typography>
                                                              }
                                                              
                                                              {(values.insuredPersons[index].age >= 60 && insurance.medicalQuestion.answered===true && insurance.medicalQuestion.chargeRate === '0') &&
                                                                  <Typography variant="body2" style={{color:'#3f51b5', paddingBottom:'1vh', textAlign:'right', fontWeight:'500'}}>
                                                                    <Text tid={'Quote.MedicalQuestionnaire.NotBeEligible'}/>
                                                                    {/* {` We are sorry, not be eligible to purchase this plan.`}  */}
                                                                  </Typography>
                                                              }
                                                            </div>
                                                          }

                                                      {/* Medical Question */}
                                                      <div className={classes.subDescription}>
                                                        {
                                                          (values.insuredPersons[index].eligilbeIns === 'VISITOR' || values.insuredPersons[index].eligilbeIns === 'CANADIAN') && values.insuredPersons[index].age > 59 ?
                                                            <>
                                                              {insurance.compnayName === 'Tugo' &&
                                                                <Button
                                                                  // color='primary'
                                                                  size="md"
                                                                  style={{ 
                                                                    backgroundColor: insurance.medicalQuestion.answered === true ? "#fff" : "#2a2f71",
                                                                    color: insurance.medicalQuestion.answered === true ? "#2a2f71": "#fff",
                                                                    border: insurance.medicalQuestion.answered === true ? "1px solid #2a2f71": "none",
                                                                  }}
                                                                  // className={classes.button}
                                                                  onClick={(e) => handleOpenTugoQuestion(values.insuredPersons[index], values)}
                                                                >
                                                                  {insurance.medicalQuestion.answered === true ?
                                                                    <>
                                                                      <EditIcon style={{ color: '#2a2f71', height: '0.8em' }} />
                                                                      <Text tid={'Quote.MedicalQuestionnaire.Edit'}/>
                                                                    </>
                                                                    : <Text tid={'Quote.MedicalQuestionnaire'}/>}
                                                                    
                                                                </Button>
                                                              }
                                                              {insurance.compnayName === 'Allianz' ?
                                                                values.insuredPersons[index].eligilbeIns === 'CANADIAN'
                                                                  ?
                                                                    <Button
                                                                      // color='primary'
                                                                      size="md"
                                                                      style={{ 
                                                                        backgroundColor: insurance.medicalQuestion.answered === true ? "#fff" : "#2a2f71",
                                                                        color: insurance.medicalQuestion.answered === true ? "#2a2f71": "#fff",
                                                                        border: insurance.medicalQuestion.answered === true ? "1px solid #2a2f71": "none",
                                                                      }}
                                                                      // className={classes.button}
                                                                      onClick={(e) => { handleOpenAllianzQuestion(values.insuredPersons[index]) }}
                                                                    >
                                                                      {insurance.medicalQuestion.answered === true ?
                                                                        <>
                                                                          <EditIcon style={{ color: '#2a2f71', height: '0.8em' }} />
                                                                          <Text tid={'Quote.MedicalQuestionnaire.Edit'}/>
                                                                        </>
                                                                        // 'Edit '
                                                                        : <Text tid={'Quote.MedicalQuestionnaire'}/>}                               
                                                                    </Button>
                                                                  :
                                                                    <Button
                                                                      // color='primary'
                                                                      size="md"
                                                                      style={{ 
                                                                        backgroundColor: insurance.medicalQuestion.answered === true ? "#fff" : "#2a2f71",
                                                                        color: insurance.medicalQuestion.answered === true ? "#2a2f71": "#fff",
                                                                        border: insurance.medicalQuestion.answered === true ? "1px solid #2a2f71": "none",
                                                                      }}
                                                                      // className={classes.button}
                                                                      onClick={(e) => { handleOpenAllianzEligibility(values.insuredPersons[index]) }}
                                                                    >
                                                                    {insurance.medicalQuestion.answered === true ?
                                                                        <>
                                                                          <EditIcon style={{ color: '#2a2f71', height: '0.8em' }} />
                                                                          <Text tid={'Quote.MedicalQuestionnaire.Edit'}/>
                                                                        </>
                                                                        // 'Edit '
                                                                        : <Text tid={'Quote.MedicalQuestionnaire'}/>}  
                                                                    </Button>
                                                                : null
                                                              }
                                                            </>
                                                            : null
                                                          }

                                                          {/* hide Medical charge Rate & charge  */}
                                                          <div style={{ display: 'none' }}>
                                                          {/* <div> */}
                                                            {insurance.medicalQuestion.answered === true
                                                              && (values.insuredPersons[index].eligilbeIns === 'VISITOR' || values.insuredPersons[index].eligilbeIns === 'CANADIAN')
                                                              && values.insuredPersons[index].age > 59 ?
                                                              <>
                                                                {insurance.compnayName === 'Tugo'
                                                                  ?
                                                                  <Typography variant="body2" >
                                                                    Medical surcharge: {insurance.medicalQuestion.surcharge.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                                                                  </Typography>
                                                                  :
                                                                  <>
                                                                    {values.insuredPersons[index].eligilbeIns === 'CANADIAN' &&
                                                                      <>
                                                                        <Typography variant="body2" >
                                                                          Medical charge Rate: {insurance.medicalQuestion.chargeRate}
                                                                        </Typography>
                                                                        <Typography variant="body2" >
                                                                          Medical extra charge:  {insurance.medicalQuestion.surcharge * 100} %
                                                                        </Typography>
                                                                        <Typography variant="body2" >
                                                                          Medical discount charge:  {insurance.medicalQuestion.discount * 100} %
                                                                        </Typography>
                                                                      </>
                                                                    }
                                                                  </>
                                                                }
                                                              </>
                                                              : null
                                                            }
                                                          </div>

                                                        </div>


                                                      <Typography className={classes.subDescription}>
                                                        <Text tid={'Quote.CoveredPeriod'}/> {values.insuredPersons[index].tripPeriod} <Text tid={'Quote.Days'}/>
                                                        {/* multi trip days */}
                                                        {values.insuredPersons[index].multiTripDays > 0 && (
                                                          <>
                                                            <br/>
                                                            <Text tid={'Quote.MultiTripDays'}/> {coverage.trip_length_max} <Text tid={'Quote.Days'}/>
                                                          </>
                                                        )}
                                                        {/* waiting */}
                                                        {values.inDestination === true 
                                                          // && insurance.compnayName !== 'GMS' 
                                                          && values.insuredPersons[index].eligilbeIns === 'VISITOR' && (
                                                          <>
                                                            <br/>
                                                            <Text tid={'Quote.ArrivedAt'}/> {dateFormat(values.insuredPersons[index].arrivalDate)} ({CalculateTripDays(values.insuredPersons[index].arrivalDate,values.insuredPersons[index].tripStartDate) -1} <Text tid={'Quote.DaysBefore'}/>)
                                                            <br/>
                                                            <Text tid={'Quote.Waiting'}/>
                                                            {/* { insurance.compnayName === 'Allianz'
                                                                ? (<> 48 <Text tid={'Quote.Hours'}/></>)
                                                                : (CalculateTripDays(values.insuredPersons[index].arrivalDate,values.insuredPersons[index].tripStartDate) -1 > 59
                                                                    ? (<> 7 <Text tid={'Quote.Days'}/></>)
                                                                    : (<> 48 <Text tid={'Quote.Hours'}/></>)
                                                                  )
                                                            } */}

                                                            {/* Show Waiting Period by Company and arrival date*/}
                                                            {insurance.compnayName === 'Allianz' ? (
                                                                <> 48 <Text tid={'Quote.Hours'} /></>
                                                            ) : insurance.compnayName === 'Tugo' ? (
                                                                CalculateTripDays(values.insuredPersons[index].arrivalDate, values.insuredPersons[index].tripStartDate) - 1 > 59 ? (
                                                                    <> 7 <Text tid={'Quote.Days'} /></>
                                                                ) : (
                                                                    <> 48 <Text tid={'Quote.Hours'} /></>
                                                                )
                                                            ) : insurance.compnayName === 'GMS' || insurance.compnayName === 'Travelance' ? (
                                                                CalculateTripDays(values.insuredPersons[index].arrivalDate, values.insuredPersons[index].tripStartDate) - 1 > 29 ? (
                                                                    <> 7 <Text tid={'Quote.Days'} /></>
                                                                ) : (
                                                                    <> 48 <Text tid={'Quote.Hours'} /></>
                                                                )
                                                            ) : null}

                                                          </>)
                                                        }
                                                      </Typography>
                                                    </Grid>
                                                  
                                                  {/* Select this button */}
                                                  <Grid item xs={12} md={12}>
                                                    <Box textAlign='right'>
                                                      
                                                      <Button
                                                        id = {insurance.compnayName ==='Allianz'
                                                                ?"allianz_selectePlan_button"
                                                                :insurance.compnayName ==='Tugo'?"tugo_selectePlan_button":"selectePlan_button" }
                                                        name={`insuredPersons.${index}.selectedPlan.isSelected`}
                                                        color={values.insuredPersons[index].selectedPlan === insurance && values.insuredPersons[index].selectedPlan.isSelected ? 'secondary' : 'dark'}
                                                        disabled={((isMedicalQuestionAnswered(values.insuredPersons[index].age, insurance)===false) ||
                                                                    (studentSelectTugo(index, values.insuredPersons) 
                                                                        && insurance.compnayName === 'Allianz' )
                                                                    ) ? true : false}
                                                        className={classes.next_button}
                                                        onClick={() => {
                                                          const val = !values.insuredPersons[index].selectedPlan.isSelected
                                                          if (val === true){
                                                              values.insuredPersons[index].selectedPlan = insurance
                                                              values.insuredPersons[index].selectedPlan.selectedPlanName = coverage.generic_name
                                                              values.insuredPersons[index].selectedPlan.selectedPlanNameKr = coverage.generic_name_kr
                                                              values.insuredPersons[index].selectedPlan.tripType = coverage.trip_type
                                                              setFieldValue(`insuredPersons.${index}.selectedPlan`, values.insuredPersons[index].selectedPlan)
                                                              
                                                              if(values.insuredPersons[index].selectedPlan.compnayName === 'Tugo' &&
                                                                  values.insuredPersons[index].travelType === 'SS')
                                                                  {values.insuredPersons.map((i, pIndex) => (
                                                                                              (i.eligilbeIns === 'STUDENT' && i.travelType !== 'SS' && 
                                                                                                !(i.travelType === 'PW' && i.yearDateAfterGraduated >= i.tripEndDate) &&
                                                                                                i.selectedPlan.compnayName === 'Allianz'
                                                                                                ) ? values.insuredPersons[pIndex].selectedPlan = []
                                                                                                  : null
                                                                                            )) 
                                                                  }

                                                              // reset error message
                                                              setAlterOpen(false)
                                                              setErrormsg('')
                                                              // check product selection validation
                                                              validate(values.insuredPersons)
                                                              scrollToElement();
                                                              // window.scrollTo(0, 200)
                                                          } else{
                                                            values.insuredPersons[index].selectedPlan = []
                                                            setFieldValue(`insuredPersons.${index}.selectedPlan`, [])
                                                          }

                                                          values.insuredPersons[index].selectedPlan.isSelected = val
                                                          setFieldValue(`insuredPersons.${index}.selectedPlan.isSelected`,  val)

                                                        }}
                                                      >
                                                        {values.insuredPersons[index].selectedPlan === insurance && values.insuredPersons[index].selectedPlan.isSelected
                                                          ?  (
                                                            <>
                                                            <img
                                                                src={Checked}
                                                                alt="Selected mark"
                                                                style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                              /> 
                                                              <span><Text tid={'Quote.Selected'}/></span>
                                                            </>
                                                          ) 
                                                          : (
                                                            <span><Text tid={'Quote.Select'}/></span>
                                                          ) }
                                                      </Button>

                                                      <Grid item xs={12} md={12} style={{fontStyle:'italic', fontSize:'12px', color:'#1c1c1c', marginTop:'1vh'}}>
                                                      {
                                                        studentSelectTugo(index, values.insuredPersons) && insurance.compnayName === 'Allianz' 
                                                          ? 
                                                            (currentLanguage !== 'ko'
                                                              ? 'When Stuent ' + values.insuredPersons.filter(f=> f.travelType==='SS' && f.selectedPlan.compnayName === 'Tugo')[0].firstName + ' select Allianz coverage, can select Allianz coverage.'
                                                              : '유학생인 ' +  values.insuredPersons.filter(f=> f.travelType==='SS' && f.selectedPlan.compnayName === 'Tugo')[0].firstName + ' 님이 알리안츠 유학생 보험을 선택하여야 동시에 가입 할 수 있습니다.'
                                                            )
                                                          : null
                                                      }
                                                      </Grid>
                                                      

                                                    </Box>
                                                  </Grid>

                                                </Grid>

                                                {/* <Grid item xs={4}> */}
                                                {/* calculations for insurance amount */}
                                                <div style={{ display: 'none' }}>
                                                  {/* selectedDeduct */}
                                                  {insurance.selectedDeduct = 
                                                    (coverage.deduct 
                                                      ? coverage.type_deduct.filter(d => d.discount === parseFloat(coverage.deduct)).map(i => i.value)[0]
                                                      : coverage.type_deduct&&
                                                        coverage.type_deduct.filter(d => d.default === true).map(i => i.value)[0] 
                                                    )}
                                                  {/* calculatedDeductAmount */}
                                                  {insurance.compnayName !== 'Allianz' && formData.tripDirection !== 'OutBound' && formData.tripType === 'SINGLE' && (
                                                    insurance.calculatedDeductAmount =
                                                      (coverage.calculate_rate === 'D'
                                                        ? (coverage.value * values.insuredPersons[index].tripPeriod * coverage.deduct)
                                                        : (coverage.value * 1 * coverage.deduct))
                                                    
                                                  )}
                                                </div>
                                                

                                                {/* Optional Plan Addition */}
                                                {values.insuredPersons[index].selectedPlan === insurance ? (
                                                  <>
                                                    { values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === insurance.compnayName) &&
                                                        values.insuredPersons[index].optionalAddOnPlans.map((AddOnPlan, AddOnIndex) => (
                                                      
                                                      <div key={AddOnIndex} style={{ width:'100%'}}>
                                                        
                                                        {AddOnPlan.compnayName === insurance.compnayName
                                                          ? (<>
                                                            {AddOnPlan.planTypes.map((optionPlans, idx) => (
                                                              <div key={idx}>
                                                                {optionPlans.coverages.filter(i => i.price_code === optionPlans.selectedCoverage && i.insured_type === values.insuredPersons[index].eligilbeIns).length > 0 &&
                                                                  optionPlans.coverages.filter(i => i.price_code === optionPlans.selectedCoverage && i.insured_type === values.insuredPersons[index].eligilbeIns).map((coverage, coverageIndex) => (
                                                                    <div key={coverageIndex}  style={{ margin:'20px'}}>
                                                                      <Grid container spacing={3} style={{border:'1px solid #efefef', borderRadius:'10px'}}>
          
                                                                              <Grid item container xs={12} style={{ background:optionPlans.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb', borderRadius:'10px 10px 0 0' }}>
                                                                                <Grid item xs={12} md={9}>
                                                                                  <div className={classes.boxTitle}>
                                                                                    {/* {insurance.compnayName + ' ' + coverage.generic_name} */}
                                                                                    {optionPlans.isSelected === true ? 
                                                                                    (<img
                                                                                        src={TickInsideCircle}
                                                                                        alt="Selected mark"
                                                                                        style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                                                      />)
                                                                                    : null}

                                                                                    {(currentLanguage === 'ko' 
                                                                                        ? (coverage.generic_name_kr ? coverage.generic_name_kr : coverage.generic_name) 
                                                                                        : coverage.generic_name)}
                                                                                        
                                                                                  </div>
                                                                                </Grid>

                                                                                <Grid item xs={12} md={3} style={{ textAlign: !isMobile ? 'right' : 'center'  }}>
                                                                                    <span style={{ color: '#2a2f71', fontSize:'14px', fontWeight:'600' }}><Text tid={'Quote.Optional'}/></span>
                                                                                </Grid>
        
                                                                              </Grid> 

                                                                              {/* Coverage description */}
                                                                              <Grid item md={7} style={{fontSize: !isMobile ? '14px' : '12px', fontFamily:'heebo', fontWeight:'300'}}>
                                                                                {optionPlans.coverageType === 'ADD' ? <Text tid={'Quote.OptionalAbout'}/> 
                                                                                  : optionPlans.coverageType === 'BAG' ? <Text tid={'Quote.OptionalBaggageAbout'}/> 
                                                                                  : optionPlans.coverageType === 'CAR' ? <Text tid={'Quote.OptionalRentalCarAbout'}/> : null
                                                                                }
                                                                              </Grid>

                                                                              {/* coverage up to */}
                                                                              <Grid item xs={12} md={5} >
                                                                                <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                                                                  <Text tid={'Quote.SumInsured'}/>
                                                                                </span>

                                                                                <SelectTextField
                                                                                  // label="Coverage"
                                                                                  name={`insuredPersons.${index}.optionalAddOnPlans.${AddOnIndex}.planTypes.${idx}.selectedCoverage`}
                                                                                  value={optionPlans.selectedCoverage}
                                                                                  onChange={handleChange}
                                                                                >
                                                                                  {optionPlans.coverages
                                                                                    .filter(c => c.insured_type === values.insuredPersons[index].eligilbeIns &&
                                                                                      (c.trip_length_min <= values.insuredPersons[index].tripPeriod && c.trip_length_max >= values.insuredPersons[index].tripPeriod))
                                                                                    .map((o) => (
                                                                                      <option key={o.price_code} value={o.price_code}>
                                                                                        {amountFormat(o.price_code,0)}
                                                                                      </option>
                                                                                    ))
                                                                                  }
                                                                                </SelectTextField>
                                                                              </Grid>

                                                                              {/*  */}
                                                                              <Grid item container xs={12} style={{ background:optionPlans.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb' }}>

                                                                                  <Grid item xs={12} md={5} className={classes.priceBox} style={{ background:optionPlans.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb' }}>
                                                                                    <IconButton aria-label="view" color="primary" 
                                                                                        onClick={() => {
                                                                                          // console.log('view optionPlans', optionPlans)
                                                                                          handleOpenPDFViewer('plan',optionPlans)
                                                                                          }
                                                                                        }
                                                                                    >
                                                                                      <DescriptionIcon />
                                                                                      <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                                                                                        <Text tid={'Quote.SeeMoreBenefit'}/>
                                                                                      </Typography>
                                                                                    </IconButton> 
                                                                                    <div style={{fontStyle:'italic', fontSize:'12px', color:'#1c1c1c', marginTop:'1.5vh'}}>
                                                                                      <Text tid={'Quote.IncludeTax'}/>
                                                                                    </div>
                                                                                  </Grid>

                                                                                  <Grid item xs={12} md={7}>
                                                                                    <div style={{ display: 'none' }}>
                                                                                      {/* {AddOnPlan.compnayName}
                                                                                        {optionPlans.calculatedAddOnAmount = coverage.calculate_rate === 'D'
                                                                                          ? (coverage.value * values.insuredPersons[index].tripPeriod)
                                                                                          : (coverage.value)} */}

                                                                                        {/* Accidental Death & Dismemberment optional plan Amount at least 
                                                                                          Allianz : $16 for Accidental Death & Dismemberment */}
                                                                                        {/* {optionPlans.calculatedAddOnAmount = 
                                                                                            coverage.calculate_rate === 'D'
                                                                                              ? (AddOnPlan.compnayName === 'Allianz' 
                                                                                                  && optionPlans.coverageType === 'ADD' 
                                                                                                  && coverage.value * values.insuredPersons[index].tripPeriod < 16
                                                                                                    ? 16
                                                                                                    : coverage.value * values.insuredPersons[index].tripPeriod)
                                                                                              : (coverage.value)
                                                                                        } */}

                                                                                            {
                                                                                              optionPlans.calculatedAddOnAmount = 
                                                                                                  coverage.calculate_rate === 'D'
                                                                                                      ? (
                                                                                                          AddOnPlan.compnayName === 'BlueCross' && optionPlans.coverageType === 'ADD' 
                                                                                                              ? (coverage.value * values.insuredPersons[index].tripPeriod) + 2.52
                                                                                                              : (AddOnPlan.compnayName === 'Allianz' 
                                                                                                                  && optionPlans.coverageType === 'ADD' 
                                                                                                                  && coverage.value * values.insuredPersons[index].tripPeriod < 16
                                                                                                                      ? 16
                                                                                                                      : coverage.value * values.insuredPersons[index].tripPeriod)
                                                                                                        )
                                                                                                      : coverage.value
                                                                                            }
                                                                                    </div>
                                                                                    <Typography variant="body2" className={classes.priceOpt} >
                                                                                      {amountFormat(optionPlans.calculatedAddOnAmount,2)}
                                                                                    </Typography>

                                                                                    <Typography className={classes.subDescriptionOpt}>
                                                                                      <Text tid={'Quote.CoveredPeriod'}/> {values.insuredPersons[index].tripPeriod} <Text tid={'Quote.Days'}/>
                                                                                    </Typography>

                                                                                  </Grid>
                                                                                  {/* Select this button */}
                                                                                  <Grid item xs={12}>
                                                                                    <Box textAlign='right'>
                                                                                      <Button
                                                                                        // variant='contained'
                                                                                        color={optionPlans.isSelected ? 'secondary' : 'dark'}
                                                                                        className={classes.next_button}
                                                                                        name={`insuredPersons.${index}.optionalAddOnPlans.${index}.planTypes.${idx}.isSelected`}
                                                                                        value={`insuredPersons.${index}.optionalAddOnPlans.${index}.planTypes.${idx}.isSelected`}
                                                                                        // size="small"
                                                                                        onChange={handleChange}
                                                                                        onClick={() => {
                                                                                          optionPlans.isSelected = !optionPlans.isSelected
                                                                                          setFieldValue(`insuredPersons.${index}.optionalAddOnPlans.${AddOnIndex}.planTypes.${idx}.selectedCoverage`, optionPlans.selectedCoverage)
                                                                                        }}
                                                                                      >
                                                                                        {optionPlans.isSelected === true ? (
                                                                                          <>
                                                                                          <img
                                                                                              src={Checked}
                                                                                              alt="Selected mark"
                                                                                              style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                                                            /> 
                                                                                            <span><Text tid={'Quote.Added'}/></span>
                                                                                          </>
                                                                                        ) 
                                                                                        : (
                                                                                          <span><Text tid={'Quote.Add'}/></span>
                                                                                        ) }
                                                                                      </Button>
                                                                                    </Box>
                                                                                  </Grid>
                                                                              </Grid>

                                                                      
                                                                        </Grid>
                                                                    </div>
                                                                  ))}
                                                              </div>
                                                            ))
                                                            }

                                                          </>
                                                          )
                                                          : null
                                                        }
                                                      
                                                      </div>

                                                    ))}
                                                    
                                                  </>
                                                
                                                ) : null}
                                        



                                                {/* Carewell addition */}
                                                {/* {values.insuredPersons[index].selectedPlan === insurance ? (
                                                  <>
                                                  <Grid item container spacing={3} style={{border:'1px solid #efefef', borderRadius:'10px', margin:'10px'}}>
                                                      <Grid item container xs={12} style={{ background:values.insuredPersons[index].optionalCarewellService.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb', borderRadius:'10px 10px 0 0' }}>
                                                      <Grid item xs={12} md={9}>
                                                        <div className={classes.boxTitle}>
                                                          {values.insuredPersons[index].optionalCarewellService.isSelected === true ? 
                                                          (<img
                                                              src={TickInsideCircle}
                                                              alt="Selected mark"
                                                              style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                            />)
                                                          : null}
                                                          Carewell Service
                                                        </div>
                                                        </Grid>

                                                          <Grid item xs={12} md={3} style={{ textAlign: !isMobile ? 'right' : 'center'  }}>
                                                              <span style={{ color: '#2a2f71', fontSize:'14px', fontWeight:'600' }}><Text tid={'Quote.AdditionalServices'}/></span>
                                                          </Grid>

                                                      </Grid>

                                                      <Grid item xs={12} md={7} style={{ fontSize: !isMobile ? '14px' : '12px', fontFamily:'heebo', fontWeight:'300' }}>
                                                            <Text tid={'Quote.AdditionalServicesAbout'}/>
                                                      </Grid>

                                                      <Grid item xs={12} md={5}>
                                                        <div style={{ display: 'none' }}>
                                                          {values.insuredPersons[index].optionalCarewellService.packageAmount 
                                                            = calculatePackageAmount(carewellService, values.insuredPersons[index].optionalCarewellService.packageName, values.insuredPersons[index].tripPeriod)}
                                                        </div>
                                                        <FormControl >
                                                            <RadioGroup
                                                              aria-label="carewell"
                                                              name={`insuredPersons.${index}.optionalCarewellService.packageName`}
                                                              style={{ flexDirection: 'initial' }}
                                                              value={values.insuredPersons[index].optionalCarewellService.packageName}
                                                              onChange={(e) => {
                                                                  let carewellServiceAmount = calculatePackageAmount(carewellService, values.insuredPersons[index].optionalCarewellService.packageName, values.insuredPersons[index].tripPeriod)
                                                                  
                                                                  values.insuredPersons[index].optionalCarewellService.packageName = e.currentTarget.value
                                                                  values.insuredPersons[index].optionalCarewellService.packageAmount = carewellServiceAmount
                                                                  setFieldValue(`insuredPersons.${index}.optionalCarewellService.packageAmount`, carewellServiceAmount)
                                                              }}>
                                                              {
                                                                // carewellService.map((carewell) => (
                                                                carewellService.map((c)=> ({name: c.name, numIncludedType: c.boundType.filter(f => f === values.tripDirection).length}))
                                                                                .filter( i => i.numIncludedType > 0).map(carewell => ( 
                                                                <FormControlLabel 
                                                                  key={carewell.name} 
                                                                  style={{ justifyContent: 'flex-start', padding: '0 30px' }}
                                                                  value={carewell.name}
                                                                  control={
                                                                    <Radio
                                                                      // id ='carewell_select_option'
                                                                      disableRipple
                                                                      color="default"
                                                                      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                                                                      icon={<span className={classes.icon} />}
                                                                      value={carewellService.name}
                                                                    />}
                                                                  label={carewell.name }
                                                                />
                                                              ))}
                                                            </RadioGroup>
                                                          </FormControl>
                                                      </Grid> 


                                                    <Grid item container xs={12} style={{ background:values.insuredPersons[index].optionalCarewellService.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb' }}>
                                                      <Grid item xs={12} md={5} className={classes.priceBox} style={{ background:values.insuredPersons[index].optionalCarewellService.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb' }}>
                                                        <IconButton aria-label="view" color="primary" 
                                                            onClick={() => handleOpenPDFViewer('carewell',insurance)}
                                                        >
                                                          <DescriptionIcon />
                                                          <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                                                            <Text tid={'Quote.SeeMoreBenefit'}/>
                                                          </Typography>
                                                        </IconButton> 
                                                        <div style={{fontStyle:'italic', fontSize:'12px', color:'#1c1c1c', marginTop:'1.5vh'}}>
                                                          <Text tid={'Quote.IncludeTax'}/>
                                                        </div>
                                                      </Grid>
                                                      
                                                      <Grid item xs={12} md={7} >
                                                        <Typography variant="body2" className={classes.priceOpt}>
                                                          {amountFormat(values.insuredPersons[index].optionalCarewellService.packageAmount, 2)}
                                                        </Typography>
                                                        <Typography className={classes.subDescriptionOpt}>
                                                          <Text tid={'Quote.CoveredPeriod'}/> {values.insuredPersons[index].tripPeriod} <Text tid={'Quote.Days'}/>
                                                        </Typography>
                                                      </Grid>
                                                      
                                                      <Grid item xs={12} md={12}>
                                                        <Box textAlign='right'>
                                                          <Button
                                                            name={`insuredPersons.${index}.selectedCarewellService.isSelected`}
                                                            color={values.insuredPersons[index].optionalCarewellService.isSelected ? 'secondary' : 'dark'}
                                                            disabled={values.insuredPersons[index].optionalCarewellService.packageAmount === 0 ? true : false}
                                                            className={classes.next_button}
                                                            onClick={() => {
                                                              values.insuredPersons[index].optionalCarewellService.isSelected = !values.insuredPersons[index].optionalCarewellService.isSelected
                                                              setFieldValue(`values.insuredPersons.${index}.optionalCarewellService.packageName`, carewellService.name)
                                                            }}
                                                          >
                                                            {values.insuredPersons[index].optionalCarewellService.isSelected ?  (
                                                              <>
                                                              <img
                                                                  src={Checked}
                                                                  alt="Selected mark"
                                                                  style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                                /> 
                                                                <span><Text tid={'Quote.Added'}/></span>
                                                              </>
                                                            ) 
                                                            : (
                                                              <span><Text tid={'Quote.Add'}/></span>
                                                            ) }
                                                          </Button>

                                                        </Box>
                                                      </Grid>
                                                    </Grid>

                                                </Grid>
                                                </>

                                                ):null} */}
                                              

                                              </Grid>
                                              
                                            </div>

                                          </Grid>
                                          
                                          <Grid item xs></Grid>
                                        </Grid>

                                      </div>

                                    ))

                                  }
                                </Grid>

                              </Grid>
                            ))
                            }
                            
                            <Grid container>
                              <Grid item xs></Grid>
                              <Grid item xs={12} md={11}>
                                  <Grid container>
                                      <Grid item xs={6}>
                                        {!isMobile && values.insuredPersons[index - 1] && (
                                          <MuiButton
                                              className={classes.button2}
                                              onClick={() => { setIndex(index - 1); scrollToElement(); }}
                                          >
                                              <span className={classes.btn_small}>
                                                  {currentLanguage !== 'ko'
                                                      ?(`< Go to ${values.insuredPersons[index-1].relationship} ( ${values.insuredPersons[index-1].firstName} ) `)
                                                      :(`< ${values.insuredPersons[index-1].relationship} ( ${values.insuredPersons[index-1].firstName} 님 ) 보험 선택`)
                                                  }
                                              </span>
                                          </MuiButton>
                                        )}
                                      </Grid>
                                      <Grid item xs={6} style={{ textAlign: 'right' }}>
                                        {!isMobile && values.insuredPersons[index + 1] && (
                                          <MuiButton
                                              className={classes.button2}
                                              onClick={() => { setIndex(index + 1); scrollToElement(); }}
                                          >
                                              <span className={classes.btn_small}>
                                                  {currentLanguage !== 'ko'
                                                      ?(`Go to ${values.insuredPersons[index+1].relationship} ( ${values.insuredPersons[index+1].firstName} )  >`)
                                                      :(`${values.insuredPersons[index+1].relationship} ( ${values.insuredPersons[index+1].firstName} 님 ) 보험 선택 >`)
                                                  }
                                              </span>
                                          </MuiButton>
                                        )}
                                      </Grid>
                                  </Grid>
                              </Grid>
                              <Grid item xs></Grid>
                            </Grid>
                          </div>

                        </Grid>
                      </Grid>
                    </>
                  }
                </Grid>

              </Grid>
            </Grid>

            {/* You selected - mobile */}
            {isMobile && values.insuredPersons[index].selectedPlan.length !== 0 && (
              <>
            
                <Grid item xs={12} style={{marginTop:'1vh'}}>
                          
                  <Card style={{ textAlign: 'left', border:'1px solid #cfcfcf', borderRadius:'0', boxShadow:'0 3px 15px #00000014' }}>
                    <CardContent className={classes.cardContentBox}>
                      <Grid container>
                        
                        <Grid item xs={12} style={{textAlign: 'center', marginBottom:'3vh', paddingBottom:'1vh' }}>
                          <Typography style={{fontWeight:600, fontSize:'18px', color:'#000000DE', marginBottom:'1vh'}}>
                            <Text tid={'Quote.YourCoverage'}/>
                          </Typography>
                          <Typography style={{background:'rgb(240, 245, 255)', paddingTop:'2vh' }}>
                            {`${values.insuredPersons[index].firstName}  ${values.insuredPersons[index].lastName} `}
                          </Typography>
                          <Typography variant="body2" style={{color:'#3f51b5', fontSize:'2em', fontWeight:'700', background:'rgb(240, 245, 255)', padding:'1.5vh', paddingTop:'0'}}>
                              {values.insuredPersons[index].selectedPlan.insuranceAmount !== 0
                                ? amountFormat(values.insuredPersons[index].selectedPlan.calculatedInsuranceAmount, 2)
                                : <AttachMoneyIcon />}
                              {/* {amountFormat(values.insuredPersons[index].selectedPlan.calculatedInsuranceAmount, 2)} */}
                          </Typography>
                        </Grid>

                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                          
                          <Typography className={classes.title2} color="textSecondary" gutterBottom>
                            <img
                              src={Insurance}
                              alt="Insurance icon"
                              style={{marginRight:'10px', paddingBottom:'3px'}} 
                            />
                            {values.insuredPersons[index].selectedPlan.compnayName + ' ' + values.insuredPersons[index].selectedPlan.coverages[0].generic_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                          {/* Insurance Premium */}
                          <Typography className={classes.title2} color="textSecondary" gutterBottom>
                            {/* {amountFormat(values.insuredPersons[index].selectedPlan.insuranceAmount, 2)} */}
                            {values.insuredPersons[index].selectedPlan.insuranceAmount !== 0
                              ? amountFormat(values.insuredPersons[index].selectedPlan.insuranceAmount, 2)
                              : <AttachMoneyIcon />}
                          </Typography>
                        </Grid>
                                      
                        {values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName) &&
                          values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName).planTypes.filter(plan => plan.isSelected === true).map((plan, idx) => (
                          <Grid container key={idx}>
                            <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                              <img
                              src={Add}
                              alt="Insurance icon"
                              style={{marginRight:'10px', paddingBottom:'3px'}} 
                              />
                                {plan.planName}
                              </Typography>
                            </Grid>
                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                              {/* Optional Fee */}
                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                {amountFormat(plan.calculatedAddOnAmount)}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}

                        {values.insuredPersons[index].optionalCarewellService.isSelected && (
                          <>
                            <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                              <img
                              src={Support}
                              alt="Insurance icon"
                              style={{marginRight:'10px', paddingBottom:'3px'}} 
                              />
                                Carewell {values.insuredPersons[index].optionalCarewellService.packageName}
                              </Typography>
                            </Grid>
                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                              {/* Carewell Fee */}
                              <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                {amountFormat(values.insuredPersons[index].optionalCarewellService.packageAmount, 2)}
                              </Typography>
                            </Grid>
                          </>
                        )}

                    </Grid>

                  </CardContent>
                </Card>
              </Grid>

              </>
            )}
        
            {/* {isMobile && values.insuredPersons[index].selectedPlan.length !== 0 ? (
              <>
                  <Grid container style={{ boxShadow:'0 3px 15px #00000014', background:'#fff', position:'fixed', bottom:'0', left:'0', width:'100vw', padding:'15px' }}>
                    {isMobile && alterOpen && (
                      <Grid item xs={12} style={{ margin: '1vh 0' }} >
                        <Alert
                            severity='error'
                            onClose={() => setAlterOpen(false)}
                        >
                            <Text tid={`Quote.Error.${errormsg}`}/>
                        </Alert>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <div>
                        <Typography style={{textAlign:'left', display:'inline-block', fontSize:'15px', fontWeight:'600', color:'#1c1c1c', marginRight:'1vh'}}>
                          Total : 
                        </Typography>
                        <Typography style={{color:'#3f51b5', fontSize:'28px', fontWeight:'700', textAlign:'left', display:'inline-block'}}>
                        {values.insuredPersons.filter(f=> f.selectedPlan.insuranceAmount===0).length === 0
                          ? amountFormat((total ? total : 0), 2)
                          : <AttachMoneyIcon />}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                        {
                          validate(values.insuredPersons)
                        }
                    </Grid>
                  </Grid>
                
              </>
            )
            :null} */}

            {/* {!isMobile && alterOpen && (
              <Grid item xs={12} style={{ margin: '1vh 0' }}>
                <Alert
                    severity='error'
                    onClose={() => setAlterOpen(false)}
                >
                    {errormsg}
                </Alert>
              </Grid>
            )} */}

        <Grid container style={{ margin: '10vh 0 10vh 0' }} justifyContent="center" spacing={1}>
            <Grid item xs={6} sm={6} md={3} lg={3}>
              <Button
                // variant='contained'
                  color="secondary"
                  className={classes.back_button}
                  onClick={() => {

                    setFormData(values); prevStep()
                    
                    // props.updateFormData(values); 
                    // props.history.push(pathDirection(props.location.pathname, values).prevStep)
                  }}
              >
                <Text tid={'Button.Previous'} />
                {/* Previous */}
                {/* 이전페이지 */}
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} md={3} lg={3}>
              {/* button - Purchase */}
                {/* {!isMobile ? (
                  validate(values.insuredPersons)
                ) : null } */}
                {validate(values.insuredPersons)}
            </Grid>
        </Grid>
          </Form>
        )}
      </Formik>

      {/* PDF Viewer Modal  */}
      {
        openPDFViewer === true &&
        <PDFViewer
          title={pdfOption.title}
          pdf={pdfOption.brochures_url} 
          openPDFViewer={openPDFViewer}
          setOpenPDFViewer={setOpenPDFViewer}
        />
      }

      {/* modal for medical question  */}
      {
        openTugoQuestion === true &&
        <MedQuestionTugoForm
          medQuestion={medQuestion}
          questionnaire={medQuestion.map(m => m.eligilbeIns)[0] === 'CANADIAN'
            ? questions.filter(q => q.company_id === 'ICO00002' && q.code === 'TQU-TMQ-4')
            : questions.filter(q => q.company_id === 'ICO00002' && q.code === 'TQU-VMQ-1')
          }
          open={openTugoQuestion}
          handleClose={setOpenTugoQuestion}
        />
      }

      {/* {
        openAllianzQuestion === true &&
        <MedQuestionAllianzForm
          medQuestion={medQuestion}
          questionnaire={questions.filter(q => q.company_id === 'ICO00001' && q.code === 'AQU-CMQ-1')}
          open={openAllianzQuestion}
          handleClose={setOpenAllianzQuestion}
        />
      } */}
      {
        openAllianzQuestion === true &&
        <MedQuestionAllianzCAN
          data={formData}
          insuredPerson={selectedInsuredPerson}
          medQuestion={medQuestion}
          questionnaire={questions.filter(q => q.company_id === 'ICO00001' && q.code === 'AQU-CMQN-1')}
          open={openAllianzQuestion}
          handleClose={setOpenAllianzQuestion}
        />
      }

      {
        openAllianzEligibility === true &&
        <MedEligibilityAllianzForm
          medQuestion={medQuestion}
          questionnaire={questions.filter(q => q.company_id === 'ICO00001' && q.code === 'AQU-VEQ-1')}
          open={openAllianzEligibility}
          handleClose={setOpenAllianzEligibility}
        />
      }
    </>
  );
};

// ProtoTypes
ProductSelection.propTypes = {
  formData: PropTypes.object.isRequired
};

export default ProductSelection;