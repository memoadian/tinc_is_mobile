import axios, {AxiosError} from 'axios';
import {Bloc} from '../../../shared/bloc';
import {UpdateServiceUseCase} from '../../../../domain/ServiceItem/useCases/UpdateServiceUseCase';
import {DetailServiceRequest, PartData} from '../../../../domain/ServiceItem/models/Service.model';
import GetPartsOfServiceUseCase from '../../../../domain/ServiceItem/useCases/GetPartsOfServiceUseCase';
import GetServiceUseCase from '../../../../domain/ServiceItem/useCases/GetServiceUseCase';

import DeletePartOfServiceUseCase from '../../../../domain/ServiceItem/useCases/DeletePartOfServiceUseCase';
import {
    initStateServiceItem, PartmaterialAsignedService, PartmaterialToService,
    PartToService,
    ServiceAssetKinds,
    ServiceItemKindParts,
    ServiceItemKinds,
    ServiceItemState,
    ServiceTabsKinds
} from './ServiceItemState';
import SetPartOfServiceUseCase from '../../../../domain/ServiceItem/useCases/SetPartOfServiceUseCase';
import GetActiveDetailUseCase from '../../../../domain/FormOrderService/useCase/GetActiveDetailUseCase';
import { ActiveEntiy } from '../../../../domain/ActiveSearch/models/ActiveSearch.model';
import { ActiveItem } from '../ActiveSearch/bloc/ActiveSearchState';
import SetPartmaterialOfService from "../../../../domain/ServiceItem/useCases/SetPartmaterialOfService";
import SetServiceAccountPartUseCase from "../../../../domain/ServiceItem/useCases/SetServiceAccountPartUseCase";
import { ToastModule } from '../../../shared/components/Toast';
import GetServiceAccountPartByIdUserCase from '../../../../domain/ServiceItem/useCases/GetServiceAccountPartByIdUserCase';
import GetPartMaterialUseCase from '../../../../domain/ServiceItem/useCases/GetPartsMaterialUseCaseById';
import SetPartmaterialUserCase from '../../../../domain/ServiceItem/useCases/SetPartmaterialUserCase';

export enum TabService{
    SignatureView,
    DetailView,
    Expenses,
}

export class ServiceItemBloc extends Bloc<ServiceItemState> {

    constructor(
        private getServiceItemUseCase: GetServiceUseCase,
        private updateServiceUseCase: UpdateServiceUseCase,
        private getPartsOfServiceUseCase: GetPartsOfServiceUseCase,
        private deletePartOfServiceUseCase: DeletePartOfServiceUseCase,
        private setPartOfServiceUseCase: SetPartOfServiceUseCase,
        private setPartMaterialOfServiceUseCase: SetPartmaterialOfService,
        private setServiceAccountPartUseCase: SetServiceAccountPartUseCase,
        private getActiveDetailUseCase: GetActiveDetailUseCase,
        private getServiceAccountPartByIdUserCase: GetServiceAccountPartByIdUserCase,
        private getPartMaterialUseCase: GetPartMaterialUseCase,
        private setPartmaterialUserCase: SetPartmaterialUserCase
    ) {
        super(initStateServiceItem)
    }

    async updateService(idService: string, detailServiceRequest: DetailServiceRequest) {
        try {
            this.changeState({
                ...this.state,
                kind: ServiceItemKinds.LoadingProviderServiceItemState
            });
            const { data } = await this.updateServiceUseCase.invoke(idService, detailServiceRequest);
            const response = data.data;
            ToastModule.show("success","Los datos se han actualizado correctamente")
            await this.getService(idService);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                console.error("Error: " + data)
            }
        }
        
    }

    async updateServiceR(
        idService: string, 
        detailServiceRequest: DetailServiceRequest,
        tabService: TabService
    ){
        try {
            this.changeState({
                ...this.state,
                kindServiceTabs: this.getInitAction(tabService)
            });
            const { data } = await this.updateServiceUseCase.invoke(idService, detailServiceRequest);
            ToastModule.show("success","Los datos se han actualizado correctamente")
            this.changeState({
                ...this.state,
                kindServiceTabs: ServiceTabsKinds.Empty,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                console.error("Error: " + data)
            }

        }
    }

    private getInitAction(tabService: TabService): ServiceTabsKinds{
        switch(tabService){
            case TabService.SignatureView:  
                return ServiceTabsKinds.LoadingUpdateSignatureViewState
            case TabService.DetailView:  
                return ServiceTabsKinds.LoadingUpdateDetailViewState
            case TabService.Expenses:
                return ServiceTabsKinds.LoadingUpdateExpensesViewState
        }
    }

    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async getActiveDetail(idActive: string) {
        this.changeState({
            ...this.state,
            kindAsset: ServiceAssetKinds.LoadingProviderServiceAssetState
        })
        await this.sleep(500);
        try {
            const data = await this.getActiveDetailUseCase.invoke(idActive);
            const response = data.data
                this.changeState({
                    ...this.state,
                    kindAsset: ServiceAssetKinds.LoadedProviderServiceAssetState,
                    assetData: this.toActiveItem(response.data[0])
                })

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    ...this.state,
                    kindAsset: ServiceAssetKinds.ErrorProviderServiceAssetState,
                    error: data?.message ?? "Error",
                })
            } else {
                this.changeState({
                    ...this.state,
                    kindAsset: ServiceAssetKinds.ErrorProviderServiceAssetState,
                    error: (error as AxiosError).message,
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

    async getService(idService: string) {
        try {
            this.changeState({
                ...this.state,
                kind: ServiceItemKinds.LoadingProviderServiceItemState
            });
            const { data } = await this.getServiceItemUseCase.invoke(idService);
            const response = data.data;
            this.changeState({
                ...this.state,
                kind: ServiceItemKinds.LoadedProviderServiceItemState,
                data: response
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKinds.ErrorProviderServiceItemState,
                    error: data?.message ?? 'Error'
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: ServiceItemKinds.ErrorProviderServiceItemState,
                    error: 'Error generico'
                });
            }
        }
    }

    async getPartsOfService(idService: string) {
        try {
            this.changeState({
                ...this.state,
                kindParts: ServiceItemKindParts.LoadingPartsOfServiceState
            });
            const { data } = await this.getPartsOfServiceUseCase.invoke(idService);
            const response = data.data;
            this.changeState({
                ...this.state,
                kindParts: ServiceItemKindParts.LoadedPartsOfServiceState,
                parts: response as PartData
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    ...this.state,
                    kindParts: ServiceItemKindParts.ErrorPartsOfServiceState,
                    error: data?.message ?? 'Error'
                });
            } else {
                this.changeState({
                    ...this.state,
                    kindParts: ServiceItemKindParts.ErrorPartsOfServiceState,
                    error: 'Error generico'
                });
            }
        }
    }

    async deletePartOfService(idPart: string, idService: string) {
        try {
            this.changeState({
                ...this.state,
                kindParts: ServiceItemKindParts.DeletePartOfServiceState
            });
            const  dataServiceAccount  = await this.getServiceAccountPartByIdUserCase.invoke(idPart);
            let serviceAccount = dataServiceAccount.data.data[0];
           
            const dataPartMaterial  = await this.getPartMaterialUseCase.invoke(serviceAccount.part_material_id);
            let partMaterial = dataPartMaterial.data.data[0];
           
            let partMaterialPut: PartToService = {
                is_account_part_id: partMaterial.is_account_part_id,
                es_supplier_main_id: partMaterial.es_supplier_main_id,
                gc_currency_cat_id: partMaterial.gc_currency_cat_id,
                unit_price: partMaterial.unit_price,
                quantity:1,
                serial_number: partMaterial.serial_number, 
                lot: partMaterial.lot,
                arrival_date: partMaterial.arrival_date,
                expiration_date: partMaterial.expiration_date,
                is_part_movement_type_cat: 5,
                is_account_main_id: partMaterial.is_account_main_id
            };
            const  dataPutPartMaterial  = await this.setPartmaterialUserCase.invoke(idPart,partMaterialPut,"create");

            if(dataPartMaterial.data.status == 200)
            {
                const deletePart = await this.deletePartOfServiceUseCase.invoke(idPart)
                let partMaterialPut2: PartToService = {
                    related_with_to_null:"NULL"
                };
                const updatepart = await this.setPartmaterialUserCase.invoke(serviceAccount.part_material_id,partMaterialPut2,"update")                
                ToastModule.show("success","Parte eliminada correctamente")
                await this.getPartsOfService(idService);
            }
            
            await this.getPartsOfService(idService);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    ...this.state,
                    kindParts: ServiceItemKindParts.ErrorPartsOfServiceState,
                    error: data?.message ?? 'Error'
                });
            } else {
                this.changeState({
                    ...this.state,
                    kindParts: ServiceItemKindParts.ErrorPartsOfServiceState,
                    error: 'Error generico'
                });
            }
        }
    }
    
    async setPartOfService(part: PartToService[], partMaterial: PartmaterialToService[], idService: string) { 
        for (let index = 0; index < partMaterial.length; index++) {
          
            await this.sleep(50)

            try {
                this.changeState({
                    ...this.state,
                    kindParts: ServiceItemKindParts.SavePartOfServiceState
                });
                
                const res = await this.setPartOfServiceUseCase.invoke(part[index]);
                const newReq: PartmaterialAsignedService = {
                    related_with_movement_id: res.data.data.created,
                    es_service_main_id: idService,
                    is_account_main_id: part[index].is_account_main_id
                };
                const  dataPutPartMaterial  = await this.setPartMaterialOfServiceUseCase.invoke(+part[index].related_with_movement_id,newReq);
                const  dataServiceaccountpart  = await this.setServiceAccountPartUseCase.invoke(partMaterial[index]);
                
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const err = error as AxiosError;
                    const data = err.response?.data;
                    this.changeState({
                        ...this.state,
                        kindParts: ServiceItemKindParts.ErrorPartsOfServiceState,
                        error: data?.message ?? 'Error'
                    });
                }else {
                    this.changeState({
                        ...this.state,
                        kindParts: ServiceItemKindParts.ErrorPartsOfServiceState,
                        error: 'Error generico'
                    });
                }
            } 
        }   
        await this.getPartsOfService(idService)          
    }
}
