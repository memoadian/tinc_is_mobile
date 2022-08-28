import { AxiosResponse } from "axios";
import {
    AddAnnexeServiceRequest,
    AddAnnexeServiceResponse,
    AnnexesServiceRequest,
    AnnexesServiceResponse,
    DeleteAnnexeServiceResponse
} from "../models/AnnexesService.model";

export default interface AnnexesServiceRepository {
    getAnnexes(request: AnnexesServiceRequest): Promise<AxiosResponse<AnnexesServiceResponse>>;
    deleteAnnexe(idAnnexe: string): Promise<AxiosResponse<DeleteAnnexeServiceResponse>>;
    addAnnexe(request: AddAnnexeServiceRequest): Promise<AxiosResponse<AddAnnexeServiceResponse>>;
}