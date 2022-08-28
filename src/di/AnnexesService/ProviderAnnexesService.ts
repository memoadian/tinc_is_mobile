import AnnexesServiceRemoteDataSource from "../../data/AnnexesService/AnnexesServiceRemoteDataSource";
import AddAnnexeServiceUseCase from "../../domain/AnnexesService/useCase/AddAnnexeServiceUseCase";
import DeleteAnnexesServiceUseCase from "../../domain/AnnexesService/useCase/DeleteAnnexesServiceUseCase";
import GetAnnexesServiceUseCase from "../../domain/AnnexesService/useCase/GetAnnexesServiceUseCase";
import { AnnexesServiceBloc } from "../../presentation/screens/Main/ServiceItem/bloc/AnnexesServiceBloc";

function provideAnnexesServiceBloc(): AnnexesServiceBloc {
    const repository = new AnnexesServiceRemoteDataSource();
    const getAllAnnexes = new GetAnnexesServiceUseCase(repository);
    const deleteAnnexe = new DeleteAnnexesServiceUseCase(repository);
    const addAnnexe = new AddAnnexeServiceUseCase(repository)
    return new AnnexesServiceBloc(getAllAnnexes, addAnnexe, deleteAnnexe);
}

export const annexesServiceModule = {
    provideAnnexesServiceBloc
}