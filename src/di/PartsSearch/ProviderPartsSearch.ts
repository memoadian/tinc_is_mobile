import PartsSearchRemoteDataSource from "../../data/PartsSearch/PartSearchRemoteDataSource";
import GetPartMaterialUseCase from "../../domain/PartsSearch/useCase/GetPartsMaterialUseCase";
import GetPartsUseCase from "../../domain/PartsSearch/useCase/GetPartsUseCase";
import { PartsSearchBloc } from "../../presentation/screens/Main/PartsSearch/bloc/PartsSearchBloc";

function providePartsSearchBloc(): PartsSearchBloc {
    const repository = new PartsSearchRemoteDataSource();
    const getPartsUseCase = new GetPartsUseCase(repository)
    const getPartsMaterialUseCase = new GetPartMaterialUseCase(repository)
    return new PartsSearchBloc(getPartsUseCase, getPartsMaterialUseCase);
}

export const partsSearchModule = {
    providePartsSearchBloc
}