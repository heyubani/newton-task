const Joi = require('joi').extend(require('@joi/date'));

const userSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required()
});


export default {
  userSchema
};
