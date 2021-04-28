const Joi = require("joi");

const schema = Joi.object({
  post_id: Joi.string().required().messages({
    "any.required": "Select a valid post",
  }),
  community_id: Joi.string().required().messages({
    "any.required": "Select a valid community",
  }),
});

module.exports = schema;
