export interface CreateOrdenServiceRequest {
    es_service_status_cat_id: string;
    es_service_type_cat_id: string;
    es_supplier_main_id: string;
    is_asset_main_id: string | number | null;
    es_service_origin_cat_id: number;
    scheduled_date: string;
    is_account_main_id: string;
    reference?: string;
    is_user_profile_id?: string | null;
}
export interface CreatedOrderServiceResponse {
    status: number;
    message: string;
    data: OrderServiceCreated;
    token: string;
}
export interface OrderServiceCreated {
    message: string;
    created: number;
}
