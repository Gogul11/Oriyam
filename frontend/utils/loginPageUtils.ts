import * as Yup from 'yup'

export const loginFormInitialValues = {
  mobile: '',
  password: '',
};

export const loginFormValidation = Yup.object().shape({
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});
