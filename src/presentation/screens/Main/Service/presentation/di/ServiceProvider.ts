import ServiceRemoteDataSource from "../../../../../../data/ListService/ServiceRemoteDataSource";
import DeleteServiceUseCase from "../../../../../../domain/ListService/useCases/DeleteServiceUseCase";
import GetServiceUseCase from "../../../../../../domain/ListService/useCases/GetServiceUseCase";
import { ServiceBloc } from "../ServiceBloc";

export function provideServiceBloc(): ServiceBloc {
    const repository = new ServiceRemoteDataSource();
    const getServicesServiceUseCase = new GetServiceUseCase(repository);
    const deleteServiceUseCase = new DeleteServiceUseCase(repository);
    return new ServiceBloc(getServicesServiceUseCase, deleteServiceUseCase);
}