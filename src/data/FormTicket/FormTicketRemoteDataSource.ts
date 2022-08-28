import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { CreateTicketRequest, CreateTicketResponse } from "../../domain/FormAddTicket/models/FormTicket.models";
import FormTicketRepository from "../../domain/FormAddTicket/repository/FormTicketRepository";

export default class FormTicketRemoteDataSource implements FormTicketRepository {

    postTicketService(request: CreateTicketRequest): Promise<AxiosResponse<CreateTicketResponse, any>> {
        return ApiService.post<CreateTicketResponse>('/ticket', request)
    }

}