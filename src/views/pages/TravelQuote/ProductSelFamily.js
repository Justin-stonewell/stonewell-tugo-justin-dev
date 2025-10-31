import React, { useState, useContext, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup'
// core components
import { Typography, Grid, Box, IconButton } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Tooltip } from "@material-ui/core";
// Allianz API
import { useSelector, useDispatch } from 'react-redux';
import { quoteAllianz } from '../../../redux/actions/travelApplicationAction';
import LoadingModal from '../TravelApplication/LoadingModal';
import store from '../../../redux/store';

// components
import { Text } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button';
import { SelectTextField } from '../../../components/common/CustomTextFields/TextField'
import { LanguageContext } from "../../../components/common/LanguageProvider";
// PDF Viewer
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";
//
import { amountFormat } from '../../../controllers/dataFormat'
// import { calculateInsuranceAmount } from '../../../functionalities/CalculateInsurance';
import { calculateInsuranceAmount } from '../../../functionalities/CalculateInsuranceAPI';
// icon
import Checked from '../../../assets/imgs/icons/checked.svg'
import HelpIcon from '@mui/icons-material/Help';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';

//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import blueCrossLogo from '../../../assets/imgs/logo/blueCross-logo.png'
import travelanceLogo from '../../../assets/imgs/logo/travelance-logo.png'

//style
import formStyle from '../../../assets/jss/styles/formStyle';


const useStyles = makeStyles(formStyle)

const FormObserver = ({ formData }) => {
  const { setValues } = useFormikContext();

  useEffect(() => {
    setValues(formData);
  }, [formData, setValues]);

  return null;
};


  // validationSchema
  const validationSchema = Yup.object({
      familyGroup: Yup.object().shape({
        isSelected: Yup.string().required('FieldIsRequired'),
        selectedCompnayName: Yup.string().when("isSelected", 
          { is: (value) => 
                  value === 'true',
                  then: Yup.string().required('SelectInsuraceCompany'),
          }),
        })
  })

  // ValidMessage
  function validMessage(fieldName) {
    return (
        <ErrorMessage
            name={fieldName}
            render={(msg) => 
                <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
                    <Text tid={`Validation.${msg}`}></Text>
                </div>
            }
        />
    );
  }


const ProductSelFamily = ({
    formData,
    setFormData,
    nextStep,
    prevStep,
  }) => {

  const classes = useStyles()
  const dispatch = useDispatch();

   //Responsive Design
   const [width, setWidth] = useState(window.innerWidth);
   function handleWindowSizeChange() {
     setWidth(window.innerWidth);
   }

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
    if (formData.tripDirection === 'OutBound' && (formData.originProvince === 'ON' || formData.originProvince === 'QC')) { 
      try {
        // getQuotesAllianz 함수 호출 시 await 키워드 사용
        await getQuotesAllianz(values);
        // console.log('allianzAPIResult:',allianzAPIResult)
        // setApiResult(quoteAllianzResult);
      } catch (error) {
        // 오류 처리
        console.error('An error occurred:', error);
      }
    }
  }, [formData, getQuotesAllianz]); // getQuotesAllianz를 의존성으로 추가

  useEffect(() => {
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

  }, [dispatch, formData, callAllianzAPI]);

  // useEffect for Allianz API
  useEffect(() => {
    if (quoteAllianzResult.length > 0 && !quoteAllianzLoading && !quoteAllianzError) {
      const sagaResult = quoteAllianzResult[0];
      // console.log('sagaResult:', sagaResult);
  
      const medicalCategories = sagaResult.offerCategories.find(category => category.name === "Medical");
      const medicalProductNoDeductible = medicalCategories?.products[0];
      const medicalProductDeductible = medicalCategories?.products[1];
  
      if (medicalProductNoDeductible) {
        // console.log('medicalProductNoDeductible:', medicalProductNoDeductible);
  
        const newInsuredPersons = formData.insuredPersons.map((person, index) => {
          const premiumValue = medicalProductNoDeductible.insured[index]?.premium;
          const medicalProductDeductValue = medicalProductDeductible?.insured[index]?.premium;
  
          return {
            ...person,
            insurancePlans: person.insurancePlans.map(plan => {
              if (plan.compnayName === "Allianz") {
                return {
                  ...plan,
                  calculatedInsuranceAmount: premiumValue,
                  insuranceAmount: premiumValue,
                  calculatedDeductAmount: 0,
                  medicalProductNoDeductValue: premiumValue,
                  medicalProductDeductValue: medicalProductDeductValue
                };
              }
              return plan;
            })
          };
        });
  
        formData.insuredPersons = newInsuredPersons;
        // console.log('formData.insuredPersons', formData.insuredPersons);
      }
      
      setForceRender(prev => !prev); // 상태 업데이트 후 강제 리렌더링
  
      // 모달 닫기
      setIsHideModalOpen(false);
      setIsModalOpen(false);
    }
  }, [quoteAllianzResult, quoteAllianzLoading, quoteAllianzError, formData]);

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

  // formData가 변경될 때 Allianz API Quote 을 위한 모달을 다시 열도록 설정
  useEffect(() => {
    if (formData.insuredPersons.length > 0 && formData.tripType === 'SINGLE' && formData.tripDirection === 'OutBound' && (formData.originProvince === 'ON' || formData.originProvince === 'QC')) {
      setIsModalOpen(true);
    }
  }, [formData]);

   useEffect(() => {
     window.addEventListener('resize', handleWindowSizeChange);
     return () => {
         window.removeEventListener('resize', handleWindowSizeChange);
     }
   }, []);

   


   let isMobile = (width <= 768);

   //current language
   let currentLanguage = useContext(LanguageContext).userLanguage

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (kind, insurance) => {
    let url = ''
    if (kind === 'plan'){
      if (insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase())).length > 0){
            url = process.env.REACT_APP_S3_URL + insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()))[0].document_url
      }
    } else
    {
      // set carewell brochure url
      url = ''
    }
    setPdfOption({
            brochures_url : url,
            title : kind === 'plan'? `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}` : 'Carewell Services'
        })
    setOpenPDFViewer(true)
  }

  const [direction, setDirection] = useState('back');

  const familyGroupInfo = [
    {compnayName : 'Tugo',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 1, outSort: 2},
    {compnayName : 'Allianz',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 2, outSort: 3},
    {compnayName : 'BlueCross',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 3, outSort: 1},
    {compnayName : 'Travelance',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 4, outSort: 4},
  ]

  // set Premium
  const setPremium = (values) => {

    //set totalPremium
    familyGroupInfo.map(i=>i.totalPremium = 0)                  
    values.insuredPersons.map(p=>p.insurancePlans
        .filter(f => {
            const eligibleIns = values.insuredPersons[0].eligilbeIns;
            const isWithin31Days = values.insuredPersons[0].tripPeriod < 31;
            // When Visitor, No Allianz
            return eligibleIns === 'CANADIAN'
              ? f.compnayName === 'Allianz' || f.compnayName === 'Tugo' || f.compnayName === 'BlueCross'
              : (eligibleIns !== 'CANADIAN' && f.compnayName !== 'Allianz') &&
                (isWithin31Days ? f.compnayName !== 'GMS' : f.compnayName !== 'GMS' && f.compnayName !== 'BlueCross');
            })    
        .map(ins=>(
            familyGroupInfo.filter(f=>f.compnayName === ins.compnayName)[0].totalPremium += ins.insuranceAmount
        ))
      )

      // values.insuredPersons.forEach(p => {
      //   p.selectedPlan.insuranceAmount = values.familyGroup.familyPremium/values.insuredPersons.length
      // })
   
    
    // set familyPremium
    const birthDateArray = values.insuredPersons.map(i=>i.birthDate)

    let eldestBirthDate = new Date(Math.min(...birthDateArray))

    const eldest = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === eldestBirthDate.toISOString().slice(0,10))[0].insurancePlans

    eldest.forEach(e => {
      if (e.compnayName === 'Allianz' || e.compnayName === 'Tugo' || e.compnayName === 'Travelance'){
        familyGroupInfo.filter(f=>f.compnayName === e.compnayName)[0].familyPremium = e.insuranceAmount * 2 
        
        // Add the condition to set familyPremium to 20 if it's less than 20
        if (familyGroupInfo.filter(f => f.compnayName === e.compnayName)[0].familyPremium < 20) {
          familyGroupInfo.filter(f => f.compnayName === e.compnayName)[0].familyPremium = 20;
        }

      } else if (e.compnayName === 'BlueCross'){

        // get 2nd insured insurance & insurance amount
        // const birthDate2ndArray = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) !== eldestBirthDate.toISOString().slice(0,10)).map(i=>i.birthDate)
        let birthDate2ndArray;
        if (values.insuredPersons.filter(f => f.birthDate.toISOString().slice(0, 10) === eldestBirthDate.toISOString().slice(0, 10)).length===2) {
          birthDate2ndArray = values.insuredPersons.filter(f => f.birthDate.toISOString().slice(0, 10) === eldestBirthDate.toISOString().slice(0, 10)).map(i => i.birthDate)
        } else {
          birthDate2ndArray = values.insuredPersons.filter(f => f.birthDate.toISOString().slice(0, 10) !== eldestBirthDate.toISOString().slice(0, 10)).map(i => i.birthDate)
        }

        let birthDate2nd = new Date(Math.min(...birthDate2ndArray))
  
        const insuraceAmount2nd = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === birthDate2nd.toISOString().slice(0,10))[0]
                                            .insurancePlans.filter(f=>f.compnayName ==='BlueCross')[0].insuranceAmount - 11
  
        familyGroupInfo.filter(f=>f.compnayName === e.compnayName)[0].familyPremium = e.insuranceAmount  + insuraceAmount2nd
        
        // Add the condition to set familyPremium to 20 if it's less than 20
        if (familyGroupInfo.filter(f => f.compnayName === e.compnayName)[0].familyPremium < 25) {
          familyGroupInfo.filter(f => f.compnayName === e.compnayName)[0].familyPremium = 25;
        }
      }
      
    });

    // set family discount
    familyGroupInfo.map(i => i.discountPremium = i.totalPremium - i.familyPremium)
  
    return null
  }
  

  function handleSubmit(values){

    if((values.familyGroup.isSelected === true && values.familyGroup.selectedCompnayName) 
        || values.familyGroup.isSelected === false ){

        for (let i = 0; i < values.insuredPersons.length; i++) {
          if (values.insuredPersons[i].selectedPlan && values.insuredPersons[i].selectedPlan.isSelected === true ){
            values.insuredPersons[i].selectedPlan = []
          }

            values.insuredPersons[i].insurancePlans
              .filter(f=>f.compnayName ===values.familyGroup.selectedCompnayName)
              .forEach(ins => {
                        values.insuredPersons[i].selectedPlan = ins
                        values.insuredPersons[i].selectedPlan.isSelected = true
                        ins.coverages
                            .filter(cf=>cf.price_code === ins.selectedCoverage)
                            .forEach(coverage => {
                                values.insuredPersons[i].selectedPlan.selectedPlanName = coverage.generic_name
                                values.insuredPersons[i].selectedPlan.selectedPlanNameKr = coverage.generic_name_kr
                                values.insuredPersons[i].selectedPlan.tripType = coverage.trip_type
                            })          
              })
        }

        //set familyPremium
        if (values.familyGroup.isSelected === true){
            values.insuredGroupType = 'Family'
            familyGroupInfo
              .filter(f=>f.compnayName === values.familyGroup.selectedCompnayName)
              .forEach(fg => {
                values.familyGroup.totalPremium = fg.totalPremium
                values.familyGroup.familyPremium = fg.familyPremium
                values.familyGroup.discountPremium = fg.discountPremium
              })
        }else{
          values.insuredGroupType = 'Individual'
          values.familyGroup.selectedCompnayName = ''
          values.familyGroup.totalPremium = 0
          values.familyGroup.familyPremium = 0
          values.familyGroup.discountPremium = 0
          // retset optional plan
          values.insuredPersons.map(i => i.optionalAddOnPlans.map(o => o.planTypes.map(t=> t.isSelected = false ) ))
        }

        setFormData(values);
        window.scrollTo(0, 0)//scroll to top after submit

        if(values.familyGroup.isSelected === true && values.familyGroup.selectedCompnayName){
          direction === 'back' ? prevStep() : nextStep();
        }

    }

  }



  return (
      <>
        <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={values => {
              handleSubmit(values)
              // console.log(values)
            }}
          >
            {({ values, setFieldValue, setValues, errors }) => (
              <Form className={classes.formWrapper}>
                <div>      
                  <Grid container justifyContent="center">

                    <Grid item xs={12} sm={12} md={10} lg={8} container justifyContent="center">
                      {isModalOpen === true && <LoadingModal />} 
                      <Typography variant="h5" gutterBottom className={classes.title_question} style={{ textAlign: 'center', marginBottom: isMobile ? '2vh': '0', marginTop: isMobile ? '5vh': '10vh' }}>
                          <Text tid={'Quote.LetsBuildCoverage'}/>
                          <span className={classes.title_question_sub2} style={{ textAlign: 'center' }}>
                          <Text tid={'Quote.SelectCoverage'}/>
                        </span>
                      </Typography>
                    </Grid>
                    <FormObserver formData={formData} />
                    <Grid item xs={12} sm={12} md={10} lg={8} container justifyContent="center">
                      <Alert severity="info">
                                <AlertTitle><Text tid={'Quote.FamilyDiscountTitle'}/></AlertTitle>
                                <Text tid={'Quote.FamilyDiscountDescription'}/>
                      </Alert>
                    </Grid>

                      <Grid item xs={12} container className={classes.title_question_big} justifyContent="center">
                          <Typography variant="h5">
                              <Text tid={'Quote.FamilyDiscountQuestion'}/>
                          </Typography>
                      </Grid>
                    
                      <Grid item xs={12} sm={12} md={10} lg={5} container justifyContent="center" style={{ marginBottom:'5vh' }}>
                        <ToggleButtonGroup
                              className={classes.toggleButtonGroup}
                              name= {`familyGroup.isSelected`}
                              value={values.familyGroup.isSelected}
                              exclusive
                              onChange={(e) => {
                                const val = e.currentTarget.value === 'true' ? true : false
                                if (val===false){
                                    values.familyGroup.selectedCompnayName = ''
                                    values.familyGroup.totalPremium = 0
                                    values.familyGroup.familyPremium = 0
                                    values.familyGroup.discountPremium = 0
                                    // retset optional plan
                                    values.insuredPersons.map(i => i.optionalAddOnPlans.map(o => o.planTypes.map(t=> t.isSelected = false ) ))
                                }
                                values.familyGroup.isSelected = val
                                  setFieldValue(`familyGroup.isSelected`, val)
                              }}
                          >
                              <ToggleButton value={true} className={classes.toggleButton}>
                                <Text tid={'Button.Yes'}/>
                              </ToggleButton>
                              <ToggleButton value={false} className={classes.toggleButton}>
                                <Text tid={'Button.No'}/>
                              </ToggleButton>
                        </ToggleButtonGroup>
                        {validMessage(`familyGroup.isSelected`)}
                      </Grid>

                    {/* calculate / set premium */}
                    <div style={{ display: 'none' }}>
                      {/* calculate Insuranc eAmount */}
                      {calculateInsuranceAmount(values)}
                      {/* set family premium */}
                      {setPremium(values)}
                    </div>
                    
                    {values.familyGroup.isSelected===true 
                      ?
                      <Grid item container justifyContent="center"  xs={12} sm={12} md={10} lg={8}>                   
                        <Grid item xs={12} container className={classes.title_question_big} justifyContent="center">
                          {values.familyGroup.isSelected===true ?
                              <Typography variant="h5">
                                  <Text tid={'Quote.FamilyPlanCustomized'}/>
                              </Typography>
                          :
                              <Typography variant="h5">
                                  <Text tid={'Quote.FamilyPlanSummary'}/>
                              </Typography>
                          }
                        </Grid>
                        
                        <Grid item container justifyContent="center" xs={12} sm={12} md={12}>
                          {familyGroupInfo.filter(f=> f.totalPremium > 0)
                            .sort((a,b)=> values.tripDirection === 'InBound'? (a.inSort -  b.inSort): (a.outSort - b.outSort))
                            .map((family) => (
                            <Grid item key={family.compnayName} xs={12} sm={4} md={4}>
                              <Card style={{margin: '1vh', borderTop: '10px solid #2a2f71', boxShadow:'rgb(0 0 0 / 8%) 0px 3px 15px'}}>
                                <CardContent style={{marginRight: isMobile ? '2vh': '0', padding: isMobile ? '0': '16px'}}>
                                  <Grid item xs={12} >
                                    <Box textAlign ='center' style={{height: '70px'}}>
                                      <img
                                        src={family.compnayName === 'Tugo' 
                                              ? tugoLogo : family.compnayName === 'Allianz' 
                                                ? allianzLogo : family.compnayName === 'BlueCross'
                                                  ? blueCrossLogo : travelanceLogo}
                                        alt='logo'
                                        style={{width: family.compnayName === 'Allianz' ? '110px' : family.compnayName ==='Tugo' ? '120px' : 'auto', height: family.compnayName ==='BlueCross' ? '70px' : family.compnayName ==='Tugo' ? 'auto' : '70px', padding:'1vh'}}
                                      />
                                      {values.tripDirection === 'InBound'? "Visitor Family Plan" : "Canadian Family Plan"} 
                                    </Box>
                                  </Grid>
                                </CardContent>
                                {values.familyGroup.isSelected &&
                                  <CardActions>
                                  {/* Coverage */}
                                    <Grid item xs={12} style={{textAlign:'center'}}>
                                      <Grid item xs={12} container justifyContent="center" spacing={1} style={{paddingTop:'2vh', borderTop:'1px solid #eee'}}> 
                                        {values.insuredPersons[0].insurancePlans
                                            .filter(fp=>fp.compnayName === family.compnayName)
                                            .map((insurance, insIndex) => (
                                                <React.Fragment key={insIndex}>
                                                  <Grid item container xs={12} lg={10} spacing={1}>
                                                          {insurance.coverages
                                                              .filter(f=>f.price_code=== insurance.selectedCoverage)
                                                              .map((coverage, cIndex)=>(
                                                                
                                                                <React.Fragment key={cIndex}>   
                                                                  <Grid item xs={6} md={6}>
                                                                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                                    <Text tid={'Quote.SumInsured'}/>
                                                                    <Tooltip title={<Text tid={'Tooltip.SumInsured'}/>} placement="right-end" enterTouchDelay={0} leaveTouchDelay={5000} color="primary">
                                                                        <HelpIcon style={{height:'20px', marginLeft:'5px'}}/>
                                                                    </Tooltip>
                                                                  </span>
                                                                  {insurance.coverages.length > 1 
                                                                    ?
                                                                      <SelectTextField
                                                                        name={`insurance.selectedCoverage`}
                                                                        style={{width:'100%'}}
                                                                        defaultValue={insurance.selectedCoverage}
                                                                        onChange={(e) => {
                                                                          for (const i in values.insuredPersons) { 
                                                                            values.insuredPersons[i].insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                                  [0].selectedCoverage = e.currentTarget.value
                                                                          }
                                                                          setFieldValue(`insurance.selectedCoverage`, e.currentTarget.value)
                                                                        }}
                                                                      >
                                                                        {
                                                                          values.insuredPersons[0].eligilbeIns !== 'CANADIAN' ?
                                                                            <>
                                                                              {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                                                <option key={coverage.price_code} value={coverage.price_code}>
                                                                                  {amountFormat(coverage.price_code, 0)}
                                                                                </option>
                                                                              ))}
                                                                            </>
                                                                            :
                                                                            <>
                                                                              {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                                                <option key={coverage.price_code} value={coverage.price_code}>
                                                                                  {amountFormat(coverage.price_code, 0)}
                                                                                </option>
                                                                              ))[0]}
                                                                            </>
                                                                        }
                                                                      </SelectTextField>
                                                                    :
                                                                      <Typography color="textSecondary" gutterBottom style={{ color:'#555', fontSize:'16px', marginTop:'1.8vh', marginBottom:'12px' }}>
                                                                       {amountFormat(insurance.coverages[0].price_code, 0)}
                                                                      </Typography>
                                                                  }
                                                                </Grid>
                                                                <Grid item xs={6} md={6}>
                                                                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                                    <Text tid={'Quote.Deductible'}/>
                                                                    <Tooltip title={<Text tid={'Tooltip.Deductible'}/>} placement="right-end" enterTouchDelay={0} leaveTouchDelay={5000} color="primary">
                                                                        <HelpIcon style={{height:'20px', marginLeft:'5px'}} />
                                                                    </Tooltip>
                                                                  </span>
                                                                  {coverage.type_deduct.length > 0 
                                                                    ?                                                            
                                                                      <SelectTextField
                                                                        name={`insurance.selectedCoverage.deduct`}
                                                                        style={{width:'100%'}}
                                                                        value={coverage.deduct ? coverage.deduct : coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                                        onChange={(e) => {
                                                                          // for (const i in values.insuredPersons) { 
                                                                          //   values.insuredPersons[i].insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                          //         [0].coverages.filter(fc=>fc.price_code=== insurance.selectedCoverage)[0].deduct = e.currentTarget.value
                                                                          // }
                                                                          for (const i in values.insuredPersons) {
                                                                            const person = values.insuredPersons[i];
                                                                            const insurancePlan = person.insurancePlans.find(f => f.compnayName === insurance.compnayName);
                                                                            if (insurancePlan) {
                                                                              const coveragePlan = insurancePlan.coverages.find(fc => fc.price_code === insurance.selectedCoverage);
                                                                              if (coveragePlan) {
                                                                                coveragePlan.deduct = e.currentTarget.value;
                                                                              }
                                                                            }
                                                                      
                                                                            // When Allianz Canadian Plan, Apply Deductible
                                                                            const allianzPlanIndex = person.insurancePlans.findIndex(plan => plan.compnayName === 'Allianz');
                                                                            // console.log('allianzPlanIndex', allianzPlanIndex);
                                                                            if (insurance.compnayName === 'Allianz' && allianzPlanIndex !== -1) {
                                                                              if (e.currentTarget.value > 0) {
                                                                                setFieldValue(`values.insuredPersons[${i}].insurancePlans[${allianzPlanIndex}].insuranceAmount`, person.insurancePlans[allianzPlanIndex].medicalProductDeductValue);
                                                                                person.insurancePlans[allianzPlanIndex].insuranceAmount = person.insurancePlans[allianzPlanIndex].medicalProductDeductValue;
                                                                                // console.log('values.insuredPersons[${i}].insurancePlans[${allianzPlanIndex}]', person.insurancePlans[allianzPlanIndex]);
                                                                              } else {
                                                                                setFieldValue(`values.insuredPersons[${i}].insurancePlans[${allianzPlanIndex}].insuranceAmount`, person.insurancePlans[allianzPlanIndex].medicalProductNoDeductValue);
                                                                                person.insurancePlans[allianzPlanIndex].insuranceAmount = person.insurancePlans[allianzPlanIndex].medicalProductNoDeductValue;
                                                                                // console.log('values.insuredPersons[${i}].insurancePlans[${allianzPlanIndex}]', person.insurancePlans[allianzPlanIndex]);
                                                                              }
                                                                            }
                                                                          }
                                                                          setFieldValue(`insurance.selectedCoverage.deduct`, e.currentTarget.value)
                                                                        }}
                                                                      >
                                                                        {coverage.type_deduct.sort((a,b)=> a.value - b.value).map((deduct) => (
                                                                          <option key={deduct.price_code} value={deduct.discount}>
                                                                            {amountFormat(deduct.lable, 0)}
                                                                          </option>
                                                                        ))}
                                                                      </SelectTextField>
                                                                    :
                                                                    <Typography color="textSecondary" gutterBottom style={{ color:'#555', fontSize:'16px', marginTop:'1.8vh', marginBottom:'12px' }}>
                                                                      $0.00
                                                                    </Typography>
                                                                  }

                                                                  {values.insuredPersons.map((person, i) => (
                                                                      <div key={i} style={{ display: 'none' }}>
                                                                        {/* selectedDeduct */}
                                                                        {/* {person.insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                                [0].selectedDeduct = (coverage.deduct 
                                                                                                        ? coverage.type_deduct.filter(d => d.discount === parseFloat(coverage.deduct)).map(i => i.value) 
                                                                                                        : coverage.type_deduct&&
                                                                                                          coverage.type_deduct.filter(d => d.default === true).map(i => i.value)) } */}
                                                                        {person.insurancePlans.filter(f => f.compnayName === insurance.compnayName)[0].selectedDeduct = 
                                                                            coverage.deduct 
                                                                            ? coverage.type_deduct.find(d => d.discount === parseFloat(coverage.deduct))?.value 
                                                                            : coverage.type_deduct.find(d => d.default === true)?.value || 0
                                                                        }

                                                                        {/* calculatedDeductAmount */}
                                                                        {person.insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                                [0].calculatedDeductAmount = (coverage.calculate_rate === 'D'
                                                                                                              ? (coverage.value * person.tripPeriod * coverage.deduct)
                                                                                                              : (coverage.value * 1 * coverage.deduct))}                                  
                                                                      </div>
                                                                    ))
                                                                  }
                                                                
                                                                </Grid>
                                                              </React.Fragment>
                                                      ))}
                                                        
                                                  </Grid>

                                                </React.Fragment>

                                        ))}
                                      </Grid>


                                      
        
                                    </Grid>

                                  </CardActions>
                                }

                                  <Grid item container xs={12} justifyContent="center" spacing={1} style={{ marginTop:'3vh' }}>
                                    {/* <Grid item container xs={12} sm={12} md={9}>
                                      <Grid item xs={ isMobile ? 8 : 9 }>
                                        <Typography variant="body2" color="primary" style={{marginLeft: isMobile ? '2vh': '0'}}>
                                          <Text tid={'Quote.RegularPremium'}/>
                                          <Tooltip title={<Text tid={'Tooltip.RegularPremium'}/>} placement="right-end" enterTouchDelay={0} leaveTouchDelay={5000} color="primary">
                                              <HelpIcon style={{height:'20px', marginLeft:'5px'}}/>
                                          </Tooltip>
                                        </Typography>  
                                      </Grid>
                                      <Grid item xs={ isMobile ? 4 : 3 } style={{textAlign:'right'}}>
                                        <Typography variant="body2" color="primary">
                                          {amountFormat(family.totalPremium,2)}
                                        </Typography>  
                                      </Grid>
                                    </Grid>

                                    <Grid item container xs={12} sm={12} md={9}>
                                      <Grid item xs={8}>
                                        <Typography variant="body2" style={{color:'red', marginLeft: isMobile ? '2vh': '0'}}>
                                          <Text tid={'Quote.FamilyDiscountAmount'}/>
                                          <Tooltip title={<Text tid={'Tooltip.FamilyDiscountAmount'}/>} placement="right-end" enterTouchDelay={0} leaveTouchDelay={5000} color="primary">
                                              <HelpIcon style={{height:'20px', marginLeft:'5px'}}/>
                                          </Tooltip>
                                        </Typography>  
                                      </Grid>
                                      <Grid item xs={4} style={{textAlign:'right'}}>
                                        <Typography variant="body2" style={{color:'red'}}>
                                          - {amountFormat(family.discountPremium,2)}
                                        </Typography>  
                                      </Grid>
                                    </Grid> */}

                                    
                                    <Grid item container xs={12} sm={12} md={9} style={{ borderTop:'1px solid #eee', paddingTop:'1vh' }}>
                                      <Grid item xs={isMobile ? 8 : 9} style={{ alignSelf:'center'}}>
                                        <Typography variant="body2" style={{color:'#1261C9', marginLeft: isMobile ? '2vh': '0'}}>
                                          <Text tid={'Quote.FamilyPlanPremium'}/>
                                          <Tooltip title={<Text tid={'Tooltip.FamilyPlanPremium'}/>} placement="right-end" enterTouchDelay={0} leaveTouchDelay={5000} color="primary">
                                              <HelpIcon style={{height:'20px', marginLeft:'5px'}}/>
                                          </Tooltip>
                                        </Typography>  
                                      </Grid>
                                      <Grid item xs={isMobile ? 4 : 3} style={{textAlign:'right'}}>
                                        <Typography variant="body2" style={{color:'#1261C9', fontWeight:'700', fontSize:'1.2rem'}}>
                                          {amountFormat(family.familyPremium,2)}
                                        </Typography>  
                                      </Grid>
                                    </Grid>

                                    <Grid item container xs={12} sm={12} justifyContent="center" style={{ marginTop:'3vh' }}>
                                        <IconButton aria-label="view" color="primary" 
                                            onClick={() =>handleOpenPDFViewer('plan',values.insuredPersons[0].insurancePlans.filter(f=>f.compnayName===family.compnayName)[0])}
                                        >
                                          <DescriptionIcon />
                                          <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                                            <Text tid={'Quote.SeeMoreBenefit'}/>
                                          </Typography>
                                        </IconButton>
                                    </Grid>

                                  </Grid>
                                  
                                  {values.familyGroup.isSelected &&
                                    <CardActions>
                                        <Button
                                              color={values.familyGroup.selectedCompnayName === family.compnayName ? 'secondary' : 'dark'}
                                              className={classes.next_button}
                                              name={`familyGroup.selectedCompnayName`}
                                              onClick={() => {
                                                const val = values.familyGroup.selectedCompnayName !== family.compnayName? family.compnayName : '' 
                                                values.familyGroup.selectedCompnayName = val
                                                values.familyGroup.totalPremium = family.totalPremium
                                                values.familyGroup.familyPremium = family.familyPremium
                                                values.familyGroup.discountPremium = family.discountPremium
                                                // retset optional plan
                                                values.insuredPersons.map(i => i.optionalAddOnPlans.map(o => o.planTypes.map(t=>t.isSelected = false) ))
                                                setFieldValue(`familyGroup.selectedCompnayName`,  val)
                                              }}
                                            >
                                              {values.familyGroup.selectedCompnayName === family.compnayName ? (
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
                                    </CardActions>
                                  }

                              </Card>
                            </Grid>
                            
                          ))}
                        </Grid>
                        {validMessage(`familyGroup.selectedCompnayName`)}
                      </Grid>
                      :null
                    }
                    
                    {values.familyGroup.selectedCompnayName && 
                      values.insuredPersons[0].optionalAddOnPlans.filter(f=>f.compnayName === values.familyGroup.selectedCompnayName).length > 0 &&
                      <Grid container justifyContent="center">
                        <Grid item container xs={12} justifyContent="center">
                            <Typography variant="h5"  className={classes.title_question_big}>
                                <Text tid={'Add Optional Plan'}/>
                            </Typography>
                        </Grid>

                        <Grid item container xs={12} sm={12} md={10} lg={8} spacing={1} justifyContent="center">
                          {values.insuredPersons[0].optionalAddOnPlans.filter(f=>f.compnayName === values.familyGroup.selectedCompnayName).length > 0 &&
                            values.insuredPersons[0].optionalAddOnPlans.filter(f=>f.compnayName === values.familyGroup.selectedCompnayName)[0]
                              .planTypes.map((optionPlans, idx) => (
                                <Grid item container xs={12} sm={6} md={4} key={idx}>
                                  {optionPlans.coverages.filter(i => i.price_code === optionPlans.selectedCoverage && i.insured_type === values.insuredPersons[0].eligilbeIns).length > 0 &&
                                    optionPlans.coverages.filter(i => i.price_code === optionPlans.selectedCoverage && i.insured_type === values.insuredPersons[0].eligilbeIns).map((coverage, coverageIndex) => (
                                      <Grid item container key={coverageIndex}>
                                        {/* <Grid item container spacing={3} style={{ padding: !isMobile ? '15px' : 'none', border: '1px solid #ddd', borderRadius: '10px', marginTop: '1vh', marginBottom: '1vh'}}> */}
                                          <Grid item container xs={12} spacing={1} style={{  border: '1px solid #eee', borderRadius: '10px', marginTop: '1vh', marginBottom: '1vh', boxShadow:'rgb(0 0 0 / 8%) 0px 3px 15px'}}>

                                            {/* <Grid item xs={12} sm={5} style={{ background: !isMobile ? 'none' : '#f9f9f9', textAlign: !isMobile ? 'left' : 'center', borderRadius: '10px 10px 0 0'}}> */}
                                            <Grid item xs={12} sm={12} style={{ borderRadius: '10px 10px 0 0', padding: isMobile? '0':'16px', textAlign:'center', borderBottom:'1px solid #ddd', marginBottom:'2vh' }}>
                                              <img
                                                  src={values.familyGroup.selectedCompnayName === 'Tugo' 
                                                        ? tugoLogo : values.familyGroup.selectedCompnayName === 'Allianz' 
                                                          ? allianzLogo : values.familyGroup.selectedCompnayName === 'BlueCross'
                                                            ? blueCrossLogo : travelanceLogo}
                                                  alt='logo'
                                                  style={{width: values.familyGroup.selectedCompnayName === 'Allianz' ? '80px' : '90px',  padding:'1vh'}}
                                              />
                                              <span style={{ fontSize: isMobile?'13px':'14px', fontWeight:'400' }}>
                                                {/* {values.familyGroup.selectedCompnayName + ' ' + optionPlans.planName} */}
                                                {optionPlans.planName}
                                              </span>
                                            </Grid>
                                        
                                            {/* coverage up to */}
                                            <Grid item container xs={6} sm={6} md={6}>
                                            
                                              <Typography style={{ fontSize: '14px', fontWeight: '600', color:'#000000DE', textAlign:"center", width:'100%' }}>
                                                <Text tid={'Quote.SumInsured'}/>
                                              </Typography>
                                              <SelectTextField
                                                name={`insuredPersons.${0}.optionalAddOnPlans.${0}.planTypes.${idx}.selectedCoverage`}
                                                value={optionPlans.selectedCoverage}
                                                onChange={(e) => {
                                                  for (const i in values.insuredPersons) { 
                                                    values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===values.familyGroup.selectedCompnayName)[0].planTypes[idx].selectedCoverage = e.currentTarget.value
                                                  }
                                                  setFieldValue(`insuredPersons.${0}.optionalAddOnPlans.${0}.planTypes.${idx}.selectedCoverage`, e.currentTarget.value)
                                                  // reset added optional plan if added
                                                  if (values.insuredPersons[0].optionalAddOnPlans[0].planTypes[idx].isSelected === true){
                                                      document.getElementById(`${idx}_optionalAdd_button`).click() 
                                                  }
                                                }}

                                              >
                                                {optionPlans.coverages
                                                  .filter(c => c.insured_type === values.insuredPersons[0].eligilbeIns &&
                                                    (c.trip_length_min <= values.insuredPersons[0].tripPeriod && c.trip_length_max >= values.insuredPersons[0].tripPeriod))
                                                  .map((o) => (
                                                    <option key={o.price_code} value={o.price_code}>
                                                      {parseFloat(o.price_code).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                                                    </option>
                                                  ))
                                                }
                                              </SelectTextField>
                                            </Grid>

                                            {/* Total Premium and Days */}
                                            {/* <Grid item xs={12} sm={3} lg={3} style={{ textAlign:'center', background: !isMobile ? 'none' : '#f9f9f9' }}> */}
                                            <Grid item xs={6} sm={6} md={6} style={{ textAlign:'center' }}>
                                              
                                              <Typography style={{ fontSize:'14px', fontWeight:'300' }}>
                                                <Text tid={'Vendor.Step3.TotalPremium'}/>
                                              </Typography>
                                              <Typography style={{ fontSize: '1.2rem', fontWeight: '700', color:'#1261c9', }}>
                                                {/* Accidental Death & Dismemberment optional plan Amount at least 
                                                    Allianz : $16 for Accidental Death & Dismemberment */}
                                                {/* {amountFormat((
                                                    (coverage.calculate_rate === 'D'
                                                        ? (values.familyGroup.selectedCompnayName === 'Allianz' 
                                                            && optionPlans.coverageType === 'ADD' 
                                                            && coverage.value * values.insuredPersons[0].tripPeriod < 16
                                                              ? 16
                                                              : coverage.value * values.insuredPersons[0].tripPeriod)
                                                        : coverage.value)  
                                                      * values.insuredPersons.length) 
                                                  ,2)} */}
                                                  {
                                                    amountFormat((
                                                      (coverage.calculate_rate === 'D'
                                                        ? (
                                                          values.familyGroup.selectedCompnayName === 'BlueCross' && optionPlans.coverageType === 'ADD'
                                                            ? (coverage.value * values.insuredPersons[0].tripPeriod)
                                                            : (values.familyGroup.selectedCompnayName === 'Allianz'
                                                                && optionPlans.coverageType === 'ADD'
                                                                && coverage.value * values.insuredPersons[0].tripPeriod < 16
                                                                    ? 16
                                                                    : (values.familyGroup.selectedCompnayName === 'Tugo'
                                                                        && optionPlans.coverageType === 'CAR' && values.familyGroup.isSelected === true
                                                                        ? (coverage.value * values.insuredPersons[0].tripPeriod) / values.insuredPersons.length
                                                                    : coverage.value * values.insuredPersons[0].tripPeriod))
                                                          )
                                                        : values.familyGroup.selectedCompnayName === 'Tugo'
                                                            && optionPlans.coverageType === 'BAG' && values.familyGroup.isSelected === true 
                                                              ? 83 / values.insuredPersons.length : coverage.value )  
                                                      * values.insuredPersons.length) 
                                                    ,2)
                                                  }


                                              </Typography>
                                            
                                            </Grid>

                                            <Grid item container xs={12} sm={12} justifyContent="center" style={{ marginTop:'3vh' }}>
                                                <IconButton aria-label="view" color="primary" 
                                                    onClick={() => handleOpenPDFViewer('plan',optionPlans)}
                                                >
                                                  <DescriptionIcon />
                                                  <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                                                    <Text tid={'Quote.SeeMoreBenefit'}/>
                                                  </Typography>
                                                </IconButton>
                                            </Grid>

                                            {/* Premium amount and Select this button */}
                                            {/* <Grid item xs={12} style={{ background: !isMobile ? 'none' : '#f9f9f9', borderRadius:'0 0 10px 10px' }}> */}
                                            <Grid item xs={12} style={{ borderRadius:'0 0 10px 10px', padding:'8px' }}>
                                              <Box textAlign='right'>
                                                <Button
                                                  id = {`${idx}_optionalAdd_button` }
                                                  name={`insuredPersons.${0}.optionalAddOnPlans.${0}.planTypes.${idx}.isSelected`}
                                                  color={optionPlans.isSelected ? 'secondary' : 'dark'}
                                                  className={classes.next_button}
                                                  style={{ width: '100%', fontSize:'14px' }}
                                                  onClick={() => {
                                                    const val = !optionPlans.isSelected
                                                    for (const i in values.insuredPersons) { 
                                                      values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===values.familyGroup.selectedCompnayName)[0].planTypes[idx].isSelected = val
                                                      if (val === true){
                                                        values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===values.familyGroup.selectedCompnayName)[0]
                                                                                .planTypes[idx].calculatedAddOnAmount = coverage.calculate_rate === 'D'
                                                                                                                        // ? (coverage.value * values.insuredPersons[0].tripPeriod)
                                                                                                                        ? (values.familyGroup.selectedCompnayName === 'Allianz' 
                                                                                                                            && optionPlans.coverageType === 'ADD' 
                                                                                                                            && coverage.value * values.insuredPersons[0].tripPeriod < 16
                                                                                                                              ? 16
                                                                                                                              : (values.familyGroup.selectedCompnayName === 'Tugo'
                                                                                                                                  && optionPlans.coverageType === 'CAR' && values.familyGroup.isSelected === true
                                                                                                                                  ? (coverage.value * values.insuredPersons[0].tripPeriod) / values.insuredPersons.length
                                                                                                                                  : coverage.value * values.insuredPersons[0].tripPeriod))
                                                                                                                          :values.familyGroup.selectedCompnayName === 'Tugo'
                                                                                                                                && optionPlans.coverageType === 'BAG' && values.familyGroup.isSelected === true 
                                                                                                                                  ? 83 / values.insuredPersons.length : coverage.value 
                                                      }else{
                                                        values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===values.familyGroup.selectedCompnayName)[0]
                                                                                .planTypes[idx].calculatedAddOnAmount = 0
                                                      }   
                                                    }
                                                    
                                                    setFieldValue(`insuredPersons.${0}.optionalAddOnPlans.${0}.planTypes.${idx}.isSelected`, val)
                                                  }}

                                                >
                                                  {optionPlans.isSelected ? (
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
                                                    <>
                                                    <span><Text tid={'Quote.Add'}/></span>
                                                    </>
                                                  ) }
                                                </Button>
                                              </Box>
                                            </Grid>
                                    
                                          </Grid>

                                      </Grid>
                                    ))}
                                </Grid>
                            ))
                            }  
                        </Grid>  
                      </Grid>
                    }

                  </Grid>  

                </div>


                <Grid container style={{ margin: '10vh 0 10vh 0' }} justifyContent="center" spacing={1}>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                      <Button
                        // variant='contained'
                          color="secondary"
                          className={classes.back_button}
                          onClick={() => {
                            setFormData(values); prevStep()
                          }}
                      >
                        <Text tid={'Button.Previous'} />
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3}>
                      <Button
                        type='submit'
                        // variant='contained'
                        color="dark"
                        className={classes.next_button}
                        onClick={() => {
                          setDirection('forward')
                        }}
                      >
                        <Text tid={'Button.Next'} />
                      </Button>
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
      
      </>
    )

}

// ProtoTypes
ProductSelFamily.propTypes = {
  formData: PropTypes.object.isRequired
};

export default ProductSelFamily;