import React, { useCallback, useEffect, useState, useContext, useRef } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { getInsuranceByType, getInsuranceByProduct } from '../../../redux/actions/insurancePlans';
import { getCountry } from '../../../redux/actions/countries'
import { getProvince } from '../../../redux/actions/countries';
import { getMedicalQuestion } from '../../../redux/actions/medicalQuestions'
import { getVendorAccountByAccessCode } from '../../../redux/actions/vendorAccountAction';
import store from '../../../redux/store'

import { quoteAllianz } from '../../../redux/actions/travelApplicationAction';

//Formik
import { Formik, Form, ErrorMessage } from 'formik'
//validation
import * as Yup from 'yup'
import * as Validation from '../../Validation'
//core components
import { Grid } from '@material-ui/core'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import WindowDimension from '../../../components/common/WindowDimension'
import LoadingModal from './LoadingModal'
// controllers
import OptimizedPlanForm from '../../../controllers/TravelQuote/OptimizedplanForm'
// import OptimizedPlan from '../../../controllers/TravelQuote/Optimizedplan';
import AddOnPlan from '../../../controllers/TravelQuote/AddOnPlan'
import { calculateInsuranceAmount } from '../../../functionalities/CalculateInsurance';
import { CalculateAgeBaseEffectiveDate, CalculateAgeDays } from '../../../controllers/CalculateValue'
//
import TripPeriod from './TripPeriod'
import Applicants from './Applicants'
import Product from './Product'
import AdditionalInfo from './AdditionalInfo'
import Payment from './Payment'
import Review from './Review'
import SubmitResult from './SubmitResult';
// Form initial data
import { travelQuoteInit } from '../../layouts/InitFormData';
// TuGo debug api
import { postQuoteTugo } from '../../../lib/api';
import { QUOTE_ENDPOINT, USE_TUGO_API_PRICING } from '../../../config/client';
import { mapPlansForUI, buildPolicyDraft, attachSelectedPlans } from '../../../lib/planSelection';
// TuGo debug api

//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import blueCrossLogo from '../../../assets/imgs/logo/blueCross-logo.png'
import gmsLogo from '../../../assets/imgs/logo/gms-logo.png'
import travelanceLogo from '../../../assets/imgs/logo/travelance-logo.png'
import imgLogo from '../../../assets/imgs/logo/img-logo2.png'

//icons
// import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'

function deriveIncludesUSA(form) {
  const list = form?.destinationCountries || form?.countries || [];
  if (typeof list === 'string') return list === 'US';
  return Array.isArray(list) ? list.includes('US') : (form?.destCountry === 'US');
}

//setup form style
const useStyles = makeStyles(formStyle)

const current = new Date()

const companyName = [
    {name:'allianz', value:'Allianz'},
    {name:'tugo', value:'Tugo'},
    {name:'gms', value:'GMS'},
    {name:'bluecross', value:'BlueCross'},
    {name:'travelance', value:'Travelance'},
    {name:'img', value:'IMG'}
]
// valication Schema
const validationSchema = Yup.object(
    {
        tripStartDate: Validation.validRequiredDateField().nullable()
            .min(new Date(current.setDate(current.getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
        tripEndDate: Validation.validRequiredDateField().nullable()
            .min(Yup.ref("tripStartDate"), "EndDateShouldBeGreaterThanStartDate"),
        // tripPeriod: Validation.validRequiredNumberMin1Field().max(365, 'MaximunDaysShouldBe365'),
        // tripPeriod: Validation.validRequiredNumberMin1Field().max(730, 'MaximunDaysShouldBe730'),
        // tripPeriod: Validation.validRequiredNumberMin1Field()
        //     .when("insuranceType", {
        //         is: (value) => value !== 'STUDENT' && value !== 'VISITOR' && value !== 'CANADIAN',
        //         then: Validation.validRequiredNumberMin1Field().max(730, 'MaximunDaysShouldBe730'),
        //         otherwise: Validation.validRequiredNumberMin1Field().max(365, 'MaximunDaysShouldBe365')
        //     }),
        tripPeriod: Validation.validRequiredNumberMin1Field()
                .when("insuranceType", {
                    is: (value, insuraceCompany) => {
                        const isVisitorAndTugo = insuraceCompany === 'Tugo' && value === 'VISITOR';
                        return value !== 'STUDENT' && value !== 'CANADIAN' && !isVisitorAndTugo;
                    },
                    then: Validation.validRequiredNumberMin1Field().max(730, 'MaximunDaysShouldBe730'),
                    otherwise: Validation.validRequiredNumberMin1Field().max(365, 'MaximunDaysShouldBe365')
                })
                .when("insuranceType", {
                    is: (value, insuraceCompany) => insuraceCompany === 'Tugo' && value === 'VISITOR',
                    then: Validation.validRequiredNumberMin1Field().max(730, 'MaximunDaysShouldBe730')
                }),

        tripArrivalDate: Yup.date().when("insuranceType", 
        { is: (value) => 
                value !== 'STUDENT',
                then: Validation.validRequiredDateField(),
                otherwise: Yup.date().nullable()
        }),
        multiTripDays: Yup.number().when("tripType", 
        { is: (value) => 
                value === 'MULTI',
                then: Validation.validRequiredNumberMin1Field()
                    .max(125, "Multi Trip days must be less than 125")
        }),
        originCountry: Yup.string().when("insuranceType", 
        { is: (value) => 
                value !== 'CANADIAN',
                then: Validation.validRequiredField()
        }),
        originProvince: Yup.string().when("insuranceType", 
        { is: (value) => 
                value === 'CANADIAN',
                then: Validation.validRequiredField()
        }),
        destCountry: Yup.string().when("insuranceType", 
        { is: (value) => 
                value === 'CANADIAN',
                then: Validation.validRequiredField()
        }),
        destProvince: Yup.string().when("insuranceType", 
        { is: (value) => 
                value === 'CANADIAN',
                then: Yup.string().when("destCountry", 
                        { is: (value) => 
                                value === 'US',
                                then: Validation.validRequiredField()
                        }),
        }),
        eligilbeAgrement : Validation.validRequiredField().nullable(),
        purchaseAgreement : Validation.validRequiredField().nullable(),
        contactPhone: Validation.validPhoneNumber(),
        contactEmail: Validation.validEmail(),
        maillingInCanada: Validation.validRequiredField(),
        mailStreetName:  Validation.validRequiredField(),
        mailCity:  Validation.validRequiredField(),
        mailPostalCode:  Validation.validPostalCodeWorldWide(),
        mailProvince:  Validation.validRequiredField(),
        mailCountry:  Validation.validRequiredField(),
        insuredNumber: Yup.number().when("insuredGroupType", 
        { is: (value) => 
                value === 'Individual',
                then: Validation.validRequiredNumberField(),
                otherwise: Yup.number().min(1,'MinimunNumberShouldBeAtLeast1').required('FieldIsRequired')
        }),
        insuredPersons: Yup.array().of(
            Yup.object().shape({
                lastName: Validation.validRequiredField(),
                firstName: Validation.validRequiredField(),
                gender: Validation.validRequiredField(),
                birthDate: Validation.validRequiredBrithDateField(),
                relationship: Validation.validRequiredField(),
                travelType: Validation.validRequiredField(),
                beneficiaryName: Validation.validRequiredField(),
                beneficiaryRelationship: Validation.validRequiredField(),
                passportNumber: Yup.string().nullable().when("travelType", {
                  is: (value) => value === 'SV' || value === 'WH',
                  then: Validation.validRequiredField(),
                    otherwise: Yup.string().nullable(),
                }),
                // passportNumber: Validation.validRequiredField(),
                graduatedDate: Yup.date().nullable().when("travelType",
                        { is: (value) => 
                                value === 'PW',
                                then: Validation.validRequiredDateField().nullable()
                                        .max(new Date(new Date().setDate(new Date().getDate() )), 'GraduatedDateShouldBeLessThanToday')
                                        .min(new Date(new Date().setDate(new Date().getDate() - 365)), 'GraduatedDateShouldBeWinthin1yearOfGraduation'),
                        }),
                tripStartDate: Validation.validRequiredDateField().nullable()
                    .min(new Date(current.setDate(current.getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
                tripEndDate: Validation.validRequiredDateField().nullable()
                    .min(Yup.ref("tripStartDate"), "EndDateShouldBeGreaterThanStartDate"),
                tripPeriod: Yup.number().nullable().when("travelType", 
                  { is: (value) => 
                          value !== 'SV',
                          then: Validation.validRequiredNumberMin1Field().max(730, 'MaximunDaysShouldBe730'),
                          otherwise: Validation.validRequiredNumberField().min(365, 'SVTripDayShouldBe365'),
                  }),
                // areEligible: Validation.validRequiredField(),
                physicalCard: Validation.validRequiredField().nullable(),
            })
        ),
        paymentMethod: Validation.validRequiredField(),
        creditCardNumber: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validCreditCardNumber()
        }),
        cardcvv: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                // then: Validation.validCardCCV()
                then: Yup.string().when('creditCardType', (creditCardType) => {
                    return Yup.string().required("FieldIsRequired")
                        .min(3, 'Enter correct digits number')
                        .test('Card CVV', function(value) {
                            if (!value) {
                            return this.createError({ message: `FieldIsRequired` })
                            }
                            else{
                            // MasterCard Visa - 3 digit number code
                            // AMEX  - 4 digit number code
                            const regEx = /^\d{3}$/;
                            const amxRegEx = /^\d{4}$/;
                            if (creditCardType === 'AmericanExpress' && amxRegEx.test(value.replace(/\s/g, ''))) {
                                return true;
                            }else if ((creditCardType === 'Visa' || creditCardType === 'MasterCard') && regEx.test(value.replace(/\s/g, ''))){
                                return true;
                            }
                            else {
                                return this.createError({ message: `InvalidSecretCode` })
                            }
                            }
                        })
                })
        }),
        cardExpired: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validCardEexpirationDate()
        }),
        cardHolderName: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        //billing address
        billStreetName: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        billCity: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        billProvince:  Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        billPostalCode:  Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Yup.string().when("billCountry", 
                      { is: (value) => 
                              value === 'CA',
                              then: Validation.validPostalCode(),
                              otherwise: Validation.validRequiredField()
                      }),
        }),
        billCountry:  Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        senderName: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'E-transfer',
                then: Validation.validRequiredField()
        }),
        sourceChnnel: Validation.validRequiredField(),
    }
)

// ValidMessage
function validMessage(fieldName) {
    return (
        <ErrorMessage
        name={fieldName}
        render={(msg) => (
            <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
              <Text tid={`Validation.${msg}`}></Text>
            </div>
        )}
        />
    )
}

function getSteps() {
  return ['Quote.Tripinfo', 'Applicants', 'Quote.Product', 'Quote.Contact', 'Quote.Payment', 'Quote.ReviewApplication'];
}

function getStepContent(step, 
                        values, 
                        handleChange, 
                        handleBlur,
                        setFieldValue, 
                        setFieldTouched, 
                        errors, 
                        countries, 
                        provinces, 
                        insurances, 
                        questions,
                        sourceChnnel,
                        onDebugQuote,
                        tugoCtx
                        ) {
  switch (step) {
    case 0:
      return (
              <TripPeriod
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                validMessage={validMessage}
                countries={countries}
                provinces={provinces}
              />
            );
    case 1:
      return (
              <Applicants
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors = {errors}
                  validMessage={validMessage}
              />
            );
    case 2: {
      const selectedPlan = (tugoCtx && tugoCtx.availablePlans ? tugoCtx.availablePlans : []).find(p => p.code === (tugoCtx && tugoCtx.selectedPlanCode)) || null;
      const displayTotal = (tugoCtx && tugoCtx.tugoPrice != null)
        ? Number(tugoCtx.tugoPrice)
        : Number(selectedPlan && typeof selectedPlan.total === 'number' ? selectedPlan.total : 0);
      // eslint-disable-next-line no-console
      console.log('[PRICE-SOURCE]', {
        from: (tugoCtx && tugoCtx.tugoPrice != null) ? 'TuGo-overlay' : 'TuGo-planCost',
        planCode: selectedPlan ? selectedPlan.code : undefined,
        planTotal: selectedPlan ? selectedPlan.total : undefined,
        displayTotal,
      });
      return (
              <>
                {(typeof window !== 'undefined' && ((new URLSearchParams(window.location.search).get('tugoApiPrice') === '1') || (localStorage.getItem('TUGO_FORCE_PRICE') === '1'))) && (
                  <div style={{ border:'1px solid #ddd', padding:'8px', fontSize:12, marginBottom:8, borderRadius:4 }}>
                    TuGo pricing flag: <b>{String(USE_TUGO_API_PRICING)}</b>
                    {" · "}endpoint: <code>{QUOTE_ENDPOINT}</code>
                    {tugoCtx && tugoCtx.tugoPlanMeta ? (<><span>{" · "}plan: {tugoCtx.tugoPlanMeta.code}</span></>) : null}
                    <button type="button" onClick={async ()=>{ if (tugoCtx && tugoCtx.forceFetchTuGo) { await tugoCtx.forceFetchTuGo(); } }} disabled={tugoCtx && tugoCtx.tugoLoading} style={{ marginLeft:12, padding:'4px 8px', border:'1px solid #aaa', borderRadius:4, background:'#fff' }}>
                      {tugoCtx && tugoCtx.tugoLoading ? 'Fetching…' : 'Fetch TuGo Now'}
                    </button>
                    {(tugoCtx && tugoCtx.tugoPrice) != null && (<span style={{ marginLeft:12 }}>price: <b>{`$${Number(tugoCtx.tugoPrice).toFixed(2)}`}</b></span>)}
                  </div>
                )}
                {/* Overlay display price (TuGo only) */}
                <div style={{ textAlign:'right', marginBottom: 8 }}>
                  <div style={{ fontWeight:600 }}>
                    {`$${(function(){
                      const sel = (tugoCtx && tugoCtx.availablePlans ? tugoCtx.availablePlans : []).find(p => p.code === (tugoCtx && tugoCtx.selectedPlanCode)) || null;
                      const tot = (tugoCtx && tugoCtx.tugoPrice != null) ? Number(tugoCtx.tugoPrice) : Number(sel && typeof sel.total === 'number' ? sel.total : 0);
                      return tot.toFixed(2);
                    })()}`}
                    {(tugoCtx && tugoCtx.tugoPrice) != null ? (<span style={{ marginLeft:8, fontSize:11, opacity:0.7 }}>(TuGo)</span>) : null}
                  </div>
                </div>
                {/* Simple plan selection list */}
                {(tugoCtx && tugoCtx.availablePlans) && tugoCtx.availablePlans.length > 0 ? (
                  <div style={{ marginBottom: 12 }}>
                    {tugoCtx.availablePlans.map((p) => (
                      <label key={p.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', border:'1px solid #eee', borderRadius:4, padding:'8px', marginBottom:6, cursor:'pointer' }}>
                        <div>
                          <div style={{ fontWeight:600 }}>{p.name}</div>
                          <div style={{ fontSize:12, opacity:0.8 }}>Code: {p.code}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontWeight:600 }}>${Number(p.total).toFixed(2)}</div>
                          {p.tax > 0 && (<div style={{ fontSize:12, opacity:0.8 }}>+ tax ${Number(p.tax).toFixed(2)}</div>)}
                        </div>
                        <input type="radio" name="tugoPlan" value={p.code} checked={(tugoCtx && tugoCtx.selectedPlanCode) === p.code} onChange={()=> tugoCtx && tugoCtx.setSelectedPlanCode && tugoCtx.setSelectedPlanCode(p.code)} />
                      </label>
                    ))}
                  </div>
                ) : (
                  <div style={{ color:'#b00', fontSize:12, marginBottom: 12 }}>We are sorry, no available TuGo plan for these trip details.</div>
                )}
                <Product
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  errors = {errors}
                  validMessage={validMessage}
                  insurances ={insurances}
                  questions={questions}
                  onDebugQuote={onDebugQuote}
                />
              </>
            );
    }
    case 3:
      if (values.eligilbeAgrement === true){
        return (
                <AdditionalInfo 
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    validMessage={validMessage}
                    countries={countries}
                    provinces={provinces}
                    sourceChnnel={sourceChnnel}
                />
        );  
      } else{
        return null
      }
    case 4:
      if (values.eligilbeAgrement === true){
        return (
                <Payment 
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  validMessage={validMessage}
                  countries={countries}
                />
              );  
        } else{
          return null
        }
      case 5:
      if (values.eligilbeAgrement === true){
        return (
          <>
              <Review 
                values={values}
              />
        </>
        );  
      } else{
        return null
      }
  default:
      return '';
  }
}

function addinsuredPerson(insuredPersonNumber, insuredPersons, renewal){
  const applied = insuredPersonNumber - insuredPersons.length;
  if (applied <= 0)
  {
      for (var i = 0; i < (applied * -1); i++) {
          insuredPersons.pop()
      }
  }
  else{ 
      for (var j = 0; j < applied; j++) {
          insuredPersons.push({
              firstName: '',
              lastName: '',
              gender: '',
              birthDate: null,
              age: 0,
              relationship: '',
              beneficiaryName:'',
              beneficiaryRelationship: '',
              passportNumber: '',
              attendSchoolName:'',
              sameDate: true,
              tripStartDate: null,
              tripEndDate: null,
              tripPeriod: 0,
              arrivalDate: null,
              graduatedDate: null,
              yearDateAfterGraduated: null,
              // travelType: insuredPersons[0].travelType,
              travelType: '',
              tripType: insuredPersons[0].tripType,
              destCountry: insuredPersons[0].destCountry,
              tripDepartureDate: null,
              tripOtherCoverageDays: 0,
              multiTripDays: insuredPersons[0].multiTripDays,
              preExistCond: false,
              coverCond: false,
              maternity: false,
              mentalIllness: false,
              eligilbeIns: insuredPersons[0].eligilbeIns,
              physicalCard: false,
              insurancePlans: [],
              selectedPlan: [],
              selectedMedQuesAnswer: [],
              optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
              optionalAddOnPlans: [],
              renewalInsurance: false,
          })
      }
  }
  return insuredPersons;
}

// const handleDeductChange = (newDeductValue) => {
//   setSelectedDeduct(newDeductValue);
// };

export default function Application({ vendorAccessCode, insuraceCompany, insuraceType, applyType, sourceChnnel, renewal, insured, contact }) {
  const classes = useStyles();

  const [isLoaded, setIsLoaded] = useState(false)

  // 모달 상태와 보험료를 관리하는 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setIsHideModalOpen] = useState(false);
  // const [selectedDeduct, setSelectedDeduct] = useState();

 
 // 액션 발생 시 모달을 열고 로딩 상태를 true로 설정하는 함수
  // const handleModal = () => {
  //   setIsModalOpen(true); // 모달 열기
  //   // dispatch(yourAction()); // yourAction: API 호출을 시작하는 액션
  // };

  
  
 
  

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  const [formData, setFormData] = useState(travelQuoteInit());
  const [, setForceRender] = useState(false); // 강제 리렌더링을 위한 상태 추가
  const prevActiveStepRef = useRef();

  const [submitted, setSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);
  const [normalizedQuote, setNormalizedQuote] = useState(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState('');
  // 표시용 TuGo 금액/메타
  const [tugoPrice, setTugoPrice] = useState(null);
  const [tugoPlanMeta, setTugoPlanMeta] = useState(null);
  const [tugoLoading, setTugoLoading] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);
  // Debug flag via URL/localStorage
  const TUGO_DEBUG = (typeof window !== 'undefined' && (
    (new URLSearchParams(window.location.search).get('tugoApiPrice') === '1') ||
    (localStorage.getItem('TUGO_FORCE_PRICE') === '1')
  ));
  // Guard to auto-fetch once per Product entry
  const didAutoFetchRef = useRef(false);

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  insuraceCompany = companyName.filter(f=>f.name === insuraceCompany).map(i=>i.value)[0]
  insuraceType = insuraceType.toUpperCase()

  const dispatch = useDispatch();
  const countries = useSelector(state => state.countryReducer.countries)
  const provinces = useSelector(state => state.countryReducer.provinces)
  const vendor = useSelector(state => state.vendorAccountReducer.vendor)
  const insurances = useSelector(state => state.insurancePlanReducer.insurances)
  const questions = useSelector(state => state.medicalQuestionReducer.questions)

// console.log('formData', formData)
// console.log('insuraceType', insuraceType)
  // get Resource Data
  const getResourceData = useCallback(() => {
      dispatch(getCountry())
      dispatch(getProvince())
      // dispatch(getInsuranceByType(insuraceType)) 
      if (insuraceType === 'CANADIAN' || insuraceType === 'VISITOR' || insuraceType === 'STUDENT') {
        dispatch(getInsuranceByType(insuraceType)); // 기존 url 유지를 위함 (canadian, student, visitor)
      } else {
        dispatch(getInsuranceByProduct(insuraceType)); // 보험상품 generic_name 으로 필터링
      }
      dispatch(getMedicalQuestion())
      dispatch(getVendorAccountByAccessCode(vendorAccessCode))
  }, [dispatch,insuraceType,vendorAccessCode]);

  // get Quotes from Allianz API
  const quoteAllianzResult  = useSelector((state) => state.travelApplicationReducer.quoteAllianzResult)
  const quoteAllianzLoading = useSelector(state => state.travelApplicationReducer.quoteAllianzLoading)
  const quoteAllianzError = useSelector(state => state.travelApplicationReducer.quoteAllianzError)


  // const v = []

  // const getQuotesAllianz = useCallback((v) => {
  //   dispatch(quoteAllianz({data: v}))
  // }, [dispatch, v]);

  // getQuotesAllianz 함수를 Promise를 사용하여 정의
  function getQuotesAllianz(values) {
    return new Promise((resolve, reject) => {
      dispatch(quoteAllianz({data: values}));
  
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
  }
  
  // const previousDeductRef = useRef();


  // const quote = !quoteAllianzError && !quoteAllianzLoading && (quoteAllianzResult.length>0 || quoteAllianzResult.status === 'error') ? quoteAllianzResult[0].offerCategories : null

  // run useEffect only once when first render
  useEffect(() => {
    // 리소스 데이터 로딩
    if(isLoaded === false){
      getResourceData();
      setIsLoaded(true);
    }
    const prevActiveStep = prevActiveStepRef.current;
    prevActiveStepRef.current = activeStep;
    // console.log('prevActiveStep',prevActiveStep)
   
    // selectedDeduct의 변경을 감지합니다.
    // previousDeductRef.current = formData.insuredPersons.map(person => person.selectedPlan.selectedDeduct);

    // for (const person of formData.insuredPersons) {
    //   if (person.selectedPlan.selectedDeduct !== previousDeductRef.current) {
    //     // callAllianzAPI 호출하여 비동기 작업 실행
    //     callAllianzAPI(formData)
    //       .then(() => {
    //         console.log('Async operation completed successfully.');
    //       })
    //       .catch((error) => {
    //         console.error('Async operation failed:', error);
    //       });
    //     break; // 한 명이라도 변경되었으면 나머지는 확인하지 않음
    //   }
    // }

    // waiting allianz api result
        if (prevActiveStep < 3 && activeStep === 2) {
            if (insuraceCompany === 'Allianz' && insuraceType === 'CANADIAN' &&
                formData.insuredPersons.some(person => person.age < 65)) {
                setIsModalOpen(true); 
            } else if (insuraceCompany === 'Allianz' && insuraceType === 'CANADIAN' &&
            formData.insuredPersons.some(person => person.age > 64)) { 
                setIsHideModalOpen(true);
            }
            // API 호출 상태가 변경될 때마다 실행됩니다
            if (quoteAllianzResult.length > 0 && !quoteAllianzLoading && !quoteAllianzError) {
              // 나머지 코드 실행
            
              const sagaResult = quoteAllianzResult[0];
              // console.log('sagaResult:', sagaResult);
            
              
              // Medical 카테고리 내의 products 배열에서 Medical 상품을 찾습니다.
              const medicalCategories = sagaResult.offerCategories
                .find(category => category.name === "Medical");

              const medicalProductNoDeductible = medicalCategories.products[0];
              const medicalProductDeductible = medicalCategories.products[1];

              if (medicalProductNoDeductible) {
                // console.log('medicalProductNoDeductible:', medicalProductNoDeductible);
                
                // Medical 상품의 insured 배열에서 해당하는 premium 값을 찾아 values에 할당합니다.
                formData.insuredPersons.forEach((person, index) => {
                  const premiumValue = medicalProductNoDeductible.insured[index]?.premium;
                  // premium 값을 selectedPlan.calculatedInsuranceAmount에 할당합니다.
                  // console.log('medicalProductNoDeductible.insured[index].premium:', premiumValue);
                  const medicalProductDeductValue = medicalProductDeductible.insured[index]?.premium;

                  // 새로운 객체 생성을 통한 불변성 유지, Update premium from Allianz API Call 
                  const newInsuredPersons = [...formData.insuredPersons];
                  newInsuredPersons[index] = {
                    ...newInsuredPersons[index],
                    selectedPlan: {
                      ...newInsuredPersons[index].selectedPlan,
                      insuranceAmount: premiumValue,
                      calculatedInsuranceAmount: premiumValue,
                      // insurance premium for each plan
                      medicalProductNoDeductValue : premiumValue,
                      medicalProductDeductValue : medicalProductDeductValue
                    }
                  };
                  formData.insuredPersons = newInsuredPersons;
                  //  console.log('formData.insuredPersons',formData.insuredPersons)


                });
              }
              setForceRender(prev => !prev); // 상태 업데이트 후 강제 리렌더링

              // 모달 닫기
              setIsHideModalOpen(false);
              setIsModalOpen(false);
        }
      
  }

}, [getResourceData, isLoaded, quoteAllianzResult, quoteAllianzLoading, quoteAllianzError, formData, activeStep, insuraceCompany, insuraceType]);


  const vendorName = vendor && vendor.length > 0 ? vendor[0].vendor_name:'';

  const { width } = WindowDimension();
  let isMobile = (width < 768);

  const isDev = process.env.NODE_ENV !== 'production';

  const fmtDate = (d) => {
    if (!d) return '';
    try {
      if (typeof d === 'string') return d.substring(0, 10);
      return new Date(d).toISOString().substring(0, 10);
    } catch (e) {
      return '';
    }
  };
  
  const buildTuGoDevPayload = (values) => {
    const start = values.insuredPersons?.[0]?.tripStartDate || values.tripStartDate;
    const end = values.insuredPersons?.[0]?.tripEndDate || values.tripEndDate;
    return {
      insuredType: 'CANADIAN',
      includesUSA: deriveIncludesUSA(values),
      coverageType: 'MED',
      trip: {
        startDate: fmtDate(start),
        endDate: fmtDate(end),
        departureProvince: values.originProvince || 'ON',
      },
      insuredPersons: (values.insuredPersons || []).map((p) => ({
        homeProvince: p.province || values.originProvince || 'ON',
        dob: fmtDate(p.birthDate),
        age: p.age,
      })),
    };
  };

  async function forceFetchTuGo() {
    try {
      setTugoLoading(true);
      console.warn('[quote:enter]', QUOTE_ENDPOINT);
      const includesUSA = formData?.destCountry === 'US' || formData?.destCountryCode === 'US' || formData?.destinationCountryCode === 'US';
      const isDomesticCanada = formData?.destCountry === 'CA' || formData?.destinationCountryCode === 'CA';
      const payload = {
        insuredType: 'CANADIAN',
        includesUSA,
        isDomesticCanada,
        coverageType: 'MED',
        trip: {
          startDate: fmtDate(formData?.tripStartDate),
          endDate: fmtDate(formData?.tripEndDate),
          departureProvince: formData?.originProvince,
        },
        insuredPersons: (Array.isArray(formData?.insuredPersons) ? formData.insuredPersons.map(a => ({
          homeProvince: a.province || formData?.originProvince,
          dob: fmtDate(a.birthDate),
          age: a.age,
        })) : [])
      };
      const res = await postQuoteTugo(payload);
      console.warn('[quote:done]', res);
      const plans = res?.response?.availablePlanPrices || [];
      if (plans.length > 0) {
        const best = plans[0];
        setTugoPrice(best.planCost ?? best.premium ?? null);
        setTugoPlanMeta({ code: best.planCode, name: best.planName });
      } else {
        setTugoPrice(null);
      }
    } catch (e) {
      console.error('[tugo:error]', e);
      setTugoPrice(null);
    } finally {
      setTugoLoading(false);
    }
  }

  // 표시 가격 계산: 기존 금액에서 TuGo로 덮어쓰기 (표시만 교체)
  const computeDisplayedPrice = (values) => {
    // 기존 계산 금액 (예시: 선택된 플랜의 calculatedInsuranceAmount)
    const base = values?.insuredPersons?.[0]?.selectedPlan?.calculatedInsuranceAmount || 0;
    if (USE_TUGO_API_PRICING && tugoPrice != null) return tugoPrice;
    return base;
  };

  // Product 스텝 진입 시 TuGo 견적 자동 호출 (표시만 교체)
  useEffect(() => {
    const onProductStep = activeStep === 2;
    const ready = !!formData?.tripStartDate && !!formData?.tripEndDate && !!formData?.originProvince && Array.isArray(formData?.insuredPersons) && formData.insuredPersons.length > 0 && !!formData.insuredPersons[0]?.birthDate;
    const flag = USE_TUGO_API_PRICING || TUGO_DEBUG;
    if (!flag || insuraceCompany !== 'Tugo' || !onProductStep || !ready) return;
    if (didAutoFetchRef.current) return;
    didAutoFetchRef.current = true;
    (async () => {
      try {
        setTugoLoading(true);
        const payload = {
          insuredType: 'CANADIAN',
          includesUSA: formData?.destCountry === 'US',
          isDomesticCanada: formData?.destCountry === 'CA',
          coverageType: 'MED',
          trip: { startDate: fmtDate(formData?.tripStartDate), endDate: fmtDate(formData?.tripEndDate), departureProvince: formData?.originProvince },
          insuredPersons: formData.insuredPersons.map(a => ({ homeProvince: a.province || formData?.originProvince, dob: fmtDate(a.birthDate), age: a.age })),
        };
        console.warn('[quote:enter]', QUOTE_ENDPOINT, payload);
        const resp = await postQuoteTugo(payload);
        console.warn('[quote:done]', resp);
        const plans = (resp?.response?.availablePlanPrices || []);
        // map for UI and default-select first MED/lowest plan
        const uiPlans = mapPlansForUI(resp?.response || {});
        setAvailablePlans(uiPlans);
        if (uiPlans.length && !selectedPlanCode) setSelectedPlanCode(uiPlans[0].code);
        let chosen = plans
          .filter(p => ((p?.basePlanInfo && p.basePlanInfo.primaryCoverage) ? p.basePlanInfo.primaryCoverage : 'MED') === 'MED')
          .sort((a,b)=> (a.planCost ?? a.premium ?? 1e9) - (b.planCost ?? b.premium ?? 1e9))[0] || plans[0];
        if (chosen) {
          const best = chosen;
          setTugoPrice(best.planCost ?? best.premium ?? null);
          setTugoPlanMeta({ code: best.planCode, name: best.planName });
          // build policy draft preview
          const draft = buildPolicyDraft({ request: resp?.request, response: resp?.response }, uiPlans[0]?.code || best.planCode);
          const finalDraft = attachSelectedPlans(draft);
          // eslint-disable-next-line no-console
          console.log('[policyDraft]', finalDraft);
        } else {
          setTugoPrice(null);
          setTugoPlanMeta(null);
        }
      } catch (e) {
        console.error('[tugo pricing error]', e);
        setTugoPrice(null);
        setTugoPlanMeta(null);
        setAvailablePlans([]);
      } finally {
        setTugoLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, formData?.tripStartDate, formData?.tripEndDate, formData?.originProvince, formData?.insuredPersons?.length, USE_TUGO_API_PRICING, insuraceCompany]);

  // duplicate guard: removed second declarations

  // initail data
  // set only once when first render
  if (isLoaded === false){
    // add initail data
    formData.application = {
                applicationCompany: insuraceCompany,
                applicationType: insuraceType
            }
    formData.insuredGroupType = applyType.charAt(0).toUpperCase() + applyType.slice(1).toLowerCase()

    formData.tripType = 'SINGLE'

    formData.insuredNumber = 1;
    formData.insuredPersons.map(i=>i.eligilbeIns = insuraceType)

    // prefilled if existed getting from params
    if(renewal && insured){
      formData.renewal = (renewal==="true"?true:false);
      formData.insuredNumber = insured.length
      formData.tripStartDate =  new Date(insured[0].tripStartDate+'T00:00:00')
      // if insured_type is CANADIAN
      if(formData.application.applicationType === 'CANADIAN') {
        formData.tripArrivalDate =  new Date(insured[0].tripStartDate+'T00:00:00')
        formData.insuredPersons[0].arrivalDate = new Date(insured[0].tripStartDate+'T00:00:00')
      }
      addinsuredPerson(insured.length,formData.insuredPersons, renewal)
      for (const i in insured) {
        formData.insuredPersons[i].firstName = insured[i].firstName
        formData.insuredPersons[i].lastName = insured[i].lastName
        formData.insuredPersons[i].birthDate = new Date(insured[i].birthDate+'T00:00:00')
        formData.insuredPersons[i].gender = insured[i].gender
        formData.insuredPersons[i].passportNumber = insured[i].passportNumber
        if(insured[i].tripStartDate){
          formData.insuredPersons[i].tripStartDate = new Date(insured[i].tripStartDate+'T00:00:00')
          formData.insuredPersons[i].age = CalculateAgeBaseEffectiveDate(formData.insuredPersons[i].birthDate, formData.insuredPersons[i].tripStartDate)
          formData.insuredPersons[i].ageDays = CalculateAgeDays(formData.insuredPersons[i].birthDate, formData.insuredPersons[i].tripStartDate )
          if (i !== 0 && formData.insuredPersons[i].tripStartDate.toISOString().substring(0,10)!==insured[0].tripStartDate){
            formData.insuredPersons[i].sameDate = false
          }
        }
        formData.insuredPersons[i].renewalInsurance = (renewal==="true"?true:false)
      }

      if (contact){
          formData.mailStreetName = contact.street?contact.street:''
          formData.mailUnitApartmentNo = contact.suiteNo?contact.suiteNo:''
          formData.mailCity = contact.city?contact.city:''
          formData.mailProvince = contact.province?contact.province:''
          formData.mailPostalCode  = contact.postalcode?contact.postalcode:''
          formData.mailCountry = contact.country?contact.country:''
          formData.contactEmail = contact.email?contact.email:''
          formData.contactPhone = contact.phone?contact.phone:''
      }
    };


    formData.sameMailAddress = false
    if (insuraceType === 'CANADIAN')
    {
        formData.originCountry = 'CA' ;
        formData.originCountryName = 'Canada'  
        formData.tripDirection = 'OutBound'   
    }else{
          formData.destCountry = 'CA'
          formData.destCountryName = 'Canada'
          formData.tripDirection = 'InBound'
    }
    formData.vendorID = vendor && vendor.length > 0 ? vendor[0].vendor_id:''
    formData.sourceFrom = 'M'

    formData.sourceChnnel = sourceChnnel?sourceChnnel:''

    formData.vendorAddress = {
      street: vendor && vendor.length > 0 ? vendor[0].street:'',
      suiteNo: vendor && vendor.length > 0 ? vendor[0].suite_no:'',
      city: vendor && vendor.length > 0 ? vendor[0].city:'',
      province:vendor && vendor.length > 0 ? vendor[0].province:'',
      postalCode: vendor && vendor.length > 0 ? vendor[0].postalcode:'',
    }
  }

  // set vendor information if formData.vendorID is null
  if ( vendor && vendor.length > 0 && formData.vendorID===''){
    formData.vendorID = vendor[0].vendor_id;
    formData.vendorAddress = {
      street: vendor[0].street?vendor[0].street:'',
      suiteNo: vendor[0].suite_no?vendor[0].suite_no:'',
      city: vendor[0].city?vendor[0].city:'',
      province: vendor[0].province?vendor[0].province:'',
      postalCode: vendor[0].postalcode?vendor[0].postalcode:''
    }
  }

  // const [apiResult, setApiResult] = useState(null);

  // 비동기 함수를 async로 정의
  async function callAllianzAPI(values) {
    // console.log('formData3:', formData)
    if (values.application.applicationCompany === 'Allianz') {
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
  }


  // validate by step
  function IsStepValidated(values, setFieldTouched, errors) {
    let result = false

    if (activeStep === 0){
      // Step - Trip period
      if (values.tripPeriod > 0 && !errors.tripStartDate && !errors.tripEndDate && !errors.tripPeriod &&
        !errors.tripArrivalDate && !errors.originCountry && !errors.originProvince && !errors.destProvince &&
        !errors.tripType && !errors.multiTripDays){
          result = true
      }else{
        setFieldTouched(`tripStartDate`)
        setFieldTouched(`tripEndDate`)
        setFieldTouched(`tripPeriod`)
        setFieldTouched(`tripArrivalDate`)
        setFieldTouched(`originCountry`)
        setFieldTouched(`originProvince`)
        setFieldTouched(`destCountry`)
        setFieldTouched(`destProvince`)
        setFieldTouched(`tripType`)
        setFieldTouched(`multiTripDays`)
      }
    } else if (activeStep === 1){
      // Step - Applicants
      setFieldTouched(`eligilbeAgrement`)
      // if (values.eligilbeAgrement === true && (errors&&!!errors.insuredPersons&&!!errors.insuredPersons[0].graduatedDate)===false){
      if (values.eligilbeAgrement === true){
          if (values.insuredPersons
                .filter(i=> i.birthDate && i.ageDays > 14 && i.relationship && i.firstName && i.lastName && i.gender && i.travelType &&
                            i.beneficiaryName && i.beneficiaryRelationship &&
                            (i.travelType==='PW'? i.yearDateAfterGraduated >= i.tripEndDate:i.graduatedDate===null) &&
                            (i.travelType==='SV'? i.tripPeriod >=  365: i.tripPeriod > 0) &&
                            ((i.travelType === 'SV' || i.travelType === 'WH') ? i.passportNumber : true)
                            ).length ===  values.insuredPersons.length
              ) { 

                  result = true;
                  OptimizedPlanForm({ data: values, insurances: insurances.filter(ins => ins.coverage_type === 'MED' && ins.compnay_name === values.application.applicationCompany) })
                  AddOnPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type !== 'MED' && ins.compnay_name === values.application.applicationCompany) })
                  calculateInsuranceAmount(values)
                  // console.log('insurances', insurances)
                  //set selectedPlan
                  for (const i in values.insuredPersons) { 
                      values.insuredPersons[i].selectedPlan = values.insuredPersons[i].insurancePlans[0]
                      if(values.insuredPersons[i].insurancePlans.length > 0 && values.insuredPersons[i].insurancePlans[0].coverages.length > 0){   
                        values.insuredPersons[i].selectedPlan.selectedPlanName = values.insuredPersons[i].insurancePlans[0].coverages[0].generic_name     
                        values.insuredPersons[i].selectedPlan.selectedPlanNameKr = values.insuredPersons[i].insurancePlans[0].coverages[0].generic_name_kr     
                        values.insuredPersons[i].selectedPlan.tripType = values.insuredPersons[i].insurancePlans[0].coverages[0].tripType 
                      }
                    }
                 

                  // call allianz api only when allianz canadian under 65 (if all person are over 65, do not call api)
                  if(values.application.applicationCompany==='Allianz' && values.application.applicationType==='CANADIAN' ){
                    // result = false;
                    // callAllianzAPI 호출하여 비동기 작업 실행
                    callAllianzAPI(values)
                      .then(() => {
                        // console.log('Async operation completed successfully.');
                      })
                      .catch((error) => {
                        // console.error('Async operation failed:', error);
                      });

                      // let isDeduct500Present = false;

                      // for (const i in values.insuredPersons) {
                      //   if (values.insuredPersons[i].selectedPlan.selectedDeduct === 500) {
                      //     isDeduct500Present = true;
                      //     break; // 500인 사람을 찾으면 루프를 종료
                      //   }
                      // }

                      // if (isDeduct500Present) {
                      //   callAllianzAPI(values)
                      //   .then(() => {
                      //     console.log('Async operation completed successfully.');
                      //   })
                      //   .catch((error) => {
                      //     console.error('Async operation failed:', error);
                      //   });
                      // }

                       
                    
                      if (quoteAllianzResult.length > 0 && !quoteAllianzLoading && !quoteAllianzError) {
                        // 나머지 코드 실행
                        const sagaResult = quoteAllianzResult[0];
                        // console.log('sagaResult:', sagaResult);
                        
                        // Medical 카테고리 내의 products 배열에서 Medical 상품을 찾습니다.
                        const medicalCategories = sagaResult.offerCategories
                          .find(category => category.name === "Medical");

                        const medicalProductNoDeductible = medicalCategories.products[0];
                        // const medicalProductDeductible = medicalCategories.products[1];

                        if (medicalProductNoDeductible) {
                          // console.log('medicalProductNoDeductible:', medicalProductNoDeductible);
                          
                          // Medical 상품의 insured 배열에서 해당하는 premium 값을 찾아 values에 할당합니다.
                          values.insuredPersons.forEach((person, index) => {
                            const premiumValue = medicalProductNoDeductible.insured[index]?.premium;
                            // premium 값을 selectedPlan.calculatedInsuranceAmount에 할당합니다.
                            // console.log('medicalProductNoDeductible.insured[index].premium:', premiumValue);

                            // 새로운 객체 생성을 통한 불변성 유지, Update premium from Allianz API Call 
                            const newInsuredPersons = [...values.insuredPersons];
                            newInsuredPersons[index] = {
                              ...newInsuredPersons[index],
                              selectedPlan: {
                                ...newInsuredPersons[index].selectedPlan,
                                insuranceAmount: premiumValue,
                                calculatedInsuranceAmount: premiumValue
                              }
                            };
                            values.insuredPersons = newInsuredPersons;

                            // console.log('values.insuredPersons[index].selectedPlan.insuranceAmount', values.insuredPersons[index].selectedPlan.insuranceAmount, values.insuredPersons[index].selectedPlan);
                          });
                        }
                      }
                      
                      // if (quoteAllianzResult.length > 0 && quoteAllianzResult[0].status !== 'error'){
                      //   result = true;
                      // }
                  }
                                  
                                
                   
          } else {
            for (const i in values.insuredPersons) {
                setFieldTouched(`insuredPersons.${i}.firstName`)
                setFieldTouched(`insuredPersons.${i}.lastName`)
                setFieldTouched(`insuredPersons.${i}.gender`)
                setFieldTouched(`insuredPersons.${i}.birthDate`)
                setFieldTouched(`insuredPersons.${i}.ageDays`)
                setFieldTouched(`insuredPersons.${i}.passportNumber`)
                setFieldTouched(`insuredPersons.${i}.relationship`)
                setFieldTouched(`insuredPersons.${i}.travelType`)
                setFieldTouched(`insuredPersons.${i}.beneficiaryName`)
                setFieldTouched(`insuredPersons.${i}.beneficiaryRelationship`)
                setFieldTouched(`insuredPersons.${i}.graduatedDate`)
                setFieldTouched(`insuredPersons.${i}.tripStartDate`)
                setFieldTouched(`insuredPersons.${i}.tripEndDate`)
                setFieldTouched(`insuredPersons.${i}.tripPeriod`)
              }
            document.getElementById("isInsuredPersonVaild").click()
          
          }
      }
    } else if (activeStep === 2){

      // Step - Product
      // if (values.eligilbeAgrement === true){
      //     if (values.insuredPersons
      //           .filter(i=> i.selectedPlan &&
      //                       (i.age > 59 && (i.travelType!=='SF' && i.travelType!=='SS')
      //                         ? (i.selectedPlan.medicalQuestion.answered
      //                             ? i.selectedPlan.medicalQuestion.chargeRate !== '0'? true: false
      //                             : i.selectedPlan.medicalQuestion.answered) 
      //                         : true) === true).length ===  values.insuredPersons.length) {
                               
      //           result = true
      //     } 
      //     else {
      //       document.getElementById("isInsuredPersonPlanVaild").click()
      //       document.getElementById("isInsuredPersonMedicalVaild").click()
      //     }
      // }
      if (values.eligilbeAgrement === true) {
        if (values.insuredPersons
            .filter(i => i.selectedPlan &&
                (
                    (i.selectedPlan.compnayName === 'Allianz' && i.age > 64 && (i.travelType !== 'SF' && i.travelType !== 'SS')) ||
                    (i.selectedPlan.compnayName !== 'Allianz' && i.age > 59 && (i.travelType !== 'SF' && i.travelType !== 'SS'))
                )
                ? (i.selectedPlan.medicalQuestion.answered
                    ? i.selectedPlan.medicalQuestion.chargeRate !== '0' ? true : false
                    : i.selectedPlan.medicalQuestion.answered)
                : true
            ).length === values.insuredPersons.length) {
            
            result = true;
        } else {
            document.getElementById("isInsuredPersonPlanVaild").click();
            document.getElementById("isInsuredPersonMedicalVaild").click();
        }
      }
    
    
      
    } else if (activeStep === 3){
      // Step - Contact
      setFieldTouched(`contactEmail`)
      setFieldTouched(`contactPhone`)
      setFieldTouched(`maillingInCanada`)
      setFieldTouched(`mailStreetName`)
      setFieldTouched(`mailCity`)
      setFieldTouched(`mailProvince`)
      setFieldTouched(`mailPostalCode`)
      setFieldTouched(`sourceChnnel`)
      if (!errors.contactEmail && !errors.contactPhone && 
          !errors.mailPostalCode && !errors.mailCity && !errors.mailProvince && !errors.mailPostalCode && !errors.sourceChnnel ){
          result = true
      }
    } else if (activeStep === 4){
      setFieldTouched(`purchaseAgreement`)
       // Step - Payment
      if (!errors.paymentMethod && !errors.senderName && 
          !errors.cardHolderName && !errors.creditCardNumber && !errors.cardcvv && !errors.cardExpired &&
          !errors.billPostalCode && !errors.billCity && !errors.billProvince && !errors.billPostalCode){
          result = true
      }else{
        setFieldTouched(`paymentMethod`)
        setFieldTouched(`senderName`)
        setFieldTouched(`cardHolderName`)
        setFieldTouched(`creditCardNumber`)
        setFieldTouched(`cardcvv`)
        setFieldTouched(`cardExpired`)
        setFieldTouched(`billStreetName`)
        setFieldTouched(`billCity`)
        setFieldTouched(`billProvince`)
        setFieldTouched(`billPostalCode`)
      }  
    } 
    return result
  }

  // Normalize payload before submit to backend
  function formatDateOnly(value) {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().substring(0, 10);
  }

  function normalizeTravelApplication(values) {
    let normalized = { ...values };
    // ensure insuredNumber matches array length
    const persons = Array.isArray(values.insuredPersons) ? values.insuredPersons : [];
    normalized.insuredNumber = Number(values.insuredNumber) || persons.length || 0;

    // normalize top-level dates
    normalized.tripStartDate = formatDateOnly(values.tripStartDate);
    normalized.tripEndDate = formatDateOnly(values.tripEndDate);
    normalized.tripArrivalDate = formatDateOnly(values.tripArrivalDate);

    // applicationType: backend expects lower-case at root
    if (values.insuranceType || (values.application && values.application.applicationType)) {
      normalized.applicationType = String(values.insuranceType || values.application.applicationType).toLowerCase();
    }

    // also reflect in nested application object for compatibility
    normalized.application = {
      ...(values.application || {}),
      applicationCompany: (values.application && values.application.applicationCompany) || normalized.application?.applicationCompany || '',
      applicationType: normalized.applicationType || '',
    };

    // Promote familyGroup.totalPremium -> root-level totalPremium
    if (values.familyGroup && values.familyGroup.totalPremium != null) {
      normalized.totalPremium = values.familyGroup.totalPremium;
    }

    // Fallback contactName from primary insured
    if (!normalized.contactName && persons[0]) {
      const p0 = persons[0];
      normalized.contactName = [p0.firstName, p0.lastName].filter(Boolean).join(' ');
    }

    // Prepare mailing address fallback
    const mailAddr = {
      address: values.mailStreetName || values.billStreetName || '',
      city: values.mailCity || values.billCity || '',
      province: values.mailProvince || values.billProvince || '',
      country: values.mailCountry || values.billCountry || '',
      postalCode: values.mailPostalCode || values.billPostalCode || '',
    };

    // helpers
    const toNumber = (val) => {
      // Unwrap arrays: [x] -> x
      if (Array.isArray(val)) {
        return toNumber(val.length > 0 ? val[0] : 0);
      }
      // Unwrap objects that look like {"0": x} or { value: x }
      if (val && typeof val === 'object') {
        const keys = Object.keys(val);
        if (keys.length > 0) {
          // Prefer common keys
          if ('value' in val) return toNumber(val.value);
          if ('0' in val) return toNumber(val['0']);
          return toNumber(val[keys[0]]);
        }
        return 0;
      }
      if (val == null || val === '') return 0;
      const n = Number(val);
      return Number.isFinite(n) ? n : 0;
    };

    const sanitizePlan = (sp) => {
      const plan = { ...(sp || {}) };
      plan.selectedDeduct = toNumber(plan.selectedDeduct);
      plan.selectedCoverage = toNumber(plan.selectedCoverage);
      plan.insuranceAmount = toNumber(plan.insuranceAmount);
      plan.calculatedInsuranceAmount = toNumber(plan.calculatedInsuranceAmount);
      plan.medicalProductNoDeductValue = toNumber(plan.medicalProductNoDeductValue);
      plan.medicalProductDeductValue = toNumber(plan.medicalProductDeductValue);
      // normalize nested coverage object if present (e.g., plan.coverages[...].deduct)
      if (Array.isArray(plan.coverages)) {
        plan.coverages = plan.coverages.map((c) => ({
          ...c,
          deduct: toNumber(c?.deduct),
          value: toNumber(c?.value),
          discount: toNumber(c?.discount),
          price_code: c?.price_code,
        }));
      }
      return plan;
    };

    // normalize insured persons
    normalized.insuredPersons = persons.map((p, index) => ({
      ...p,
      // Relationship default: Primary for first, generic for others
      relationship: p.relationship || (index === 0 ? 'Primary' : 'Spouse/Child'),
      birthDate: formatDateOnly(p.birthDate),
      tripStartDate: formatDateOnly(p.tripStartDate),
      tripEndDate: formatDateOnly(p.tripEndDate),
      arrivalDate: formatDateOnly(p.arrivalDate),
      graduatedDate: formatDateOnly(p.graduatedDate),
      yearDateAfterGraduated: formatDateOnly(p.yearDateAfterGraduated),
      tripDepartureDate: formatDateOnly(p.tripDepartureDate),
      tripArrivalDate: formatDateOnly(p.tripArrivalDate),
      sameDate: !!p.sameDate,
      selectedPlan: sanitizePlan(p.selectedPlan || {}),
      optionalCarewellService: (() => {
        const care = p.optionalCarewellService || { packageName: 'Package', packageAmount: 0, isSelected: false };
        return { ...care, packageAmount: toNumber(care.packageAmount), isSelected: !!care.isSelected };
      })(),
      insurancePlans: Array.isArray(p.insurancePlans) ? p.insurancePlans.map(sanitizePlan) : [],
      optionalAddOnPlans: Array.isArray(p.optionalAddOnPlans)
        ? p.optionalAddOnPlans.map((op) => ({
            ...op,
            planTypes: Array.isArray(op.planTypes)
              ? op.planTypes.map((pt) => ({
                  ...pt,
                  selectedCoverage: toNumber(pt?.selectedCoverage),
                  calculatedAddOnAmount: toNumber(pt?.calculatedAddOnAmount),
                  isSelected: !!pt?.isSelected,
                }))
              : [],
          }))
        : [],
      // Address defaults per insured
      address: p.address ?? mailAddr.address,
      city: p.city ?? mailAddr.city,
      province: p.province ?? mailAddr.province,
      country: p.country ?? mailAddr.country,
      postalCode: p.postalCode ?? mailAddr.postalCode,
    }));

    // Final deep numeric coerce (mirror saga & submit safety)
    const numericKeys = new Set([
      'selectedCoverage', 'selectedDeduct', 'insuranceAmount', 'calculatedInsuranceAmount',
      'medicalProductNoDeductValue', 'medicalProductDeductValue', 'deduct', 'value', 'discount',
      'calculatedAddOnAmount'
    ]);
    function deepCoerce(node, parentKey) {
      if (Array.isArray(node)) {
        if (node.length === 1 && numericKeys.has(parentKey)) {
          return deepCoerce(node[0], parentKey);
        }
        return node.map((v) => deepCoerce(v, parentKey));
      }
      if (node && typeof node === 'object') {
        const keys = Object.keys(node);
        if (keys.length === 1 && keys[0] === '0' && numericKeys.has(parentKey)) {
          return deepCoerce(node['0'], parentKey);
        }
        const out = {};
        for (const k of keys) out[k] = deepCoerce(node[k], k);
        return out;
      }
      if (node == null && numericKeys.has(parentKey)) return 0;
      if (typeof node === 'string' && numericKeys.has(parentKey)) {
        const m = node.match(/^[-+]?\d+(?:\.\d+)?$/);
        if (m) return parseFloat(node);
      }
      return node;
    }
    normalized = deepCoerce(normalized, undefined);
    return normalized;
  }

  if (submitted === false) {
    return (
        <Formik
          initialValues={formData}
          // initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
              const next = { ...values, preferLanguage: currentLanguage };
              const normalized = normalizeTravelApplication(next);
              setFormData(normalized);
              setSubmitted(true);
          }} 
        >
          {({ values, handleChange, handleBlur, setFieldValue, setTouched, setFieldTouched, touched, errors}) => (
            <Form  style={{ margin: '2vh'}}>
                {/* {console.log('errors', errors)} */}

                {/* Form title - mobile */}
                {/* { isMobile ? (
                    <>
                        <div style={{ position: 'fixed', top:'50px', left:'0', textAlign:'center', padding:'1.5vh', background:"#2a2f71", width:'100%', fontWeight:'500', zIndex:'1000', color:'#fff', }}>
                            {`${values.application.applicationCompany} ${values.application.applicationType.charAt(0).toUpperCase() + values.application.applicationType.slice(1).toLowerCase()}  Plan Application `}
                        </div>
                    </>
                ) : null} */}

                {/* {isModalOpen && <LoadingModal />}  */}

                <Grid container direction='column' spacing={4}>
                    
                    {isModalOpen === true && <LoadingModal />} 
                    
                    <Grid item container xs={12} style={{textAlign:'center', fontWeight:400, fontSize:isMobile ? '20px':'1.6em', margin: isMobile ? '0':'20px 0', borderBottom:'1px solid #f3f3f3', background: isMobile ? '#f9f9f9':"none", marginTop:isMobile?'-5px':'0'}}>
                        <Grid item xs={12} style={{  fontSize:'14px', margin:isMobile ?'10px 0':'30px 0', color:'#555'}}>
                            Your Agency <span style={{ fontWeight:'600', marginLeft:'10px' }}>{vendorName}</span>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign:'center' }}>
                          <img
                              src={values.application.applicationCompany === 'Tugo' 
                                      ? tugoLogo : values.application.applicationCompany === 'Allianz' 
                                      ? allianzLogo : values.application.applicationCompany === 'BlueCross'
                                          ? blueCrossLogo : values.application.applicationCompany === 'GMS'
                                             ? gmsLogo : values.application.applicationCompany === 'Travelance' ? travelanceLogo 
                                             : values.application.applicationCompany === 'IMG' ? imgLogo : ''}
                                     
                              alt='logo'
                              style={{width: values.application.applicationCompany === 'Allianz' ? '110px' : values.application.applicationCompany ==='Tugo' ? '120px' : values.application.applicationCompany === 'GMS' ? '100px' : 'auto', height: values.application.applicationCompany ==='BlueCross' ? '70px' : 'auto', padding:'1vh'}}
                          />
                          {/* <span style={{ alignSelf:'center' }}>
                              {`${values.application.applicationType.charAt(0).toUpperCase() + values.application.applicationType.slice(1).toLowerCase()}  Plan Application `}
                          </span> */}
                          <span style={{ alignSelf: 'center' }}>
                            {`${values.application.applicationType.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")} Plan Application`}
                          </span>

                        </Grid>
                        
                    </Grid>
                  
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((label, index) => (
                        <Step key={label}>
                          {/* <StepLabel>{label}</StepLabel> */}
                          <StepLabel><Text tid={label}/></StepLabel>
                          <StepContent>
                            {getStepContent(
                              index, 
                              values, 
                              handleChange, 
                              handleBlur,
                              setFieldValue, 
                              setFieldTouched, 
                              errors, 
                              countries, 
                              provinces, 
                              insurances, 
                              questions,
                              sourceChnnel,
                              async () => {
                                try {
                                  setQuoteLoading(true);
                                  setQuoteError(null);
                                  const payload = buildTuGoDevPayload(values);
                                  console.warn('[quote:enter]', QUOTE_ENDPOINT, payload);
                                  const resp = await postQuoteTugo(payload);
                                  console.warn('[quote:done]', resp);
                                  
                                  // Handle fallback response (error case)
                                  if (resp?.response?.error === "TOKEN_OR_QUOTE_FAILED") {
                                    console.warn('[quote:fallback] TuGo returned fallback response, premium=0');
                                    const fallbackPlans = [{
                                      planCode: "FALLBACK",
                                      planName: "TuGo (Fallback)",
                                      premium: 0,
                                      planCost: 0,
                                      tax: 0,
                                      minimumPremium: 0,
                                    }];
                                    const fallbackUiPlans = [{
                                      code: "FALLBACK",
                                      name: "TuGo (Fallback)",
                                      premium: 0,
                                      tax: 0,
                                      total: 0,
                                    }];
                                    setNormalizedQuote({ endpoint: resp?.endpoint || "quotePrice", requestEcho: resp?.request, plans: fallbackPlans });
                                    setAvailablePlans(fallbackUiPlans);
                                    setTugoPrice(0);
                                    setTugoPlanMeta({ code: "FALLBACK", name: "TuGo (Fallback)" });
                                    setQuoteError(resp?.response?.errorMessage || "TuGo quote unavailable - using fallback premium");
                                    return;
                                  }
                                  
                                  // Normal response with plans
                                  const availablePlansArray = Array.isArray(resp?.response?.availablePlanPrices) 
                                    ? resp.response.availablePlanPrices 
                                    : [];
                                  const plans = availablePlansArray.map(p => ({
                                    planCode: p.planCode || "",
                                    planName: p.planName || "",
                                    premium: Number(p.premium || 0),
                                    planCost: Number(p.planCost || p.premium || 0),
                                    tax: Number(p.tax || 0),
                                    minimumPremium: Number(p.minimumPremium || 0),
                                  }));
                                  
                                  // Map plans for UI display (with code, name, total properties)
                                  const uiPlans = mapPlansForUI(resp?.response || {});
                                  console.log('[quote:uiPlans]', uiPlans);
                                  setAvailablePlans(uiPlans);
                                  
                                  setNormalizedQuote({ endpoint: resp?.endpoint || "quotePrice", requestEcho: resp?.request, plans });
                                  if (plans[0]?.planCode) setSelectedPlanCode(plans[0].planCode);
                                  // 표시 가격만 TuGo로 교체
                                  if (USE_TUGO_API_PRICING && plans[0]) {
                                    setTugoPrice(plans[0].planCost ?? plans[0].premium ?? 0);
                                    setTugoPlanMeta({ code: plans[0].planCode, name: plans[0].planName });
                                  } else if (USE_TUGO_API_PRICING && plans.length === 0) {
                                    // No plans available - set fallback
                                    setTugoPrice(0);
                                    setTugoPlanMeta({ code: "NO_PLANS", name: "No TuGo plans available" });
                                    setAvailablePlans([]);
                                  }
                                } catch (e) {
                                  console.warn('[quote:error]', String(e));
                                  setQuoteError(e?.message || 'Failed to fetch quote');
                                  // Set fallback values on error
                                  setTugoPrice(0);
                                  setAvailablePlans([]);
                                  setNormalizedQuote({ endpoint: "quotePrice", requestEcho: null, plans: [] });
                                } finally {
                                  setQuoteLoading(false);
                                }
                              },
                              { tugoPrice, tugoPlanMeta, tugoLoading, forceFetchTuGo, availablePlans, selectedPlanCode, setSelectedPlanCode }
                            )}
                            
                            <Grid container style={{ margin: '4vh 0 1vh 0', marginLeft: width > 1400 ? '22vh' : '0' }} spacing={1}>
                                {activeStep !== 0 &&
                                <Grid item xs={6} sm={6} md={3} lg={3}>
                                  <Button 
                                    color="secondary" 
                                    className={classes.back_button} 
                                    onClick={handleBack}
                                  >
                                    <Text tid={'Button.Previous'}/>
                                  </Button>
                                  </Grid>
                                }
                                <Grid item xs={6} sm={6} md={3} lg={3}>
                                  {activeStep < 5 &&
                                    <Button 
                                      color="dark" 
                                      className={classes.next_button}
                                      // disabled = {(activeStep <= 1 || (activeStep > 1 && values.eligilbeAgrement))?false:true}
                                      disabled={
                                        !(
                                          activeStep <= 1 || 
                                          (activeStep > 1 && values.eligilbeAgrement && !(activeStep > 3 && !values.purchaseAgreement))
                                        )
                                      }
                                      onClick={()=>{
                                        if(IsStepValidated(values, setFieldTouched, errors) === true){
                                            setFormData(values);
                                            // Build policy draft from last quote if plans available
                                            if (availablePlans && availablePlans.length) {
                                              const chosenCode = selectedPlanCode || availablePlans[0].code;
                                              const draft = buildPolicyDraft({ request: { ...formData, trip: { startDate: fmtDate(formData?.tripStartDate), endDate: fmtDate(formData?.tripEndDate), departureProvince: formData?.originProvince } }, response: { availablePlanPrices: [] } }, chosenCode);
                                              const finalDraft = attachSelectedPlans(draft);
                                              // eslint-disable-next-line no-console
                                              console.log('[policyDraft]', finalDraft);
                                            }
                                            handleNext();
                                          }

                                      }}
                                    >
                                      <Text tid={'Button.Next'}/>
                                    </Button>
                                  }
                                  {activeStep === 5 &&
                                    <Button 
                                      type='submit' 
                                      color="dark" 
                                      className={classes.next_button} 
                                      // onClick={console.log('submitted', submitted)}
                                    >
                                      <Text tid={'Button.Apply'}/>
                                    </Button>
                                  }
                                </Grid>
                            
                            </Grid>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>

                    <Grid item container xs={12} style={{fontWeight:400, fontSize:isMobile ? '20px':'1.6em', borderBottom:'1px solid #f3f3f3', background: isMobile ? '#f9f9f9':"none", marginTop:isMobile?'-5px':'0'}}>
                        <Grid item xs={12} style={{  fontSize:'12px', marginBottom:'10px', color:'#555'}}>
                        Individual circumstances may vary. Contact Stonewell Financial Services INC if you need advice about your insurance needs. Travel insurance does not cover everything. Please refer to the policy wording for full terms and conditions, including limitations and exclusions.
                        </Grid>
                        {insuraceCompany ==='Allianz' && 
                          <Grid item xs={12} style={{  fontSize:'12px', color:'#555'}}>
                            Travel insurance is underwritten by CUMIS General Insurance Company, a member of the Co-Operators Group of Companies and administered by Allianz Global Assistance. Allianz Global Assistance is a registered business name of AZGA Service Canada Inc. and AZGA Insurance
                            Agency Canada Ltd. CUMIS General Insurance Company, P.O. Box 5065, 151 North Service Road, Burlington, Ontario L7R 4C2, Canada, 1-800-263-9120<br/><br/>
                              <a href="https://www.allianz‐assistance.ca/en_CA/file‐a‐claim/complaint‐resolution‐process.html" rel="noopener noreferrer" target="_blank"><Text tid={'Quote.HowToFileAComplaint'}/></a>&nbsp;
                              <a href="https://www.allianz-assistance.ca/en_CA/privacy-statement.html" rel="noopener noreferrer" target="_blank">Privacy Policy</a><br/><br/>
                            Distributor: Stonewell Financial Services INC <Text tid={'Quote.HowToFileAComplaint.Detail1'}/> <br/>
                            * Allianz Global Assistance <Text tid={'Quote.HowToFileAComplaint.Detail2'}/> Allianz Global Assistance <Text tid={'Quote.HowToFileAComplaint.Detail3'}/>
                          </Grid>
                        }
                        
                    </Grid>
                
                </Grid>

              </Form>
          )}
        </Formik>

    );
  } else {
    return( 
        <SubmitResult
          formData={formData}
        />
    )

  }
}