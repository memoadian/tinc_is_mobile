import { AxiosResponse } from "axios";
import { PartsServiceResponse } from "../models/Service.model";
import ServiceRepository from "../repository/ServiceRepository";

export default class GetPartsOfServiceUseCase {

    private serviceRepository: ServiceRepository;

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(idService: string): Promise<AxiosResponse<PartsServiceResponse>> {
        return this.serviceRepository.getParts(idService);
    }

}