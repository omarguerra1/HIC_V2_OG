import db from "../database/db.js";
import { DataTypes, Sequelize } from "sequelize"

const MessageModel = db.define("messages", {
    msg_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    msg_content: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    msg_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    hasBeenSeen: {
        type: DataTypes.STRING(10),
        defaultValue: "false",
    },
    respondingTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default MessageModel;