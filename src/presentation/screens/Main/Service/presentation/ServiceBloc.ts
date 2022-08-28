import axios, {AxiosError} from "axios";
import {Bloc} from "../../../../shared/bloc";
import {ServiceRequest} from "../../../../../domain/ListService/models/Service.model";
import DeleteServiceUseCase from "../../../../../domain/ListService/useCases/DeleteServiceUseCase";
import GetServiceUseCase from "../../../../../domain/ListService/useCases/GetServiceUseCase";
import {servicesInitState, ServiceState} from "./ServiceState";

export class ServiceBloc extends Bloc<ServiceState> {

    constructor(
        private getServiceUseCase: GetServiceUseCase,
        private deleteServiceUseCase: DeleteServiceUseCase) {
        super(servicesInitState)
    }

    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async loadServices(query?: ServiceRequest | null, isMoreData: Boolean = false) {
        let safetyQuery: ServiceRequest = {
            page: 1,
            perpage: 50,
            is_user_profile_id: null,
            is_account_main_id: null,
            mobile_searcher: null,
            scheduled_date_auto: null,
            service_priority_multi: null,
            service_type_multi: null,
            service_status_multi: null,
            asset_location_id: null,
            orderby: 'scheduled_date',
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
                kind: 'LoadingServicesState',
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
                    kind: 'LoadingServicesState',
                    info: {
                        ...this.state.info,
                        totalRows: 0,
                        totalPages: 1,
                        services: []
                    }
                }
            )
        }
        await this.sleep(500);
        try {
            const {data, config} = await this.getServiceUseCase.invoke(safetyQuery);
            const response = data.data
            this.changeState({
                kind: 'LoadedServicesState',
                info: {
                    totalRows: response.total_rows,
                    totalPages: response.total_pages,
                    services: [...this.state.info.services, ...response.data],
                    query: {
                        ...safetyQuery,
                        page: response.page + 1,
                    }
                }
            });
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'ErrorServiceState',
                    error: data?.message ?? "Error",
                    info: this.state.info
                });
            } else {
                this.changeState({
                    kind: 'ErrorServiceState',
                    error: 'Error generico',
                    info: this.state.info
                });
            }
        }
    }

    async deleteService(idService: string) {
        try {
            this.changeState({
                kind: 'DeleteServiceLoadingState',
                info: this.state.info
            })
            const {data} = await this.deleteServiceUseCase.invoke(idService);
            const response = data.data
            const services = (response.deleted > 0) ?
                this.state.info.services.filter(value => idService !== `${value.id}`) : this.state.info.services
            this.changeState({
                kind: 'DeleteServiceDeletedState',
                info: {
                    ...this.state.info,
                    services: services,
                    totalRows: (response.deleted > 0) ? this.state.info.totalRows - 1 : this.state.info.totalRows
                },
                delete: response
            });

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'DeleteServiceErrorState',
                    error: data?.message ?? "Error",
                    info: this.state.info
                });
            } else {
                this.changeState({
                    kind: 'DeleteServiceErrorState',
                    error: 'Error generico',
                    info: this.state.info
                });
            }
        }
    }

    async dontUpdate() {
        this.changeState({
            kind: 'SleepServicesState',
            info: this.state.info
        })
    }

}