import * as Enums from '../libs/enum.status';

const validateData = (schema, type) => async(req, res, next) => {
  try {
    const getType = {
      payload: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      file: req.files
    };

    const options = { language: { key: '{{key}} ' } };
    const data = getType[type];

    const isValid = await schema.validate(data, options);
    if (!isValid.error) return next();

    const { message } = isValid.error.details[0];
    return res.status(Enums.UNPROCESSABLE_ENTITY)
    .json({
       status: 'error',
       message: message.replace(/["]/gi, '')
   });
  } catch (error) {
    return next(error);
  }
};

export default validateData;
