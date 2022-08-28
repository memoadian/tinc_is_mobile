import { AxiosResponse } from "axios";
import { UserSearchResponse } from "../models/UserSearch.model";
import UserSearchRepository from "../repository/UserSearchRespository";

export default class GetUserSearchUseCase {

    private userSearchRepository: UserSearchRepository;

    constructor(userSearchRepository: UserSearchRepository) {
        this.userSearchRepository = userSearchRepository;
    }

    invoke(perpage: number, accountMainId: number): Promise<AxiosResponse<UserSearchResponse>> {
        return this.userSearchRepository.getUsers(perpage, accountMainId);
    }

}