import ServiceRepository from "../repository/ServiceRepository";
import {PartmaterialToService} from "../../../presentation/screens/Main/ServiceItem/ServiceItemState";
import {AxiosResponse} from "axios";
import {PartsServiceResponse} from "../models/Service.model";

export default class SetServiceAccountPartUseCase {

    private serviceRepository: ServiceRepository;

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(request: PartmaterialToService): Promise<AxiosResponse<PartsServiceResponse>> {
        return this.serviceRepository.setServiceAccountPart(request);
    }
}