export default class ticketService {
    constructor(dao) {
        this.dao = dao;
    }

    createTicket = async(cart,user) => {
        return await this.dao.createTicket(cart,user)
    }
}