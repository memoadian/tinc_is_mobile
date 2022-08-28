import {AxiosResponse} from 'axios';
import {TicketItemResponse, TicketModel} from '../models/Ticket.model';
import {ServicesResponse} from '../../ListService/models/Service.model';

export default interface TicketItemRepository {
  getTicket(idTicket: string): Promise<AxiosResponse<TicketItemResponse>>;
  updateTicket(idTicket: string, ticket: TicketModel): Promise<AxiosResponse<TicketItemResponse>>;
  getTicketServices(folio: string) : Promise<AxiosResponse<ServicesResponse>>
}
