import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { UserSearchResponse } from "../../domain/UserSearch/models/UserSearch.model";
import UserSearchRepository from "../../domain/UserSearch/repository/UserSearchRespository";

export default class UserSearchRemoteDataSource implements UserSearchRepository {
    getUsers(perpage: number, accountMainId: number): Promise<AxiosResponse<UserSearchResponse, any>> {
        return ApiService.
            get<UserSearchResponse>(`/corporateuserengineer?perpage=${perpage}&is_account_main_id=${accountMainId}`)
    }
}