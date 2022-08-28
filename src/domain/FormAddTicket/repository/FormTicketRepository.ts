import { AxiosResponse } from "axios";
import { CreateTicketRequest, CreateTicketResponse } from "../models/FormTicket.models";

export default interface FormTicketRepository {
    postTicketService(request: CreateTicketRequest): Promise<AxiosResponse<CreateTicketResponse>>
}