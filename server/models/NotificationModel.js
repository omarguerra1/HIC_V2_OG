import db from "../database/db.js";
import { DataTypes } from "sequelize";

const NotificationModel = db.define("notification", {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "notifications",   // por defecto Sequelize pluraliza "notification"
  timestamps: true
});

export default NotificationModel;
