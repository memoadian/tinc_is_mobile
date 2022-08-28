import { AxiosResponse } from "axios";
import { NumberServiceRequest, ServiceResponse } from "../models/Home.model";
import HomeRepository from "../repository/Home.repository";

export default class GetScheduleServiceUseCase {

    private homeRepository: HomeRepository;

    constructor(homeRepository: HomeRepository) {
        this.homeRepository = homeRepository;
    }

    invoke(request: NumberServiceRequest): Promise<AxiosResponse<ServiceResponse>> {
        return this.homeRepository.getScheduleService(request)
    }

}