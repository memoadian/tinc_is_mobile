import { ServiceData } from "../../ListService/models/Service.model";

export interface ServiceResponse {
    status: number;
    message: string;
    token: string;
    data: ServiceData[];
}

export interface DetailServiceRequest {
    is_user_profile_id?: number;
    assigned_technician?: string;
    start_date?: string;
    end_date?: string;
    hours?: string;
    minutes?: string;
    summary?: string;
    conclusion?: string;
    description?: string;
    es_service_failure_reason_cat_id?: string;
    es_service_status_cat_id?: string;
    es_service_type_cat_id?: string;
    es_supplier_main_id?: string;
    is_asset_main_id?: string;
    scheduled_date?: string;
    service_chief_signature?: string;
    service_chief_name?: string;
    service_specialist_signature?: string;
    service_specialist_name?: string;
    end_user_signature?: string;
    end_user_name?: string;
    service_cost?: string;
    service_labor_cost?:string
}

export interface PartsServiceResponse {
    status: number;
    message: string;
    token: string;
    data: PartData | DeletedPart;
}

export interface PartData {
    data: Part[];
    page: number;
    per_page: number;
    total_pages: number;
    total_rows: number
}

export interface DeletedPart {
    deleted: number;
    message: string;
}

export interface Part {
    average_cost: string;
    create_at: string;
    es_service_main_id: string;
    es_service_summary: string;
    id: string;
    is_account_main_id: string;
    is_account_part_id: string;
    is_account_part_number: string;
    is_account_part_subtotal: string;
    is_account_part_unit_price: string;
    is_account_user_id: string;
    is_ccount_part_name: string;
    part_material_id: string;
    part_material_related_with_movement_id: string;
    part_material_serial_number: string;
    quantity: string;
    update_at: string;
}
