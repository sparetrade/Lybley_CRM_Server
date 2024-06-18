const OrderModel = require("../models/order")

const addOrder = async (req, res) => {

    try {
        let body = req.body;
        let data = new OrderModel(body);
        await data.save();
        res.json({ status: true, msg: "Order   Added" });
    } catch (err) {
        res.status(400).send(err);
    }

};

const getAllOrder = async (req, res) => {
    try {
        let data = await OrderModel.find({}).sort({ _id: -1 });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}
const getOrderById = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await OrderModel.findById(_id);
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}

const editOrder = async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let data = await OrderModel.findByIdAndUpdate(_id, body);
        res.json({ status: true, msg: "Order Updated" });
    } catch (err) {
        res.status(500).send(err);
    }
}
const deleteOrder = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await OrderModel.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Order Deteled" });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { addOrder, getAllOrder, getOrderById, editOrder, deleteOrder };
