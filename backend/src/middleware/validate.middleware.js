const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const errorDetails = err.errors ? err.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message
    })) : [{ message: err.message }];

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errorDetails
    });
  }
};

module.exports = validate;
