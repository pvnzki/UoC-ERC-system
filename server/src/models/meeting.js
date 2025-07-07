"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    static associate(models) {
      // Optionally, define associations here
      // Meeting.belongsTo(models.Committee, { foreignKey: "committee_id", as: "committee" });
    }
  }

  Meeting.init(
    {
      meeting_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      committee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meeting_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Meeting",
      tableName: "CommitteeMeetings",
      timestamps: false,
      underscored: true,
    }
  );

  return Meeting;
};
