import ticketModel from "../models/ticket.model.js";

export default class ticketManager {
    async addTicket(data) {
        try {
            if (data) return await ticketModel.create(data);
        } catch (error) {
            throw error;
        }
    }
    async getTickets() {
        try {
            return await ticketModel.find().lean().exec();
        } catch (error) {
            throw error;
        }
    }
    async getTicketById(id) {
        try {
            if (id) {
                return await ticketModel.findById(id).lean().exec();
            }
        } catch (error) {
            throw error;
        }
    }
    async updateTicket(id, data) {
        try {
            if ((id, data)) {
                return await ticketModel.findByIdAndUpdate(id, data);
            }
        } catch (e) {
            throw e;
        }
    }
}