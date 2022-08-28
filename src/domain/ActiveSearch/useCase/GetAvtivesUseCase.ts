import { AxiosResponse } from "axios";
import { ActiveRequest, ActiveSearchResponse } from "../models/ActiveSearch.model";
import ActiveSearchRepository from "../repository/ActiveSearchRepository";

export default class GetActiveUseCase {

    private activeSearchRepository: ActiveSearchRepository;

    constructor(activeSearchRepository: ActiveSearchRepository) {
        this.activeSearchRepository = activeSearchRepository;
    }

    invoke(request: ActiveRequest): Promise<AxiosResponse<ActiveSearchResponse>> {
        return this.activeSearchRepository.getActives(request)
    }

}