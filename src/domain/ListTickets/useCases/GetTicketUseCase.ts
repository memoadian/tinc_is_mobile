import { AxiosResponse } from "axios";

import { TicketRequest, TicketsResponse } from "../models/Ticket.model";
import TiketRepository from "../repository/TicketRepository";

export default class GetTicketUseCase {

    private ticketRepository: TiketRepository;

    constructor(ticketRepository: TiketRepository) {
        this.ticketRepository = ticketRepository;
    }

    invoke(query: TicketRequest): Promise<AxiosResponse<TicketsResponse>> {
        return this.ticketRepository.getTicketsService(query)
    }
}