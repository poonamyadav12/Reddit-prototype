const Joi = require("joi");
const ObjectId = require("mongoose").Types.ObjectId;

// Construct schema
const schema = Joi.object({
  pageNumber: Joi.number().integer().min(1).required().messages({
    "number.integer": "Select a valid page number",
    "number.min": "Select a valid page number",
    "number.base": "Select a valid page number",
    "any.required": "Select a valid page number",
  }),
  pageSize: Joi.number().integer().min(1).messages({
    "number.integer": "Select a valid page size",
    "number.min": "Select a valid page size",
    "number.base": "Select a valid page size",
  }),
  searchKeyword: Joi.string(),
  user_id: Joi.string()
    .required()
    .custom((_id, helper) => {
      if (!ObjectId.isValid(_id)) {
        return helper.message("Select a valid user");
      } else {
        return true;
      }
    })
    .messages({
      "any.required": "Please select a valid user",
    }),
});

module.exports = schema;
