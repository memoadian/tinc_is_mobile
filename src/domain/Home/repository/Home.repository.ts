import { AxiosResponse } from "axios";
import { NumberServiceRequest, NumberTicketRequest, ServiceResponse, TicketResponse } from "../models/Home.model";

export default interface HomeRepository {
    getScheduleService(request: NumberServiceRequest): Promise<AxiosResponse<ServiceResponse>>;
    getCompleteService(request: NumberServiceRequest): Promise<AxiosResponse<ServiceResponse>>;
    getDeadlineOverService(request: NumberServiceRequest): Promise<AxiosResponse<ServiceResponse>>;
    getCreatedTicket(request: NumberTicketRequest): Promise<AxiosResponse<TicketResponse>>;
    getClosedTicket(request: NumberTicketRequest): Promise<AxiosResponse<TicketResponse>>;
    getOpenedTicket(request: NumberTicketRequest): Promise<AxiosResponse<TicketResponse>>;
}