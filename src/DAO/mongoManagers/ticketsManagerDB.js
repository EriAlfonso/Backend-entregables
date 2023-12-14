import ticketModel from "../models/ticket.model.js";
import {v4 } from "uuid";

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

    async createTicket(cart, user) {
    
        try {
            cart.products.forEach(product => {
                product.totalPrice = product.quantity * product._id.price;
            });
            const cartTotalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
            const ticketCode = v4();

            const ticket = new ticketModel({
                cart: cart._id,
                purchase_datetime: new Date().toString(),
                products: cart.products,
                purchaser: user,
                amount: cartTotalPrice,
                code: ticketCode,
            });

            await ticket.save();
            return ticket;
        } catch (error) {
            console.error('Error during ticket creation:', error);
            throw error;
        }
    }
}
