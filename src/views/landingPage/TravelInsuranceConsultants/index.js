import React from 'react'
import { useState, useEffect } from 'react';
//3rd library
// import { Grid, Typography, IconButton } from '@material-ui/core'
import { Grid, Hidden } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
import Button from '../../../components/common/CustomButtons/Button'
import { Text } from '../../../components/common/LanguageProvider';
//components
import MetaTags from '../../../components/common/MetaTags';
import SideMenu from '../../../components/common/SideMenu';

//style
// import bannerLandingStyles from '../../../assets/jss/styles/bannerLandingStyle';

// icon
// import CallIcon from '@mui/icons-material/Call';

// image
import consultantsImg from '../../../assets/imgs/landingPage/travel insurance consultants canada.jpg'

// const useStyles = makeStyles(bannerLandingStyles)

const sideMenuContents = [
  {
    href: '#The Impact of Global Events on Travel Insurance',
    title: 'The Impact of Global Events on Travel Insurance',
  },
  {
    href: '#What is Travel Insurance',
    title: 'What is Travel Insurance',
  },
  {
    href: '#Navigating Complex Travel Scenarios',
    title: 'Navigating Complex Travel Scenarios',
  },
  {
    href: '#The Role of Travel Insurance Consultants',
    title: 'The Role of Travel Insurance Consultants',
  },
  {
    href: '#Why Consult a Travel Insurance Expert',
    title: 'Why Consult a Travel Insurance Expert',
  },
  {
    href: '#Tailored Advice for Your Travel Plans',
    title: 'Tailored Advice for Your Travel Plans',
  },
  {
    href: '#The Benefits of Expert Guidance',
    title: 'The Benefits of Expert Guidance',
  },
  {
    href: '#Staying Informed About Changing Policies',
    title: 'Staying Informed About Changing Policies',
  },
  {
    href: '#Solving Issues and Managing Claims',
    title: 'Solving Issues and Managing Claims',
  },
  {
    href: '#Building Long-term Relationships',
    title: 'Building Long-term Relationships',
  },
  {
    href: '#Choosing the Right Travel Insurance Consultant',
    title: 'Choosing the Right Travel Insurance Consultant',
  },
  {
    href: '#Frequently Asked Questions',
    title: 'Frequently Asked Questions',
  },
  {
    href: '#A Partner in Your Travel Journey',
    title: 'A Partner in Your Travel Journey',
  },
  {
    href: '#Contact a Travel Insurance Consultant Today',
    title: 'Contact a Travel Insurance Consultant Today',
  },
]

export default function TravelInsuranceConsultants ({match}) {

  const metaData = {
    title: 'Expert Travel Insurance Consultants for Comprehensive Coverage',
    description: 'Discover top travel insurance consulting services. Get expert advice on choosing the right travel insurance plans for your needs.',
    canonical: match.url,
    keywords: 'travel insurance consultants, travel insurance advice, personalized travel insurance, travel insurance planning, expert travel insurance guidance'
}


  // const classes = useStyles()

   //Responsive Design
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
 
   let isMobile = (width <= 768);

  
  return (
    <>
    <MetaTags data={metaData} />
      <Grid container justifyContent="center" style={{ marginTop:isMobile? '0':'4vh'}}>

          <Grid item container
              // className={classes.bannerWrapper}
              style={{
                // background: `url(/imgs/banner${window.location.pathname}.png)`,
                // background: `url(${snowbirdImg}) center / cover no-repeat`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                background:'#2a2f71',
                padding:isMobile?'5vh':'5vh 20vh'
              }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {/* Title */}
              <Grid item container justifyContent='center' style={{ color:"#fff" }}>
                  <h1 style={{ fontWeight:'800', fontSize:isMobile?'35px':'45px' }}>
                    <strong>Why you need travel insurance consultants?</strong>
                  </h1>
              </Grid>

              {/* Sub Title */}
              <Grid item container justifyContent='center' style={{ color:"#fff" }}>
                  <h2 style={{ fontSize:isMobile?'18px':'25px'}}>
                    Stress-Free Claims Assistance
                  </h2>
              </Grid>

              
          </Grid>


          <Hidden mdDown>
            <Grid item sm={12} lg={4} xl={2}>
              <SideMenu
                pageName={'Navigating Your Insurance Needs with the best travel insurance consultants'}
                lists={sideMenuContents}
              />
             
            </Grid>
          </Hidden>

          <Grid item sm={12} lg={8} xl={5} style={{ margin:'2vh' }}>

          <section id="The Impact of Global Events on Travel Insurance">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71'}}>The Impact of Global Events on Travel Insurance</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                Recent global events, such as the COVID-19 pandemic, have significantly impacted travel insurance. 
                <span style={{ color:'#F2736C'}}>
                  <strong>Consultants stay abreast of these changes, offering updated advice on new policies and coverage options in response to global health and safety concerns.</strong>
                </span> 
              </p>
          </section>

          <section id="The Importance of Travel Insurance">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>The Importance of Travel Insurance</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                Travel insurance is an indispensable part of any journey, providing security against unexpected events. 
                However, understanding the intricacies of various policies can be daunting. 
                <span style={{ color:'#F2736C'}}>
                  <strong>This is where travel insurance consultants come in, offering their expertise to help you navigate through the maze of options.</strong>
                </span> 
              </p>
              
                <img alt={'travel insurance consultants'} src={consultantsImg} width="100%" /> 
          </section>

          <section id="What is Travel Insurance">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>What is Travel Insurance?</h2>  

              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <span style={{ color:'#F2736C'}}>
                  <strong>Travel insurance is a type of insurance that covers unforeseen incidents during travel. </strong>
                </span> 
                Types of Travel Insurance :
              </p>
            
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <ul>
                  <li><strong>Single Trip Insurance:</strong> Ideal for occasional travelers covering one trip.</li>
                  <li><strong>Annual Multi-Trip Insurance:</strong> Best for frequent travelers, covering multiple trips in a year.</li>
                  <li><strong>Specialized Policies:</strong> Tailored for specific needs like adventure sports, cruises, or student travel.</li>
                </ul>
              </p>
          </section>

          <section id="Navigating Complex Travel Scenarios">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Navigating Complex Travel Scenarios</h2>  

              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                Travel insurance consultants are particularly helpful in complex travel scenarios, such as:
              </p>
            
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <ul>
                  <li><strong>Pre-existing Medical Conditions:</strong> They can advise on policies that offer coverage for pre-existing conditions.</li>
                  <li><strong>Adventure Travel:</strong> Consultants can recommend policies that cover high-risk activities.</li>
                  <li><strong>Business Travel:</strong> Tailoring policies for the unique needs of business travelers.</li>
                </ul>
              </p>
          </section>

          <section id="The Role of Travel Insurance Consultants">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>The Role of Travel Insurance Consultants</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                Travel insurance consultants are professionals who specialize in advising travelers on the best insurance policies for their needs. 
                <span style={{ color:'#F2736C'}}>
                  <strong> They help demystify the jargon, compare different plans, and guide you in selecting the right coverage based on your travel itinerary, budget, and specific requirements.</strong>
                </span> 
              </p>

          </section>

          <section id="Why Consult a Travel Insurance Expert">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Why Consult a Travel Insurance Expert?</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <span style={{ color:'#F2736C'}}>
                    <strong>Consulting with a travel insurance expert can save you time and money. </strong>
                </span>   
                They have in-depth knowledge of the insurance market and can quickly identify policies that offer the best value and coverage. 
                Their expertise is especially valuable for understanding complex situations, like coverage for high-risk activities or pre-existing medical conditions.
              </p>

          </section>



            <section id="Tailored Advice for Your Travel Plans">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Tailored Advice for Your Travel Plans</h2>  
            
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                Every journey is unique, and so are the insurance needs that come with it. 
                <span style={{ color:'#F2736C'}}>
                  <strong>Whether you're backpacking across Europe, going on a business trip, or planning a family vacation, a travel insurance consultant can provide tailored advice. </strong>
                </span>
                They consider factors like trip duration, destinations, and activities to ensure you're adequately covered. 
              </p>
            </section>

            <section id="The Benefits of Expert Guidance">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>The Benefits of Expert Guidance</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                <ul>
                  <li><strong>Personalized Coverage:</strong> Consultants assess your individual travel needs to recommend the most suitable policy.</li>
                  <li><strong>Cost-Effective Solutions:</strong> They help find the best coverage at competitive prices.</li>
                  <li><strong>Understanding the Fine Print:</strong> Consultants clarify terms and conditions, helping you understand what is and isn’t covered.</li>
                  <li><strong>Saving Time and Effort:</strong> They do the research and comparisons, saving you significant time and effort.</li>
                </ul>
              </p>

              <Button 
                  variant="contained" 
                  color="dark" 
                  href="https://www.stonewellfinancial.com/travel-insurance/quote/trip-info"
                >
                <Text tid={`Get a quote`} />
              </Button>

            </section>

            <section id="Staying Informed About Changing Policies">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Staying Informed About Changing Policies</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                The travel insurance landscape is continuously evolving, especially in the wake of global events like the COVID-19 pandemic. 
                <span style={{ color:'#F2736C'}}>
                  <strong>Travel insurance consultants stay updated on the latest policy changes and can advise you on new requirements or benefits that might affect your travel plans. </strong>
                </span>
              </p>
            </section>

            <section id="Solving Issues and Managing Claims">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Solving Issues and Managing Claims</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                In the event of a claim, travel insurance consultants offer invaluable assistance.        
                <span style={{ color:'#F2736C'}}>
                  <strong>They can guide you through the claims process, ensuring that you have all the necessary documentation and understand the procedure, which can be quite intricate and time-sensitive. </strong>
                </span>
              </p>
            </section>

            <section id="Building Long-term Relationships">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Building Long-term Relationships</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                Establishing a relationship with a travel insurance consultant can be beneficial for frequent travelers. 
                <span style={{ color:'#F2736C'}}>
                  <strong>Over time, your consultant understands your travel habits and preferences, enabling them to offer quicker and more personalized service for future trips. </strong>
                </span>
              </p>
            </section>

            <section id="Choosing the Right Travel Insurance Consultant">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Choosing the Right Travel Insurance Consultant</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}> 
                When selecting a consultant, consider their experience, knowledge, and customer reviews. 
                <span style={{ color:'#F2736C'}}>
                  <strong>It’s important to choose someone you feel comfortable with and who understands your specific travel needs. </strong>
                </span>
              </p>
            </section>

            <section id="Frequently Asked Questions">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Frequently Asked Questions</h2>  

              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px' }}>
                  <ul>
                    <li><strong>What Does a Travel Insurance Consultant Do?</strong><br/>
                    Answer: A travel insurance consultant provides expert advice on choosing the best travel insurance policies based on your individual travel needs, including factors like destination, duration, and activities.</li>
                    
                    <li><strong>Why Should I Use a Travel Insurance Consultant?</strong><br/>
                    Answer: Consultants offer personalized service, helping you understand complex policy details and ensuring you get the coverage that best suits your travel plans, often at a more cost-effective price.</li>
                    
                    <li><strong>Can Consultants Help With Pre-Existing Medical Conditions Coverage?</strong><br/>
                    Answer: Yes, consultants are skilled in finding policies that provide coverage for pre-existing medical conditions, navigating the specific terms and exclusions for you.</li>
                    
                    <li><strong>How Do Travel Insurance Consultants Stay Informed About Policy Changes?</strong><br/>
                    Answer: Consultants regularly update their knowledge base with the latest changes in travel insurance policies, including new laws, global events impact, and insurer updates, to provide the most current advice.</li>
                    
                    <li><strong>What Should I Expect During a Consultation?</strong><br/>
                    Answer: During a consultation, the consultant will ask about your travel plans, discuss different insurance options, explain coverage details, and help you understand the policy terms and conditions.</li>
                    
                    <li><strong>Are Travel Insurance Consultants' Services Expensive?</strong><br/>
                    Answer: Fees for consultants vary, but many offer affordable services and can actually save you money in the long run by finding the best deals and avoiding unnecessary coverage.</li>
                    
                    <li><strong>How Can I Prepare for a Meeting with a Travel Insurance Consultant?</strong><br/>
                    Answer: Prepare by having details of your trip ready, such as travel dates, destinations, planned activities, and any specific concerns or needs you have regarding insurance.</li>
                    
                    <li><strong>Can Consultants Assist With the Claims Process?</strong><br/>
                    Answer: Yes, consultants can guide you through the claims process, ensuring you have all the necessary documentation and understand the steps involved to make a successful claim.</li>
                    
                    <li><strong>How Do I Choose the Right Travel Insurance Consultant?</strong><br/>
                    Answer: Look for consultants with strong customer reviews, expertise in the type of travel you're planning, and a transparent approach to fees and services.</li>
                    
                    <li><strong>What Makes Consulting Services Different From Buying Insurance Directly Online?</strong><br/>
                    Answer: Consultants provide a personalized approach, helping you navigate the complexities of travel insurance and offering tailored advice, unlike the one-size-fits-all approach often found with online insurance purchases.</li>
                  </ul>
              </p>

            </section>


            <section id="Conclusion A Partner in Your Travel Journey">
                <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Conclusion : A Partner in Your Travel Journey</h2>  
                
                <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px'}}> 
                  Travel insurance consultants are more than just advisors; they are partners in your travel journey. 
                  They offer peace of mind, ensuring that you are well-prepared for any contingencies, so you can focus on enjoying your trip.
                </p>
            </section>

            <section id="Contact a Travel Insurance Consultant Today">
              <h2 style={{ fontWeight:'800', fontSize:isMobile?'24px':'35px', color:'#2a2f71' }}>Contact a Travel Insurance Consultant Today</h2>  
              
              <p style={{ color:'#444', marginTop:'2vh', fontSize:'18px', marginBottom:'10vh' }}> 
                 Considering a trip soon? Reach out to a travel insurance consultant to discuss your options and ensure your next adventure is secure and worry-free.
              </p>
            </section>


          </Grid>
         
      </Grid>

    </>
  )
}


