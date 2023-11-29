import { ticketRepository } from "../services/index.js"



export const createTicket = async (req, res) => {
    const ticket = {
        amount: req.body.amount,
        purchaser: req.body.purchaser
    }
    try {
        await ticketRepository.createTicket(ticket);
        res.status(200).send({succes: true, message: "Ticket Created Successfully"})
    } catch (error) {
        console.error('An error occurred', error)
        req.logger.error("Error Creating ticket",error)
        res.status(404).send({succes: false, message: error.message})
    }
}