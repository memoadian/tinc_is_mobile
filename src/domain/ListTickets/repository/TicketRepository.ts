import { AxiosResponse } from "axios";
import { TicketRequest, TicketsResponse } from "../models/Ticket.model";
import { TicketDeleteResponse } from "../models/TicketDelete.model";

export default interface TicketRepository {
    getTicketsService(query: TicketRequest): Promise<AxiosResponse<TicketsResponse>>;
    deleteTicket(idTicket: string): Promise<AxiosResponse<TicketDeleteResponse>>
}
