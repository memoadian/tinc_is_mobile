import { AxiosResponse } from "axios";
import { ActiveDetailResponse, ActiveRequest, ActiveSearchResponse } from "../models/ActiveSearch.model";


export default interface ActiveSearchRepository {
    getActives(request: ActiveRequest): Promise<AxiosResponse<ActiveSearchResponse>>
}