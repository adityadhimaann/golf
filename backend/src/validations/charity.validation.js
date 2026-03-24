const { z } = require('zod');

const charitySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is too short'),
    description: z.string().optional(),
    image_url: z.string().optional(),
    category: z.string().optional(),
    is_featured: z.boolean().default(false),
    events: z.array(z.object({
      title: z.string(),
      date: z.string().transform(str => new Date(str)),
      description: z.string().optional()
    })).optional()
  })
});

const userCharitySelectionSchema = z.object({
  body: z.object({
    charity_id: z.string().min(24, 'Invalid ID'),
    charity_percentage: z.number().min(10).max(100)
  })
});

module.exports = { charitySchema, userCharitySelectionSchema };
