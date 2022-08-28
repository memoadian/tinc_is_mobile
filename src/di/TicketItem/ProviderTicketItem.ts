import {TicketItemBloc} from '../../presentation/screens/Main/TicketItem/bloc/TicketItemBloc';
import TicketItemRemoteDataSource from '../../data/TicketItem/TicketItemRemoteDataSource';
import GetTicketUseCase from '../../domain/TicketItem/useCases/GetTicketUseCase';
import UpdateTicketUseCase from '../../domain/TicketItem/useCases/UpdateTicketUseCase';
import GetTicketServicesUseCase from '../../domain/TicketItem/useCases/GetTicketServicesUseCase';
import OrderServiceRemoteDataSource from '../../data/FormOrderService/OrderServiceRemoteDataSoruce';
import GetActiveDetailUseCase from '../../domain/FormOrderService/useCase/GetActiveDetailUseCase';

function providerTicketItemBloc(): TicketItemBloc {
  const repository = new TicketItemRemoteDataSource();
  const repositoryAsset = new OrderServiceRemoteDataSource();
  const getTicket = new GetTicketUseCase(repository);
  const updateTicket = new UpdateTicketUseCase(repository);
  const getTicketServices = new GetTicketServicesUseCase(repository);
  const getActiveDetailUseCase = new GetActiveDetailUseCase(repositoryAsset);
  
  return new TicketItemBloc(getTicket, updateTicket, getTicketServices, getActiveDetailUseCase);
}

export const ticketItemModule = {
  providerTicketItemBloc
}
