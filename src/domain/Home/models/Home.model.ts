export interface TicketResponse {
    status: number;
    message: string;
    data: DataTicket;
    token: string;
}

export interface DataTicket {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
}

export interface ServiceResponse {
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
}

export interface NumberServiceRequest {
    dateInit: string;
    dateEnd: string;
    statusServiceCat: number;
    accountMain: number
}

export interface NumberTicketRequest {
    accountMain: number;
    dateInit: string;
    dateEnd: string;
    statusTicket: string;
}