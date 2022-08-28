import OrderServiceRemoteDataSource from "../../../../../data/FormOrderService/OrderServiceRemoteDataSoruce";
import GetActiveDetailUseCase from "../../../../../domain/FormOrderService/useCase/GetActiveDetailUseCase";
import SavedOrderServiceUseCase from "../../../../../domain/FormOrderService/useCase/SaveOrderServiceUseCase";
import { FormOrderServiceBloc } from "../FormOrderServiceBloc";

function providerOrderServiceBloc(): FormOrderServiceBloc {
    const repository = new OrderServiceRemoteDataSource();
    const saveOrderServiceUseCase = new SavedOrderServiceUseCase(repository);
    const getActiveDetailUseCase = new GetActiveDetailUseCase(repository);
    return new FormOrderServiceBloc(saveOrderServiceUseCase, getActiveDetailUseCase);
}

export const providerOrderServiceModule = {
    providerOrderServiceBloc
};