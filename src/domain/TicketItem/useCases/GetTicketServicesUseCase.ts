import TicketItemRepository from '../repository/TicketItemRepository';
import {AxiosResponse} from 'axios';
import {ServicesResponse} from '../../ListService/models/Service.model';

export default class GetTicketServicesUseCase {
  private ticketItemRepository: TicketItemRepository;
  
  constructor(ticketItemRepository: TicketItemRepository) {
    this.ticketItemRepository = ticketItemRepository
  }
  
  invoke(folio: string): Promise<AxiosResponse<ServicesResponse>> {
    return this.ticketItemRepository.getTicketServices(folio);
  }
}
