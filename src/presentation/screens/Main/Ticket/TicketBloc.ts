import axios, { AxiosError } from "axios";
import { Bloc } from "../../../shared/bloc";
import { TicketRequest } from "../../../../domain/ListTickets/models/Ticket.model";
import DeleteTicketUseCase from "../../../../domain/ListTickets/useCases/DeleteTicketUseCase";
import GetTicketUseCase from "../../../../domain/ListTickets/useCases/GetTicketUseCase";
import { ticketsInitState, TicketState } from "./TicketState";

export class TicketBloc extends Bloc<TicketState> {

    constructor(
        private getTicketUseCase: GetTicketUseCase,
        private deleteTicketUseCase: DeleteTicketUseCase) {
        super(ticketsInitState)
    }

    async loadTickets(query?: TicketRequest | null, isMoreData: Boolean = false) {
        let safetyQuery: TicketRequest = {
            page: 1,
            perpage: 50,
            is_user_profile_id: null,
            is_account_main_id: null,
            mobile_searcher: null,
            request_date_auto: null,
            ticket_priority_multi: null,
            ticket_request_multi: null,
            ticket_status_name: null,
            is_account_location_id: null,
            orderby: 'create_at',
            ordertype: query?.ordertype ?? 'DESC',
            queryPath: null
        };
        let totalPages = this.state.info.totalPages;
        let currentPage = this.state.info.query.page;

        if (currentPage > totalPages && isMoreData) {
            return
        }
        if (isMoreData) {
            safetyQuery = {
                ...this.state.info.query,
                page: currentPage
            }
            this.changeState({
                kind: 'LoadingTicketsState',
                info: this.state.info
            });
        } else {
            if (query) {
                safetyQuery = {
                    ...query,
                    page: 1
                }
            }
            this.changeState(
                {
                    kind: 'LoadingTicketsState',
                    info: {
                        ...this.state.info,
                        totalRows: 0,
                        totalPages: 1,
                        tickets: []
                    }
                }
            )
        }

        try {
            if (isMoreData) {
                this.changeState({
                    kind: 'LoadingTicketsState',
                    info: this.state.info
                });
            } else {
                this.changeState(
                    {
                        kind: 'LoadingTicketsState',
                        info: {
                            ... this.state.info,
                            totalRows: 0,
                            totalPages: 1,
                            tickets: []
                        }
                    }
                )
            }
            const { data, config } = await this.getTicketUseCase.invoke(safetyQuery);
            const response = data.data
            this.changeState({
                kind: 'LoadedTicketsState',
                info: {
                    totalRows: response.total_rows,
                    totalPages: response.total_pages,
                    tickets: [...this.state.info.tickets, ...response.data],
                    query: {
                        ...safetyQuery,
                        page: response.page + 1
                    }
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'ErrorTicketState',
                    error: data?.message ?? "Error",
                    info: this.state.info
                });
            } else {
                this.changeState({
                    kind: 'ErrorTicketState',
                    error: 'Error generico',
                    info: this.state.info
                });
            }
        }
    }

    async deleteTicket(idTicket: string) {
        try {
            this.changeState({
                kind: 'DeleteTicketLoadingState',
                info: this.state.info
            })
            const { data } = await this.deleteTicketUseCase.invoke(idTicket);
            const response = data.data
            const tickets = (response.deleted > 0) ?
                this.state.info.tickets.filter(value => idTicket !== `${value.id}`) : this.state.info.tickets
            this.changeState({
                kind: 'DeleteTicketDeletedState',
                info: {
                    ...this.state.info,
                    tickets: tickets,
                    totalRows: (response.deleted > 0) ? this.state.info.totalRows - 1 : this.state.info.totalRows
                },
                delete: response
            });

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'DeleteTicketErrorState',
                    error: data?.message ?? "Error",
                    info: this.state.info
                });
            } else {
                this.changeState({
                    kind: 'DeleteTicketErrorState',
                    error: 'Error generico',
                    info: this.state.info
                });
            }
        }

    }

    async dontUpdate() {
        this.changeState({
            kind: 'SleepTicketsState',
            info: this.state.info
        })
    }

}