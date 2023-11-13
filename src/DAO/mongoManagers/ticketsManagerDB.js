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
        } catch (error) {
            throw error;
        }
    }

    createTicket = async (ticket) => {
        const tickets = await this.getTickets();
        const newCode = tickets.length
        const nextCode = newCode? newCode + 1 : 1
        const purchase_datetime = new Date().toString()
        try {
            const newTickets = await ticketModel({...ticket, code : nextCode, purchase_datetime: purchase_datetime});
            newTickets.save();
            return {success: true, message: "Ticket Created Successfully"}
        } catch (error) {
            console.error('Error during Ticket Creation:', error);
    throw error;}
    }
}
