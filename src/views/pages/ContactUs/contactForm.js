import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
import { Grid } from '@material-ui/core';
import Button from '../../../components/common/CustomButtons/Button';
import { Text } from '../../../components/common/LanguageProvider';
import SubmitResult from './SubmitResult';

const useStyles = makeStyles(() => ({
  root: {
    padding: '2em',
    marginTop: '2vh',
  },
  title: {
    paddingBottom: '2em',
  },
}));

function validMessage(fieldName) {
  return (
    <ErrorMessage
      name={fieldName}
      render={(msg) => (
        <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
          <Text tid={`Validation.${msg}`} />
        </div>
      )}
    />
  );
}

// Formik 초기값
const initialValues = {
  firstName: '',
  lastName: '',
  emailAdd: '',
  phoneNum: '',
  userID: '',
  contact: '',
  reqMessage: '',
  status: 'requested',
  'bot-field': '', // Netlify honeypot
};

// 유효성
const validationSchema = Yup.object({
  firstName: Validation.validRequiredField(),
  lastName: Validation.validRequiredField(),
  emailAdd: Validation.validEmail(),
  reqMessage: Validation.validRequiredField(),
});

// Netlify가 요구하는 x-www-form-urlencoded 인코딩
const encode = (data) =>
  Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key] ?? ''))
    .join('&');

export const ContactForm = () => {
  const classes = useStyles();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState([]);

  // Netlify Forms 제출
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        'form-name': 'contact',
        ...values, // 사용자가 입력한 값 포함
        status: 'requested',
      };

      await fetch('/?no-cache=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      });

      setFormData(values);
      setSubmitted(true);
      resetForm();
    } catch (e) {
      alert('전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!submitted) {
    return (
      <div className={classes.root}>
        <Grid container justifyContent="center">
          <Grid item xs={12} className={classes.title}>
            <h4>
              <Text tid={'ContactForm.Title'} />
            </h4>
            <p>
              <Text tid={'ContactForm.Subtitle'} />
            </p>
          </Grid>

          <Grid item container xs={12}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, isSubmitting }) => (
                <Form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-recaptcha="true"   // ✅ Netlify reCAPTCHA 활성화
                  netlify-honeypot="bot-field"
                >
                  {/* Netlify 인식용 숨은 필드 */}
                  <input type="hidden" name="form-name" value="contact" />

                  {/* Honeypot (숨김) */}
                  <p style={{ display: 'none' }}>
                    <label>
                      Don’t fill this out if you’re human:{' '}
                      <input
                        name="bot-field"
                        onChange={handleChange}
                        value={values['bot-field']}
                      />
                    </label>
                  </p>

                  <Grid item container xs={12} spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Text tid={`Quote.${'FirstName'}`} /> *
                      <Field
                        className="form-control"
                        type="text"
                        value={values.firstName}
                        onChange={handleChange}
                        name="firstName"
                        autoComplete="given-name"
                        required
                      />
                      {validMessage('firstName')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Text tid={`Quote.${'LastName'}`} /> *
                      <Field
                        className="form-control"
                        type="text"
                        value={values.lastName}
                        onChange={handleChange}
                        name="lastName"
                        autoComplete="family-name"
                        required
                      />
                      {validMessage('lastName')}
                    </Grid>

                    <Grid item xs={12}>
                      <Text tid={`Quote.${'Email'}`} /> *
                      <Field
                        className="form-control"
                        type="email"
                        name="emailAdd"
                        value={values.emailAdd}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                      {validMessage('emailAdd')}
                    </Grid>

                    <Grid item xs={12}>
                      <Text tid={`Quote.${'Message'}`} /> *
                      <Field
                        className="form-control"
                        as="textarea"
                        rows="6"
                        value={values.reqMessage}
                        name="reqMessage"
                        autoComplete="off"
                        required
                      />
                      {validMessage('reqMessage')}
                    </Grid>

                    {/* ✅ reCAPTCHA 표시 영역 (버튼 바로 위, Grid 아이템으로 감싸기) */}
                    <Grid item xs={12}>
                      <div data-netlify-recaptcha="true"></div>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                      <Button
                        color="dark"
                        type="submit"
                        className={classes.next_button}
                        disabled={isSubmitting}
                      >
                        <Text tid={`Quote.${'SendMessage'}`} />
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <SubmitResult formData={formData} />;
  }
};
