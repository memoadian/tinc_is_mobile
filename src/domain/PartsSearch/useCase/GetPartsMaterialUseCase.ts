import { AxiosResponse } from "axios";
import { PartsMaterialRequest, PartsMaterialResponse } from "../models/PartsMaterial.model";
import PartsSearchRepository from "../repository/PartsSearchRepository";

export default class GetPartMaterialUseCase {

    private partsSearchRepository: PartsSearchRepository;

    constructor(partsSearchRepository: PartsSearchRepository) {
        this.partsSearchRepository = partsSearchRepository;
    }

    invoke(request: PartsMaterialRequest): Promise<AxiosResponse<PartsMaterialResponse>> {
        return this.partsSearchRepository.getPartMaterial(request);
    }

}