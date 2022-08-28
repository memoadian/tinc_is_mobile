import { DateFilterServiceEnum, PriorityServiceFilterEnum, StatusFilterServiceEnum, StatusFilterTicketEnum, TypeServiceFilterEnum, TypeTicketFilterEnum } from "../../../../../../domain/ListService/models/ServiceFilter.model";

export interface DateServiceFilter {
    title: string;
    value: DateFilterServiceEnum;
}





export interface StatusServiceFilter {
    title: string;
    value: StatusFilterServiceEnum;
}

export interface StatusTicketFilter {
    title: string;
    value: StatusFilterTicketEnum;
}

export const datesServiceFilter: DateServiceFilter[] = [
    { title: 'Todo (predeterminado)', value: DateFilterServiceEnum.All },
    { title: 'Hoy', value: DateFilterServiceEnum.Today },
    { title: 'Mañana', value: DateFilterServiceEnum.Tomorrow }, 
    { title: 'Próximos 7 días', value: DateFilterServiceEnum.NextDays },
    { title: 'Últimos 7 días', value: DateFilterServiceEnum.LastDays },
    { title: 'Mes en curso', value: DateFilterServiceEnum.currentMonth },
    { title: 'Vencidos', value: DateFilterServiceEnum.Expired },
];

export const statesTicketFilter: StatusTicketFilter[] = [
    { title: 'Todo (predeterminado)', value: StatusFilterTicketEnum.ALL },
    { title: 'Abierto', value: StatusFilterTicketEnum.OPEN },
    { title: 'Cerrado', value: StatusFilterTicketEnum.CLOSE },
];

export const statesServiceFilter: StatusServiceFilter[] = [
    { title: 'Todo (predeterminado)', value: StatusFilterServiceEnum.ALL },
    { title: 'Por definir', value: StatusFilterServiceEnum.PORDEFINIR },
    { title: 'Planeado', value: StatusFilterServiceEnum.PLANEADO },
    { title: 'En Proceso', value: StatusFilterServiceEnum.PROCESO },
    { title: 'En Espera', value: StatusFilterServiceEnum.ESPERA },
    { title: 'Concluido', value: StatusFilterServiceEnum.CONCLUIDO },
    { title: 'Cancelado', value: StatusFilterServiceEnum.CANCELADO },
    //{ title: 'Por Definir', value: StatusFilterServiceEnum.DEFINIR },
    { title: 'En espera de partes', value: StatusFilterServiceEnum.PARTES },
    { title: 'Pago pendiente', value: StatusFilterServiceEnum.PAGO },
];

export interface PriorityServiceFilter { 
    title: string;
    value: PriorityServiceFilterEnum;
}

export const priorityServiceFilter: PriorityServiceFilter[] = [
    { title: 'Todo (predeterminado)', value: PriorityServiceFilterEnum.ALL },
    { title: 'Prioridad 1: Atención Inmediata', value: PriorityServiceFilterEnum.ONE },
    { title: 'Prioridad 2: Atención durante el día', value: PriorityServiceFilterEnum.TWO },
    { title: 'Prioridad 3: Atención durante la semana', value: PriorityServiceFilterEnum.THREE },
    { title: 'Prioridad 4: Atención durante el mes', value: PriorityServiceFilterEnum.FOUR },
];

export interface TypeTicketFilter {
    title: string;
    value: TypeTicketFilterEnum;
}

export interface TypeServiceFilter {
    title: string;
    value: TypeServiceFilterEnum;
}

export const typeTicketFilter: TypeTicketFilter[] = [
    { title: 'Todo (predeterminado)', value: TypeTicketFilterEnum.ALL },
    { title: 'Falla', value: TypeTicketFilterEnum.FALLA },
    { title: 'Asesoría', value: TypeTicketFilterEnum.ASESORIA },
    { title: 'Instalación', value: TypeTicketFilterEnum.INSTALACION },
    { title: 'Otro', value: TypeTicketFilterEnum.OTRO },
    { title: 'Revisión', value: TypeTicketFilterEnum.REVISION },
    { title: 'Traslado', value: TypeTicketFilterEnum.TRASLADO },
    { title: 'Servicio', value: TypeTicketFilterEnum.SERVICIO },
];


export const typeServiceFilter: TypeServiceFilter[] = [
    { title: 'Todo (predeterminado)', value: TypeServiceFilterEnum.ALL },
    { title: "Por Definir", value: TypeServiceFilterEnum.PORDEFINIR },
    { title: "Mantenimiento Preventivo", value: TypeServiceFilterEnum.MANTENIMIENTO },
    { title: "Reparación", value: TypeServiceFilterEnum.REPARACION },
    { title: "Instalación", value: TypeServiceFilterEnum.INSTALACION },
    { title: "Asesoría", value: TypeServiceFilterEnum.ASESORIA },
    { title: "Revisión", value: TypeServiceFilterEnum.REVISION },
    { title: "Limpieza Exhaustiva", value: TypeServiceFilterEnum.LIMPIEZA },
    { title: "Apoyo en Cirugía", value: TypeServiceFilterEnum.APOYO },
    { title: "Préstamo de Activo", value: TypeServiceFilterEnum.PRESTAMO },
    { title: "Otros Servicios", value: TypeServiceFilterEnum.OTROS },
    { title: "Incidente Adverso", value: TypeServiceFilterEnum.INCIDENTE },
    { title: "Calibración", value: TypeServiceFilterEnum.CALIBRACION }
  ];
