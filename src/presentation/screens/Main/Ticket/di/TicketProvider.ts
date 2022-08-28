import TicketRemoteDataSource from "../../../../../data/ListTickets/TicketRemoteDataSource";
import DeleteTicketUseCase from "../../../../../domain/ListTickets/useCases/DeleteTicketUseCase";
import GetTicketUseCase from "../../../../../domain/ListTickets/useCases/GetTicketUseCase";
import { TicketBloc } from "../TicketBloc";

export function provideTicketBloc(): TicketBloc {
    const repository = new TicketRemoteDataSource();
    
    const getTicketsServiceUseCase = new GetTicketUseCase(repository);
    const deleteTicketUseCase = new DeleteTicketUseCase(repository);
    
    return new TicketBloc(getTicketsServiceUseCase, deleteTicketUseCase,);
}