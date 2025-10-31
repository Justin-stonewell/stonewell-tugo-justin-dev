import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
// redux
import { useSelector, useDispatch } from 'react-redux';
import store from "../../../redux/store";

// core components
import {
  Dialog, DialogContent, 
  Typography, IconButton, Grid,
  FormControlLabel, RadioGroup, Radio
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MdClose } from 'react-icons/md'
import CircularProgress from '@material-ui/core/CircularProgress'
//
import Button from '../CustomButtons/Button'
import { Text, LanguageContext } from "../LanguageProvider";
import { textLineBreak } from "../../../functionalities/TextFormat";
//icon
// import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
// import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import { quoteAllianz, quoteAllianzMedCAN } from "../../../redux/actions/travelApplicationAction";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 999999,
  },
  formTitle: { 
    fontSize: '20px', 
    fontWeight:'300',
    marginBottom:'0',
    color:'#fff' 
  },
  formDescription: {
    fontSize:'14px', 
    fontWeight:'300',
    marginBottom:'2vh',
    marginTop:'2vh' 
  },
  RedBoldWording: {
    fontWeight:'500',
    color:'#fe001a',
    marginBottom:'1vh',
    fontSize:'20px'
  },
  answerBox: {
    // padding:'8px',
    // border:'1px solid #e2e2e3',
    // borderRadius:'4px',
    marginTop:'8px',
    marginLeft:'40px',
    marginBottom:'40px'
  },
  questionTitle: {
    fontSize:'18px',
    color:'#003781',
    fontWeight:'600',
    lineHeight:'1.6'
  },
  button: {
    margin: 10,
    '&:hover': {
      color: '#fff',
    },
  },
  back_button: {
    width: '100%'
  },
  next_button: {
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#fff',
  },
  divider: {
    margin: '16px 0',
  },
  btnWrapper: {
    textAlign: 'center',
  },
  nested: {
    // paddingLeft: theme.spacing(4)
    padding:'5px 0',
    borderBottom:'1px solid #eee',
    color:'#53565a',
    fontSize:'14px'
  },
  subList: {
    marginLeft:'2vh',
    marginTop:'2vh',
    fontSize:'17px'
  }
}))


const MedQuestionAllianzCAN = (props) => {
  // const { medQuestion, questionnaire, open, handleClose, medicalChargeRate  } = props;
  const { data, insuredPerson, medQuestion, questionnaire, open, handleClose } = props;

  const classes = useStyles()

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage
  // let stopPoint = 0

  // 버튼 활성화 상태를 관리하는 state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();

  const planMedQuest = medQuestion.map(i => i.planMedQuestion)
  const planMedQuestAnswer = ((planMedQuest.map(m => m.medicalQuestion)).map(a => a.quesAnswer)).map(ans => ans)


  const initialData = getInitialData()

  function getInitialData(){

    if (planMedQuestAnswer.map(i=>i.length) > 0)
    {
      const iniData = planMedQuestAnswer.map(i=>i)[0].map((a, index) => ({
        questionnaire_id : a.questionnaire_id,
        question_code : a.question_code,
        header_content_kr : a.header_content_kr,
        header_content_en : a.header_content_en,
        question_kr : a.question_kr,
        question_en : a.question_en,
        input_type : a.input_type,
        answer : a.answer,
        numRequiredAnswer: a.answer.length,
        answerResult: index === 0 && a.answer.filter(f=>f.answer_code === 'q1a1' && f.answer_value === true).length > 0 ?  'Yes': a.answerResult,
        answerFlag: a.answerFlag
      }))

        return(iniData)
    }
    else
    {
      const iniData = questionnaire.map(item => ({
        questionnaire_id : item.questionnaire_id,
        question_code : item.question_code,
        header_content_kr : item.header_content_kr,
        header_content_en : item.header_content_en,
        question_kr : item.question_kr,
        question_en : item.question_en,
        input_type : item.input_type,
        answer : item.answer,
        numRequiredAnswer: item.answer.length,
        answerResult : item.input_type==='SINGSEL'?'':0,
        answerFlag: 0
      }))

      return(iniData)
    }

  }

  // get Quotes Med Canadian from Allianz API
  const quoteAllianzMedCANResult  = useSelector((state) => state.travelApplicationReducer.quoteAllianzMedCANResult)
  const quoteAllianzMedCANLoading = useSelector(state => state.travelApplicationReducer.quoteAllianzMedCANLoading)
  const quoteAllianzMedCANError = useSelector(state => state.travelApplicationReducer.quoteAllianzMedCANError)

  const [medSurveyAnswers, setMedSurveyAnswers] = useState([]);

  useEffect(() => {

     // API 호출 상태가 변경될 때마다 실행됩니다
    if (quoteAllianzMedCANResult.length > 0 && !quoteAllianzMedCANLoading && !quoteAllianzMedCANError) {
     
      const medicalResult = quoteAllianzMedCANResult[0];
      // console.log('medicalResult:', medicalResult);
     
      // Medical 상품의 insured 배열에서 해당하는 Medical Result 값을 찾아 values에 할당합니다.
      insuredPerson.insurancePlans[0].medicalSurvey = {
          surveyScore: medicalResult.score,
          scoringReference: medicalResult.scoringReference,
          verificationToken: medicalResult.validationToken,
          medicalSurveyAnswers: medSurveyAnswers
      };
      
      insuredPerson.insurancePlans[0].medicalQuestion.answered = true


    }

    

}, [quoteAllianzMedCANResult, quoteAllianzMedCANLoading, quoteAllianzMedCANError, insuredPerson, medSurveyAnswers]);


  // validationSchema
  const validationSchema = Yup.array().of(
    Yup.object().shape({
      question_code: Yup.string().required(),
      answerFlag: Yup.number().when('question_code', {
        is: (code) => code === 'q01' || code === 'q03' || code === 'q04',
        then: Yup.number().when('input_type', {
          is: 'SINGSEL',
          then: Yup.number().min(1, 'Required the answer!').required('RequiredAnswer'),
          otherwise: Yup.number().min(Yup.ref('numRequiredAnswer'), 'RequiredAnswer').required('Required the answer!')
        }),
       
        // otherwise: Yup.number().when('question_code', {
        //   is: (code) => /^q02[a-f]$/.test(code),
        //   then: Yup.number().when('answerResult', {
        //     is: (value, context) => {
        //       const parentQ02 = context.options.context.values.find(item => item.question_code === 'q02');
        //       return parentQ02 && (parentQ02.answerResult === true || parentQ02.answerResult === "");
        //     },
        //     then: Yup.number().when('input_type', {
        //       is: 'SINGSEL',
        //       then: Yup.number().min(1, 'Required the answer!').required('RequiredAnswer'),
        //       otherwise: Yup.number().min(Yup.ref('numRequiredAnswer'), 'RequiredAnswer').required('Required the answer!')
        //     }),
        //     otherwise: Yup.number().notRequired()
        //   }),
        //   otherwise: Yup.number().when('input_type', {
        //     is: 'SINGSEL',
        //     then: Yup.number().min(1, 'Required the answer!').required('RequiredAnswer'),
        //     otherwise: Yup.number().min(Yup.ref('numRequiredAnswer'), 'RequiredAnswer').required('Required the answer!')
        //   })
        // })
      }),
      answerResult: Yup.boolean()
    })
  );
  
  


  

  // ValidMessage
  function validMessage(fieldName) {
    return (
        <ErrorMessage
            name={fieldName}
            render={(msg) => 
                <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
                    <Text tid={`${msg}`}></Text>
                </div>
            }
        />
    );
  }
  



  // submitSurvey 함수를 Promise를 사용하여 정의
  function submitSurvey(values) {
    // console.log('submitSurvey values', values);
    return new Promise((resolve, reject) => {
      dispatch(quoteAllianzMedCAN({ data: values }));
      // console.log('submitSurvey dispatch', dispatch(quoteAllianzMedCAN({ data: values })));
      const unsubscribe = store.subscribe(() => {
        const state = store.getState();
        // 여기서는 quoteAllianzMedCANLoading, quoteAllianzMedCANError, quoteAllianzMedCANResult 상태를 체크합니다.
        const { quoteAllianzMedCANLoading, quoteAllianzMedCANError, quoteAllianzMedCANResult } = state.travelApplicationReducer;
        if (!quoteAllianzMedCANLoading) {
          unsubscribe(); // 상태 갱신이 완료되면 구독 해제
          if (quoteAllianzMedCANError) {
            reject(quoteAllianzMedCANError);
          } else {
            resolve(quoteAllianzMedCANResult);
          }
        }
      });
    });
  }

  // 비동기 함수를 async로 정의 - final quote api
  async function callAllianzAPI(values) {
    // console.log('formData3:', formData)
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
  
  // getQuotesAllianz 함수를 Promise를 사용하여 정의 - final quote api
  function getQuotesAllianz(data) {
    return new Promise((resolve, reject) => {
      dispatch(quoteAllianz({data: data}));
  
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


  const handleSubmit = async (values) => {
    setIsButtonDisabled(true);
    callAllianzMedAPI(values)
      .then(() => {
        // console.log('First Async operation completed successfully.');
  
        // 첫 번째 비동기 작업(Get Medical Result API) 이 성공한 후 두 번째 비동기 작업 실행 (Get final Quote API)
        return callAllianzAPI(data);
      })
      .then(() => {
        // console.log('Second Async operation completed successfully.');
        // 버튼 활성화
        setIsButtonDisabled(false);
      })
      .catch((error) => {
        console.error('Async operation failed:', error);
        // 에러가 발생해도 버튼을 활성화
        setIsButtonDisabled(false);
      })
      .finally(() => {
        // result of medical questions
        planMedQuest.map(m => m.medicalQuestion.quesAnswer = values)
        planMedQuest.map(m => m.medicalQuestion.answered = true)
        handleClose(false);
      });
  };

  // 비동기 함수를 async로 정의
  async function callAllianzMedAPI(values) {
     // 우선 values 객체에서 medicalSurvey 배열을 생성합니다.
     const medicalSurvey = values.map(v => ({
      questionId: v.question_code,
      // 해당하는 response 값을 'true' 또는 'false'로 설정합니다.
      response: v.answerResult === true ? 'true' : 'false'
    }));

      try {
        // submitSurvey 함수 호출 시 await 키워드 사용
        const result = await submitSurvey(medicalSurvey);
        // console.log('allianzAPIResult:',result)
        insuredPerson.medicalSurvey = result
        // setApiResult(quoteAllianzResult);
        // console.log('insuredPerson:',insuredPerson)

        const updateInsuredPerson = (data, insuredPerson) => {
          // data.insuredPersons 배열을 순회하면서 조건에 맞는 요소를 찾습니다.
          data.insuredPersons = data.insuredPersons.map(person => {
            if (person.firstName === insuredPerson.firstName && person.birthDate === insuredPerson.birthDate) {
              // 조건에 맞는 경우, insuredPerson 객체로 업데이트합니다.
              // insuredPerson.medicalSurvey = medicalSurvey;
              return insuredPerson;
            } else {
              // 조건에 맞지 않는 경우, 원래 객체를 그대로 반환합니다.
              return person;
            }
          });
        };
        
        updateInsuredPerson(data, insuredPerson);

        // console.log('data.insuredPersons:',data.insuredPersons)
      
      } catch (error) {
        // 오류 처리
        console.error('An error occurred:', error);
      }

  }
  //
  


  return (
    <div>
      <Dialog 
        style={{zIndex: 9999}}
        fullWidth={true}
        maxWidth="md"
        open={open} 
        // onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography variant="h2" className={classes.formTitle}>
            Allianz Medical Questionnaire
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {handleClose(false)}}
          >
            { isButtonDisabled===false && <MdClose /> }
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={values => {
              handleSubmit(values)
            }}
          >
            {({ values, setFieldValue, setFieldTouched, errors }) => (
              <Form>
                <div>
                  {/* {console.log(errors)} */}
                   
                  {/* Question 1 */}
                  {values && values.map((v, index) => (
                     !v.question_code.match(/q02[a-f]/) &&
                      v.question_code.match('q01')// 질문 코드가 'q01' 경우에만 렌더링
                        && (
                        <div key={index}>
                          <Grid container>
                            <Grid item xs={12}>
                              {/* 문단 설명 */}
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="h5">
                                1.
                                {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
                              </Typography>
                            </Grid>
                            <FieldArray
                                name={`${index}.answer`}
                                render={() => (
                                  <RadioGroup
                                    name={`${index}.answer`}
                                    value={v.answer.find(a => a.answer_value === true)?.answer_code || ''}
                                    onChange={event => {
                                      const answerCode = event.target.value;
                                      // 모든 답변의 answer_value를 false로 설정
                                      v.answer.forEach((a, a_index) => {
                                        setFieldValue(`${index}.answer.${a_index}.answer_value`, false);
                                      });
                                      // 선택된 답변의 answer_value를 true로 설정
                                      const selectedAnswerIndex = v.answer.findIndex(a => a.answer_code === answerCode);
                                      if (selectedAnswerIndex !== -1) {
                                        setFieldValue(`${index}.answer.${selectedAnswerIndex}.answer_value`, true);
                                      }
                                      setFieldValue(`${index}.answerResult`, answerCode === 'a1'?true:false) 
                                      // console.log('values', values)
                                    }}
                                    row
                                  >
                                    {v.answer.map((a, a_index) => (
                                      <FormControlLabel
                                        key={a_index}
                                        value={a.answer_code}
                                        control={<Radio size="small" />}
                                        label={currentLanguage === 'ko' ? a.content_kr : a.content_en}
                                        labelPlacement="end"
                                        style={{ margin:'1vh' }}
                                      />
                                    ))}
                                  </RadioGroup>
                                )}
                              />
                          </Grid>

                          <div style={{ display: 'none' }}>
                            {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}  
                          </div>
                          {validMessage(`${index}.answerFlag`)}
                        </div>
                      )
                    ))}

                    {/* Question 02 */}
                    {values[0].answer[0].answer_value === true ?
                      <>
                        {values && values.map((v, index) => (
                        !v.question_code.match(/q02[a-f]/) &&
                          v.question_code.match('q02')// 질문 코드가 'q02' 경우에만 렌더링
                            && (
                            <div key={index}>
                              <Grid container>
                                <Grid item xs={12}>
                                  {/* 문단 설명 */}
                                </Grid>
                                <Grid item xs={12} style={{ marginBottom:'2vh' }}>
                                  <Typography variant="h5">
                                    *
                                    {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
                                  </Typography>
                                </Grid>
                                <div style={{ display:'none'}}>
                                    <FieldArray
                                        name={`${index}.answer`}
                                        render={() => (
                                          <RadioGroup
                                            name={`${index}.answer`}
                                            // value={v.answer.find(a => a.answer_value === true)?.answer_code || ''}
                                            value={values[0].answer[0].answer_value === true?'a1':'a2'}
                                            onChange={event => {
                                              const answerCode = event.target.value;
                                              // 모든 답변의 answer_value를 false로 설정
                                              v.answer.forEach((a, a_index) => {
                                                setFieldValue(`${index}.answer.${a_index}.answer_value`, false);
                                              });
                                              // 선택된 답변의 answer_value를 true로 설정
                                              const selectedAnswerIndex = v.answer.findIndex(a => a.answer_code === answerCode);
                                              if (selectedAnswerIndex !== -1) {
                                                setFieldValue(`${index}.answer.${selectedAnswerIndex}.answer_value`, true);
                                              }
                                              
                                              setFieldValue(`${index}.answerResult`, answerCode === 'a1'?true:false) 
                                            }}
                                            row
                                          >
                                            {v.answer.map((a, a_index) => (
                                              <FormControlLabel
                                                key={a_index}
                                                value={a.answer_code}
                                                control={<Radio size="small" />}
                                                label={currentLanguage === 'ko' ? a.content_kr : a.content_en}
                                                labelPlacement="end"
                                                style={{ margin:'1vh' }}
                                              />
                                            ))}
                                          </RadioGroup>
                                        )}
                                      />
                                </div>
                              </Grid>

                              <div style={{ display: 'none' }}>
                                {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}  
                              </div>
                              {validMessage(`${index}.answerFlag`)}
                            </div>
                          )
                        ))}
                      </>:null
                    }

                      {/* If Question 2 = yes */}
                      {values[0].answer[0].answer_value === true ?
                            <>
                            {values && values.map((v, index) => (
                              v.question_code.match(/q02[a-f]/) && ( 
                                  <div key={index}>
                                    <Grid container>
                                      <Grid item xs={12}>
                                        {/* 문단 설명 */}
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Typography variant="h5">
                                          &nbsp;&nbsp;˙
                                          {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
                                        </Typography>
                                      </Grid>
                                      <FieldArray
                                          name={`${index}.answer`}
                                          render={() => (
                                            <RadioGroup
                                              name={`${index}.answer`}
                                              value={v.answer.find(a => a.answer_value === true)?.answer_code || ''}
                                              onChange={event => {
                                                const answerCode = event.target.value;
                                                // 모든 답변의 answer_value를 false로 설정
                                                v.answer.forEach((a, a_index) => {
                                                  setFieldValue(`${index}.answer.${a_index}.answer_value`, false);
                                                });
                                                // 선택된 답변의 answer_value를 true로 설정
                                                const selectedAnswerIndex = v.answer.findIndex(a => a.answer_code === answerCode);
                                                if (selectedAnswerIndex !== -1) {
                                                  setFieldValue(`${index}.answer.${selectedAnswerIndex}.answer_value`, true);
                                                }
                                                setFieldValue(`${index}.answerResult`, answerCode === 'a1'?true:false) 
                                              }}
                                              row
                                            >
                                              {v.answer.map((a, a_index) => (
                                                <FormControlLabel
                                                  key={a_index}
                                                  value={a.answer_code}
                                                  control={<Radio size="small" />}
                                                  label={currentLanguage === 'ko' ? a.content_kr : a.content_en}
                                                  labelPlacement="end"
                                                  style={{ margin:'1vh' }}
                                                />
                                              ))}
                                            </RadioGroup>
                                          )}
                                        />
                                    </Grid>

                                    <div style={{ display: 'none' }}>
                                      {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}  
                                    </div>
                                    {validMessage(`${index}.answerFlag`)}
                                  </div>
                              )
                            ))}
                            </>
                        :null}

                    {/* Question 3 and 4 */}
                    {values && values.map((v, index) => (
                      (v.question_code.match('q03') || v.question_code.match('q04'))// 질문 코드가 'q03','q04' 경우에만 렌더링
                        && (
                        <div key={index}>
                          <Grid container>
                            <Grid item xs={12}>
                              {/* 문단 설명 */}
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="h5">
                                {v.question_code === 'q03' ? '2.'
                                 : v.question_code === 'q04' ? '3.'
                                 : null}

                                {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
                              </Typography>
                            </Grid>
                            <FieldArray
                                name={`${index}.answer`}
                                render={() => (
                                  <RadioGroup
                                    name={`${index}.answer`}
                                    value={v.answer.find(a => a.answer_value === true)?.answer_code || ''}
                                    onChange={event => {
                                      const answerCode = event.target.value;
                                      // 모든 답변의 answer_value를 false로 설정
                                      v.answer.forEach((a, a_index) => {
                                        setFieldValue(`${index}.answer.${a_index}.answer_value`, false);
                                      });
                                      // 선택된 답변의 answer_value를 true로 설정
                                      const selectedAnswerIndex = v.answer.findIndex(a => a.answer_code === answerCode);
                                      if (selectedAnswerIndex !== -1) {
                                        setFieldValue(`${index}.answer.${selectedAnswerIndex}.answer_value`, true);
                                      }
                                      setFieldValue(`${index}.answerResult`, answerCode === 'a1'?true:false) 

                                      // console.log(values);
                                    }}
                                    row
                                  >
                                    {v.answer.map((a, a_index) => (
                                      <FormControlLabel
                                        key={a_index}
                                        value={a.answer_code}
                                        control={<Radio size="small" />}
                                        label={currentLanguage === 'ko' ? a.content_kr : a.content_en}
                                        labelPlacement="end"
                                        style={{ margin:'1vh' }}
                                      />
                                    ))}
                                  </RadioGroup>
                                )}
                              />
                          </Grid>

                          <div style={{ display: 'none' }}>
                            {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}  
                          </div>
                          {validMessage(`${index}.answerFlag`)}
                        </div>
                      )
                    ))}

                  {/* <div> Q1_answer {values[0].answerResult} ~ Q8_answer </div> */}
 
                </div>


                <Grid item container style={{ margin: '5vh 0 5vh 0' }} justifyContent="center" spacing={1}>
                    <Grid item xs={6} lg={3}>
                      <Button
                        color="secondary"
                        className={classes.back_button}
                        disabled={isButtonDisabled} // 버튼의 disabled 속성에 상태를 연결
                        onClick={() => {handleClose(false)}}
                      >
                        Close
                      </Button>
                    </Grid>

                    <Grid item xs={6} lg={3}>
                      <Button
                        color="dark"
                        type="submit"
                        className={classes.next_button}
                        disabled={isButtonDisabled} // 버튼의 disabled 속성에 상태를 연결
                        onClick ={() => {
                          const medicalSurvey = values.map(v => ({
                            questionId: v.question_code,
                            response: v.answerResult === true ? 'true' : 'false'
                          }));
                          setMedSurveyAnswers(medicalSurvey);
                          // insuredPerson.medicalSurvey = medicalSurvey
                          // insuredPerson.selectedPlan.medicalQuestion.quesAnswer = values

                          // selectedPlan이 비어있지 않고(P.Qoute 에는 비어 있음), medicalQuestion 객체가 있는 경우에만 실행
                          if (insuredPerson.selectedPlan.length > 0 && insuredPerson.selectedPlan.medicalQuestion) {
                            insuredPerson.selectedPlan.medicalQuestion.quesAnswer = values;
                          }

                          // console.log('insuredPerson.medicalSurvey.medicalSurveyAnswers', insuredPerson.medicalSurvey.medicalSurveyAnswers)
                        }}
                      >
                        { isButtonDisabled===true && <CircularProgress color="inherit" /> } 
                        { isButtonDisabled===true ? 'Calculating premium, please wait.' : 'Submit' }
                      </Button>
                    </Grid>
                </Grid>
                
              </Form>
            )}
          </Formik>
        </DialogContent>

      </Dialog>
    </div>
  );
}

export default MedQuestionAllianzCAN;