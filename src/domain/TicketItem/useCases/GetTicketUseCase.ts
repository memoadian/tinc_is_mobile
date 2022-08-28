import TicketItemRepository from '../repository/TicketItemRepository';
import {AxiosResponse} from 'axios';
import {TicketItemResponse} from '../models/Ticket.model';

export default class GetTicketUseCase {
  private ticketItemRepository: TicketItemRepository;
  
  constructor(ticketItemRepository: TicketItemRepository) {
    this.ticketItemRepository = ticketItemRepository
  }
  
  invoke(idTicket: string): Promise<AxiosResponse<TicketItemResponse>> {
    return this.ticketItemRepository.getTicket(idTicket);
  }
}
