import ServiceRepository from "../repository/ServiceRepository";
import {
    PartmaterialAsignedService,
    PartmaterialToService
} from "../../../presentation/screens/Main/ServiceItem/ServiceItemState";
import {AxiosResponse} from "axios";
import {PartsServiceResponse} from "../models/Service.model";

export default class SetPartmaterialOfService {

    private serviceRepository: ServiceRepository

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(idPart: number, request: PartmaterialAsignedService): Promise<AxiosResponse<PartsServiceResponse>> {
        return this.serviceRepository.setPartMaterialOfService(idPart, request);
    }
}