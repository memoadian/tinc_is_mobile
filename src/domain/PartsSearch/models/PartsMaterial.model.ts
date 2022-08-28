export interface PartsMaterialRequest {
    is_account_part_id: number;
    is_part_movement_cat_name: string;
    is_part_material_related_with_movement_id: string | null;
    is_account_main_id: number;
    perpage: number
}

export interface PartsMaterialResponse {
    status: number;
    message: string;
    data: PartsMaterialData;
    token: string;
}

export interface PartsMaterialData {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: PartsMaterialEntity[];
}

export interface PartsMaterialEntity {
    id: string,
    is_account_part_id: string,
    is_account_main_id: string,
    es_supplier_main_id: string,
    es_supplier_main_name: string,
    gc_currency_cat_id: string,
    unit_price: string,
    quantity: string,
    lot: string,
    serial_number: string | null,
    arrival_date: string,
    expiration_date?: string,
    is_part_movement_type_cat: string,
    es_service_main_id: string,
    is_part_material_related_with_movement_id: string,
    create_at: string,
    update_at: string,
    is_account_part_number: string,
    is_account_main_name: string,
    gc_currency_cat_name: string,
    is_part_movement_cat_name: string,
    is_account_part_part_brand: string,
    is_part_material_picture: string,
    timezone_create_at: string,
    is_account_part_time_in_existence: string
}
