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

const SummaryOfExclusionsModal = (props) => {
  const { title, company, plan, open, setOpen, okButton } = props;

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
          {company === 'Allianz' && plan === 'STUDENT' &&
            <>
              <Text tid={'TravelApplication.Exclusions.Description.Allianz'}/>
              <span style={{ margin:'1vh 0 0 0', color:'blue', fontWeight:'600', display:'block' }}><Text tid={'TravelApplication.Exclusions.SubTitle.AllianzST'}/></span>
              <Text tid={'TravelApplication.Exclusions.List1.AllianzST'}/>
              <ul>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub1.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub2.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub3.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub4.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub5.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub6.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub7.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub8.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub9.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub10.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub11.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub12.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub13.AllianzST'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub14.AllianzST'}/></li>
              </ul>
            </>
          }

          {company === 'Allianz' && plan === 'VISITOR' &&
            <>
              <Text tid={'TravelApplication.Exclusions.Description.Allianz'}/>
              <span style={{ margin:'1vh 0 0 0', color:'blue', fontWeight:'600', display:'block' }}><Text tid={'TravelApplication.Exclusions.SubTitle.AllianzVI'}/></span>
              <Text tid={'TravelApplication.Exclusions.List1.AllianzVI'}/>
              <ul>
                  <li>
                    <Text tid={'TravelApplication.Exclusions.List1.Sub1.AllianzVI'}/>
                    <ul>
                      <li><Text tid={'TravelApplication.Exclusions.List1.Sub1.Sub1.AllianzVI'}/></li>
                      <li><Text tid={'TravelApplication.Exclusions.List1.Sub1.Sub2.AllianzVI'}/></li>
                    </ul>
                  </li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub2.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub3.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub4.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub5.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub6.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub7.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub8.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub9.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub10.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub11.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub12.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub13.AllianzVI'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub14.AllianzVI'}/></li>
              </ul>
            </>
          }

          {company === 'Allianz' && plan === 'CANADIAN' &&
            <>
              <Text tid={'TravelApplication.Exclusions.Description.Allianz'}/>
              <span style={{ margin:'1vh 0 0 0', color:'blue', fontWeight:'600', display:'block' }}><Text tid={'TravelApplication.Exclusions.SubTitle.AllianzCAN'}/></span>
              <Text tid={'TravelApplication.Exclusions.List1.AllianzCAN'}/>
              <ul>
                  <li>
                    <Text tid={'TravelApplication.Exclusions.List1.Sub1.AllianzCAN'}/>
                    <ul>
                      <li><Text tid={'TravelApplication.Exclusions.List1.Sub1.Sub1.AllianzCAN'}/></li>
                      <li><Text tid={'TravelApplication.Exclusions.List1.Sub1.Sub2.AllianzCAN'}/></li>
                    </ul>
                  </li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub2.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub3.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub4.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub5.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub6.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub7.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub8.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub9.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub10.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub11.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub12.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub13.AllianzCAN'}/></li>
                  <li><Text tid={'TravelApplication.Exclusions.List1.Sub14.AllianzCAN'}/></li>
              </ul>
            </>
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
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

export default SummaryOfExclusionsModal;