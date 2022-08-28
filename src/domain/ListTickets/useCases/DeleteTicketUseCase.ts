import { AxiosResponse } from "axios";

import { TicketDeleteResponse } from "../models/TicketDelete.model";
import TiketRepository from "../repository/TicketRepository";

export default class DeleteTicketUseCase {

    private ticketRepository: TiketRepository;

    constructor(ticketRepository: TiketRepository) {
        this.ticketRepository = ticketRepository;
    }

    invoke(idTicket: string): Promise<AxiosResponse<TicketDeleteResponse>> {
        return this.ticketRepository.deleteTicket(idTicket);
    }
}