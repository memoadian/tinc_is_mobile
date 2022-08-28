import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { TicketRequest, TicketsResponse } from "../../domain/ListTickets/models/Ticket.model";
import { TicketDeleteResponse } from "../../domain/ListTickets/models/TicketDelete.model";
import TicketRepository from "../../domain/ListTickets/repository/TicketRepository";

export default class TicketRemoteDataSource implements TicketRepository {
    getTicketsService(query: TicketRequest): Promise<AxiosResponse<TicketsResponse, any>> {
        if (query.queryPath) {
            return ApiService.get<TicketsResponse>(`/ticket?${query.queryPath}`);
        } else {
            return ApiService.get<TicketsResponse>('/ticket', { params: { ...query } });
        }
    }
    deleteTicket(idTicket: string): Promise<AxiosResponse<TicketDeleteResponse, any>> {
        return ApiService.delete<TicketDeleteResponse>(`/ticket/${idTicket}`);
    }
}