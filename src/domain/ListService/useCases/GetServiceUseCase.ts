import { AxiosResponse } from "axios";

import { ServiceRequest, ServicesResponse } from "../models/Service.model";
import TiketRepository from "../repository/ServiceRepository";

export default class GetServiceUseCase {

    private serviceRepository: TiketRepository;

    constructor(serviceRepository: TiketRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(query: ServiceRequest): Promise<AxiosResponse<ServicesResponse>> {
        return this.serviceRepository.getServicesService(query)
    }
}