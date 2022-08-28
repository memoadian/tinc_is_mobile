import ProviderSearchRemoteDataSource from "../../../../../data/ProviderSearch/ProviderSearchRemoteDataSource";
import GetProvidersUseCase from "../../../../../domain/ProviderSearch/useCase/GetProvidersUseCase";
import { ProviderSearchBloc } from "../ProviderSearchBloc";

function provideProviderSearchBloc(): ProviderSearchBloc {
    const repository = new ProviderSearchRemoteDataSource();
    const getProvidersUseCase = new GetProvidersUseCase(repository)
    return new ProviderSearchBloc(getProvidersUseCase);
}

export const providerSearchModule = {
    provideProviderSearchBloc
}