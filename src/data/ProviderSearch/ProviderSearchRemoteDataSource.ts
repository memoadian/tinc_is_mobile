import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { ProviderRequest, ProviderSearchResponse } from "../../domain/ProviderSearch/models/ProviderSearch.model";
import ProviderSearchRepository from "../../domain/ProviderSearch/repository/ProviderSearchRepository";

export default class ProviderSearchRemoteDataSource implements ProviderSearchRepository {

    getProviders({ perPage, page, sortDirection, textQuery }: ProviderRequest): Promise<AxiosResponse<ProviderSearchResponse, any>> {
        return ApiService.get<ProviderSearchResponse>(`/supplier?perpage=${perPage}&ordertype=${sortDirection}&orderby=name&searcher=${textQuery}&page=${page}`);
    }

}