import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { ServiceRequest, ServicesResponse } from "../../domain/ListService/models/Service.model";
import { ServiceDeleteResponse } from "../../domain/ListService/models/ServiceDelete.model";
import ServiceRepository from "../../domain/ListService/repository/ServiceRepository";

export default class ServiceRemoteDataSource implements ServiceRepository {
    getServicesService(query: ServiceRequest): Promise<AxiosResponse<ServicesResponse, any>> {
        if (query.queryPath) {
            return ApiService.get<ServicesResponse>(`/service?${query.queryPath}`);
        } else {
            return ApiService.get<ServicesResponse>('/service', { params: { ...query } });
        }
    }
    deleteService(idService: string): Promise<AxiosResponse<ServiceDeleteResponse, any>> {
        return ApiService.delete<ServiceDeleteResponse>(`/service/${idService}`);
    }
}