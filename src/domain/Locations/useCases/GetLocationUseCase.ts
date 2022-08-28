import { AxiosResponse } from "axios";
import { LocationRequest, LocationResponse } from "../models/Location.model";

import LocationRepository from "../repository/LoactionRepository";
export default class GetLocationUseCase {

    private locationRepository: LocationRepository;

    constructor(locationRepository: LocationRepository) {
        this.locationRepository = locationRepository;
    }

    invoke(request: LocationRequest): Promise<AxiosResponse<LocationResponse>> {
        return this.locationRepository.getLocationService(request)
    }
}