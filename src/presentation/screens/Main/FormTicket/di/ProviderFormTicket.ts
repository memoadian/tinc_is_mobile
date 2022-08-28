
import OrderServiceRemoteDataSource from "../../../../../data/FormOrderService/OrderServiceRemoteDataSoruce";
import FormTicketRemoteDataSource from "../../../../../data/FormTicket/FormTicketRemoteDataSource";
import SaveTicketUseCase from "../../../../../domain/FormAddTicket/useCase/SaveTicketUseCase";
import GetActiveDetailUseCase from "../../../../../domain/FormOrderService/useCase/GetActiveDetailUseCase";
import { FormTicketBloc } from "../bloc/FormTicketBloc";

function providerFormTicketBloc(): FormTicketBloc {
    const repository = new FormTicketRemoteDataSource();
    const repositoryGetActive = new OrderServiceRemoteDataSource();
    const saveTicketUseCase = new SaveTicketUseCase(repository);
    const getActiveDetail = new GetActiveDetailUseCase(repositoryGetActive);
    return new FormTicketBloc(saveTicketUseCase, getActiveDetail);
}

export const ProviderFormTicketModule = {
    getBloc: providerFormTicketBloc
};