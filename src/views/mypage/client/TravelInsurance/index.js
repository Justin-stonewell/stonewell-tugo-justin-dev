import React, { useEffect, useCallback, useState, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
// import {useParams} from 'react-router-dom';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplicationsByClient } from '../../../../redux/actions/travelApplicationAction';
import { getFileFromS3 } from '../../../../redux/actions/s3Action';

//core component
import { Tabs, Tab, Typography, Grid, IconButton } from '@material-ui/core'
//component
import Button from '../../../../components/common/CustomButtons/Button'
import { Text, LanguageContext } from '../../../../components/common/LanguageProvider';
import PDFViewer from "../../../../components/common/PDFViewer/AllPageViewer";
// import RenewApplicationModal from '../../common/RenewalApplication/RenewModal';
// import RepurchaseApplication from './RepurchaseApplication'
import RepurchaseModal from './RepurchaseModal'
import RefundApplicationModal from '../../common/RefundApplication/RefundModal';
import WindowDimension from '../../../../components/common/WindowDimension'
//
import { amountFormat } from '../../../../controllers/dataFormat';
// import { renewalApplication } from '../../../../functionalities/DuplicateApplication'; 
import { download } from '../../../../functionalities/downloadFile';

//icons
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AssignmentIcon from '@mui/icons-material/Assignment';
// import EditIcon from '@mui/icons-material/Edit';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// import Criteria from '../../common/Criteria'
// import queryString from 'query-string';

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';
import ClaimModal from './ClaimModal';
// import TravelApplication from '../../../pages/TravelApplication';

const useStyles = makeStyles(dashboardStyles)

// sorting based on relationship
const relationship_sort = [
  { code: 'Primary', sort: 1 },
  { code: 'Spouse', sort: 2 },
  { code: 'Child', sort: 3 },
  { code: 'Parent', sort: 4 },
  { code: 'Siblings', sort: 5 },
  { code: 'Guardian', sort: 6 },
  { code: 'Companion', sort: 7 }
  ]

    // sorting based on relationship
const sortNumber = (relationship) => {
  const order = relationship_sort.filter(f=>f.code ===relationship)
  return order.length > 0 ? order[0].sort : 9
}  

// TabPanel 컴포넌트 정의
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid container>
          {children}
        </Grid>
      )}
    </div>
  );
}

export default function ClientTravelInsurance({user, email}) { 
  const classes = useStyles();

  const dispatch = useDispatch();
  const applications = useSelector(state => state.travelApplicationReducer.applications)

  // policy declaration
  const file = useSelector(state => state.s3Reducer.file)
  const loading = useSelector(state => state.s3Reducer.loading)
  // const error = useSelector(state => state.s3Reducer.error)

  // Tabs
  const [selectedTab, setSelectedTab] = useState(0);
  const [uniqueInsuredPersons, setUniqueInsuredPersons] = useState([]);
  // const [uniquePersonClaims, setUniquePersonClaims] = useState([]);
  
  // const getSearchResult = useCallback(() => {
  //   dispatch(getTravelApplicationsByClient(user))
  //   }, [dispatch, user]);
  const isLoading = useSelector(state => state.isLoading);

  const getSearchResult = useCallback(() => {
      if (!isLoading) {
        dispatch(getTravelApplicationsByClient(email));
      }
  }, [dispatch, email, isLoading]);

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const [filePDF, setFilePDF] = useState([])
  const [viewType, setViewType] = useState('')

  // get Policy declaration
  const handleFileDownload = useCallback(() => {
    if (!loading && file && file.Body && file.Body.data) {
      download(new Blob([new Uint8Array(file.Body.data)], {type: 'application/pdf'}), filePDF[1]);
    }
  }, [file, filePDF, loading]);


  useEffect(() => {

    handleFileDownload();
    // 모든 applications의 insuredPersons을 추출하고, 중복 제거
    const allInsuredPersons = applications.flatMap(app => app.insuredpersons);

    const uniquePersons = Array.from(new Set(allInsuredPersons.map(insured => 
      JSON.stringify({ firstName: insured.firstName, lastName: insured.lastName })
    ))).map(uniqueKey => 
      allInsuredPersons.find(insured => 
        JSON.stringify({ firstName: insured.firstName, lastName: insured.lastName }) === uniqueKey
      )
    );
    // setUniqueInsuredPersons(uniquePersons);

    // console.log('uniquePersons', uniquePersons)

    //insured_claim 추출하기
    const uniquePersonClaims = uniquePersons.map(person => {
      // 각 uniquePerson에 대해 모든 applications을 검색하여 일치하는 insured_claim을 찾습니다.
      const claims = applications.flatMap(app => 
        app.insured_claim.filter(claim => claim.insuredPersonId === person.insuredPersonID)
      );
      // 일치하는 모든 claims을 포함하는 객체를 반환합니다.
      return {
        ...person,
        claims: claims
      };
    });

    setUniqueInsuredPersons(uniquePersonClaims);

    if (applications.length === 0 && !isLoading) {
      getSearchResult();
    }

    }, [applications, getSearchResult, isLoading, file, handleFileDownload]);

 
    const handleChange = (event, newValue) => {
      setSelectedTab(newValue);
    };
  // criteria
  // const [criteriaData, setCriteriaData] = useState({
  //   fromDate: '2022-01-01',
  //   toDate: new Date().toISOString().replace('T', ' ').substr(0, 10),
  // })

  // Mobile Design
  const { width } = WindowDimension();
  let isMobile = (width < 768);



  // User Language
  let currentLanguage = useContext(LanguageContext).userLanguage


  // pdf
  const handleOpenPDFViewer = (kind, selectedPerson) => {
    let url = ''

    if (kind === 'plan') {
      const brochure = selectedPerson.documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()));
      if (brochure.length > 0) {
          url = process.env.REACT_APP_S3_URL + brochure[0].document_url;
      } else {
          const enBrochure = selectedPerson.documents.filter(f => (f.document_type === 'Brochure' && f.language === 'EN'));
          if (enBrochure.length > 0) {
              url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url;
          }
      }
    } else if (kind === 'policy') {
        const enPolicy = selectedPerson.documents.filter(f => (f.document_type === 'Policy' && f.language === 'EN'));
        if (enPolicy.length > 0) {
            url = process.env.REACT_APP_S3_URL + enPolicy[0].document_url;
        }
    } else {
        // set url
        url = '';
    }

    setPdfOption({
            brochures_url : url,
            // title : kind === 'plan'? `${selectedPerson.compnayName}` : 'Carewell Services'
            title : kind === 'plan'? `Brochure` : 'Policy Wording'
        })
    setOpenPDFViewer(true)
  }

 

  function getDocumentFromS3(viewType, file_name) {
    setFilePDF(file_name.split('/'));
    setViewType(viewType);
    dispatch(getFileFromS3({type:'Policy', fileName:file_name.split('/')[1]})); 
    dispatch({ type: 'DOWNLOAD_FILE_REQUESTED' });
  }
  

  // Repurchase application modal
  const [data, setData] = useState([]);
  const [openRepurchaseApplication, setOpenRepurchaseApplication] = useState(false);
  
  // Renew (Repurchase) application modal 
  // const handleOpenRepurchaseApplication = (application) => {
  //   setData(renewalApplication(application, user, true))
  //   setOpenRepurchaseApplication(true)
  // }
  // Get Repurchase URL
  
  const getURL = (application, selectedPerson) => {
    const baseURL = `https://www.stonewellfinancial.com/travel-insurance/${application.access_code}/application`;
    console.log(application, selectedPerson)
    // get tripstartdate
    const getTripStartDate = (tripEndDate) => {
      const date = new Date(tripEndDate); // tripEndDate Date 객체로 변환
      date.setDate(date.getDate() + 1); // 현재 날짜에 하루 추가
  
      // YYYY-MM-DD 형식으로 날짜를 포매팅
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더함
      const day = ('0' + date.getDate()).slice(-2);
  
      return `${year}-${month}-${day}`;
    };
    
    const tripStartDate = getTripStartDate(selectedPerson.tripEndDate);
    
    const paramsInsured = JSON.stringify(application.insuredpersons.sort((a, b) => (
        application.source_from === 'Z' ? (new Date(a.birthdate) - new Date(b.birthdate)) : (sortNumber(a.relationship) - sortNumber(b.relationship))
    )).map(p => ({
        firstName: p.firstName,
        lastName: p.lastName,
        birthDate: p.birthdate,
        gender: p.gender,
        tripStartDate: tripStartDate
    })));

    const paramsContact = JSON.stringify({
        street: application.address[0].street ? application.address[0].street.replace('#', ' ') : '',
        suiteNo: application.address[0].suiteNo, 
        city: application.address[0].city,  
        province: application.address[0].province, 
        postalcode: application.address[0].postalcode, 
        country: application.address[0].country,
        email: application.email,
        phone: application.phone ? application.phone : ''
    });

    const URL = `${baseURL}/${application.insured_type.toLowerCase()}/${selectedPerson.compnayName.toLowerCase()}/${application.insured_group_type}?renewal=true&insured=${paramsInsured}&contact=${paramsContact}`;
    return encodeURI(URL);
}
  
  // URL을 저장할 상태 변수
  const [repurchaseUrl, setRepurchaseUrl] = useState('');

  // 버튼 클릭 시 getURL 함수를 호출하고 결과를 상태 변수에 저장
  const handleRepurchaseButtonClick = (application, selectedPerson) => {
      const generatedURL = getURL(application,selectedPerson);
      setRepurchaseUrl(generatedURL); // 상태 변수 업데이트
  };

  // Refund application modal
  const [openRefundApplication, setOpenRefundApplication] = useState(false);

  // Refund
  const handleOpenRefundApplication = (application) => {
    if (application){
        // build requested refund info data
        const refundInfo = {
          email: application.email,
          insuranceType: application.insured_type,
          reason: '',
          refundFormFiles: [],
          proofFiles: [],
          insuredNumber: application.insuredpersons.length,
          insuredPersons: application.insuredpersons.filter(f=>f.refundRequestDate === null).map(p=> { 
            return{
              firstName : p.firstName,
              lastName : p.lastName,
              gender: p.gender,
              birthDate: p.birthdate,
              insuranceType: p.travelType,
              insuranceCompany: p.compnayName,
              planName: p.planName,
              policyNum: p.policyNo,
              tripStartDate: p.tripStartDate,
              tripEndDate: p.tripEndDate,
              refundRequested: true,
              reason: '',
              requiredFiles: []
            }
          }),
          sourceFrom: 'V',
          userID: user
          }
        // setData(refundApplication(application, user, true))
        setData(refundInfo)
        // console.log(refundInfo)
        setOpenRefundApplication(true)
    }
  }

  // re get application list after request refund
  function handleConfirm(resultMessage){
    if (resultMessage === 'success'){
      getSearchResult()
    }
  };

  // submit claim email 
  const handleEmail = () => {
    const email = 'claim@tugo.com';
    const bcc = 'info@stonewellfinancial.com';
    const subject = encodeURIComponent('Claim Request');
    const body = encodeURIComponent('Hello');
    window.location.href = `mailto:${email}?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  // Claim modal
  const [insuranceClaim, setInsuranceClaim] = useState([]);
  const [openHowToClaim, setOpenHowToClaim] = useState(false);

  const handleOpenHowToClaim = (application,selectedPerson) => {
    // group by insuranceCompany, plan
    var obj = Object.create(null)
    const groupInsuranceClaim = []
    application.insuredpersons.forEach(function (o) {
        var key = ['compnayName', 'planNam'].map(function (k) { return o[k]; }).join('|');
        if (!obj[key]) {
            obj[key] = { company: o.compnayName, plan: o.planName };
            groupInsuranceClaim.push(obj[key]);
        }
    });

   console.log('selectedPerson', selectedPerson)
    //setInsuranceClaim(groupInsuranceClaim)
    setInsuranceClaim(groupInsuranceClaim,application,selectedPerson)
    setOpenHowToClaim (true)
  }

  // sort based on relationship
  applications && applications.map(row=>
    row.insuredpersons.length>0 && row.insuredpersons.sort((a,b)=> sortNumber(a.relationship) - sortNumber(b.relationship))
  );
  
console.log('applications', applications)
  return (

    <Grid container>
       {/* { applications.applicationType && */}
  
        <Grid item container style={{ margin:'5vh 5vh 2vh' }}>
          <Typography className={classes.dashboardPageTitle}>
            {/* <Text tid={'Vendor.StartApplication'} /> */}
            My Travel Insurance
          </Typography>
        </Grid>
        {/* <Grid item container style={{ margin:'0 5vh 2vh' }}>
          <Typography className={classes.dashboardPageSubTitle}>
            Active
          </Typography>
        </Grid> */}
        

      {/* Repurchase Modal */}
      {openRepurchaseApplication === true &&
          // <RenewApplicationModal
          //   renewData={data}
          //   insuraceCompany={data.applicationCompany}
          //   insuraceType={data.insuredPersons[0].eligilbeIns}
          //   applyType={data.application.applicationType}
          //   open={openRepurchaseApplication}
          //   handleClose={setOpenRepurchaseApplication}
          // />
          // <RepurchaseApplication
          //   renewData={data}
          //   insuraceCompany={data.applicationCompany}
          //   insuraceType={data.insuredPersons[0].eligilbeIns}
          //   applyType={data.application.applicationType}
          //   width={width}
          //   isMobile={isMobile}
          //   open={openRepurchaseApplication}
          //   handleClose={setOpenRepurchaseApplication}
          // />
          <RepurchaseModal
            renewData={data}
            open={openRepurchaseApplication}
            handleClose={setOpenRepurchaseApplication}
          />
      }

      {/* Refund Modal */}
      {openRefundApplication === true &&
          <RefundApplicationModal
            refundData={data}
            open={openRefundApplication}
            handleClose={setOpenRefundApplication}
            onConfirm={handleConfirm}
          />
      }

      <Tabs value={selectedTab} onChange={handleChange} style={{ margin:'5vh 5vh 4vh' }}>
        {uniqueInsuredPersons.map((selectedPerson, index) => (
          <Tab key={index} label={`${selectedPerson.firstName} ${selectedPerson.lastName}`} />
        ))}
      </Tabs>

      {uniqueInsuredPersons.map((selectedPerson, index) => (
        <TabPanel value={selectedTab} index={index} key={index}>
          {applications.filter(app => 
            app.insuredpersons.some(insured => 
              insured.firstName === selectedPerson.firstName && insured.lastName === selectedPerson.lastName
            )
          ).map((application, index) => (
            // 이곳에 application과 관련된 컴포넌트와 로직을 배치합니다.
            <Grid item container key={index}>
              {/* 여기에 application 및 selectedPerson 정보에 따른 컴포넌트와 로직을 추가 */}
              <Grid item container key={index} className={classes.productBox}>

                {/* Insurance summary row */}
                <Grid item container style={{ paddingBottom: '1vh' }}>
                  <Grid item xs={12} lg={3}>
                    <label className={classes.productLable} style={{ marginBottom:'-2px'}}>{application.app_status} </label>
                    <Typography className={classes.productTitle}>
                      {selectedPerson.compnayName} {selectedPerson.planName}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} lg={2} style={{ padding: isMobile ? '1vh' : '0' }}>
                    <label className={classes.productLable}>Insured Name</label>
                    <span className={classes.inputValue}>{selectedPerson.firstName} {selectedPerson.lastName}</span>
                  </Grid>

                <Grid item container xs={12} lg={5}>
                
                  <Grid item>
                    <IconButton aria-label="view" color="primary"
                        style={{ borderRadius:'0'}} 
                        onClick={() => {
                          getDocumentFromS3('download','Policy/'+selectedPerson.policyNo+'.pdf')
                        }}
                    >
                      <DescriptionIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                         Download Confirmation
                      </Typography>
                    </IconButton>
                  </Grid>

                  
                  {/* Benefit PDF open */}
                  <Grid item>
                    <IconButton aria-label="view" color="primary"
                        style={{ borderRadius:'0'}} 
                        onClick={() => {
                          handleOpenPDFViewer('plan', selectedPerson)
                        }}
                    >
                      <DescriptionIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SeeMoreBenefit'}/>
                      </Typography>
                    </IconButton>
                  </Grid>
                  {/* Policy Wording PDF open */}
                  <Grid item>
                    <IconButton aria-label="view" color="primary" 
                        style={{ borderRadius:'0'}}
                        onClick={() => {
                          // console.log(selectedPerson)
                          handleOpenPDFViewer('policy',selectedPerson)
                         
                        }
                        }
                    >
                      <DescriptionIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SeePolicyWording'}/>
                      </Typography>
                    </IconButton>
                  </Grid>
                </Grid>


               
              
                      <Grid item xs={12} lg={1} style={{ textAlign: isMobile ? 'left': 'right', padding: isMobile ? '2vh 0 0 0' : '0'}}>
                      {/* <Link to={`/travel-insurance/application/${type}/${company}/${applyType}`} target='_blank'>Repurchase</Link> */}
                          <Grid item style={{textAlign: isMobile ? 'left': 'right' }}>
                            {/* <Button
                                color={'primary'}
                                style={{ width: isMobile ? '100%': 'auto'}}
                                onClick={() => {
                                  handleOpenRepurchaseApplication(application)
                                }}
                            >
                                Repurchase
                            </Button> */}
                            {/* <a title="Click here to re-purchase" href="${getURL(plan, data.email)}"></a> */}
                            <Button
                                color={'primary'}
                                style={{ width: isMobile ? '100%': 'auto'}}
                                onClick={() => handleRepurchaseButtonClick(application, selectedPerson)}
                            >
                                {/* {repurchaseUrl && ( */}
                                    <a href={repurchaseUrl} target="_blank" rel="noopener noreferrer">Repurchase</a>
                                {/* )} */}
                            </Button>
                          </Grid>

                          {/* Refund Modal open */}
                          {application.app_status==='Approved' &&
                            <Grid item style={{ textAlign: isMobile ? 'left' : 'right' }}>
                              <IconButton aria-label="view" color="primary" 
                                  style={{ borderRadius:'0'}}
                                  onClick={() => {
                                    handleOpenRefundApplication(application)
                                  }}
                              >
                                <CreditScoreIcon />
                                <Typography variant="body2" className={classes.iconButtonText}>
                                  <Text tid={'Quote.SubmitRefund'}/>
                                </Typography>
                              </IconButton>
                            </Grid>
                          }

                      </Grid>

               

                </Grid>

                {/* Insurance Detail info row */}
                  <Grid item container className={classes.productDetailBox}>
                    <Grid item xs={6} lg={2} style={{ padding: isMobile ? '1vh' : '0' }}>
                      <label className={classes.productLable}>Policy Number</label>
                      <span className={classes.inputValue}>{selectedPerson.policyNo}</span>
                    </Grid>
                    <Grid item xs={6} lg={2} style={{ padding: isMobile ? '1vh' : '0' }}>
                      <label className={classes.productLable}>Application Date</label>
                      <span className={classes.inputValue}>{application.app_date}</span>
                    </Grid>
                    <Grid item xs={6} lg={2} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Max Benefit Amount</label>
                      <span className={classes.inputValue}>{amountFormat(selectedPerson.coverage, 0)} (Deductible:{amountFormat(selectedPerson.deductible, 0)})</span>
                    </Grid>
         
                    <Grid item xs={6} lg={3} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Coverage Period</label>
                      <span className={classes.inputValue}>{selectedPerson.tripStartDate}~{selectedPerson.tripEndDate} ({selectedPerson.tripPeriod} days)</span>
                    </Grid> 
                    <Grid item xs={6} lg={1} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Premium</label>
                      <span className={classes.inputValue}>{amountFormat(selectedPerson.plan_price, 2)}</span>
                    </Grid>     

                   
                    
                    {/* Submit Claim */}
                    <Grid item lg={2} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                      <Button 
                        color="primary" 
                        onClick={() => {
                          if (selectedPerson.compnayName === 'Allianz') {
                            window.open('https://www.allianzassistanceclaims.ca/login', '_blank');
                          } else if (selectedPerson.compnayName === 'BlueCross') {
                            window.open('https://canassistance.com/en/policyholder/depot', '_blank');
                          } else {
                            handleOpenHowToClaim(application, selectedPerson);
                          }
                        }}
                      >
                          {/* <Text tid={'Quote.SeeHowToClaim'}/> */}
                          Submit New Claim
                      </Button>
                    </Grid>

                </Grid>


                {/* Claim History */}
                {selectedPerson.claims.length > 0 ?
                  <>
                    <Grid item container style={{ margin:'2vh 0' }}>
                      <Grid item lg={2}>
                          <Typography className={classes.dashboardPageSubTitle}>
                            {/* <Text tid={'Vendor.StartApplication'} /> */}
                            <AssignmentIcon/> Claim
                          </Typography>
                      </Grid>
                    </Grid>

                    {/* Each Claim Info */}
                    {selectedPerson.claims.map((claim, index) => (

                      <Grid item container key={index} className={classes.productDetailBox}>
                          <Grid item xs={6} lg={2} style={{ padding: isMobile ? '1vh' : '0' }}>
                            <label className={classes.productLable}>Claim Number</label>
                            <span className={classes.inputValue}>{claim.claimNum}</span>
                          </Grid>
                          <Grid item xs={6} lg={2} style={{ padding: isMobile ? '1vh' : '0' }}>
                            <label className={classes.productLable}>Claim Submission Date</label>
                            <span className={classes.inputValue}>{claim.submitDate}</span>
                          </Grid>
                          <Grid item xs={6} lg={2} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Review Completion Date</label>
                            <span className={classes.inputValue}>{claim.resultDate?claim.resultDate:'Not'}</span>
                          </Grid>
                          <Grid item xs={6} lg={3} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Ducuments</label>
                            <span className={classes.inputValue}>{claim.document_url?claim.document_url:'Not'}</span>
                          </Grid>
                          <Grid item xs={6} lg={1} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Claim Status</label>
                            <span className={classes.inputValue}>{claim.claimStatus}</span>
                          </Grid> 
                        

                          <Grid item lg={2} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                              <Button
                                  color={'primary'}
                                  style={{ width: isMobile ? '100%': 'auto' }}
                                  onClick={handleEmail}
                              >
                                  Contact Us
                              </Button>
                          </Grid>
                          
                      </Grid>
                    ))}
                  </>
                :null}

                {openHowToClaim === true &&
                  <ClaimModal
                    application = {application}
                    insuranceClaim = {insuranceClaim}
                    selectedPerson = {selectedPerson}
                    open={openHowToClaim}
                    handleClose={setOpenHowToClaim}
                  />
                }


                {/* PDF Viewer Modal  */}
                {
                  openPDFViewer === true && viewType !=='download'?
                  <PDFViewer
                    title={pdfOption.title}
                    pdf={pdfOption.brochures_url} 
                    openPDFViewer={openPDFViewer}
                    setOpenPDFViewer={setOpenPDFViewer}
                  />
                  :
                  null
                }

                

              </Grid>
            </Grid>
          ))}
        </TabPanel>
      ))}


      
    
    </Grid>


  )
}
