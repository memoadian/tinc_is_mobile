import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { DetailServiceRequest, PartsServiceResponse, ServiceResponse } from "../../domain/ServiceItem/models/Service.model";
import ServiceRepository from "../../domain/ServiceItem/repository/ServiceRepository";
import {
    PartmaterialAsignedService,
    PartmaterialToService,
    PartToService
} from '../../presentation/screens/Main/ServiceItem/ServiceItemState';

export default class ServiceRemoteDataSource implements ServiceRepository {
    updateService(idService: string, detailServiceRequest: DetailServiceRequest): Promise<AxiosResponse<ServiceResponse, any>> {
        return ApiService.put(`/service/${idService}`, detailServiceRequest)
    }

    getService(idService: string): Promise<AxiosResponse<ServiceResponse, any>> {
        return ApiService.get(`/service/${idService}`);
    }

    getParts(idService: string): Promise<AxiosResponse<PartsServiceResponse, any>> {
        return ApiService.get(`/Serviceaccountpart?like=es_service_main_id&match=${idService}&perpage=50&es_service_main_id=${idService}`);
    }
    
    deletePArt(idPart: string): Promise<AxiosResponse<PartsServiceResponse, any>> {
        return ApiService.delete(`Serviceaccountpart/${idPart}`);        
    }

    getServiceAccountPartById(idPart: string): Promise<AxiosResponse<PartsServiceResponse, any>> {
        return ApiService.get(`Serviceaccountpart/${idPart}`);
    }
    
    getPartMaterial(idPart: string): Promise<AxiosResponse<PartsServiceResponse, any>> {
        return ApiService.get(`partmaterial/${idPart}`);
    }
    setPartOfService(part: PartToService): Promise<AxiosResponse<PartsServiceResponse>> {
        return ApiService.post('/partmaterial', part)
    }

    setPartMaterialOfService(idPart: number, request: PartmaterialAsignedService): Promise<AxiosResponse<PartsServiceResponse>> {
        return ApiService.put(`/partmaterial/${idPart}`, request);
    }

    setPartMaterial(idPart: string, request: PartToService,type: string): Promise<AxiosResponse<PartsServiceResponse>> {
        if(type ==="update")
            return ApiService.put(`/partmaterial/${idPart}`, request);
        else
            return ApiService.post(`/partmaterial/${idPart}`, request);
    }

    setServiceAccountPart(request: PartmaterialToService): Promise<AxiosResponse<PartsServiceResponse>> {
        return ApiService.post('Serviceaccountpart', request);
    }
    
    
}
