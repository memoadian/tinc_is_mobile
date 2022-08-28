import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import AnnexesServiceRepository from "../../domain/AnnexesService/repository/AnnexesServiceRepository";
import { AddAnnexeServiceRequest, AddAnnexeServiceResponse, AnnexesServiceRequest, AnnexesServiceResponse, DeleteAnnexeServiceResponse } from "../../domain/AnnexesService/models/AnnexesService.model";

export default class AnnexesServiceRemoteDataSource implements AnnexesServiceRepository {

    getAnnexes(request: AnnexesServiceRequest): Promise<AxiosResponse<AnnexesServiceResponse, any>> {
        return ApiService.get<AnnexesServiceResponse>('/serviceattachment', { params: { ...request } })
    }

    deleteAnnexe(idAnnexe: string): Promise<AxiosResponse<DeleteAnnexeServiceResponse, any>> {
        return ApiService.delete<DeleteAnnexeServiceResponse>(`/serviceattachment/${idAnnexe}`)
    }

    addAnnexe(request: AddAnnexeServiceRequest): Promise<AxiosResponse<AddAnnexeServiceResponse, any>> {
        return ApiService.post<AddAnnexeServiceResponse>('/serviceattachment', request)
    }

}