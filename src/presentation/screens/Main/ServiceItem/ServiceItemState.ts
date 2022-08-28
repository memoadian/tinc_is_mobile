import { ServiceData } from "../../../../domain/ListService/models/Service.model";
import { PartData } from "../../../../domain/ServiceItem/models/Service.model";
import { ActiveItem } from "../ActiveSearch/bloc/ActiveSearchState";
export interface ServiceItemState {
    kind: ServiceItemKinds,
    kindParts: ServiceItemKindParts,
    kindAsset: ServiceAssetKinds,
    kindServiceTabs: ServiceTabsKinds,
    data: ServiceData[],
    assetData:ActiveItem | undefined,
    parts: PartData,
    error: string
}

export interface PartToService {
    is_account_part_id: string;
    is_account_main_id: string;
    es_supplier_main_id?: string;
    gc_currency_cat_id: string;
    lot: string;
    unit_price: string;
    quantity: number;
    serial_number: string;
    arrival_date: string;
    expiration_date: string | undefined;
    is_part_movement_type_cat: number;
    es_service_main_id: string;
    related_with_movement_id: string | undefined;
    related_with_to_null?: string | undefined;
}

export interface PartmaterialAsignedService {
    related_with_movement_id: string;
    es_service_main_id: string;
    is_account_main_id:string
}

export interface PartmaterialToService {
    es_service_main_id: string;
    is_account_part_id: string;
    unit_price: string;
    is_part_material_id: string;
    quantity: number;
}

export enum ServiceItemKinds {
    LoadingProviderServiceItemState = 'LoadingProviderServiceItemState',
    LoadedProviderServiceItemState = 'LoadedProviderServiceItemState',
    ErrorProviderServiceItemState = 'ErrorProviderServiceItemState'
}

export enum ServiceAssetKinds {
    LoadingProviderServiceAssetState = 'LoadingProviderServiceAssetState',
    LoadedProviderServiceAssetState = 'LoadedProviderServiceAssetState',
    ErrorProviderServiceAssetState = 'ErrorProviderServiceAssetState',
    Empty = ''
}

export enum ServiceTabsKinds{
    LoadingUpdateSignatureViewState = 'LoadingUpdateSignatureViewState',
    LoadingUpdateDetailViewState = 'LoadingUpdateDetailViewState', 
    LoadingUpdateExpensesViewState = 'LoadingUpdateExpensesViewState',
    Empty = ''
    
}

export enum ServiceItemKindParts {
    LoadingPartsOfServiceState = 'LoadingPartsOfServiceState',
    LoadedPartsOfServiceState = 'LoadedPartsOfServiceState',
    ErrorPartsOfServiceState = 'ErrorPartsOfServiceState',
    DeletePartOfServiceState = 'DeletePartOfServiceState',
    SavePartOfServiceState = 'SavePartOfServiceState',
    Empty = ''
}

export const initStateServiceItem: ServiceItemState = {
    kind: ServiceItemKinds.LoadingProviderServiceItemState,
    kindParts: ServiceItemKindParts.Empty,
    data: [],
    error: '',
    parts: {
        data: [],
        page: 0,
        per_page: 0,
        total_pages: -1,
        total_rows: -1
    },
    kindAsset: ServiceAssetKinds.Empty,
    assetData: undefined,
    kindServiceTabs: ServiceTabsKinds.Empty
}
