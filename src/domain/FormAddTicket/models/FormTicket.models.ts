
export interface CreateTicketRequest {
    is_account_location_id: string;
    subject: string;
    es_ticket_priority_cat_id: string;
    es_ticket_request_cat_id: string;
    es_ticket_status_cat_id: number;
    requestor: string;
    is_asset_main_id: string | null;
    comments: string;
    contact_phone: string;
    is_account_main_id: string;
    is_user_profile_id: string | null;
}

export interface CreateTicketResponse {
    status: number;
    message: string;
    data: CreateTicketData;
    token: string;
}

export interface CreateTicketData {
    message: string;
    created: number;
}
