import axios, { AxiosError } from "axios";
import { AnnexesEntity, AnnexesServiceRequest } from "../../../../../domain/AnnexesService/models/AnnexesService.model";
import AddAnnexeServiceUseCase from "../../../../../domain/AnnexesService/useCase/AddAnnexeServiceUseCase";
import DeleteAnnexesServiceUseCase from "../../../../../domain/AnnexesService/useCase/DeleteAnnexesServiceUseCase";
import GetAnnexesServiceUseCase from "../../../../../domain/AnnexesService/useCase/GetAnnexesServiceUseCase";
import { Bloc } from "../../../../shared/bloc";
import { AnnexesData, initStateAnnexes, ServiceItemKindAnnexes, ServiceItemKindAnnexesState } from "./AnnexesServiceState";

export class AnnexesServiceBloc extends Bloc<ServiceItemKindAnnexesState> {

    constructor(
        private getAnnexes: GetAnnexesServiceUseCase,
        private addAnnexeServiceUseCase: AddAnnexeServiceUseCase,
        private deleteAnnexe: DeleteAnnexesServiceUseCase,
    ) {
        super(initStateAnnexes)
    }

    async getAllAnnexes(request: AnnexesServiceRequest) {
        try {
            this.changeState({
                ...this.state,
                kind: ServiceItemKindAnnexes.LoadingAnnexesOfServiceState
            })
            const { data } = await this.getAnnexes.invoke(request);
            const response = data.data;
            const items = this.getItems(response.data);
            this.changeState({
                ...this.state,
                kind: ServiceItemKindAnnexes.LoadedAnnexesOfServiceState,
                data: items,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: 'Error generico',
                });
            }
        }
    }

    async saveAnnexe(
        serviceId: number,
        account: string,
        name: string,
        fileName: string,
        url: string,
        file_size: number,
    ) {
        try {
            this.changeState({
                ...this.state,
                kind: ServiceItemKindAnnexes.LoadingAnnexesOfServiceState
            })
            const { data, config } = await this.addAnnexeServiceUseCase.invoke({
                es_service_main_id: `${serviceId}`,
                name: name,
                file_name: fileName,
                url: url,
                file_size: file_size,
                is_account_main_id: account
            });
            const response = data.data;
            if (response.created > 0) {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.AddAnnexeOfServiceState,
                })
            } else {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: data.message
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: 'Error generico',
                });
            }
        }
    }

    async delete(idAnnexe: string) {
        try {
            this.changeState({
                ...this.state,
                kind: ServiceItemKindAnnexes.LoadingAnnexesOfServiceState
            })
            const { data, config } = await this.deleteAnnexe.invoke(idAnnexe);
            const response = data.data;
            if (response.deleted != 404) {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.DeleteAnnexesOfServiceState,
                    data: this.state.data.filter((item) => item.id !== idAnnexe)
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: response.message
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKindAnnexes.ErrorAnnexesOfServiceState,
                    error: 'Error generico',
                });
            }
        }
    }

    async setEmpty() {
        this.changeState({
            ...this.state,
            kind: ServiceItemKindAnnexes.Empty
        })
    }

    private getItems(elements: AnnexesEntity[]): AnnexesData[] {
        return elements.map((item) => {
            return {
                id: item.id,
                name: item.name,
                url: item.url
            }
        })
    }
}