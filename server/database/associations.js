import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";
import MessageModel from "../models/MessageModel.js";
import MedicineModel from "../models/MedicamentoModel.js";
import PrescriptionModel from "../models/PrescriptionModel.js";
import HistorialPagos from "../models/HistorialPagosModel.js";


UserModel.hasMany(OrderModel, {
    foreignKey: "user_id"
});

OrderModel.belongsTo(UserModel, {
    foreignKey: "user_id"
});


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


MessageModel.belongsTo(MessageModel, {
    foreignKey: "respondingTo",
    as: "Response",
});

MessageModel.hasOne(MessageModel, {
    foreignKey: "respondingTo",
});


MedicineModel.belongsTo(PrescriptionModel, { 
    foreignKey: 'prescription_id' 
});
PrescriptionModel.hasMany(MedicineModel, {
    foreignKey: "prescription_id"
});

OrderModel.belongsTo(PrescriptionModel, {
  foreignKey: 'prescription_id',
  as:         'receta'
});


PrescriptionModel.hasMany(OrderModel, {
  foreignKey: 'prescription_id',
  as:         'ordenes'
});
export { UserModel, OrderModel, MessageModel, PrescriptionModel, MedicineModel, HistorialPagos };