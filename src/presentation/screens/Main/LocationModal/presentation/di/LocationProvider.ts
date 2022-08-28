import LocationRemoteDataSource from "../../../../../../data/Locations/LocationRemoteDataSource";
import GetLocationUseCase from "../../../../../../domain/Locations/useCases/GetLocationUseCase";
import { LocationBloc } from "../../LocationBloc";

export function provideTicketBloc(): LocationBloc {
    const repository = new LocationRemoteDataSource();
    const getLocationServiceUseCase = new GetLocationUseCase(repository);
    return new LocationBloc(getLocationServiceUseCase);
}