import HomeRemoteDataSouce from "../../data/Home/HomeRemoteDataSource";
import GetClosedTicketUseCase from "../../domain/Home/useCases/GetClosedTicketUseCase";
import GetCompleteServiceUseCase from "../../domain/Home/useCases/GetCompleteServiceUseCase";
import GetCreatedTicketUseCase from "../../domain/Home/useCases/GetCreatedTicketUseCase";
import GetDeadlineOverServiceUseCase from "../../domain/Home/useCases/GetDeadlineOverServiceUseCase";
import GetOpenedTicketUseCase from "../../domain/Home/useCases/GetOpenedTicketUseCase";
import GetScheduleServiceUseCase from "../../domain/Home/useCases/GetScheduleServiceUsecase";
import { HomeBloc } from "../../presentation/screens/Main/Principal/bloc/HomeBloc";

export function provideHomeBloc(): HomeBloc {
    const repository = new HomeRemoteDataSouce();
    const getScheduleServiceUseCase = new GetScheduleServiceUseCase(repository);
    const getCompleteServiceUseCase = new GetCompleteServiceUseCase(repository);
    const getDeadlineOverServiceUseCase = new GetDeadlineOverServiceUseCase(repository);
    const getCreatedTicketUseCase = new GetCreatedTicketUseCase(repository);
    const getClosedTicketUseCase = new GetClosedTicketUseCase(repository);
    const getOpenedTicketUseCase = new GetOpenedTicketUseCase(repository);
    return new HomeBloc(
        getScheduleServiceUseCase,
        getCompleteServiceUseCase,
        getDeadlineOverServiceUseCase,
        getCreatedTicketUseCase,
        getClosedTicketUseCase,
        getOpenedTicketUseCase);
}