import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { ActiveDetailResponse } from "../../domain/ActiveSearch/models/ActiveSearch.model";
import { CreateOrdenServiceRequest, CreatedOrderServiceResponse } from "../../domain/FormOrderService/model/FormOrderService.model";
import FormOrderServiceRepository from "../../domain/FormOrderService/repository/FormOrderServiceRepository";

export default class OrderServiceRemoteDataSource implements FormOrderServiceRepository {

    getActiveDetail(idActive: string): Promise<AxiosResponse<ActiveDetailResponse, any>> {
        return ApiService.get<ActiveDetailResponse>(`/asset/${idActive}`);
    }

    postOrderService(request: CreateOrdenServiceRequest): Promise<AxiosResponse<CreatedOrderServiceResponse, any>> {
        return ApiService.post<CreatedOrderServiceResponse>('/service', request)
    }

}