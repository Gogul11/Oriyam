import * as Yup from 'yup'

const today = new Date();
export const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
);

export const registerFormInitialValues = {
    userName : '',
    email : '',
    mobile : '',
    mobileCountryCode : '',
    password : '',
    confirmPassword : '',
    dob : eighteenYearsAgo,
    aadharCardNumber : '',
    panCardNumber : '',
    voterId : ''
}

export const registerFormValidation = Yup.object().shape({
    userName : Yup.string()
                .min(5, "Username should contain atleast 5 Characters")
                .required("Username must be Required"),

    email : Yup.string()
                .email('Invalid Email'),

    mobile : Yup.string()
                .matches(/^[0-9]{7,15}$/, 'Invalid mobile number')
                .required("Mobile Number is required"),

    mobileCountryCode : Yup.string()
                            .required("Contry code is missing"),

    password : Yup.string()
                    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters and include a number")
                    .required("Password is required"),

    confirmPassword: Yup.string()
                        .oneOf([Yup.ref("password")], "Passwords must match")
                        .required("Confirm password is required"),

    dob: Yup.date()
            .max(
                new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                "You must be at least 18 years old"
            )
            .required("Date of birth is required"),

    aadharCardNumber: Yup.string()
                            .required("Aadhar card number is required"),

    panCardNumber: Yup.string(),

    voterId: Yup.string()
                .required("Voter ID is required"),

        
})