import axios, { AxiosError, AxiosResponse } from "axios";
import { ActiveEntiy } from "../../../../domain/ActiveSearch/models/ActiveSearch.model";
import { CreateOrdenServiceRequest } from "../../../../domain/FormOrderService/model/FormOrderService.model";
import GetActiveDetailUseCase from "../../../../domain/FormOrderService/useCase/GetActiveDetailUseCase";
import SavedOrderServiceUseCase from "../../../../domain/FormOrderService/useCase/SaveOrderServiceUseCase";
import { Bloc } from "../../../shared/bloc";
import { ActiveItem } from "../ActiveSearch/bloc/ActiveSearchState";
import { FormOrderServiceState, initStateFormOrderService } from "./FormOrderServiceState";
export class FormOrderServiceBloc extends Bloc<FormOrderServiceState> {
    constructor(
        private saveOrderServiceUseCase: SavedOrderServiceUseCase,
        private getActiveDetailUseCase: GetActiveDetailUseCase
    ) {
        super(initStateFormOrderService)
    }

    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async getActiveDetail(idActive: string) {
        this.changeState({
            kind: 'LoadingSavedOrderState'
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
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    kind: 'ErrorSavedOrderState',
                    error: data?.message ?? "Error",
                })
            } else {
                this.changeState({
                    kind: 'ErrorSavedOrderState',
                    error: (error as AxiosError).message,
                });
            }
        }
    }

    emptyState() {
        this.changeState({
            kind: 'EmptySavedOrderState'
        })
    }

    async saveOrderService(request: CreateOrdenServiceRequest) {
        this.changeState({
            kind: 'LoadingSavedOrderState'
        })
        await this.sleep(500);
        try {
            const data = await this.saveOrderServiceUseCase.invoke(request);
            const response = data.data;
            if (response.data.created > 0) {
                this.changeState({
                    kind: 'SavedOrderState',
                    data: response.data
                })
            } else {
                this.changeState({
                    kind: 'ErrorSavedOrderState',
                    error: response.data.message
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    kind: 'ErrorSavedOrderState',
                    error: data?.message ?? "Error",
                })
            } else {
                this.changeState({
                    kind: 'ErrorSavedOrderState',
                    error: 'Error generico',
                });
            }
        }
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

    private toEmptyItem(): ActiveItem {
        return {
            id: "",
            idTinc: "",
            model: "",
            asset_brand_name: "",
            serialNumber: "",
            assetCategoryName: "",
            locationName: "",
            sublocationName: "",
            image: "",
            isSelected: false,
            asset_type_name: "",
            is_account_location_id: "",
            is_account_main_id: "",
            is_asset_status_cat_id: 0,
        }
    }
}