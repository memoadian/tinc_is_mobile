import AnnexesTicketRemoteDataSource from "../../data/AnnexesTicket/AnnexesTicketRemoteDataSource";
import AddAnnexeTicketUseCase from "../../domain/AnnexesTicket/useCase/AddAnnexeServiceUseCase";
import DeleteAnnexesTicketUseCase from "../../domain/AnnexesTicket/useCase/DeleteAnnexesTicketUseCase";
import GetAnnexesTicketUseCase from "../../domain/AnnexesTicket/useCase/GetAnnexesTicketUseCase";
import { AnnexesTicketBloc } from "../../presentation/screens/Main/TicketItem/bloc/AnnexesTicketBloc";

function providerBloc(): AnnexesTicketBloc {
    const repository = new AnnexesTicketRemoteDataSource();
    const getAllAnnexes = new GetAnnexesTicketUseCase(repository);
    const deleteAnnexe = new DeleteAnnexesTicketUseCase(repository);
    const addAnnexe = new AddAnnexeTicketUseCase(repository);
    return new AnnexesTicketBloc(getAllAnnexes, deleteAnnexe, addAnnexe);
}

export const annexesTikcetModule = {
    providerBloc
}