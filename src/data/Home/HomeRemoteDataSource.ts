import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import { NumberServiceRequest, NumberTicketRequest, ServiceResponse } from "../../domain/Home/models/Home.model";
import HomeRepository from "../../domain/Home/repository/Home.repository";
import { darkColors } from "@rneui/base";
import { addDays } from "../../presentation/shared/util/Date";
import { completeHandlerIOS } from "react-native-fs";

export default class HomeRemoteDataSouce implements HomeRepository { 

    getScheduleService(request: NumberServiceRequest): Promise<AxiosResponse<ServiceResponse>> {
        var apiRequest = `/service?perpage=50&scheduled_date>=${request.dateInit}&scheduled_date<=${request.dateEnd}&es_service_status_cat_id=2&is_account_main_id=${request.accountMain}`;
        //console.log("Servicios Programados",apiRequest)
        return ApiService.get<ServiceResponse>(apiRequest);
    }
    getCompleteService(request: NumberServiceRequest): Promise<AxiosResponse<ServiceResponse, any>> {
        var apiRequest = `/service?perpage=1&end_date>=${request.dateInit}&end_date<=${request.dateEnd}&is_account_main_id=${request.accountMain}&es_service_status_cat_id=5&fields=is_account_user_id`;
        //console.log("Servicios Concluidos",apiRequest)
        return ApiService.get<ServiceResponse>(apiRequest);
    }
    getDeadlineOverService(request: NumberServiceRequest): Promise<AxiosResponse<ServiceResponse, any>> {
        let today = addDays(new Date(),0);
        var dd = String(today. getDate()). padStart(2, '0');
        var mm = String(today. getMonth()+1). padStart(2, '0'); 
        var yyyy = today. getFullYear();
        let currentDay = yyyy + '-'+mm+'-'+dd;
        var apiRequest = `/service?perpage=1&scheduled_date>=${request.dateInit}&scheduled_date<=${currentDay}&is_account_main_id=${request.accountMain}&service_status_multi=1,2,3,4,6,7,8,9&fields=is_account_user_id`;
        //console.log("Servicios Vencidos", apiRequest)
        return ApiService.get<ServiceResponse>(apiRequest);
    }
    getCreatedTicket(request: NumberTicketRequest): Promise<AxiosResponse<ServiceResponse, any>> {        
        var apiRequest = `/ticket?perpage=1&is_account_main_id=${request.accountMain}&timezone_create_at>=${request.dateInit}&timezone_create_at<=${request.dateEnd}&fields=is_account_user_id`;
        //console.log("Ticket Created",apiRequest)
        return ApiService.get<ServiceResponse>(apiRequest);
    }
    getClosedTicket(request: NumberTicketRequest): Promise<AxiosResponse<ServiceResponse, any>> {
        var apiRequest = `/ticket?perpage=1&is_account_main_id=${request.accountMain}&attention_date>=${request.dateInit}&attention_date<=${request.dateEnd}&es_ticket_status_cat_id=2&fields=is_account_user_id`;
        //console.log("Ticked Closed",apiRequest)
        return ApiService.get<ServiceResponse>(apiRequest);
    }
    getOpenedTicket(request: NumberTicketRequest): Promise<AxiosResponse<ServiceResponse, any>> {
        var apiRequest = `/ticket?perpage=1&is_account_main_id=${request.accountMain}&timezone_create_at>=${request.dateInit}&timezone_create_at<=${request.dateEnd}&&es_ticket_status_cat_id=1&fields=is_account_user_id`;
        //console.log("Ticket Open",apiRequest)
        return ApiService.get<ServiceResponse>(apiRequest);
    }

}