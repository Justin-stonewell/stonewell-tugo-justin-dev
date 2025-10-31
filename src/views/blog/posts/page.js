import React, { useEffect, useState, useContext } from 'react';
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

// import { makeStyles } from '@material-ui/core/styles'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
//components
import { Link, useHistory } from 'react-router-dom'; 
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { Pagination } from '@mui/material';

import Button from '../../../components/common/CustomButtons/Button'
// import MetaTags from '../../../components/common/MetaTags'
// import SectionContent from '../../../components/common/SectionContent'

const useStyles = makeStyles((theme) => ({
    root: {
    //   height: '100%',
    //   margin: '1vh',
      fontFamily: 'SpoqaHanSansNeo-Regular, heebo, Noto Sans KR, sans-serif'
    },
    cardTitle: {
      color: theme.palette.primary.main,
    },
}))

const CategoryBoxEN = [
    {
      title:  <Text tid={'Visitor Insurance'} />,
      link: '91'
    },
    {
      title:  <Text tid={'Student Insurance'} />,
      link: '92'
    },
    {
      title:  <Text tid={'Travelling Canadians'} />,
      link: '93'
    },
    {
        title:  <Text tid={'Visitor Insurance USA'} />,
        link: '94'
    },
    {
        title:  <Text tid={'Student Insurance USA'} />,
        link: '95'
    },
    {
      title:  <Text tid={'Life Insurance'} />,
      link: '106'
    },
    {
      title:  <Text tid={'Group Benefits'} />,
      link: '108'
    }
]

const CategoryBoxKO = [
    {
      title:  <Text tid={'Visitor Insurance'} />,
      link: '5'
    },
    {
      title:  <Text tid={'Student Insurance'} />,
      link: '6'
    },
    {
      title:  <Text tid={'Travelling Canadians'} />,
      link: '73'
    },
    {
        title:  <Text tid={'Visitor Insurance USA'} />,
        link: '72'
    },
    {
        title:  <Text tid={'Student Insurance USA'} />,
        link: '76'
    },
    {
      title:  <Text tid={'Life Insurance'} />,
      link: '68'
    },
    {
      title:  <Text tid={'Group Benefits'} />,
      link: '75'
    }
]



// Blog.stonewellfinancial.com API 
let reqUrl = process.env.REACT_APP_WP_BLOG_POSTS_API_URL
// let reqUrl = "https://blog.stonewellfinancial.com/wp-json/wp/v2/posts"

export default function Blog({match}) {  

    const classes = useStyles()
 
   // 상태를 추가하여 API 응답을 저장합니다.
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        const req = await fetch(`${reqUrl}?categories=${match.params.categories}`);
        const posts = await req.json();
        setPosts(posts); 
        };

        // 정의한 비동기 함수를 호출합니다.
        fetchData();
    }, [match.params.categories]); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행되게 합니다.

    // console.log('posts', match);

  //current language
  const history = useHistory(); // useHistory 훅을 사용하여 history 객체에 접근
  const { userLanguage } = useContext(LanguageContext); // userLanguage를 LanguageContext에서 가져옴

//   let currentLanguage = useContext(LanguageContext).userLanguage

  useEffect(() => {
    // 언어가 한국어('ko')로 바뀌었는지 감지
    if (userLanguage === 'ko') {
      history.push('/blog/category/8'); // '/blog/category/8'로 리다이렉션
    } else {
      history.push('/blog/category/9'); // redirect to en page
    }
  }, [userLanguage, history]); // userLanguage가 변경될 때마다 이 useEffect가 실행되도록 의존성 배열에 추가


  // Post Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
    // 현재 페이지의 포스트만 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);
    // 페이지네이션 컨트롤을 위한 함수
  const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

  // 필터링된 FAQ 포스트를 위한 새 상태
  const [FAQPosts, setFAQPosts] = useState([]);
  const [currentPageFAQ, setCurrentPageFAQ] = useState(1);
//   const [postsPerPageFAQ, setPostsPerPageFAQ] = useState(3);
  const postsPerPageFAQ = 3;

  // posts 상태가 업데이트 될 때마다 실행
  useEffect(() => {
    const FAQCategories = [78, 80, 82, 84, 85, 88, 89, 90, 96, 98, 100, 102, 104, 107, 109];

    const filtered = posts.filter(post =>
        post.categories.some(category => FAQCategories.includes(category))
    );
    setFAQPosts(filtered);
  }, [posts]);

  // 필터링된 FAQ 포스트의 페이지네이션 계산
  const indexOfLastPostFAQ = currentPageFAQ * postsPerPageFAQ;
  const indexOfFirstPostFAQ = indexOfLastPostFAQ - postsPerPageFAQ;
  const currentPostsFAQ = FAQPosts.slice(indexOfFirstPostFAQ, indexOfLastPostFAQ);

    // 필터링된 FAQ 포스트의 페이지네이션을 위한 함수
  const paginateFAQ = (pageNumber) => {
      setCurrentPageFAQ(pageNumber);
  };

    // 필터링된 FAQ 포스트의 총 페이지 수
  const totalPagesFAQ = Math.ceil(FAQPosts.length / postsPerPageFAQ);


  // Claim 
// 필터링된 FAQ 포스트를 위한 새 상태
const [ClaimPosts, setClaimPosts] = useState([]);
const [currentPageClaim, setCurrentPageClaim] = useState(1);
// const [postsPerPageClaim, setPostsPerPageClaim] = useState(3);
const postsPerPageClaim = 3;

  // posts 상태가 업데이트 될 때마다 실행
  useEffect(() => {
    const ClaimCategories = [79, 81, 86, 87, 83, 97, 99, 101, 103, 105];

    const filtered = posts.filter(post =>
        post.categories.some(category => ClaimCategories.includes(category))
    );
    setClaimPosts(filtered);
  }, [posts]);

  // 필터링된 Claim 포스트의 페이지네이션 계산
  const indexOfLastPostClaim = currentPageClaim * postsPerPageClaim;
  const indexOfFirstPostClaim = indexOfLastPostClaim - postsPerPageClaim;
  const currentPostsClaim = ClaimPosts.slice(indexOfFirstPostClaim, indexOfLastPostClaim);

    // 필터링된 Claim 포스트의 페이지네이션을 위한 함수
  const paginateClaim = (pageNumber) => {
      setCurrentPageClaim(pageNumber);
  };

    // 필터링된 Claim 포스트의 총 페이지 수
  const totalPagesClaim = Math.ceil(ClaimPosts.length / postsPerPageClaim);

  //
  const FAQCategories = ['78', '80', '82', '84', '85', '88', '89', '90', '96', '98', '100', '102', '104', '107', '109'];
  const ClaimCategories = ['79', '81', '86', '87', '83', '97', '99', '101', '103', '105'];

  // Mobile Design
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  
  let isMobile = (width <= 768);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);



//   const metaData = {
//     title: 'Blog',
//     description: 'Meta.Blog.Description',
//     // canonical: match.url
//   }
//   console.log(match.params.categories, FAQCategories.includes(match.params.categories),FAQCategories)
  return (
    <>
      {/* <MetaTags data={metaData} /> */}
      <Grid container justifyContent="center" spacing={0} className={classes.root}>

        {/* Page Title */}
        <Grid item container justifyContent='center' style={{ background:'#F2F4F9', marginTop: isMobile ? '0':'38px', padding:'5vh', color:'#2a2f71' }}>
          <h1><Text tid={'Blog'} /></h1>
        </Grid>
   

        {/* Categories box*/}
        <Grid item container sm={12} lg={7} style={{ textAlign:'center',  marginBottom:'5vh' }}>
            { userLanguage === 'ko' ?
                <>
                    {CategoryBoxKO.map((con, index) => (
                        <Grid item key={index} xs={12} sm={12} md={4} lg={4}>
                            
                                <Card style={{ border:'1px solid #ddd', boxShadow:'none', borderRadius:'0' }}>
                                <Link to={`/blog/category/${con.link}`}>
                                    {/* {con.icon} */}
                                    <CardContent style={{ paddingBottom:'16px' }}>
                                        <div style={{ fontSize: '16px', fontWeight:'600', color:'#2a2f71'}}>
                                        {con.title}
                                        </div>
                                    </CardContent>
                                </Link>
                                </Card>
                        
                        </Grid>
                    ))}
                </> 
                : 
                 <>
                    {CategoryBoxEN.map((con, index) => (
                        <Grid item key={index} xs={12} sm={12} md={4} lg={4}>
                            
                                <Card style={{ border:'1px solid #ddd', boxShadow:'none', borderRadius:'0' }}>
                                <Link to={`/blog/category/${con.link}`}>
                                    {/* {con.icon} */}
                                    <CardContent style={{ paddingBottom:'16px' }}>
                                        <div style={{ fontSize: '16px', fontWeight:'600', color:'#2a2f71'}}>
                                        {con.title}
                                        </div>
                                    </CardContent>
                                </Link>
                                </Card>
                        
                        </Grid>
                    ))}
                 </>
            }
        </Grid>
   
        {/* Contents */}
        <Grid item container sm={12} lg={7} style={{ marginBottom:'10vh' }}>

            {/* First Post */}
            {/* {posts.slice(0, 1).map(post => (
                <Grid item container style={{ margin:'5vh 0'}}>
                    <Grid item sm={12} md={6}>
                        <img src={post.yoast_head_json.og_image[0].url} alt={post.slug} style={{ width:'100%', height:'300px' }} ></img>
                    </Grid>
                    <Grid item sm={12} md={6} style={{ padding:'0 3vh' }}>
                        <Typography className={classes.cardTitle} gutterBottom variant="h2">
                            {post.title.rendered}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {post.yoast_head_json.og_description}
                        </Typography>
                    </Grid>
                </Grid>
            ))} */}

            { !FAQCategories.includes(match.params.categories)  && !ClaimCategories.includes(match.params.categories)  ?
                    <>
                        {posts.length > 0  &&
                            <Grid item sm={12}>
                                <Typography className={classes.cardTitle} gutterBottom variant="h4" style={{ fontSize:'1.5rem', margin:'2vh 1vh'}}>
                                    <Text tid={'Recent Posts'} />
                                </Typography>
                            </Grid>
                        }

                        {currentPosts.map(post => (
                            <>
                                <Grid item sm={12} md={4} lg={4}>
                                    <Link className={classes.cardBtn} to={`/blog/post/${post.slug}`}>
                                        <Card key={post.id} className={classes.root} style={{ margin:'1vh' }}>
                                            {/* <CardActionArea> */}
                                            <CardMedia
                                                component="img"
                                                alt={post.slug}
                                                height="150"
                                                image={post.yoast_head_json.og_image[0].url}
                                                title={post.slug}
                                            />
                                            <CardContent>
                                                <Typography className={classes.cardTitle} gutterBottom variant="h4" >
                                                {post.title.rendered}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                {post.yoast_head_json.og_description.slice(0, 70) + (post.yoast_head_json.og_description.length > 100 ? "..." : "")}
                                                </Typography>

                                                <Button color="primary" style={{ marginTop: 10, width:'100%' }}>
                                                    <Text tid={'Learn more'} />
                                                </Button>
                                            </CardContent>
                                        </Card>       
                                    </Link>  
                                </Grid>
                            </>
                        ))}

                        <Grid item xs={12} container justifyContent="center" style={{ marginTop: '5vh' }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(event, value) => paginate(value)}
                                />
                        </Grid>
                    </>
            :null}


            {/* FAQ */}
            {!ClaimCategories.includes(match.params.categories) ?
                <>
                    {currentPostsFAQ.length > 0  &&
                        <Grid item sm={12} style={{ marginTop:'5vh' }}>
                            <Link to={`/blog/category/${match.params.categories === '5' ? '80' 
                                                        : match.params.categories === '6' ? '78'
                                                        : match.params.categories === '73' ? '82'
                                                        : match.params.categories === '72' ? '84'
                                                        : match.params.categories === '76' ? '85'
                                                        : match.params.categories === '68' ? '88'
                                                        : match.params.categories === '75' ? '89' 
                                                        : match.params.categories === '91' ? '98'
                                                        : match.params.categories === '92' ? '96' 
                                                        : match.params.categories === '93' ? '100'
                                                        : match.params.categories === '94' ? '102'
                                                        : match.params.categories === '95' ? '104'
                                                        : match.params.categories === '106' ? '107'
                                                        : match.params.categories === '108' ? '109'
                                                        : match.params.categories}`}>
                                <Typography className={classes.cardTitle} gutterBottom variant="h4" style={{ fontSize:'1.5rem', margin:'2vh 1vh'}}>
                                    <Text tid={'FAQ'} />
                                </Typography>
                            </Link>
                        </Grid>
                    }

                    {currentPostsFAQ.map(post => (
                        <>
                            <Grid item sm={12} md={4} lg={4}>
                                <Link className={classes.cardBtn} to={`/blog/post/${post.slug}`}>
                                    <Card key={post.id} className={classes.root} style={{ margin:'1vh' }}>
                                        {/* <CardActionArea> */}
                                        {/* <CardMedia
                                            component="img"
                                            alt={post.slug}
                                            height="150"
                                            image={post.yoast_head_json.og_image[0].url}
                                            title={post.slug}
                                        /> */}
                                        <CardContent>
                                            <Typography className={classes.cardTitle} gutterBottom variant="h4" >
                                            {post.title.rendered}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                            {post.yoast_head_json.og_description.slice(0, 70) + (post.yoast_head_json.og_description.length > 100 ? "..." : "")}
                                            </Typography>

                                            <Button color="primary" style={{ marginTop: 10, width:'100%' }}>
                                                <Text tid={'Learn more'} />
                                            </Button>
                                        </CardContent>
                                    </Card>       
                                </Link>  
                            </Grid>
                        </>
                    ))}


                    {currentPostsFAQ.length > 0  &&
                        <Grid item xs={12} container justifyContent="center" style={{ marginTop: '5vh' }}>
                            <Pagination
                                count={totalPagesFAQ}
                                page={currentPageFAQ}
                                onChange={(event, value) => paginateFAQ(value)}
                            />
                        </Grid>
                    }
                </>
            :null}

            { !FAQCategories.includes(match.params.categories)  ?
                <>
                {/* Claim */}
                    {currentPostsClaim.length > 0  &&
                        <Grid item sm={12} style={{ marginTop:'5vh' }}>
                            <Link to={`/blog/category/${match.params.categories === '5' ? '81' 
                                                        : match.params.categories === '6' ? '79'
                                                        : match.params.categories === '73' ? '83'
                                                        : match.params.categories === '72' ? '87'
                                                        : match.params.categories === '76' ? '86'
                                                        : match.params.categories === '91' ? '99'
                                                        : match.params.categories === '92' ? '97'
                                                        : match.params.categories === '93' ? '101'
                                                        : match.params.categories === '94' ? '103'
                                                        : match.params.categories === '95' ? '105'
                                                        : match.params.categories}`}>
                                <Typography className={classes.cardTitle} gutterBottom variant="h4" style={{ fontSize:'1.5rem', margin:'2vh 1vh'}}>
                                    <Text tid={'Claim Story'} />
                                </Typography>
                            </Link>
                        </Grid>
                    }

                    {currentPostsClaim.map(post => (
                        <>
                            <Grid item sm={12} md={4} lg={4}>
                                <Link className={classes.cardBtn} to={`/blog/post/${post.slug}`}>
                                    <Card key={post.id} className={classes.root} style={{ margin:'1vh' }}>
                                        {/* <CardActionArea> */}
                                        <CardMedia
                                            component="img"
                                            alt={post.slug}
                                            height="150"
                                            image={post.yoast_head_json.og_image[0].url}
                                            title={post.slug}
                                        />
                                        <CardContent>
                                            <Typography className={classes.cardTitle} gutterBottom variant="h4" >
                                            {post.title.rendered}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                            {post.yoast_head_json.og_description.slice(0, 70) + (post.yoast_head_json.og_description.length > 100 ? "..." : "")}
                                            </Typography>

                                            <Button color="primary" style={{ marginTop: 10, width:'100%' }}>
                                                <Text tid={'Learn more'} />
                                            </Button>
                                        </CardContent>
                                    </Card>       
                                </Link>  
                            </Grid>
                        </>
                    ))}


                    {currentPostsClaim.length > 0  &&
                        <Grid item xs={12} container justifyContent="center" style={{ marginTop: '5vh' }}>
                            <Pagination
                                count={totalPagesClaim}
                                page={currentPageClaim}
                                onChange={(event, value) => paginateClaim(value)}
                            />
                        </Grid>
                    }
                </>
            :null}

            

        </Grid>

       

        

      </Grid>
    </>
  )
}
