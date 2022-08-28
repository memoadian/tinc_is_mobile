import { AxiosResponse } from "axios";
import { AddAnnexeTicketRequest, AddAnnexeTicketResponse } from "../models/AnnexesTicket.model";
import AnnexesTicketRepository from "../repository/AnnexesTicketRepository";

export default class AddAnnexeTicketUseCase {

    private repository: AnnexesTicketRepository;

    constructor(repository: AnnexesTicketRepository) {
        this.repository = repository
    }

    invoke(request: AddAnnexeTicketRequest): Promise<AxiosResponse<AddAnnexeTicketResponse>> {
        return this.repository.addAnnexe(request)
    }

}