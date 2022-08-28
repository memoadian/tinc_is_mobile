import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { LocationRequest, LocationResponse } from "../../domain/Locations/models/Location.model";
import LocationRepository from "../../domain/Locations/repository/LoactionRepository";

export default class LocationRemoteDataSource implements LocationRepository {
    getLocationService(request: LocationRequest): Promise<AxiosResponse<LocationResponse, any>> {
        return ApiService.get<LocationResponse>('/location', { params: { ...request } })
    }
}