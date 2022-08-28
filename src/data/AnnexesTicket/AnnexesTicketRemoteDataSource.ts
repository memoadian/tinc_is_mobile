import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import AnnexesTicketRepository from "../../domain/AnnexesTicket/repository/AnnexesTicketRepository";
import { AddAnnexeTicketRequest, AddAnnexeTicketResponse, AnnexesTicketRequest, AnnexesTicketResponse, DeleteAnnexeTicketResponse } from "../../domain/AnnexesTicket/models/AnnexesTicket.model";

export default class AnnexesTicketRemoteDataSource implements AnnexesTicketRepository {

    getAnnexes(request: AnnexesTicketRequest): Promise<AxiosResponse<AnnexesTicketResponse, any>> {
        return ApiService.get<AnnexesTicketResponse>('/ticketattachment', { params: { ...request } })
    }

    deleteAnnexe(idAnnexe: string): Promise<AxiosResponse<DeleteAnnexeTicketResponse, any>> {
        return ApiService.delete<DeleteAnnexeTicketResponse>(`/ticketattachment/${idAnnexe}`)
    }

    addAnnexe(request: AddAnnexeTicketRequest): Promise<AxiosResponse<AddAnnexeTicketResponse, any>> {
        return ApiService.post<AddAnnexeTicketResponse>('/ticketattachment', request)
    }

}