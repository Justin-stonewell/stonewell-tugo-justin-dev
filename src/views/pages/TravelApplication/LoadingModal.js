import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, 
  Dialog, DialogContent,
  Typography, 
} from '@material-ui/core';
// import MuiDialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  formTitle: { 
    fontSize: '1.4rem',
    marginTop:'3vh'
 },
 dialogPaper: {
  height: '80vh', // 높이를 80% 뷰포트 높이로 설정
},
}));



export default function LoadingModal({ closeModal }) {
  
  const classes = useStyles();
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <Dialog fullWidth={true} maxWidth="xl" classes={{ paper: classes.dialogPaper }} open={true}>
      <DialogContent>
        <Grid 
          container 
          style={{ height: '100%' }} // Set the height of the container to 100%
          alignItems='center' // Vertically center the content
          justifyContent='center' // Horizontally center the content
        >
          <Grid item xs={12} sm={12} md={10} lg={8}>
            <CircularProgress style={{ display: 'block', margin: '0 auto' }} /> {/* Center the CircularProgress */}
            <Typography variant="h2" align="center" className={classes.formTitle}>
              Calculating Premium...
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>

  );
}