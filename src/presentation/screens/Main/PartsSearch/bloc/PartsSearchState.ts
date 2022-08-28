export interface PartItem {
    id: string;
    name: string;
    numPart: string;
    brand: string;
    type: string;
    stock: number;
    image: string;
    isSelected: boolean;
    classPart: string;
    material: PartMaterialItem[];
    unitPrice: string;
    lot:string;
}

export interface PartMaterialItem {
    currency: string;
    id: string;
    serial: string;
    dueDate?: string;
    isSelected: boolean;
    supplierId: string;
    accountPartId: string;
    lot:string
}

export interface PartsSearchState {
    kind: PartsSearchKinds,
    allData: PartItem[];
    filterData: PartItem[];
    orderAsc: boolean;
    textFilter: string;
    error: string;
}

export enum PartsSearchKinds {
    LoadingPartsSearchState = 'LoadingPartsSearchState',
    LoadedPartsSearchState = 'LoadedPartsSearchState',
    ErrorPartsSearchState = 'ErrorPartsSearchState',
}


export const initStatePartsSearch: PartsSearchState = {
    kind: PartsSearchKinds.LoadingPartsSearchState,
    allData: [],
    filterData: [],
    orderAsc: true,
    textFilter: '',
    error: ''
}