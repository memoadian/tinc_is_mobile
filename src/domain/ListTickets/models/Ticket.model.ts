export interface TicketRequest {
    page: number;
    perpage: number;
    is_user_profile_id: string | null,
    is_account_main_id: string | null,
    mobile_searcher: string | null,
    request_date_auto: number[] | null,
    ticket_priority_multi: string | null,
    ticket_request_multi: string | null,
    ticket_status_name: string | null,
    is_account_location_id: string | null,
    queryPath: string | null,
    orderby: string | null,
    ordertype: string | null,
}

export interface TicketsResponse {
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
    data: TicketData[];
}

export interface TicketData {
    id: number
    id_tinc: string
    is_account_user_id: number,
    is_account_main_id: number,
    is_account_location_id: number,
    is_account_location_name: string,
    is_asset_main_id: number | null,
    subject: string,
    es_ticket_priority_cat_id: number,
    es_ticket_request_cat_id: number,
    es_ticket_request_cat_name: string,
    comments: string,
    contact_phone?: string,
    comments_diagnostic?: string,
    es_service_main_id: number,
    requestor: string,
    es_ticket_status_cat_id: number,
    es_ticket_solution_cat_id?: number,
    end_date?: string,
    solution_description?: string,
    attention_date?: string,
    attention_hour?: string,
    duration_hours?: string,
    duration_minutes?: string,
    assignedengineername?: string,
    create_at: string,
    update_at: string,
    account_user_name: string,
    asset_id_tinc: string,
    asset_id_custom?: string,
    asset_type_id: number,
    asset_type_name: string,
    is_asset_category_cat_id: number,
    is_asset_category_cat_name: string,
    asset_model: string,
    asset_brand_name: string,
    asset_serial_number: string,
    asset_status_name: string,
    asset_location_name: string,
    asset_sublocation_name?: string,
    priority_name: string,
    ticket_request_name: string,
    service_id_tinc: string,
    ticket_status_name: string,
    ticket_solution_name?: string,
    service_chief_signature?: string,
    service_specialist_signature?: string,
    end_user_signature?: string,
    service_chief_name?: string,
    service_specialist_name?: string,
    end_user_name?: string,
    es_supplier_main_id?: number,
    es_supplier_main_name?: string,
    supplier_bloqued?: string,
    supplier_notification_date?: string,
    is_user_profile_id?: number,
    is_user_profile_full_name?: string,
    last_update_user_id: null,
    last_update_user_name: string,
    account_name: string,
    timezone_create_at: string,
    total_request?: string,
    available_by_request_limit: string
}
