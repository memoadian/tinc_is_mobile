import { AxiosResponse } from "axios";

import { ServiceDeleteResponse } from "../models/ServiceDelete.model";
import ServiceRepository from "../repository/ServiceRepository";

export default class DeleteServiceUseCase {

    private serviceRepository: ServiceRepository;

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(idService: string): Promise<AxiosResponse<ServiceDeleteResponse>> {
        return this.serviceRepository.deleteService(idService);
    }
}