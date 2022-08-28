import ServiceRemoteDataSource from "../../../../../data/ServiceItem/ServiceRemoteDataSource";
import DeletePartOfServiceUseCase from "../../../../../domain/ServiceItem/useCases/DeletePartOfServiceUseCase";
import GetPartsOfServiceUseCase from "../../../../../domain/ServiceItem/useCases/GetPartsOfServiceUseCase";
import GetServiceUseCase from "../../../../../domain/ServiceItem/useCases/GetServiceUseCase";
import { UpdateServiceUseCase } from "../../../../../domain/ServiceItem/useCases/UpdateServiceUseCase";
import { ServiceItemBloc } from "../ServiceItemBloc";
import SetPartOfServiceUseCase from '../../../../../domain/ServiceItem/useCases/SetPartOfServiceUseCase';
import GetActiveDetailUseCase from "../../../../../domain/FormOrderService/useCase/GetActiveDetailUseCase";
import OrderServiceRemoteDataSource from "../../../../../data/FormOrderService/OrderServiceRemoteDataSoruce";
import SetPartmaterialOfService from "../../../../../domain/ServiceItem/useCases/SetPartmaterialOfService";
import SetServiceAccountPartUseCase from "../../../../../domain/ServiceItem/useCases/SetServiceAccountPartUseCase";
import GetServiceAccountPartByIdUserCase from "../../../../../domain/ServiceItem/useCases/GetServiceAccountPartByIdUserCase";
import GetPartMaterialUseCase from "../../../../../domain/ServiceItem/useCases/GetPartsMaterialUseCaseById";
import SetPartmaterialUserCase from "../../../../../domain/ServiceItem/useCases/SetPartmaterialUserCase";


export function provideServiceItemBloc(): ServiceItemBloc {
  const repository = new ServiceRemoteDataSource();
  const repositoryAsset = new OrderServiceRemoteDataSource();
  const getServicesServiceUseCase = new GetServiceUseCase(repository);
  const updateServiceUseCase = new UpdateServiceUseCase(repository)
  const getPartsOfServiceUseCase = new GetPartsOfServiceUseCase(repository);
  const deletePartOfServiceUseCase = new DeletePartOfServiceUseCase(repository);
  const getServiceAccountPartByIdUserCase = new GetServiceAccountPartByIdUserCase(repository);
  const setPartOfServiceUseCase = new SetPartOfServiceUseCase(repository);
  const getActiveDetailUseCase = new GetActiveDetailUseCase(repositoryAsset);
  const getPartMaterialUseCase = new GetPartMaterialUseCase(repository)
  const setPartmaterialUserCase = new SetPartmaterialUserCase(repository);

  const setPatMaterialOfServiceUseCase = new SetPartmaterialOfService(repository);
  const setServiceAccountPartUseCase = new SetServiceAccountPartUseCase(repository);
  return new ServiceItemBloc(
    getServicesServiceUseCase,
    updateServiceUseCase,
    getPartsOfServiceUseCase,
    deletePartOfServiceUseCase,
    setPartOfServiceUseCase,
    setPatMaterialOfServiceUseCase,
    setServiceAccountPartUseCase,
    getActiveDetailUseCase,
    getServiceAccountPartByIdUserCase,
    getPartMaterialUseCase,
    setPartmaterialUserCase
  );
}
