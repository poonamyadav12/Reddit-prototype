const Joi = require("joi");
const ObjectId = require("mongoose").Types.ObjectId;

// Construct schema
const schema = Joi.object({
  communities: Joi.array().items(
    Joi.string()
      .required()
      .custom((_id, helper) => {
        if (!ObjectId.isValid(_id)) {
          return helper.message("Select a valid user");
        } else {
          return true;
        }
      })
      .messages({
        "any.required": "Please select a communityr",
      })
  ),
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
      "any.required": "Please select a valid usser",
    }),
});

module.exports = schema;
