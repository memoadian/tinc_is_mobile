import { AxiosResponse } from "axios";
import { ActiveDetailResponse } from "../../ActiveSearch/models/ActiveSearch.model";
import FormOrderServiceRepository from "../repository/FormOrderServiceRepository";

export default class GetActiveDetailUseCase {

    private orderServiceRepository: FormOrderServiceRepository;

    constructor(orderServiceRepository: FormOrderServiceRepository) {
        this.orderServiceRepository = orderServiceRepository;
    }

    invoke(idActive: string): Promise<AxiosResponse<ActiveDetailResponse>> {
        return this.orderServiceRepository.getActiveDetail(idActive)
    }

}
