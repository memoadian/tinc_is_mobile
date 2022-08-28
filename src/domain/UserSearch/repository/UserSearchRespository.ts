import { AxiosResponse } from "axios";
import { UserSearchResponse } from "../models/UserSearch.model";

export default interface UserSearchRepository {
    getUsers(perpage: number, accountMainId: number): Promise<AxiosResponse<UserSearchResponse>>
}