import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  section: {
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(../../../imgs/banner/usa/travel-insurance/usaFlag.png)",
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    marginBottom:'5vh'
  },
  description: {
    color: theme.palette.background.secondary,
    fontSize:'18px'
  },
}));

export default function CTA(props) {
  const { link } = props
  const classes = useStyles();

  const content = {
    'header-p1': 'Did you Know?',
    'header-p2': 'Prices are regulated by law.',
    'description': 'You cannot find a lower price anywhere for the same product.',
    'primary-action': 'Get a Quote',
    'secondary-action': 'Get a Quote',
    ...props.content
  };

  return (
    <section className={classes.section}>
      <Container>
        <Box py={5} style={{ marginTop:'-100px' }} textAlign="center" color="common.white">
          <Typography variant="h3" component="h3" gutterBottom={true}>
            <Typography color="secondary" variant="h3" component="span" style={{ fontSize:'35px', fontWeight:'300', color:'#fff', fontStyle:'italic'}}>{content['header-p1']} </Typography>
            <Typography variant="subtitle1" component="span" style={{ fontSize:'22px', color:'#fff', fontWeight:'300', marginTop:'2vh', fontStyle:'italic', display:'block' }}>{content['header-p2']}</Typography>
          </Typography>
          <Container>
            <Typography variant="subtitle2" paragraph={true} className={classes.description}>{content['description']}</Typography>
          </Container>
          <Box mt={3}>
            <a href={link}>
                <Button variant="outlined" color="primary">{content['primary-action']}</Button>
            </a>
          </Box>
        </Box>
      </Container>
    </section>
  );
}