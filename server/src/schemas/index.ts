import Joi from 'joi';
import { generateValidationMessage } from '../utils/generateValidationMessage';

export const signupSchema = Joi.object({
  fullName: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z ]*$/))
    .min(3)
    .max(75)
    .required()
    .messages({
      'string.pattern.base':
        'The full name may only contain alphabets and spaces.',
      'string.min': generateValidationMessage('min', 'full name', 3),
      'string.max': generateValidationMessage('max', 'full name', 75),
      'any.required': generateValidationMessage('required', 'full name')
    }),
  username: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9_]*$/))
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base':
        'The username may only contain alphanumeric characters (letters A-Z, numbers 0-9) and underscores (_).',
      'string.min': generateValidationMessage('min', 'username', 3),
      'string.max': generateValidationMessage('max', 'username', 50),
      'any.required': generateValidationMessage('required', 'username')
    }),
  email: Joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'email address', 5),
      'string.max': generateValidationMessage('max', 'email address', 50),
      'string.email': generateValidationMessage('email'),
      'any.required': generateValidationMessage('required', 'email address')
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'password', 8),
      'any.required': generateValidationMessage('required', 'password')
    }),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.required': generateValidationMessage(
        'required',
        'password confirmation'
      ),
      'any.only': generateValidationMessage('passwordConfirmation')
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'email address', 5),
      'string.max': generateValidationMessage('max', 'email address', 50),
      'string.email': generateValidationMessage('email')
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'password', 8)
    })
}).messages({
  'any.required': 'Please provide an email address and password.'
});

const messageText = Joi.string()
  .required()
  .messages({
    'any.required': generateValidationMessage('required', 'text')
  });

const recipientId = Joi.string()
  .length(24)
  .required()
  .messages({
    'string.length': generateValidationMessage('length', 'recipient', 24),
    'any.required': generateValidationMessage('required', 'recipient')
  });

export const textMessageSchema = Joi.object({
  text: messageText,
  unread: Joi.boolean()
});

export const imageMessageSchema = Joi.object({
  unread: Joi.boolean()
});

export const conversationSchema = Joi.object({
  recipient: recipientId,
  text: messageText
});

export const updateMeSchema = Joi.object({
  fullName: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z ]*$/))
    .min(3)
    .max(75)
    .messages({
      'string.pattern.base':
        'The full name may only contain alphabets and spaces.',
      'string.min': generateValidationMessage('min', 'full name', 3),
      'string.max': generateValidationMessage('max', 'full name', 75)
    }),
  email: Joi.string()
    .min(5)
    .max(50)
    .email()
    .messages({
      'string.min': generateValidationMessage('min', 'email address', 5),
      'string.max': generateValidationMessage('max', 'email address', 50),
      'string.email': generateValidationMessage('email')
    }),
  currentPassword: Joi.string()
    // .when('newPassword', {
    //   is: Joi.exist(),
    //   then: Joi.string().required()
    // })
    .messages({
      'any.required': generateValidationMessage('required', 'current password'),
      'string.empty': generateValidationMessage('required', 'current password')
    }),
  newPassword: Joi.string()
    .when('currentPassword', {
      is: Joi.exist(),
      then: Joi.string().required()
    })
    .min(8)
    .messages({
      'string.min': generateValidationMessage('min', 'new password', 8),
      'string.empty': generateValidationMessage('required', 'new password')
    }),

  newPasswordConfirmation: Joi.string()
    .valid(Joi.ref('newPassword'))
    .when('newPassword', {
      is: Joi.exist(),
      then: Joi.string().required(),
      otherwise: Joi.string().forbidden()
    })
    .messages({
      'any.required': generateValidationMessage(
        'required',
        'new password confirmation'
      ),
      'any.only': generateValidationMessage('newPasswordConfirmation')
    })
});
