import { AxiosResponse } from "axios";
import { DeleteAnnexeTicketResponse } from "../models/AnnexesTicket.model";
import AnnexesTicketRepository from "../repository/AnnexesTicketRepository";

export default class DeleteAnnexesTicketUseCase {

    private repository: AnnexesTicketRepository;

    constructor(repository: AnnexesTicketRepository) {
        this.repository = repository
    }

    invoke(idAnnexe: string): Promise<AxiosResponse<DeleteAnnexeTicketResponse>> {
        return this.repository.deleteAnnexe(idAnnexe)
    }

}