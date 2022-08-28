import { AxiosResponse } from "axios";
import { PartsSearchRequest, PartsSearchResponse } from "../models/Parts.model";
import { PartsMaterialRequest, PartsMaterialResponse } from "../models/PartsMaterial.model";

export default interface PartsSearchRepository {
    getPats(request: PartsSearchRequest): Promise<AxiosResponse<PartsSearchResponse>>;
    getPartMaterial(request: PartsMaterialRequest): Promise<AxiosResponse<PartsMaterialResponse>>;
}