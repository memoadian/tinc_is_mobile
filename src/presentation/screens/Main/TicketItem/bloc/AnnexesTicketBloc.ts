import axios, { AxiosError } from "axios";
import { AnnexesEntity, AnnexesTicketRequest } from "../../../../../domain/AnnexesTicket/models/AnnexesTicket.model";
import AddAnnexeTicketUseCase from "../../../../../domain/AnnexesTicket/useCase/AddAnnexeServiceUseCase";
import DeleteAnnexesTicketUseCase from "../../../../../domain/AnnexesTicket/useCase/DeleteAnnexesTicketUseCase";
import GetAnnexesTicketUseCase from "../../../../../domain/AnnexesTicket/useCase/GetAnnexesTicketUseCase";
import { Bloc } from "../../../../shared/bloc";
import { AnnexesTicketData, initStateAnnexes, TicketItemKindAnnexes, TicketItemKindAnnexesState } from "./AnnexesTicketState";

export class AnnexesTicketBloc extends Bloc<TicketItemKindAnnexesState> {

    constructor(
        private getAnnexes: GetAnnexesTicketUseCase,
        private deleteAnnexe: DeleteAnnexesTicketUseCase,
        private addAnnexe: AddAnnexeTicketUseCase,
    ) {
        super(initStateAnnexes)
    }

    async getAllAnnexes(request: AnnexesTicketRequest) {
        try {
            this.changeState({
                ...this.state,
                kind: TicketItemKindAnnexes.LoadingAnnexesOfTicketState
            })
            const { data, config } = await this.getAnnexes.invoke(request);
            const response = data.data;
            const items = this.getItems(response.data);
            this.changeState({
                ...this.state,
                kind: TicketItemKindAnnexes.LoadedAnnexesOfTicketState,
                data: items,
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: 'Error generico',
                });
            }
        }
    }

    async saveAnnexe(
        idTicket: string,
        account: string,
        name: string,
        fileName: string,
        url: string,
        file_size: number,
    ) {
        try {
            this.changeState({
                ...this.state,
                kind: TicketItemKindAnnexes.LoadingAnnexesOfTicketState
            })
            const { data, config } = await this.addAnnexe.invoke({
                es_ticket_main_id: idTicket,
                name: name,
                file_name: fileName,
                file_url: url,
                file_size: file_size,
                is_account_main_id: account
            });
            const response = data.data;
            if (response.created > 0) {
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.AddAnnexeOfServiceState,
                })
            } else {
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: data.message
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: 'Error generico',
                });
            }
        }
    }

    async delete(idAnnexe: string) {
        try {
            this.changeState({
                ...this.state,
                kind: TicketItemKindAnnexes.LoadingAnnexesOfTicketState
            })
            const { data } = await this.deleteAnnexe.invoke(idAnnexe);
            const response = data.data;
            if (response.deleted > 0) {
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.DeletedAnnexesOfTicketState,
                    data: this.state.data.filter((item) => item.id !== idAnnexe)
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: response.message
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: TicketItemKindAnnexes.ErrorAnnexesOfTicketState,
                    error: 'Error generico',
                });
            }
        }
    }

    async setEmpty() {
        this.changeState({
            ...this.state,
            kind: TicketItemKindAnnexes.Empty
        })
    }

    private getItems(elements: AnnexesEntity[]): AnnexesTicketData[] {
        return elements.map((item) => {
            return {
                id: item.id,
                name: item.name,
                url: item.file_url
            }
        })
    }
}