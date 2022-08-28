export interface ProviderRequest {
    perPage: number,
    page: number,
    sortDirection: 'ASC' | 'DESC',
    textQuery: null | string;
}

export interface ProviderSearchResponse {
    status: number;
    message: string;
    data: ProviderData;
    token: string;
}

export interface ProviderData {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: ProviderEntity[];
}

export interface ProviderEntity {
    id: string;
    id_tinc: string;
    name: string;
    logo_url: string;
    gc_state_cat_name: string;
    gc_city_cat_name: string;
    legal_name: string;
    country_name: string;
    support_email: null | string;
}

export enum CountryName {
    Argentina = "Argentina",
    Chile = "Chile",
    Colombia = "Colombia",
    CostaRica = "Costa Rica",
    ElSalvador = "El Salvador",
    México = "México",
    Otro = "Otro",
    Panamá = "Panamá",
    Perú = "Perú",
    PorDefinir = "Por definir",
}
