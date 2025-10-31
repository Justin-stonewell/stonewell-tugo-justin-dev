import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { Grid } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
// import { Text } from '../../../components/common/LanguageProvider'
//components

import MetaTags from '../../../../components/common/MetaTags'
// import Banner from '../../../../components/common/Banner'
// import SectionContent from '../../../components/common/SectionContent'

// banner Title
// const bannerTitle = ['Blog']
// const links = [
//   {
//     to: '/',
//     name: 'Home',
//   },
//   {
//     to: '/about-us',
//     name: 'About Us',
//   },
// ]


export default function Post() {  

  const params = useParams(); // useParams 훅을 사용하여 params를 가져옵니다.
  // Blog.stonewellfinancial.com API 
// const reqUrl = `https://blog.stonewellfinancial.com/wp-json/wp/v2/posts?slug=${params.slug}`;
 let reqUrl = process.env.REACT_APP_WP_BLOG_POSTS_API_URL

 console.log('params', params)
   // 상태를 추가하여 API 응답을 저장합니다.
   const [post, setPost] = useState(null);

    useEffect(() => {
        // 비동기 함수를 정의합니다.
        const fetchData = async () => {
        // const req = await fetch(reqUrl);
        const req = await fetch(`${reqUrl}?slug=${params.slug}`);
        const postData = await req.json();
        setPost(postData[0]); // 상태 업데이트
        // console.log('posts', post);
        };

        fetchData();
    }, [params.slug, reqUrl]);

    // console.log('post', post.yoast_head_json[0].description)
  
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


  if (!post) {
    return <div>Loading...</div>; // 게시물을 불러오는 동안 로딩 표시
  }

  
  const metaData = {
    title: post.title.rendered,
    description: post.yoast_head_json.description,
    // canonical: match.url
  }

  return (
    <>
      <MetaTags data={metaData} />
      {/* <Banner title={bannerTitle} links={links}  /> */}
      <Grid container justifyContent="center">

        <Grid item container justifyContent='center' style={{ background:'#F2F4F9', marginTop: isMobile ? '0':'38px', padding:'5vh', color:'#2a2f71' }}>
          <h1>{post.title.rendered}</h1>
        </Grid>
   
        {/* Contents */}
        <Grid item container sm={11} lg={6} xl={5} style={{ padding:'0 2vh'}}>
          <section className="target" id="">
                <div key={post.id}>
                    {/* {post.title.rendered} */}
                    <div dangerouslySetInnerHTML={{__html: post.content.rendered}}>
                    {/* {post.content.rendered} */}
                    </div>
                </div>
          </section>
        </Grid>
      </Grid>
    </>
  )
}
