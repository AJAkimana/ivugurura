import Joi from "joi";
import {
  Topic,
  Language,
  Category,
  User,
  Commentary,
  Media,
  TopicView,
  Album,
  MediaDownload,
  MediaShare,
  EntityDisplay,
  Sequelize,
} from "../models";

const { Op } = Sequelize;
export class ConstantHelper {
  constructor() {
    this.hour = 3600000;
    this.day = this.hour * 24;
    this.week = this.day * 7;
  }
  static serverError = "Unknown upload";
  getLoginKeys() {
    return {
      languageId: Joi.number().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    };
  }
  getUserKeys(action) {
    let baseKeys = {
      names: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string(),
      profile_image: Joi.string(),
      role: Joi.number().valid(2, 3).required(),
      isActive: Joi.boolean().required(),
      languageId: Joi.number(),
    };
    return action === "edit"
      ? { ...baseKeys, password: Joi.string() }
      : baseKeys;
  }
  getSignupKeys() {
    let userInfo = {
      ...this.getLoginKeys(),
      names: Joi.string().required(),
      username: Joi.string().required(),
      access_lvl: Joi.number().required(),
    };
    return userInfo;
  }
  existingTopicKeys() {
    return {
      title: Joi.string(),
      originalTitle: Joi.string(),
      description: Joi.string(),
      coverImage: Joi.string(),
      content: Joi.string(),
      categoryId: Joi.number(),
      languageId: Joi.number().required(),
      isPublished: Joi.boolean(),
    };
  }
  categoryKeys() {
    return {
      name: Joi.string().required(),
      categoryId: Joi.number(),
      languageId: Joi.number(),
    };
  }
  albumKeys() {
    return {
      name: Joi.string().required(),
      languageId: Joi.number(),
    };
  }
  mediaKeys() {
    return {
      title: Joi.string().required(),
      type: Joi.string().valid("audio", "video", "image").required(),
      mediaLink: Joi.string().required(),
      author: Joi.string().required(),
      actionDate: Joi.date().required(),
      languageId: Joi.number().required(),
      albumId: Joi.number().required(),
    };
  }
  announcemtKeys() {
    return {
      title: Joi.string().required(),
      isPublished: Joi.boolean(),
      content: Joi.string().required(),
      expiryDate: Joi.date().required(),
      languageId: Joi.number().required(),
    };
  }
  getTopicKeys() {
    return {
      title: Joi.string().required(),
      description: Joi.string(),
      content: Joi.string().required(),
      isPublished: Joi.boolean(),
      categoryId: Joi.number().required(),
      coverImage: Joi.string().required(),
      languageId: Joi.number().required(),
    };
  }
  messageKeys() {
    return {
      names: Joi.string().required(),
      email: Joi.string().required(),
      message: Joi.string().required(),
      languageId: Joi.number().required(),
    };
  }
  entityDisplayKeys() {
    return {
      type: Joi.string().valid("topic", "media").required(),
      displayType: Joi.string().valid("carsoul", "home").required(),
      languageId: Joi.number().required(),
    };
  }
  commentReplyKeys() {
    return {
      replyType: Joi.string().valid("private", "public").required(),
      content: Joi.string().required(),
      languageId: Joi.number().required(),
    };
  }
  bookKeys() {
    return {
      name: Joi.string().required(),
      languageId: Joi.number(),
      categoryId: Joi.number().required(),
      author: Joi.string().required(),
      summary: Joi.string().required(),
      bookCover: Joi.string().required(),
      bookFile: Joi.string().required(),
    };
  }
  albumIncludes() {
    return [
      {
        model: Media,
        as: "media",
        attributes: ["name"],
      },
    ];
  }
  mediaIncludes() {
    return [
      {
        model: Album,
        as: "album",
        attributes: ["id", "name"],
      },
      {
        model: Language,
        as: "language",
        attributes: ["name"],
      },
      {
        model: MediaDownload,
        as: "downloads",
        attributes: ["id"],
      },
      {
        model: MediaShare,
        as: "shares",
        attributes: ["id"],
      },
    ];
  }
  identifierIncludes() {
    return [
      {
        model: User,
        as: "user",
        attributes: ["names"],
      },
      {
        model: Language,
        as: "language",
        attributes: ["name"],
      },
    ];
  }
  categoryIncludes() {
    return [
      {
        model: Category,
        as: "categories",
        attributes: ["id", "name", "slug"],
      },
    ];
  }
  oneCategoryIncludes() {
    return [
      {
        model: Category,
        as: "parent",
        attributes: ["id", "name"],
      },
    ];
  }
  topicCategorIncludes(topicId) {
    return [
      {
        model: Category,
        as: "category",
        attributes: ["name"],
        include: [
          {
            model: Topic,
            as: "relatedTopics",
            where: { isPublished: true, id: { [Op.ne]: topicId } },
            attributes: ["title", "slug", "description", "coverImage"],
          },
        ],
      },
    ];
  }
  commentariesIncludes() {
    return [
      {
        model: Commentary,
        as: "commentaries",
        where: { isPublished: true },
        attributes: ["content", "names", "createdAt"],
      },
    ];
  }
  oneTopicIncludes(topicId) {
    return [...this.topicIncludes(), ...this.topicCategorIncludes(topicId)];
  }
  getTopicDisplayIncludes(toIncludeDisplay = false, conditions = {}) {
    return toIncludeDisplay
      ? [
          {
            model: EntityDisplay,
            as: "entities",
            attributes: ["id", "type"],
            ...conditions,
          },
        ]
      : [];
  }
  commentAllIncludes(options) {
    return [
      {
        model: Topic,
        as: "topic",
        attributes: ["title", "slug"],
        ...options,
      },
    ];
  }
  commentIncludes() {
    return [
      {
        model: Commentary,
        as: "replies",
      },
    ];
  }
  topicIncludes(toIncludeDisplay = false, conditions = {}) {
    return [
      ...this.identifierIncludes(),
      {
        model: Category,
        as: "category",
        attributes: ["name", "slug"],
      },
      {
        model: TopicView,
        as: "views",
        attributes: ["ipAddress"],
      },
      ...this.getTopicDisplayIncludes(toIncludeDisplay, conditions),
    ];
  }
  commentKeys() {
    return {
      content: Joi.string().required(),
      names: Joi.string().required(),
      email: Joi.string().email().required(),
      languageId: Joi.number().required(),
      website: Joi.string().allow(""),
    };
  }
}
