import { AxiosResponse } from "axios";
import { ProviderRequest, ProviderSearchResponse } from "../models/ProviderSearch.model";

export default interface ProviderSearchRepository {
    getProviders(request: ProviderRequest): Promise<AxiosResponse<ProviderSearchResponse>>
}