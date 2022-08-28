export interface AnnexesServiceRequest {
    orderby: string;
    ordertype: string;
    like: string;
    match: number;
    matchnot: string | undefined;
    notlike: string | undefined;
    is_account_main_id: string;
    perpage: number;
}
export interface AddAnnexeServiceRequest {
    es_service_main_id: string;
    name: string;
    file_name: string;
    url: string;
    file_size: number;
    is_account_main_id: string;
}


export interface AnnexesServiceResponse {
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
    es_service_main_id: string,
    is_account_user_id: string,
    is_account_main_id: string,
    folio: string,
    name: string,
    file_name: string,
    url: string,
    create_at: string,
    update_at: string,
    service_id_tinc: string
}

export interface DeleteAnnexeServiceResponse {
    status: number;
    message: string;
    data: DeleteData;
    token: string;
}
export interface DeleteData {
    message: string;
    deleted: number;
}
export interface AddAnnexeServiceResponse {
    status: number;
    message: string;
    data: AddDataResponse;
    token: string;
}
export interface AddDataResponse {
    message: string;
    created: number;
}
