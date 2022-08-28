import { AxiosResponse } from "axios";
import { ServiceResponse } from "../models/Service.model";
import ServiceRepository from "../repository/ServiceRepository";

export default class GetServiceUseCase {

    private serviceRepository: ServiceRepository;

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(idService: string): Promise<AxiosResponse<ServiceResponse>> {
        return this.serviceRepository.getService(idService);
    }
}