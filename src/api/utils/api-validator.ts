import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";

const JoiExtended = Joi as typeof Joi & {
  objectId: () => any;
};
JoiExtended.objectId = require("joi-objectid")(Joi);

// validate input for create and edit note
const validateRecord = (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  const validations: any = {
    studentName: Joi.string().required(),
    subject: Joi.string().required(),
    score: Joi.number()
      .required()
      .custom((value, helpers) => {
        if (value > body.totalScore) {
          return helpers.error("any.invalid", {
            message: "Score cannot be greater than total score.",
          });
        }
        return value;
      }),
    totalScore: Joi.number().required(),
    feedback: Joi.string().required(),
  };
  const schema = Joi.object(validations);

  const { error } = schema.validate(body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const {
      details: [{ message: errMsg }],
    } = error;
    const errPattern = /\"/gi;
    let message = errMsg.replace(errPattern, "");
    message = `${message.charAt(0).toUpperCase()}${message.slice(1)}`;
    return res.status(400).send({ success: false, message });
  }

  return next();
};

export { validateRecord };
