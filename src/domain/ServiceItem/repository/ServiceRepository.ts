import { AxiosResponse } from "axios";
import {
    PartsServiceResponse,
    DetailServiceRequest,
    ServiceResponse
} from "../models/Service.model";
import {
    PartmaterialAsignedService,
    PartmaterialToService,
    PartToService
} from '../../../presentation/screens/Main/ServiceItem/ServiceItemState';


export default interface ServiceRepository {
    getService(idService: string): Promise<AxiosResponse<ServiceResponse>>;
    updateService(
        idService: string,
        detailServiceRequest: DetailServiceRequest
    ): Promise<AxiosResponse<ServiceResponse>>;
    getParts(idService: string): Promise<AxiosResponse<PartsServiceResponse>>;
    deletePArt(idPart: string): Promise<AxiosResponse<PartsServiceResponse>>;
    setPartOfService(part: PartToService): Promise<AxiosResponse<PartsServiceResponse>>;
    setPartMaterialOfService(idPart: number, request: PartmaterialAsignedService): Promise<AxiosResponse<PartsServiceResponse>>;
    setServiceAccountPart(request: PartmaterialToService): Promise<AxiosResponse<PartsServiceResponse>>;
    getServiceAccountPartById(idPart: string): Promise<AxiosResponse<PartsServiceResponse>>;
    getPartMaterial(idPart: string): Promise<AxiosResponse<PartsServiceResponse>>;
    setPartMaterial(idPart: string, request: PartToService,type: string): Promise<AxiosResponse<PartsServiceResponse>>;
    
    
}
