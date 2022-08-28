import { AxiosResponse } from "axios";
import { AnnexesServiceRequest, AnnexesServiceResponse } from "../models/AnnexesService.model";
import AnnexesServiceRepository from "../repository/AnnexesSErviceRepository";

export default class GetAnnexesServiceUseCase {

    private repository: AnnexesServiceRepository;

    constructor(repository: AnnexesServiceRepository) {
        this.repository = repository
    }

    invoke(request: AnnexesServiceRequest): Promise<AxiosResponse<AnnexesServiceResponse>> {
        return this.repository.getAnnexes(request)
    }

}