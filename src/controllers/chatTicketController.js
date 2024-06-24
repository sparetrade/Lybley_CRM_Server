const ChatTicketModel = require("../models/chatTicket")

const addChatTicket = async (req, res) => {

    try {
        let body = req.body;
        let data = new ChatTicketModel(body);
        await data.save();
        res.json({ status: true, msg: "ChatTicket   Added" });
    } catch (err) {
        res.status(400).send(err);
    }

};

const getAllChatTicket = async (req, res) => {
    try {
        let data = await ChatTicketModel.find({}).sort({ _id: -1 });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}
const getChatTicketById = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await ChatTicketModel.findById(_id);
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}

const editChatTicket = async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let data = await ChatTicketModel.findByIdAndUpdate(_id, body);
        res.json({ status: true, msg: "ChatTicket Updated" });
    } catch (err) {
        res.status(500).send(err);
    }
}
const deleteChatTicket = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await ChatTicketModel.findByIdAndDelete(_id);
        res.json({ status: true, msg: "ChatTicket Deteled" });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { addChatTicket, getAllChatTicket, getChatTicketById, editChatTicket, deleteChatTicket };