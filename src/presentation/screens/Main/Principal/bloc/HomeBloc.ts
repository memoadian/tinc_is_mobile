import axios, {AxiosError} from "axios";
import GetClosedTicketUseCase from "../../../../../domain/Home/useCases/GetClosedTicketUseCase";
import GetCompleteServiceUseCase from "../../../../../domain/Home/useCases/GetCompleteServiceUseCase";
import GetCreatedTicketUseCase from "../../../../../domain/Home/useCases/GetCreatedTicketUseCase";
import GetDeadlineOverServiceUseCase from "../../../../../domain/Home/useCases/GetDeadlineOverServiceUseCase";
import GetOpenedTicketUseCase from "../../../../../domain/Home/useCases/GetOpenedTicketUseCase";
import GetScheduleServiceUseCase from "../../../../../domain/Home/useCases/GetScheduleServiceUsecase";
import {Bloc} from "../../../../shared/bloc";
import { addDays } from "../../../../shared/util/Date";
import {homeInitState, HomeState} from "./HomeState";

export class HomeBloc extends Bloc<HomeState> {

    constructor(
        private getScheduleServiceUseCase: GetScheduleServiceUseCase,
        private getCompleteServiceUseCase: GetCompleteServiceUseCase,
        private getDeadlineOverServiceUseCase: GetDeadlineOverServiceUseCase,
        private getCreatedTicketUseCase: GetCreatedTicketUseCase,
        private getClosedTicketUseCase: GetClosedTicketUseCase,
        private getOpenedTicketUseCase: GetOpenedTicketUseCase,
    ) {
        super(homeInitState);
    }

    async loadData(account: number, dateInit: string, dateEnd: string) {
        let today = addDays(new Date(),0);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        
        let currentDay = yyyy + '-' + mm + '-' + dd;
        
        this.changeState({
            kind: 'LoadingHomeState'
        })
        const completed = this.getCompleteServiceUseCase.invoke({
            dateInit: dateInit,
            dateEnd: dateEnd,
            statusServiceCat: 5,
            accountMain: account
        });
        const schedule = this.getScheduleServiceUseCase.invoke({
            dateInit: dateInit,
            dateEnd: dateEnd,
            statusServiceCat: 2,
            accountMain: account
        });
        const deadlineService = this.getDeadlineOverServiceUseCase.invoke({
            dateInit: dateInit,
            dateEnd: dateEnd,
            statusServiceCat: 5,
            accountMain: account
        });
        const createdTicket = this.getCreatedTicketUseCase.invoke({
            accountMain: account,
            dateInit: dateInit,
            dateEnd: dateEnd,
            statusTicket: "2"
        });
        const closedTicket = this.getClosedTicketUseCase.invoke({
            accountMain: account,
            dateInit: dateInit,
            dateEnd: dateEnd,
            statusTicket: "2"
        });
        const openedTicket = this.getOpenedTicketUseCase.invoke({
            accountMain: account,
            dateInit: dateInit,
            dateEnd: dateEnd,
            statusTicket: "1"
        })
        try {
            const response = await Promise.all([
                schedule,
                completed,
                deadlineService,
                createdTicket,
                closedTicket,
                openedTicket
            ])
            const servicesSchedule = response[0].data.data;
            const servicesCompleted = response[1].data.data;
            const deadlineServiceData = response[2].data.data;
            const createdTicketData = response[3].data.data;
            const closedTicketData = response[4].data.data;
            const openedTicketData = response[5].data.data;

            this.changeState({
                kind: 'LoadedHomeState',
                resume: [
                    {
                        title: 'Ordenes de Servicio',
                        data: [
                            {
                                subtitle: 'Servicios programados en el mes',
                                resume: `${servicesSchedule.total_rows} Servicios`,
                                enable: servicesSchedule.total_rows > 0,
                                query: `page=1&perpage=50&scheduled_date>=${dateInit}&scheduled_date<=${dateEnd}&es_service_status_cat_id=2&is_account_main_id=${account}`,
                                section: 'service'
                            },
                            {
                                subtitle: 'Servicios concluidos en el mes',
                                resume: `${servicesCompleted.total_rows} Servicios`,
                                enable: servicesCompleted.total_rows > 0,
                                query: `page=1&perpage=50&end_date>=${dateInit}&end_date<=${dateEnd}&is_account_main_id=${account}&service_status_multi="5"`,
                                section: 'service'
                            },
                            {
                                subtitle: 'Servicios vencidos',
                                resume: `${deadlineServiceData.total_rows} Servicios`,
                                enable: deadlineServiceData.total_rows > 0,
                                query: `page=1&perpage=50&scheduled_date>=${dateInit}&scheduled_date<=${currentDay}&is_account_main_id=${account}&service_status_multi=1,2,3,4,6,7,8,9&main_id=${account}`,
                                section: 'service'
                            },
                        ]
                    },
                    {
                        title: 'Tickets de Servicio',
                        data: [
                            {
                                subtitle: 'Tickets creados en el mes',
                                resume: `${createdTicketData.total_rows} Tickets`,
                                enable: createdTicketData.total_rows > 0,
                                query: `page=1&perpage=100&is_account_main_id=${account}&timezone_create_at>=${dateInit}&timezone_create_at<=${dateEnd}`,
                                section: 'ticket'
                            },
                            {
                                subtitle: 'Tickets cerrados en el mes',
                                resume: `${closedTicketData.total_rows} Tickets`,
                                enable: closedTicketData.total_rows > 0,
                                query: `page=1&perpage=100&is_account_main_id=${account}&attention_date>=${dateInit}&attention_date<=${dateEnd}&es_ticket_status_cat_id=2`,
                                section: 'ticket'
                            },
                            {
                                subtitle: 'Tickets abiertos',
                                resume: `${openedTicketData.total_rows} Tickets`,
                                enable: openedTicketData.total_rows > 0,
                                query: `page=1&perpage=100&is_account_main_id=${account}&es_ticket_status_cat_id=1&timezone_create_at>=${dateInit}&timezone_create_at<=${dateEnd}`,
                                section: 'ticket'
                            },
                        ]
                    },
                ]
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'ErrorHomeState',
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    kind: 'ErrorHomeState',
                    error: 'Error generico',
                });
            }
        }
    }

}