export interface AnnexesData {
    id: string;
    name: string;
    url: string;
}

export interface ServiceItemKindAnnexesState {
    kind: ServiceItemKindAnnexes,
    data: AnnexesData[];
    file: string;
    nameFile: string;
    error: string;
}

export enum ServiceItemKindAnnexes {
    LoadingAnnexesOfServiceState = 'LoadingAnnexesOfServiceState',
    LoadedAnnexesOfServiceState = 'LoadedAnnexesOfServiceState',
    ErrorAnnexesOfServiceState = 'ErrorAnnexesOfServiceState',
    DeleteAnnexesOfServiceState = 'DeleteAnnexesOfServiceState',
    AddAnnexeOfServiceState = 'AddAnnexeOfServiceState',
    Empty = ''
}

export const initStateAnnexes: ServiceItemKindAnnexesState = {
    kind: ServiceItemKindAnnexes.Empty,
    data: [],
    file: '',
    nameFile: '',
    error: ''
}