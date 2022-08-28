import TicketItemRepository from '../../domain/TicketItem/repository/TicketItemRepository';
import {AxiosResponse} from 'axios';
import {TicketItemResponse, TicketModel} from '../../domain/TicketItem/models/Ticket.model';
import ApiService from '../../presentation/core/api/ApiService';
import {ServicesResponse} from '../../domain/ListService/models/Service.model';

export default class TicketItemRemoteDataSource implements TicketItemRepository {
  getTicket(idTicket: string): Promise<AxiosResponse<TicketItemResponse, any>> {
    return ApiService.get(`/ticket/${idTicket}`);
  }
  
  updateTicket(idTicket: string, ticket: TicketModel): Promise<AxiosResponse<TicketItemResponse, any>> {
    
    return ApiService.put(`/ticket/${idTicket}`, this.cleanTicket(ticket))
  }
  
  getTicketServices(folio: string): Promise<AxiosResponse<ServicesResponse, any>> {
    return ApiService.get(`service?reference=${folio}`);
  }
  
  cleanTicket(ticket){
    ticket.is_user_profile_id == null || ticket.is_user_profile_id == '' ? delete ticket.is_user_profile_id : ticket.is_user_profile_id = ticket.is_user_profile_id
    ticket.contact_phone == null || ticket.contact_phone == '' ? delete ticket.contact_phone : ticket.contact_phone = ticket.contact_phone
    ticket.es_ticket_priority_cat_id == null || ticket.es_ticket_priority_cat_id == '' ? delete ticket.es_ticket_priority_cat_id : ticket.es_ticket_priority_cat_id = ticket.es_ticket_priority_cat_id
    ticket.es_ticket_request_cat_id == null || ticket.es_ticket_request_cat_id == '' ? delete ticket.es_ticket_request_cat_id : ticket.es_ticket_request_cat_id = ticket.es_ticket_request_cat_id
    ticket.is_account_location_id == null || ticket.is_user_profile_id == '' ? delete ticket.is_user_profile_id : ticket.is_user_profile_id = ticket.is_user_profile_id
    
    ticket.is_asset_main_id == null || ticket.is_asset_main_id == '' ? delete ticket.is_asset_main_id : ticket.is_asset_main_id = ticket.is_asset_main_id
    ticket.requestor == null || ticket.requestor == '' ? delete ticket.requestor : ticket.requestor = ticket.requestor
    ticket.subject == null || ticket.subject == '' ? delete ticket.subject : ticket.subject = ticket.subject
    ticket.es_supplier_main_id == null || ticket.es_supplier_main_id == '' ? delete ticket.es_supplier_main_id : ticket.es_supplier_main_id = ticket.es_supplier_main_id
    
    ticket.attention_date == null || ticket.attention_date == '' ? delete ticket.attention_date : ticket.attention_date = ticket.attention_date
    ticket.attention_hour == null || ticket.attention_hour == '' ? delete ticket.attention_hour : ticket.attention_hour = ticket.attention_hour
    ticket.comments_diagnostic == null || ticket.comments_diagnostic == '' ? delete ticket.comments_diagnostic : ticket.comments_diagnostic = ticket.comments_diagnostic
    ticket.duration_hours == null || ticket.duration_hours == '' ? delete ticket.duration_hours : ticket.duration_hours = ticket.duration_hours
    ticket.duration_minutes == null || ticket.duration_minutes == '' ? delete ticket.duration_minutes : ticket.duration_minutes = ticket.duration_minutes
    ticket.es_ticket_solution_cat_id == null || ticket.es_ticket_solution_cat_id == '' ? delete ticket.es_ticket_solution_cat_id : ticket.es_ticket_solution_cat_id = ticket.es_ticket_solution_cat_id
    ticket.es_ticket_status_cat_id == null || ticket.es_ticket_status_cat_id == '' ? delete ticket.es_ticket_status_cat_id : ticket.es_ticket_status_cat_id = ticket.es_ticket_status_cat_id
    
    ticket.service_chief_signature == null || ticket.service_chief_signature == '' ? delete ticket.service_chief_signature : ticket.service_chief_signature = ticket.service_chief_signature
    ticket.service_chief_name == null || ticket.service_chief_name == '' ? delete ticket.service_chief_name : ticket.service_chief_name = ticket.service_chief_name
    ticket.service_specialist_signature == null || ticket.service_specialist_signature == '' ? delete ticket.service_specialist_signature : ticket.service_specialist_signature = ticket.service_specialist_signature
    ticket.service_specialist_name == null || ticket.service_specialist_name == '' ? delete ticket.service_specialist_name : ticket.service_specialist_name = ticket.service_specialist_name
    ticket.end_user_signature == null || ticket.end_user_signature == '' ? delete ticket.end_user_signature : ticket.end_user_signature = ticket.end_user_signature
    ticket.end_user_name == null || ticket.end_user_name == '' ? delete ticket.end_user_name : ticket.end_user_name = ticket.end_user_name
    return ticket;
  }

}
