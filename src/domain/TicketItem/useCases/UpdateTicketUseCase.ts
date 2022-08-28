import TicketItemRepository from '../repository/TicketItemRepository';
import {TicketItemResponse, TicketModel} from '../models/Ticket.model';
import {AxiosResponse} from 'axios';

export default class UpdateTicketUseCase {
  
  private ticketItemRepository: TicketItemRepository;
  
  constructor(ticketItemRepository: TicketItemRepository) {
    this.ticketItemRepository = ticketItemRepository
  }
  
  invoke(idTicket: string, ticket: TicketModel): Promise<AxiosResponse<TicketItemResponse>> {
    return this.ticketItemRepository.updateTicket(idTicket, ticket);
  }
  
}
