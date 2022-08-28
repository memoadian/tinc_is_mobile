import { AxiosResponse } from "axios";
import { DetailServiceRequest, ServiceResponse } from "../models/Service.model";
import ServiceRepository from "../repository/ServiceRepository";

export class UpdateServiceUseCase {
    private serviceRepository: ServiceRepository;

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(idService: string, detailServiceRequest: DetailServiceRequest): Promise<AxiosResponse<ServiceResponse>> {
        return this.serviceRepository.updateService(idService, detailServiceRequest);
    }
}