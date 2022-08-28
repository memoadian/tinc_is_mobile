import { AxiosResponse } from "axios";
import { ServiceRequest, ServicesResponse } from "../models/Service.model";
import { ServiceDeleteResponse } from "../models/ServiceDelete.model";

export default interface ServiceRepository {
    getServicesService(query: ServiceRequest): Promise<AxiosResponse<ServicesResponse>>;
    deleteService(idService: string): Promise<AxiosResponse<ServiceDeleteResponse>>
}