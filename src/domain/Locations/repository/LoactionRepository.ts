import { AxiosResponse } from "axios";
import { LocationRequest, LocationResponse } from "../models/Location.model";

export default interface LocationRepository {
    getLocationService(request: LocationRequest): Promise<AxiosResponse<LocationResponse>>;
}