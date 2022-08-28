export enum StatusFilterTicketEnum {
    ALL = '',
    OPEN = 'Abierto',
    CLOSE = 'Cerrado',
}

export enum StatusFilterServiceEnum {
    ALL = 0,
    PORDEFINIR = 1,
    PLANEADO = 2,
    PROCESO = 3,
    ESPERA = 4,
    CONCLUIDO = 5,
    CANCELADO = 6,
    DEFINIR = 1,
    PARTES = 8,
    PAGO = 9,
    
}

export enum DateFilterServiceEnum {
    All = 0,
    Today = 1,
    Tomorrow = 2,
    NextDays = 3,
    LastDays = 4,
    currentMonth = 5,
    Expired = 6
}

export enum PriorityServiceFilterEnum {
    ALL = 0,
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
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

export enum TypeServiceFilterEnum {
    ALL = 0,
    PORDEFINIR = 1,
    MANTENIMIENTO = 2,
    REPARACION = 3,
    INSTALACION = 4,
    ASESORIA = 5,
    REVISION = 6,
    LIMPIEZA = 7,
    APOYO = 8,
    PRESTAMO = 9,
    OTROS = 10,
    INCIDENTE = 11,
    CALIBRACION = 12,
   // ENTRADA = 13,
   // SALIDA = 14,
}

export interface PriorityFilterValue {
    values: number[];
}

export type PriorityService = PriorityServiceFilterEnum | PriorityFilterValue;

