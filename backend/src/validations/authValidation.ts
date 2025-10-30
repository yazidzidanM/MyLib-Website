import * as yup from 'yup'

export const registerSchema = yup.object({
  username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
})