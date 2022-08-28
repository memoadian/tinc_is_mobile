import { AxiosResponse } from "axios";
import { CreatedOrderServiceResponse, CreateOrdenServiceRequest } from "../model/FormOrderService.model";
import FormOrderServiceRepository from "../repository/FormOrderServiceRepository";

export default class SavedOrderServiceUseCase {

    private orderServiceRepository: FormOrderServiceRepository;

    constructor(orderServiceRepository: FormOrderServiceRepository) {
        this.orderServiceRepository = orderServiceRepository
    }

    invoke(request: CreateOrdenServiceRequest): Promise<AxiosResponse<CreatedOrderServiceResponse>> {
        return this.orderServiceRepository.postOrderService(request)
    }

}