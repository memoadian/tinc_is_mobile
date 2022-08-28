import { AxiosResponse } from "axios";
import { DeleteAnnexeServiceResponse } from "../models/AnnexesService.model";
import AnnexesServiceRepository from "../repository/AnnexesSErviceRepository";

export default class DeleteAnnexesServiceUseCase {

    private repository: AnnexesServiceRepository;

    constructor(repository: AnnexesServiceRepository) {
        this.repository = repository
    }

    invoke(idAnnexe: string): Promise<AxiosResponse<DeleteAnnexeServiceResponse>> {
        return this.repository.deleteAnnexe(idAnnexe)
    }

}