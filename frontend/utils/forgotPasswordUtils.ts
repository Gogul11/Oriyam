import * as Yup from "yup";

export const forgotPasswordInitialValues = {
  email: "",
};

export const forgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

export const otpInitialValues = {
  email: "",
  otp: "",
};

export const otpValidation = Yup.object().shape({
  email: Yup.string().email().required(),
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "Enter a valid 6-digit OTP"),
});

export const resetPasswordInitialValues = {
  email: "",
  newPassword: "",
};

export const resetPasswordValidation = Yup.object().shape({
  email: Yup.string().email().required(),
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});
