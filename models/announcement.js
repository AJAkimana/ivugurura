'use strict';
module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define(
    'Announcement',
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      type: DataTypes.STRING
    },
    {}
  );
  Announcement.associate = function(models) {
    Announcement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'publisher',
      onDelete: 'CASCADE'
    });
  };
  return Announcement;
};
