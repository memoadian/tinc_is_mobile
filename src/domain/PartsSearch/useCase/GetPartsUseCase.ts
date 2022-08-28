import { AxiosResponse } from "axios";
import { PartsSearchRequest, PartsSearchResponse } from "../models/Parts.model";
import PartsSearchRepository from "../repository/PartsSearchRepository";

export default class GetPartsUseCase {

    private partsSearchRepository: PartsSearchRepository;

    constructor(partsSearchRepository: PartsSearchRepository) {
        this.partsSearchRepository = partsSearchRepository;
    }

    invoke(request: PartsSearchRequest): Promise<AxiosResponse<PartsSearchResponse>> {
        return this.partsSearchRepository.getPats(request);
    }

}