import { AxiosResponse } from "axios";
import { CreateTicketRequest, CreateTicketResponse } from "../models/FormTicket.models";
import FormTicketRepository from "../repository/FormTicketRepository";

export default class SaveTicketUseCase {

    private formTicketRepository: FormTicketRepository;

    constructor(formTicketRespository: FormTicketRepository) {
        this.formTicketRepository = formTicketRespository
    }

    invoke(request: CreateTicketRequest): Promise<AxiosResponse<CreateTicketResponse>> {
        return this.formTicketRepository.postTicketService(request)
    }

}