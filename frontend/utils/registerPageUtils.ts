import * as Yup from 'yup';

const today = new Date();
export const eighteenYearsAgo = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);

export const registerFormInitialValues = {
  userName: '',
  email: '',
  mobile: '',
  mobileCountryCode: '',
  password: '',
  confirmPassword: '',
  dob: eighteenYearsAgo,
  aadharCardNumber: '',
  panCardNumber: '',
  voterId: ''
};

export const getRegisterFormValidation = (selectedIdType: 'aadhar' | 'pan' | 'voter') =>
  Yup.object().shape({
    userName: Yup.string()
      .min(5, "Username should contain at least 5 characters")
      .required("Username is required"),

    email: Yup.string().email('Invalid Email'),

    mobile: Yup.string()
      .matches(/^[0-9]{7,15}$/, 'Invalid mobile number')
      .required("Mobile Number is required"),

    mobileCountryCode: Yup.string()
      .required("Country code is required"),

    password: Yup.string()
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, 
               "Password must be at least 8 characters and include a number")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),

    dob: Yup.date()
      .max(eighteenYearsAgo, "You must be at least 18 years old")
      .required("Date of birth is required"),

    // Conditional validation for ID types
    aadharCardNumber: selectedIdType === 'aadhar'
      ? Yup.string().required("Aadhar card number is required")
      : Yup.string(),

    panCardNumber: selectedIdType === 'pan'
      ? Yup.string().required("PAN card number is required")
      : Yup.string(),

    voterId: selectedIdType === 'voter'
      ? Yup.string().required("Voter ID is required")
      : Yup.string(),
  });
