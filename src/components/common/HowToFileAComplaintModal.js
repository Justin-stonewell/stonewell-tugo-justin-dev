import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { Text } from "./LanguageProvider";
// import {IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from '../common/CustomButtons/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
// import { MdClose } from 'react-icons/md'

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
    paddingLeft: theme.spacing(4)
}
}))

const HowToFileAComplaintModal = (props) => {
  const { title, company, open, setOpen, okButton, goButton } = props;

  const classes = useStyles()

  return (
    <Dialog
      fullWidth maxWidth="sm" 
      open={open}
      onClose={() => setOpen(false)}
      // aria-labelledby="dialog-title"
    >
      <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
        <Typography variant="h2" className={classes.formTitle}>
          {title}
        </Typography>
      </MuiDialogTitle>

      <DialogContent style={{ marginTop:'2vh' }}>
        <DialogContentText>
        Distributor: Stonewell Financial Services INC <Text tid={'Quote.HowToFileAComplaint.Detail1'}/> <br/><br/>
        <span style={{ color:'red', fontWeight:'500'}}>* {company}&nbsp; <Text tid={'Quote.HowToFileAComplaint.Detail2'}/> {company}&nbsp; <Text tid={'Quote.HowToFileAComplaint.Detail3'}/></span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus
         onClick={() => {
          if (company === 'Allianz Global Assistance') {
            window.open('https://www.allianz-assistance.ca/en_CA/file-a-claim/complaint-resolution-process.html', '_blank');
          } else if(company === 'Tugo') {
            window.open('https://www.tugo.com/en/legal/', '_blank');
          } else if(company === 'Bluecross') {
            window.open('https://on.bluecross.ca/client-care##compliments-complaints', '_blank');
          } else if(company === 'Travelance') {
            window.open('https://www.travelance.ca/complaint-resolution-process/', '_blank');
          } else if(company === 'GMS') {
            window.open('https://www.gms.ca/contact-us/customer-complaint-resolution-policy', '_blank');
          } else {
            window.open('https://www.stonewellfinancial.com/contact-us', '_blank');
          }
        }}
          color="dark"
        >
          {goButton}
        </Button>
        <Button autoFocus
          onClick={() => {
            setOpen(false)
            // onClick();
          }}
          color="dark"
        >
          {okButton}
        </Button>
      </DialogActions>
    </Dialog>
    // </div>
  );
};

export default HowToFileAComplaintModal;