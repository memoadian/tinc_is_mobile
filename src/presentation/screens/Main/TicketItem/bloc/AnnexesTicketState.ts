export interface AnnexesTicketData {
    id: string;
    name: string;
    url: string;
}

export interface TicketItemKindAnnexesState {
    kind: TicketItemKindAnnexes,
    data: AnnexesTicketData[];
    file: string;
    nameFile: string;
    error: string;
}

export enum TicketItemKindAnnexes {
    LoadingAnnexesOfTicketState = 'LoadingAnnexesOfTicketState',
    LoadedAnnexesOfTicketState = 'LoadedAnnexesOfTicketState',
    ErrorAnnexesOfTicketState = 'ErrorAnnexesOfTicketState',
    DeletedAnnexesOfTicketState = 'DeletedAnnexesOfTicketState',
    AddAnnexeOfServiceState = 'AddAnnexeOfServiceState',
    Empty = ''
}

export const initStateAnnexes: TicketItemKindAnnexesState = {
    kind: TicketItemKindAnnexes.Empty,
    data: [],
    file: '',
    nameFile: '',
    error: ''
}