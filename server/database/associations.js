import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";
import MessageModel from "../models/MessageModel.js";
import MedicineModel from "../models/MedicamentoModel.js";
import PrescriptionModel from "../models/PrescriptionModel.js";

//Relaciones entre Orden y Usuario
UserModel.hasMany(OrderModel, {
    foreignKey: "user_id"
});

OrderModel.belongsTo(UserModel, {
    foreignKey: "user_id"
});

//Relaciones entre Usuario y Mensaje
UserModel.hasMany(MessageModel, {
    foreignKey: "sender_id",
    as: "SentMessages"
});

UserModel.hasMany(MessageModel, {
    foreignKey: "receiver_id",
    as: "ReceivedMessages"
});

MessageModel.belongsTo(UserModel, {
    foreignKey: "sender_id",
    as: "Sender"
});

MessageModel.belongsTo(UserModel, {
    foreignKey: "receiver_id",
    as: "Receiver"
});

//Relaciones entre mensaje y mensaje
MessageModel.belongsTo(MessageModel, {
    foreignKey: "respondingTo",
    as: "Response",
});

MessageModel.hasOne(MessageModel, {
    foreignKey: "respondingTo",
});

//Relaciones entre Medicine y Prescription
MedicineModel.belongsTo(PrescriptionModel, { 
    foreignKey: 'prescription_id' 
});
PrescriptionModel.hasMany(MedicineModel, {
    foreignKey: "prescription_id"
});

export { UserModel, OrderModel, MessageModel, PrescriptionModel, MedicineModel };