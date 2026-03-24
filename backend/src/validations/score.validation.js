const { z } = require('zod');

const scoreSchema = z.object({
  body: z.object({
    score: z.number().min(0).max(45, 'Score must be between 0 and 45'),
    date_played: z.string().transform(str => new Date(str))
  })
});

module.exports = { scoreSchema };
