import { DateFilterTicketEnum, PriorityTicketFilterEnum, StatusFilterTicketEnum, TypeTicketFilterEnum } from "../../../../../domain/ListTickets/models/TicketFilter.model";

export interface DateTicketFilter {
    title: string;
    value: DateFilterTicketEnum;
}

export const datesTicketFilter: DateTicketFilter[] = [
    { title: 'Todo (predeterminado)', value: DateFilterTicketEnum.All },
    { title: 'Hoy', value: DateFilterTicketEnum.Today },
    { title: 'Ayer', value: DateFilterTicketEnum.Yesterday },
    { title: 'Últimos 7 días', value: DateFilterTicketEnum.LastDays },
    { title: 'Mes en curso', value: DateFilterTicketEnum.currentMonth },
];

export interface StatusTicketFilter {
    title: string;
    value: StatusFilterTicketEnum;
}

export const statesTicketFilter: StatusTicketFilter[] = [
    { title: 'Todo (predeterminado)', value: StatusFilterTicketEnum.ALL },
    { title: 'Abierto', value: StatusFilterTicketEnum.OPEN },
    { title: 'Cerrado', value: StatusFilterTicketEnum.CLOSE },
];

export interface PriorityTicketFilter {
    title: string;
    value: PriorityTicketFilterEnum;
}

export const priorityTicketFilter: PriorityTicketFilter[] = [
    { title: 'Todo (predeterminado)', value: PriorityTicketFilterEnum.ALL },
    { title: 'Por definir', value: PriorityTicketFilterEnum.UNDEFINED },
    { title: 'Prioridad 1: Atención Inmediata', value: PriorityTicketFilterEnum.ONE },
    { title: 'Prioridad 2: Atención durante el día', value: PriorityTicketFilterEnum.TWO },
    { title: 'Prioridad 3: Atención durante la semana', value: PriorityTicketFilterEnum.THREE },
    { title: 'Prioridad 4: Atención durante el mes', value: PriorityTicketFilterEnum.FOUR },
];

export interface TypeTicketFilter {
    title: string;
    value: TypeTicketFilterEnum;
}

export const typeTicketFilter: TypeTicketFilter[] = [
    { title: 'Todo (predeterminado)', value: TypeTicketFilterEnum.ALL },
    { title: 'Por definir', value: TypeTicketFilterEnum.PORDEFINIR},
    { title: 'Falla', value: TypeTicketFilterEnum.FALLA },
    { title: 'Asesoría', value: TypeTicketFilterEnum.ASESORIA },
    { title: 'Instalación', value: TypeTicketFilterEnum.INSTALACION },
    { title: 'Otro', value: TypeTicketFilterEnum.OTRO },
    { title: 'Revisión', value: TypeTicketFilterEnum.REVISION },
    { title: 'Traslado', value: TypeTicketFilterEnum.TRASLADO },
    { title: 'Servicio', value: TypeTicketFilterEnum.SERVICIO },
];