import { io } from "../main.js";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";
import MedicamentoModel from "../models/MedicamentoModel.js";
import PrescriptionModel from "../models/PrescriptionModel.js";
import NotificationModel from "../models/NotificationModel.js";

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (user_id) where.user_id = user_id;

    // Traemos también receta→medicamentos (para leer precio)
    const result = await OrderModel.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['order_date', 'DESC']],
      include: [{
        model: PrescriptionModel,
        as: 'receta',
        attributes: ['prescription_id'],
        include: [{
          model: MedicamentoModel,
          as: 'medicamentos',
          attributes: ['precio']
        }]
      }]
    });

    // Aplanamos cada order y calculamos total
    const orders = result.rows.map(o => {
      const meds = o.receta?.medicamentos || [];
      const total = meds.reduce((sum, m) => sum + parseFloat(m.precio || 0), 0);
      return {
        order_id: o.order_id,
        user_id: o.user_id,              
        state: o.state,
        estado_pago: o.estado_pago,
        order_date: o.order_date,
        delivery_schedule: o.delivery_schedule,
        total,
      };
    });

    return res.status(200).json({
      orders,
      total: result.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.count / limit)
    });
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener un pedido específico con precio de cada medicamento
export const getOneOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const order = await OrderModel.findOne({
      where: { order_id },
      include: [
        {
          model: MedicamentoModel,
          as: 'medicamentos',
          attributes: [
            'medicamento_id',
            'nombre',
            'flavor',
            'precio'
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada"
      });
    }

    // devolvemos el array completo
    res.status(200).json({
      success: true,
      order: {
        order_id: order.order_id,
        user_id: order.user_id,
        state: order.state,
        estado_pago: order.estado_pago,
        order_date: order.order_date,
        delivery_schedule: order.delivery_schedule,
        medicamentos: order.medicamentos
      }
    });
  } catch (error) {
    console.error("Error al buscar la orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar la orden",
      error: error.message
    });
  }
};

export const createOrder = async (req, res) => {
  const { user_id, prescription_id } = req.body; 

  try {
    const newOrder = await OrderModel.create({
      user_id,
      prescription_id,
    });
    await NotificationModel.create({
      user_id: newOrder.user_id,
      message: `Tu pedido ${newOrder.order_id} ha sido aprobado y puedes proceder a pagarlo.`,
    });
    io.to(`user_${newOrder.user_id}`)
      .emit("order-ready-to-pay", {
        orderId: newOrder.order_id,
        message: "Tu pedido ha sido aprobado y puedes proceder a pagarlo"
      });
    const admins = await UserModel.findAll({ where: { role: 'hic_admin' } });
    const adminMsg = `Se creó nueva orden #${newOrder.order_id} de usuario ${newOrder.user_id}.`;
    await Promise.all(
      admins.map(a =>
        NotificationModel.create({ user_id: a.user_id, message: adminMsg })
      )
    );
    io.to('admin').emit('new-order', {
      orderId: newOrder.order_id,
      byUser: newOrder.user_id,
      timestamp: new Date(),
    });
    res.status(201).json({
      message: "Pedido creado",
      success: true,
      order: {
        order_id: newOrder.order_id,
        order_date: newOrder.order_date,
        state: newOrder.state,
        user_id: newOrder.user_id,
        delivery_schedule: newOrder.delivery_schedule,
        prescription_id: newOrder.prescription_id
      }
    });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const [updated] = await OrderModel.update(req.body, {
      where: { order_id },
    });

    if (updated) {
      const updatedOrder = await OrderModel.findOne({
        where: { order_id },
      });
      const order = await OrderModel.findByPk(order_id);
      if (req.body.estado_pago === "Pagada") {
        const admins = await UserModel.findAll({ where: { role: "hic_admin" } });
        await Promise.all(
          admins.map(a =>
            NotificationModel.create({
              user_id: a.user_id,
              message: `El usuario ${order.user_id} ha pagado la orden #${order_id}.`
            })
          )
        );
        io.to("admin").emit("order-paid", {
          orderId: order_id,
          byUser: order.user_id,
          timestamp: new Date()
        });
      }
      if (req.body.state) {
        await NotificationModel.create({
          user_id: order.user_id,
          message: `Tu pedido #${order_id} cambió a "${order.state}".`
        });
        io.to(`user_${order.user_id}`).emit("order-state-changed", {
          orderId: order_id,
          newState: order.state,
          timestamp: new Date()
        });
      }
      /*//Notificamos al usuario dueño de la orden:
      const created = await NotificationModel.create({
        user_id: order.user_id,
        message: `Tu orden ${order_id} cambió a "${order.state}".`
      });
      console.log("Notificaciones creadas:", created.map(n => ({
        id: n.notification_id,
        user: n.user_id,
        msg: n.message
      })));
      io.emit("order-updated", {
        orderId: order_id,
        newState: order.state,
        timestamp: new Date(),
      });*/
      res.status(200).json({
        message: "Pedido actualizado",
        order: updatedOrder,
      });
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleted = await OrderModel.destroy({
      where: { order_id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({ message: "Pedido eliminado" });
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
