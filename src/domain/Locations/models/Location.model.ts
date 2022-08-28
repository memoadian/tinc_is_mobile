export interface LocationResponse {
    status: number;
    message: string;
    data: LocationData;
    token: string;
}

export interface LocationData {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: LocationEntity[];
}

export interface LocationEntity {
    id: string;
    name: string;
    description: string;
    is_account_main_id: string;
    is_account_user_id: string;
    create_at: string;
    update_at: string;
    name_wo_account: string;
    is_account_main_name: string;
}

export interface LocationRequest {
    is_account_main_id: string;
    orderby: string;
    ordertype: string;
    perpage: number;
}
