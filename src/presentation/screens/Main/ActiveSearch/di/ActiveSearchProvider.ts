import ActiveSearchRemoteDataSource from "../../../../../data/ActiveSearch/ActiveSearchRemoteDataSoruce";
import GetActiveUseCase from "../../../../../domain/ActiveSearch/useCase/GetAvtivesUseCase";
import { ActiveSearchBloc } from "../bloc/ActiveSearchBloc";

function provideActiveSearchBloc(): ActiveSearchBloc {
    const repository = new ActiveSearchRemoteDataSource();
    const getActiveUseCase = new GetActiveUseCase(repository)
    return new ActiveSearchBloc(getActiveUseCase);
}

export const activeSearchModule = {
    provideActiveSearchBloc
}