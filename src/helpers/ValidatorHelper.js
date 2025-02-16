import Joi from "joi";
import { ConstantHelper } from "./ConstantHelper";

export class ValidatorHelper extends ConstantHelper {
  constructor(data) {
    super();
    this.data = data;
  }

  validateInput(type, action = "") {
    let validateKeys = null;
    switch (type) {
      case "login":
        validateKeys = Joi.object().keys(this.getLoginKeys());
        break;
      case "user":
        validateKeys = Joi.object().keys(this.getUserKeys(action));
        break;
      case "newTopic":
        validateKeys = Joi.object().keys(this.getTopicKeys());
        break;
      case "existingTopic":
        validateKeys = Joi.object().keys(this.existingTopicKeys());
        break;
      case "category":
        validateKeys = Joi.object().keys(this.categoryKeys());
        break;
      case "album":
        validateKeys = Joi.object().keys(this.albumKeys());
        break;
      case "media":
        validateKeys = Joi.object().keys(this.mediaKeys());
        break;
      case "announcemt":
        validateKeys = Joi.object().keys(this.announcemtKeys());
        break;
      case "comment":
        validateKeys = Joi.object().keys(this.commentKeys());
        break;
      case "message":
        validateKeys = Joi.object().keys(this.messageKeys());
        break;
      case "entity-display":
        validateKeys = Joi.object().keys(this.entityDisplayKeys());
        break;
      case "commentReply":
        validateKeys = Joi.object().keys(this.commentReplyKeys());
        break;
      case "book":
        validateKeys = Joi.object().keys(this.bookKeys());
        break;
      default:
        break;
    }
    return validateKeys.validate(this.data);
  }
}
