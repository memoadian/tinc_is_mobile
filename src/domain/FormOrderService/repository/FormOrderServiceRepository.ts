import { AxiosResponse } from "axios";
import { ActiveDetailResponse } from "../../ActiveSearch/models/ActiveSearch.model";
import { CreatedOrderServiceResponse, CreateOrdenServiceRequest } from "../model/FormOrderService.model";

export default interface FormOrderServiceRepository {
    postOrderService(request: CreateOrdenServiceRequest): Promise<AxiosResponse<CreatedOrderServiceResponse>>
    getActiveDetail(idActive: string): Promise<AxiosResponse<ActiveDetailResponse>>
}