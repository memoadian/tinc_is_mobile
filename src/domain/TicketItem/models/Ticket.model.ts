import {TicketData} from '../../ListTickets/models/Ticket.model';

export interface TicketItemResponse {
  status: number;
  message: string;
  data: TicketData[] | TicketUpdated;
  token: string;
}

export interface TicketUpdated {
  message: string;
  updated: number;
}

export interface TicketModel {
  comments?: string;
  contact_phone?: string;
  es_ticket_priority_cat_id?: string;
  es_ticket_request_cat_id?: string;
  is_account_location_id?: string;
  is_asset_main_id?: string;
  requestor?: string;
  subject?: string;
  is_user_profile_id?: string;
  es_supplier_main_id?: string;
  
  attention_date?: string;
  attention_hour?: string;
  comments_diagnostic?: string
  duration_hours?: string;
  duration_minutes?: string;
  es_ticket_solution_cat_id?: string;
  es_ticket_status_cat_id?: string;
  
  service_chief_signature?: string;
  service_chief_name?: string;
  service_specialist_signature?: string;
  service_specialist_name?: string;
  end_user_signature?: string;
  end_user_name?: string;
}
