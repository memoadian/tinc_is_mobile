import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { ActiveRequest, ActiveSearchResponse } from "../../domain/ActiveSearch/models/ActiveSearch.model";
import ActiveSearchRepository from "../../domain/ActiveSearch/repository/ActiveSearchRepository";

export default class ActiveSearchRemoteDataSource implements ActiveSearchRepository {

    getActives({ perPage, sortDirection, page, accountMain, textQuery }: ActiveRequest): Promise<AxiosResponse<ActiveSearchResponse, any>> {
        return ApiService.get<ActiveSearchResponse>(`/asset?perpage=${perPage}&ordertype=${sortDirection}&pageIndex=${page}&orderby=asset_type_name&notlike=is_asset_status_cat_id&matchnot=8&is_account_main_id=${accountMain}&searcher=${textQuery}`);
    }

}