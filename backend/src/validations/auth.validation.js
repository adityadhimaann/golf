const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    full_name: z.string().min(2, 'Full name must be at least 2 characters long'),
    charity_id: z.string().optional(),
    charity_percentage: z.number().min(10).max(100).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters long')
  })
});

module.exports = { signupSchema, loginSchema, resetPasswordSchema };
