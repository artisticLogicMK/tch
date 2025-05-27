import * as yup from 'yup'

const suspiciousEmailDomains = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'throwawaymail.com',
  'maildrop.cc', 'yopmail.com', 'sharklasers.com', 'getnada.com', 'trashmail.com', 'mintemail.com',
  'spambog.com', 'mailcatch.com', 'mytemp.email', 'dispostable.com', 'fakeinbox.com', 'tmail.ws',
  'spamgourmet.com', 'temp-mail.org', 'moakt.com', 'anonbox.net', 'easytrashmail.com', 'instant-email.org',
  'mohmal.com', 'emailondeck.com', 'fakemailgenerator.com', 'luxusmail.org', 'burnermail.io'
]

// Function to check if the email domain is suspicious
const isSuspiciousEmail = (email) => {
  if (!email) return false
  const domain = email.split('@')[1]
  return suspiciousEmailDomains.includes(domain)
}


const signupValidationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .test('not-suspicious', 'Suspicious email addresses are not allowed', (value) => {
      if (!value) return true
      return value && !isSuspiciousEmail(value)
    }),

  password: yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // Added uppercase letter check
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*()_=+,.?":{}|<>]/, 'Password must contain at least one special character (!@#$%^&*()_=+,.?":{}|<>)')
    .required('Password is required'),

  confirmPassword: yup.string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
    
  terms: yup.boolean()
    .required('You must accept the terms')
    .oneOf([true], 'You must accept the terms'),
})


const loginValidationSchema = yup.object({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
})


const setPassValidationSchema = yup.object({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // Added uppercase letter check
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),

  confirmPassword: yup.string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})


const setProfileValidationSchema = yup.object({
  username: yup.string()
    .matches(/^[A-Za-z]{3}/, 'The first 3 characters must be letters')
    .max(15, 'Username must be at most 15 characters')
    .min(3, 'Username must be more than 3 characters')
     .matches(/^[A-Za-z0-9]+$/, 'Username can only contain letters and numbers')
    .test('at-least-3-letters', 'Username must contain at least 3 letters', (value) => {
      return (value.match(/[A-Za-z]/g) || []).length >= 3;
    })
    .test('max-4-numbers', 'Username can have at most 4 numbers', (value) => {
      return (value.match(/\d/g) || []).length <= 4;
    })
    .required('Username is required'),
  country: yup.object().required('Country is required'),
  secret: yup.string().required('Security Question is required'),
  answer: yup.string().required('Secret Answer is required'),
  gender: yup.string().required('Gender is required'),
})


const setProfileUpdValidationSchema = yup.object({
  username: yup.string()
    .matches(/^[A-Za-z]{3}/, 'The first 3 characters must be letters')
    .max(15, 'Username must be at most 15 characters')
    .min(3, 'Username must be more than 3 characters')
     .matches(/^[A-Za-z0-9]+$/, 'Username can only contain letters and numbers')
    .test('at-least-3-letters', 'Username must contain at least 3 letters', (value) => {
      return (value.match(/[A-Za-z]/g) || []).length >= 3;
    })
    .test('max-4-numbers', 'Username can have at most 4 numbers', (value) => {
      return (value.match(/\d/g) || []).length <= 4;
    })
    .required('Username is required'),
  country: yup.object().required('Country is required'),
  gender: yup.string().required('Gender is required'),
  about: yup.string().max(300, 'About must be at most 300 characters').nullable().optional()
})


// thread form validation schema
const threadValidationSchema = yup.object({
  title: yup.string().required('Title is required').max(150, 'Title must be at most 150 characters'),
  content: yup.string()
    .required('Content is required')
    .test('not-empty', 'Content cannot be empty or just a newline', (value) => {
      // Check if content is not just a newline or whitespace
      return value && value.trim() !== '' && value !== '\n'
    })
    .max(60000, 'Content must be at most 60,000 characters')
})

// post validation schema
const postValidationSchema = yup.object({
  content: yup.string()
    .required('Content is required')
    .test('not-empty', 'Content cannot be empty or just a newline', (value) => {
      // Check if content is not just a newline or whitespace
      return value && value.trim() !== '' && value !== '\n'
    })
    .max(60000, 'Content must be at most 60,000 characters')
})


export {
  signupValidationSchema,
  loginValidationSchema,
  setPassValidationSchema,
  setProfileValidationSchema,
  setProfileUpdValidationSchema,
  threadValidationSchema,
  postValidationSchema
}