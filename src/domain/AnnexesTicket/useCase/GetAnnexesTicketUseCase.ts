import { AxiosResponse } from "axios";
import { AnnexesTicketRequest, AnnexesTicketResponse } from "../models/AnnexesTicket.model";
import AnnexesTicketRepository from "../repository/AnnexesTicketRepository";

export default class GetAnnexesTicketUseCase {

    private repository: AnnexesTicketRepository;

    constructor(repository: AnnexesTicketRepository) {
        this.repository = repository
    }

    invoke(request: AnnexesTicketRequest): Promise<AxiosResponse<AnnexesTicketResponse>> {
        return this.repository.getAnnexes(request)
    }

}