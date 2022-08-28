import { AxiosResponse } from "axios";
import { PartsSearchRequest, PartsSearchResponse } from "../../domain/PartsSearch/models/Parts.model";
import { PartsMaterialRequest, PartsMaterialResponse } from "../../domain/PartsSearch/models/PartsMaterial.model";
import PartsSearchRepository from "../../domain/PartsSearch/repository/PartsSearchRepository";
import ApiService from "../../presentation/core/api/ApiService";

export default class PartsSearchRemoteDataSource implements PartsSearchRepository {
    getPartMaterial(request: PartsMaterialRequest): Promise<AxiosResponse<PartsMaterialResponse, any>> {
        return ApiService.get<PartsMaterialResponse>('/partmaterial', { params: { ...request } })
    }
    getPats(request: PartsSearchRequest): Promise<AxiosResponse<PartsSearchResponse, any>> {
        return ApiService.get<PartsSearchResponse>('/parts', { params: { ...request } })
    }
}