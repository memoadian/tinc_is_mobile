import { AxiosResponse } from "axios";
import { ProviderRequest, ProviderSearchResponse } from "../models/ProviderSearch.model";
import ProviderSearchRepository from "../repository/ProviderSearchRepository";

export default class GetProvidersUseCase {

    private providerSearchRepository: ProviderSearchRepository;

    constructor(providerSearchRepository: ProviderSearchRepository) {
        this.providerSearchRepository = providerSearchRepository;
    }

    invoke(request: ProviderRequest): Promise<AxiosResponse<ProviderSearchResponse>> {
        return this.providerSearchRepository.getProviders(request);
    }

}