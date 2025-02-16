import { joiValidatorMsg, ValidatorHelper } from "../helpers";

export const isBookValid = (req, res, next) => {
  let validator = new ValidatorHelper(req.body);
  const errorBody = validator.validateInput("book");
  if (errorBody.error) return joiValidatorMsg(res, errorBody);
  return next();
};
