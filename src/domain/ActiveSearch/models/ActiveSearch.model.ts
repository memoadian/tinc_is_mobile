export interface ActiveSearchResponse {
    status: number;
    message: string;
    data: Data;
    token: string;
}

export interface Data {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: ActiveEntiy[];
}
export interface ActiveEntiy {
    id: string;
    id_tinc: string;
    model: string;
    asset_brand_name: string;
    asset_picture: string | null;
    serial_number: string;
    asset_category_name: string;
    location_name: string;
    sublocation_name: string;
    asset_type_name: string;
    is_account_location_id: string;
    is_account_main_id: string;
    is_asset_status_cat_id: number;
}

export interface ActiveRequest {
    perPage: number;
    page: number;
    sortDirection: 'ASC' | 'DESC';
    accountMain: number;
    textQuery: string | null;
}
export interface ActiveDetailResponse {
    status: number;
    message: string;
    data: ActiveEntiy[];
    token: string;
}
