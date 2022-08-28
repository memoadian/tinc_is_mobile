export interface PartsSearchRequest {
    perpage: number;
    is_account_main_id: number;
}

export interface PartsSearchResponse {
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
    data: PartData[];
}

export interface PartData {
    id: string,
    is_account_user_id: string,
    is_account_main_id: string,
    account_name: string,
    id_custom: string,
    number: string,
    is_part_category_cat_id: string,
    name: string,
    part_brand: string,
    unit_price: string,
    quantity: string,
    gc_currency_cat_id: string,
    gc_currency_cat_name: string,
    min_stock: string,
    create_at: string,
    update_at: string,
    account_user_name: string,
    category_name: string,
    is_part_class_cat_name: string,
    picture: string,
    timezone_create_at: string,
    lot:string
}
