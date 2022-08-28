import ServiceRepository from "../repository/ServiceRepository";
import {
    PartmaterialAsignedService,
    PartmaterialToService,
    PartToService
} from "../../../presentation/screens/Main/ServiceItem/ServiceItemState";
import {AxiosResponse} from "axios";
import {PartsServiceResponse} from "../models/Service.model";

export default class SetPartmaterialUserCase {

    private serviceRepository: ServiceRepository

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    invoke(idPart: string, request: PartToService,type: string): Promise<AxiosResponse<PartsServiceResponse>> {
        return this.serviceRepository.setPartMaterial(idPart, request,type);
    }
}