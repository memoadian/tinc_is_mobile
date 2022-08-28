import { AxiosResponse } from "axios";
import {
    AddAnnexeTicketRequest,
    AddAnnexeTicketResponse,
    AnnexesTicketRequest,
    AnnexesTicketResponse,
    DeleteAnnexeTicketResponse
} from "../models/AnnexesTicket.model";

export default interface AnnexesTicketRepository {
    getAnnexes(request: AnnexesTicketRequest): Promise<AxiosResponse<AnnexesTicketResponse>>;
    deleteAnnexe(idAnnexe: string): Promise<AxiosResponse<DeleteAnnexeTicketResponse>>;
    addAnnexe(request: AddAnnexeTicketRequest): Promise<AxiosResponse<AddAnnexeTicketResponse>>;
}