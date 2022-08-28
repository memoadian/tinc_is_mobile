import axios, { AxiosError, AxiosResponse } from "axios";
import { Bloc } from "../../../../shared/bloc";
import { ActiveEntiy } from "../../../../../domain/ActiveSearch/models/ActiveSearch.model";
import { ActiveItem } from "../../ActiveSearch/bloc/ActiveSearchState";
import GetActiveDetailUseCase from "../../../../../domain/FormOrderService/useCase/GetActiveDetailUseCase";
import { CreateTicketRequest } from "../../../../../domain/FormAddTicket/models/FormTicket.models";
import { FormTicketState, initStateFormTicketState } from "./FormTicketStates";
import SaveTicketUseCase from "../../../../../domain/FormAddTicket/useCase/SaveTicketUseCase";

export class FormTicketBloc extends Bloc<FormTicketState> {

    constructor(
        private saveTicketUseCase: SaveTicketUseCase,
        private getActiveDetailUseCase: GetActiveDetailUseCase
    ) {
        super(initStateFormTicketState)
    }

    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async saveTicket(request: CreateTicketRequest) {
        this.changeState({
            kind: 'LoadingCreatedTicketState'
        })
        await this.sleep(500);
        try {
            const data = await this.saveTicketUseCase.invoke(request);
            const response = data.data;
            if (response.data.created > 0) {
                this.changeState({
                    kind: 'CreatedTicketState',
                    data: response.data
                })
            } else {
                this.changeState({
                    kind: 'ErrorCreatedTicketState',
                    error: response.data.message
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    kind: 'ErrorCreatedTicketState',
                    error: data?.message ?? "Error",
                })
            } else {
                this.changeState({
                    kind: 'ErrorCreatedTicketState',
                    error: 'Error generico',
                });
            }
        }
    }

    async getActiveDetail(idActive: string) {
        this.changeState({
            kind: 'LoadingCreatedTicketState'
        })
        await this.sleep(500);
        try {
            const data = await this.getActiveDetailUseCase.invoke(idActive);
            const response = data.data           
            this.changeState({
                kind: 'GetActiveState',
                data: this.toActiveItem(response.data[0])
            }) 
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    kind: 'ErrorCreatedTicketState',
                    error: data?.message ?? "Error",
                })
            } else {
                this.changeState({
                    kind: 'ErrorCreatedTicketState',
                    error: (error as AxiosError).message,
                });
            }
        }
    }

    emptyState() {
        this.changeState({
            kind: 'EmptyCreatedTicketState'
        })
    }

    private toActiveItem(item: ActiveEntiy): ActiveItem {
        return {
            id: item.id,
            idTinc: item.id_tinc,
            model: item.model,
            asset_brand_name: item.asset_brand_name,
            serialNumber: item.serial_number,
            assetCategoryName: item.asset_category_name,
            locationName: item.location_name,
            sublocationName: item.sublocation_name,
            image: item.asset_picture ?? '',
            isSelected: false,
            asset_type_name: item.asset_type_name,
            is_account_location_id: item.is_account_location_id,
            is_account_main_id: item.is_account_main_id,
            is_asset_status_cat_id: item.is_asset_status_cat_id,
        }
    }
}