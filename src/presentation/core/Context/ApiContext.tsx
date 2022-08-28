import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import React, { createContext, useState,useEffect } from 'react'
import ApiService from '../api/ApiService';

type ApiContextProps = {
    order: Object[];
    typeAsset:Object[];
    location:Object[];
    getTickets: () => Promise<void>;
    getService: (params: any) => Promise<any>
    list: (endpoint: string, params: any) => Promise<void>;
    listOpenApi: (endpoint: string, queryParams: any) => Promise<void>;
    setLocationMethod: () => void;
    seTypeAsset: ()=> void;
    get: (endpoint: string, id: string) => Promise<void>;
    get2: (endpoint: string, id: string) => Promise<void>;
    getFromKardex: (endpoint: string, id: string) => Promise<void>;
    getFromAnalytics: (endpoint: string, id: string) => Promise<void>;
    create: (endpoint: string, object: any) => Promise<void>;
    createSpecial: (endpoint: string, object: any) => Promise<void>;
    create2: (endpoint: string, object: any) => Promise<void>;
    sendMail: (object: any) => Promise<void>;
    sendMailUserActCode: (object: any) => Promise<void>;
    update: (endpoint: string, id: string, object: any) => Promise<void>;
    remove: (endpoint: string, id: string) => Promise<void>;
    confirmationEmail: (object: any) => Promise<void>;
    mailPost: (source: string, operation: string, object: any) => Promise<void>;
    olapPost: (endpoint: any, id: string) => Promise<void>;
}
const userInfo: Partial<any> = {
    "data": {
        "id_user": "4",
        "email": "pruebastinc@gmail.com",
        "full_name": "Isela Toledo Zaragoza edici\u00f3n",
        "terms_accepted": "1",
        "is_superuser": "1",
        "id_account_user": "10",
        "id_account": "13", "name": "0  Hospital TINC",
        "currency_name": "MXN",
        "id_city": "14", "city_name": "Mexicali",
        "id_state": "3",
        "id_country": "2",
        "id_sector": "2",
        "id_account_type": "1",
        "first_log": "1",
        "id_role": "2",
        "role_name": "Ingeniero Cl\u00ednico",
        "is_plan_paid": "1",
        "corporate_id": "1",
        "corporate_name": "Corporativo Tinc",
        "corporate_image": "https:\/\/res.cloudinary.com\/cmmstinc\/image\/upload\/v1587166306\/general\/TincIsotipo_mgmjnt.png",
        "is_active": "1",
        "is_user_timezone_cat_id": "1",
        "is_user_timezone_cat_name": "CST",
        "create_at": "2020-04-19 11:45:09",
        "corp_account_create_at": "2020-04-19 11:59:08",
        "corporate_accounts": [
            { "is_account_main_id": "415", "is_account_main_name": "2 Hospital Tinc 2", "gc_city_cat_name": "Bocoyna" }
            , { "is_account_main_id": "414", "is_account_main_name": "1 Hospital Tinc 1", "gc_city_cat_name": "Zapopan" },
            { "is_account_main_id": "13", "is_account_main_name": "0  Hospital TINC", "gc_city_cat_name": "Mexicali" },
            { "is_account_main_id": "412", "is_account_main_name": "3 Hospital  Regional de Alta Especialidad \u00c1ngel SA de CV", "gc_city_cat_name": "Zacatecas" }
        ]
    }
}
const typeData:any = [
    {"id":"2","name":"Almohadilla T\u00e9rmica","description":"Almohadilla T\u00e9rmica","is_asset_category_cat_id":"2"},{"id":"3","name":"Ambu Neonatal","description":"Ambu Neonatal","is_asset_category_cat_id":"2"},
    {"id":"4","name":"Ambu Ped\u00edatrico","description":"Ambu Ped\u00edatrico","is_asset_category_cat_id":"2"},
    {"id":"5","name":"Analizador Card\u00edaco","description":"Analizador Card\u00edaco","is_asset_category_cat_id":"2"},{"id":"6","name":"Analizador de Flujo de Gases","description":"Analizador de Flujo de Gases","is_asset_category_cat_id":"2"},
    {"id":"7","name":"Analizador de Glucosa","description":"Analizador de Glucosa","is_asset_category_cat_id":"2"},
    {"id":"8","name":"Analizador Para Velocidad de Sedimentaci\u00f3n Globula","description":"Analizador Para Velocidad de Sedimentaci\u00f3n Globula","is_asset_category_cat_id":"2"},
    {"id":"9","name":"Analizador Respiratorio","description":"Analizador Respiratorio","is_asset_category_cat_id":"2"},{"id":"10","name":"Arenadora Dental","description":"Arenadora Dental","is_asset_category_cat_id":"2"},
    {"id":"11","name":"Asistente de Tos","description":"Asistente de Tos","is_asset_category_cat_id":"2"},
    {"id":"949","name":"Generador El\u00e9ctrico","description":"Generador El\u00e9ctrico","is_asset_category_cat_id":"15"},{"id":"950","name":"Gr\u00faa","description":"Gr\u00faa","is_asset_category_cat_id":"15"},{"id":"951","name":"Habitaci\u00f3n","description":"Habitaci\u00f3n","is_asset_category_cat_id":"15"},{"id":"952","name":"Impresora 3D","description":"Impresora 3D","is_asset_category_cat_id":"15"},{"id":"953","name":"Impresora T\u00e9rmica","description":"Impresora T\u00e9rmica","is_asset_category_cat_id":"15"},{"id":"954","name":"L\u00e1mpara de Emergencia","description":"L\u00e1mpara de Emergencia","is_asset_category_cat_id":"15"}
]
const dataOrder: Partial<any> = { "total_rows": 210, "per_page": 5, "page": 1, "total_pages": 42, "data": [{ "id": "1890", "id_tinc": "SER10000001890", "is_account_user_id": "484", "is_account_main_id": "415", "assigned_engineer_name": null, "account_name": "2 Hospital Tinc 2", "es_service_status_cat_id": "2", "es_service_type_cat_id": "2", "es_supplier_main_id": "1", "is_asset_main_id": "5314", "scheduled_date": "2021-10-28", "es_service_origin_cat_id": "5", "is_user_profile_id": "729", "start_date": "2022-02-16", "end_date": "2022-02-16", "hours": "10", "minutes": "0", "summary": "", "description": "", "service_chief_signature": null, "service_specialist_signature": null, "end_user_signature": null, "service_chief_name": null, "service_specialist_name": null, "end_user_name": null, "service_cost": "30", "id_contract": null, "contract_url": null, "reference": null, "service_labor_cost": "0", "create_at": "2021-10-26 12:20:38", "update_at": "2022-02-16 11:10:08", "account_user_name": "Pendiente", "service_status_name": "Planeado", "service_type_name": "Mantenimiento Preventivo", "supplier_name": "Depto. Ing. Biom\u00e9dica", "asset_id_tinc": "AST10000005314", "asset_id_custom": null, "asset_model": "Infusomat\u00ae fmS", "asset_type_id": "40", "asset_type_name": "Bomba de Infusi\u00f3n", "is_asset_category_cat_id": "2", "is_asset_category_cat_name": "Equipo M\u00e9dico", "asset_brand_id": "184", "asset_brand_name": "B Braun", "asset_serial_number": "171122", "asset_status_id": "3", "asset_status_name": "Funcional", "asset_location_id": "894", "asset_location_name": "Ubicaci\u00f3n Pendiente Hosp 2", "asset_sublocation_id": null, "asset_sublocation_name": null, "asset_mprev_routine_id": "1", "asset_mprev_routine_name": "Por definir", "service_origin_name": "Otro", "assigned_technician_from_fk": "Especialista de Servicio H2", "last_update_user_id": null, "last_update_user_name": null, "assigned_technician": null, "conclusion": null, "es_service_failure_reason_cat_id": null, "es_service_failure_reason_cat_name": null, "timezone_create_at": "2021-10-26 12:20:38", "total_request": "2", "available_by_request_limit": "1" }, { "id": "1891", "id_tinc": "SER10000001891", "is_account_user_id": "484", "is_account_main_id": "415", "assigned_engineer_name": null, "account_name": "2 Hospital Tinc 2", "es_service_status_cat_id": "5", "es_service_type_cat_id": "4", "es_supplier_main_id": "1", "is_asset_main_id": "5314", "scheduled_date": "2021-10-29", "es_service_origin_cat_id": "5", "is_user_profile_id": "4", "start_date": "2022-02-14", "end_date": "2022-02-15", "hours": "6", "minutes": "40", "summary": "ok", "description": "ok", "service_chief_signature": null, "service_specialist_signature": null, "end_user_signature": null, "service_chief_name": null, "service_specialist_name": null, "end_user_name": null, "service_cost": "2974.65", "id_contract": null, "contract_url": null, "reference": null, "service_labor_cost": "2884.65", "create_at": "2021-10-26 12:20:50", "update_at": "2022-02-16 20:10:10", "account_user_name": "Pendiente", "service_status_name": "Concluido", "service_type_name": "Instalaci\u00f3n", "supplier_name": "Depto. Ing. Biom\u00e9dica", "asset_id_tinc": "AST10000005314", "asset_id_custom": null, "asset_model": "Infusomat\u00ae fmS", "asset_type_id": "40", "asset_type_name": "Bomba de Infusi\u00f3n", "is_asset_category_cat_id": "2", "is_asset_category_cat_name": "Equipo M\u00e9dico", "asset_brand_id": "184", "asset_brand_name": "B Braun", "asset_serial_number": "171122", "asset_status_id": "3", "asset_status_name": "Funcional", "asset_location_id": "894", "asset_location_name": "Ubicaci\u00f3n Pendiente Hosp 2", "asset_sublocation_id": null, "asset_sublocation_name": null, "asset_mprev_routine_id": "1", "asset_mprev_routine_name": "Por definir", "service_origin_name": "Otro", "assigned_technician_from_fk": "Isela Toledo Zaragoza edici\u00f3n", "last_update_user_id": null, "last_update_user_name": null, "assigned_technician": null, "conclusion": null, "es_service_failure_reason_cat_id": null, "es_service_failure_reason_cat_name": null, "timezone_create_at": "2021-10-26 12:20:50", "total_request": "2", "available_by_request_limit": "1" }, { "id": "1892", "id_tinc": "SER10000001892", "is_account_user_id": "484", "is_account_main_id": "415", "assigned_engineer_name": null, "account_name": "2 Hospital Tinc 2", "es_service_status_cat_id": "5", "es_service_type_cat_id": "4", "es_supplier_main_id": "1", "is_asset_main_id": "5323", "scheduled_date": "2021-10-01", "es_service_origin_cat_id": "5", "is_user_profile_id": null, "start_date": null, "end_date": null, "hours": "0", "minutes": "0", "summary": null, "description": null, "service_chief_signature": null, "service_specialist_signature": null, "end_user_signature": null, "service_chief_name": null, "service_specialist_name": null, "end_user_name": null, "service_cost": null, "id_contract": null, "contract_url": null, "reference": null, "service_labor_cost": null, "create_at": "2021-10-26 12:21:10", "update_at": "2021-10-26 12:21:10", "account_user_name": "Pendiente", "service_status_name": "Concluido", "service_type_name": "Instalaci\u00f3n", "supplier_name": "Depto. Ing. Biom\u00e9dica", "asset_id_tinc": "AST10000005323", "asset_id_custom": null, "asset_model": "747  Transport Stretcher", "asset_type_id": "698", "asset_type_name": "Camilla", "is_asset_category_cat_id": "8", "is_asset_category_cat_name": "Equipo de Traslado", "asset_brand_id": "1493", "asset_brand_name": "Stryker", "asset_serial_number": "1404033781", "asset_status_id": "4", "asset_status_name": "Fuera de Servicio", "asset_location_id": "895", "asset_location_name": "Urgencias Hosp 2", "asset_sublocation_id": null, "asset_sublocation_name": null, "asset_mprev_routine_id": "1", "asset_mprev_routine_name": "Por definir", "service_origin_name": "Otro", "assigned_technician_from_fk": null, "last_update_user_id": null, "last_update_user_name": null, "assigned_technician": null, "conclusion": null, "es_service_failure_reason_cat_id": null, "es_service_failure_reason_cat_name": null, "timezone_create_at": "2021-10-26 12:21:10", "total_request": null, "available_by_request_limit": "1" }, { "id": "1961", "id_tinc": "SER10000001961", "is_account_user_id": "10", "is_account_main_id": "415", "assigned_engineer_name": null, "account_name": "2 Hospital Tinc 2", "es_service_status_cat_id": "5", "es_service_type_cat_id": "2", "es_supplier_main_id": "1", "is_asset_main_id": "5313", "scheduled_date": "2021-12-01", "es_service_origin_cat_id": "5", "is_user_profile_id": null, "start_date": null, "end_date": "2021-12-01", "hours": "0", "minutes": "0", "summary": "", "description": "", "service_chief_signature": null, "service_specialist_signature": null, "end_user_signature": null, "service_chief_name": null, "service_specialist_name": null, "end_user_name": null, "service_cost": "0", "id_contract": null, "contract_url": null, "reference": null, "service_labor_cost": "0", "create_at": "2021-12-16 15:24:58", "update_at": "2021-12-16 15:25:15", "account_user_name": "Pendiente", "service_status_name": "Concluido", "service_type_name": "Mantenimiento Preventivo", "supplier_name": "Depto. Ing. Biom\u00e9dica", "asset_id_tinc": "AST10000005313", "asset_id_custom": null, "asset_model": "Attest\u2122 1291", "asset_type_id": "473", "asset_type_name": "Analizador de Indicadores Biol\u00f3gicos", "is_asset_category_cat_id": "5", "is_asset_category_cat_name": "Equipo de Laboratorio", "asset_brand_id": "4", "asset_brand_name": "3M", "asset_serial_number": "232989", "asset_status_id": "6", "asset_status_name": "En Mantenimiento", "asset_location_id": "893", "asset_location_name": "Laboratorio Hosp 2", "asset_sublocation_id": "1217", "asset_sublocation_name": "Sub Laboratorio 2 Hosp 2", "asset_mprev_routine_id": "1", "asset_mprev_routine_name": "Por definir", "service_origin_name": "Otro", "assigned_technician_from_fk": null, "last_update_user_id": null, "last_update_user_name": null, "assigned_technician": "", "conclusion": null, "es_service_failure_reason_cat_id": null, "es_service_failure_reason_cat_name": null, "timezone_create_at": "2021-12-16 15:24:58", "total_request": null, "available_by_request_limit": "1" }, { "id": "1980", "id_tinc": "SER10000001980", "is_account_user_id": "10", "is_account_main_id": "415", "assigned_engineer_name": null, "account_name": "2 Hospital Tinc 2", "es_service_status_cat_id": "5", "es_service_type_cat_id": "2", "es_supplier_main_id": "1", "is_asset_main_id": "5609", "scheduled_date": "2021-12-17", "es_service_origin_cat_id": "5", "is_user_profile_id": null, "start_date": null, "end_date": null, "hours": "0", "minutes": "0", "summary": null, "description": null, "service_chief_signature": null, "service_specialist_signature": null, "end_user_signature": null, "service_chief_name": null, "service_specialist_name": null, "end_user_name": null, "service_cost": null, "id_contract": null, "contract_url": null, "reference": null, "service_labor_cost": null, "create_at": "2021-12-22 12:48:09", "update_at": "2021-12-22 12:48:09", "account_user_name": "Pendiente", "service_status_name": "Concluido", "service_type_name": "Mantenimiento Preventivo", "supplier_name": "Depto. Ing. Biom\u00e9dica", "asset_id_tinc": "AST10000005609", "asset_id_custom": null, "asset_model": "1", "asset_type_id": "662", "asset_type_name": "Camilla Pedi\u00e1trica", "is_asset_category_cat_id": "7", "is_asset_category_cat_name": "Mobiliario M\u00e9dico", "asset_brand_id": "3", "asset_brand_name": "2 Care", "asset_serial_number": "21", "asset_status_id": "5", "asset_status_name": "En Revisi\u00f3n", "asset_location_id": "892", "asset_location_name": "General 1", "asset_sublocation_id": "1189", "asset_sublocation_name": "General 1", "asset_mprev_routine_id": "1", "asset_mprev_routine_name": "Por definir", "service_origin_name": "Otro", "assigned_technician_from_fk": null, "last_update_user_id": null, "last_update_user_name": null, "assigned_technician": null, "conclusion": null, "es_service_failure_reason_cat_id": null, "es_service_failure_reason_cat_name": null, "timezone_create_at": "2021-12-22 12:48:09", "total_request": null, "available_by_request_limit": "1" }] }

const locationData = [{"id":"885","name":"1 Hospital Tinc 1 - General","description":"General","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:31:46","update_at":"2021-10-26 11:31:46","name_wo_account":"General","is_account_main_name":"1 Hospital Tinc 1"},{"id":"968","name":"1 Hospital Tinc 1 - Hospitalizaci\u00f3n","description":"Hospitalizaci\u00f3n","is_account_main_id":"414","is_account_user_id":"10","create_at":"2022-01-20 08:37:23","update_at":"2022-01-20 08:37:23","name_wo_account":"Hospitalizaci\u00f3n","is_account_main_name":"1 Hospital Tinc 1"},{"id":"886","name":"1 Hospital Tinc 1 - Laboratorio Hosp 1","description":"Laboratorio Hosp 1","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:33:35","update_at":"2021-10-26 15:32:44","name_wo_account":"Laboratorio Hosp 1","is_account_main_name":"1 Hospital Tinc 1"},{"id":"922","name":"1 Hospital Tinc 1 - Prueba cuenta nueva Hosp 1","description":"Prueba cuenta nueva Hosp 1","is_account_main_id":"414","is_account_user_id":"10","create_at":"2021-12-10 20:32:18","update_at":"2021-12-10 20:32:18","name_wo_account":"Prueba cuenta nueva Hosp 1","is_account_main_name":"1 Hospital Tinc 1"},{"id":"890","name":"1 Hospital Tinc 1 - Quir\u00f3fano Hosp 1","description":"Quir\u00f3fano Hosp 1","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:34:46","update_at":"2021-10-26 15:33:03","name_wo_account":"Quir\u00f3fano Hosp 1","is_account_main_name":"1 Hospital Tinc 1"},{"id":"924","name":"1 Hospital Tinc 1 - Test Limon 1","description":"Test Limon 1","is_account_main_id":"414","is_account_user_id":"10","create_at":"2021-12-19 14:35:34","update_at":"2021-12-19 14:35:34","name_wo_account":"Test Limon 1","is_account_main_name":"1 Hospital Tinc 1"},{"id":"889","name":"1 Hospital Tinc 1 - Tococirug\u00eda Hosp 1","description":"Tococirug\u00eda Hosp 1","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:34:16","update_at":"2021-10-26 15:32:59","name_wo_account":"Tococirug\u00eda Hosp 1","is_account_main_name":"1 Hospital Tinc 1"},{"id":"887","name":"1 Hospital Tinc 1 - Ubicaci\u00f3n Pendiente Hosp 1","description":"Ubicaci\u00f3n Pendiente Hosp 1","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:33:43","update_at":"2021-10-26 15:32:49","name_wo_account":"Ubicaci\u00f3n Pendiente Hosp 1","is_account_main_name":"1 Hospital Tinc 1"},{"id":"969","name":"1 Hospital Tinc 1 - UCI","description":"UCI","is_account_main_id":"414","is_account_user_id":"10","create_at":"2022-01-20 08:37:38","update_at":"2022-01-20 08:37:38","name_wo_account":"UCI","is_account_main_name":"1 Hospital Tinc 1"},{"id":"891","name":"1 Hospital Tinc 1 - UCIN\/UTIN - UNIDAD DE CUIDADOS\/TERAPIA INTENSIVA NEONATAL Hosp 1","description":"UCIN\/UTIN - UNIDAD DE CUIDADOS\/TERAPIA INTENSIVA NEONATAL Hosp 1","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:34:52","update_at":"2021-10-26 15:33:09","name_wo_account":"UCIN\/UTIN - UNIDAD DE CUIDADOS\/TERAPIA INTENSIVA NEONATAL Hosp 1","is_account_main_name":"1 Hospital Tinc 1"},{"id":"888","name":"1 Hospital Tinc 1 - Urgencias Hosp 1","description":"Urgencias Hosp 1","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:33:53","update_at":"2021-10-26 15:32:54","name_wo_account":"Urgencias Hosp 1","is_account_main_name":"1 Hospital Tinc 1"}]

export const ApiContext = createContext({} as ApiContextProps);



export const ApiProvider = ({ children }: any) => {
    const [order, setOrder] = useState([]);
    const [typeAsset, setTypeAsset] = useState([{"label": "Todo (predeterminado)", value: "0", check: true}]);
    const [location, setLocation] = useState([{"id":"885","name":"1 Hospital Tinc 1 - General","description":"General","is_account_main_id":"414","is_account_user_id":"483","create_at":"2021-10-26 11:31:46","update_at":"2021-10-26 11:31:46","name_wo_account":"General","is_account_main_name":"1 Hospital Tinc 1"}])
    useEffect(() => {
        //seTypeAsset();
        //setLocationMethod();
    }, [])
    

    const getTickets = async () => {
        const params = {
            'orderby': 'update_at',
            'ordertype': 'DESC',
            'like': 'pend',
            'match': 'Buscar',
            'is_account_main_id': 415,
        }
        try {
            const resp = await ApiService.get('/ticket', { params })
            return resp.data
        } catch (error) {
            const err = error as AxiosError
            console.error(err.response?.data)
        }
    }
    const getService = async (params: any) => {
        try {
            const resp = await ApiService.get('/service', {params: params})
            return resp.data;
        } catch (error) {
            console.error('ApiContext/getService()', error);
            const err = error as AxiosError
            console.error(err.response?.data)
            return dataOrder.data;
        }
    }
    const seTypeAsset= async ()=>{
        let type:any = [{"label": "Todo (predeterminado)", value: "0", check: true}];
        try {
            const resp = await ApiService.get('/assettypecat', {
                params:{
                    perpage: 10
                }
            })
            await resp.data.data.data.forEach((element:any) => { type.push({ label: element.description, value: element.is_asset_category_cat_id, check: false })});
            setTypeAsset(type)
            return type;
        } catch (error) {
            console.error('ApiContext/getTypeAsset()', error);
            const err = error as AxiosError
            console.error(err.response?.data)
            setTypeAsset(typeData)
        }
    }
    const setLocationMethod= async ()=>{
        let lo:any = [{"label": "Todo (predeterminado)", value: "0", check: true}];
        try {
            const resp = await ApiService.get('/location', {
                params: {
                    perpage: 10,
                    orderby:'is_account_main_name,name_wo_account',
                    ordertype:'ASC',
                    is_account_main_id: 415
                }
            });
            resp.data.data.data.forEach((element:any)=>{ 
                lo.push({label: element.name, value: element.id, check: false}) 
            })
            setLocation(lo);
            return lo;
        } catch (error) {
            console.error('ApiContext/location',error);
            const err = error as AxiosError
            console.error(err.response?.data)
            setLocation(locationData)
        }
    }
    const list = async (endpoint: string, params: any) => {
        try {
            const resp = await ApiService.get(endpoint, {
                params
            });
            return resp.data;
        } catch (error) {
            console.error(error);
        }

    }
    const listOpenApi = async (endpoint: string, queryParams: any) => {

    }
    const get = async (endpoint: string, id: string) => {

    }
    const get2 = async (endpoint: string, id: string) => {

    }
    const getFromKardex = async (endpoint: string, id: string) => {

    }
    const getFromAnalytics = async (endpoint: string, id: string) => {

    }
    const createSpecial = async (endpoint: string, object: any) => {

    }
    const create = async (endpoint: string, object: any) => {

    }
    const create2 = async (endpoint: string, object: any) => {

    }
    const sendMail = async (object: any) => {

    }
    const sendMailUserActCode = async (object: any) => {

    }
    const update = async (endpoint: string, id: string, object: any) => {

    }
    const remove = async (endpoint: string, id: string) => {

    }
    const confirmationEmail = async (queryParams: any) => {

    }
    const mailPost = async (source: string, operation: string, object: any) => {

    }
    const olapPost = async (endpoint: any, id: string) => {

    }

    return (
        <ApiContext.Provider value={{
            order,
            typeAsset,
            location,
            getTickets,
            getService,
            list,
            listOpenApi,
            setLocationMethod,
            seTypeAsset,
            get,
            get2,
            getFromKardex,
            getFromAnalytics,
            create,
            create2,
            createSpecial,
            sendMail,
            sendMailUserActCode,
            update,
            remove,
            confirmationEmail,
            mailPost,
            olapPost

        }}
        >{children}</ApiContext.Provider>)
}

