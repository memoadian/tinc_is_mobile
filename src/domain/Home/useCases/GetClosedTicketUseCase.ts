import { AxiosResponse } from "axios";
import { NumberTicketRequest, TicketResponse } from "../models/Home.model";
import HomeRepository from "../repository/Home.repository";

export default class GetClosedTicketUseCase {

    private homeRepository: HomeRepository;

    constructor(homeRepository: HomeRepository) {
        this.homeRepository = homeRepository;
    }

    invoke(request: NumberTicketRequest): Promise<AxiosResponse<TicketResponse>> {
        return this.homeRepository.getClosedTicket(request)
    }

}