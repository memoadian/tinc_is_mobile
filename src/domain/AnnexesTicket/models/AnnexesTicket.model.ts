export interface AnnexesTicketRequest {
    orderby: string;
    ordertype: string;
    like: string;
    match: string;
    matchnot: string | undefined;
    notlike: string | undefined;
    is_account_main_id: string;
    perpage: number;
}

export interface AddAnnexeTicketRequest {
    es_ticket_main_id: string;
    name: string;
    file_name: string;
    file_url: string;
    file_size: number;
    is_account_main_id: string;
}

export interface AnnexesTicketResponse {
    status: number;
    message: string;
    data: DataAnnexes;
    token: string;
}

export interface DataAnnexes {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: AnnexesEntity[];
}

export interface AnnexesEntity {
    id: string,
    es_ticket_main_id: string,
    is_account_main_id: string,
    folio: string,
    name: string,
    file_name: string,
    file_url: string,
    create_at: string,
    update_at: string,
    ticket_id_tinc: string
}
export interface DeleteAnnexeTicketResponse {
    status: number;
    message: string;
    data: Data;
    token: string;
}
export interface Data {
    message: string;
    deleted: number;
}

export interface AddDataResponse {
    message: string;
    created: number;
}

export interface AddAnnexeTicketResponse {
    status: number;
    message: string;
    data: AddDataResponse;
    token: string;
}
export interface AddDataResponse {
    message: string;
    created: number;
}
