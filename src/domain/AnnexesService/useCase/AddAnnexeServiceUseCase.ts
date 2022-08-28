import { AxiosResponse } from "axios";
import { AddAnnexeServiceRequest, AddAnnexeServiceResponse } from "../models/AnnexesService.model";
import AnnexesServiceRepository from "../repository/AnnexesSErviceRepository";

export default class AddAnnexeServiceUseCase {

    private repository: AnnexesServiceRepository;

    constructor(repository: AnnexesServiceRepository) {
        this.repository = repository
    }

    invoke(request: AddAnnexeServiceRequest): Promise<AxiosResponse<AddAnnexeServiceResponse>> {
        return this.repository.addAnnexe(request)
    }

}