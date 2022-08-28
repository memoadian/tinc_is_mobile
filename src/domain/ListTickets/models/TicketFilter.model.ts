export enum StatusFilterTicketEnum {
    ALL = '',
    OPEN = 'Abierto',
    CLOSE = 'Cerrado',
}

export enum DateFilterTicketEnum {
    All = 0,
    Today = 1,
    Yesterday = 2,
    LastDays = 3,
    currentMonth = 4
}

export enum PriorityTicketFilterEnum {
    ALL = 0,
    UNDEFINED = 1,
    ONE = 2,
    TWO = 3,
    THREE = 4,
    FOUR = 5,
}

export enum TypeTicketFilterEnum {
    ALL = 0,
    PORDEFINIR = 1,
    FALLA = 2,
    ASESORIA = 3,
    INSTALACION = 4,
    OTRO = 5,
    REVISION = 6,
    TRASLADO = 7,
    SERVICIO = 8,
}

export interface PriorityFilterValue {
    values: number[];
}

export type PriorityTicket = PriorityTicketFilterEnum | PriorityFilterValue;

