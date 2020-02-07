import Joi from 'joi';
import { ConstantHelper } from './ConstantHelper';

export class ValidatorHelper extends ConstantHelper {
  constructor(data) {
    super();
    this.data = data;
  }

  validateInput(type) {
    let validateKeys = null;
    switch (type) {
      case 'user':
        validateKeys = Joi.object().keys(this.getLoginKeys());
        break;
      case 'newTopic':
        validateKeys = Joi.object().keys(this.getTopicKeys());
        break;
      case 'existingTopic':
        validateKeys = Joi.object().keys(this.existingTopicKeys());
        break;
      case 'category':
        validateKeys = Joi.object().keys(this.categoryKeys());
        break;
      case 'album':
        validateKeys = Joi.object().keys(this.albumKeys());
        break;
      default:
        break;
    }
    return Joi.validate(this.data, validateKeys);
  }
}
