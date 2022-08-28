import axios, { AxiosError } from "axios";
import { Bloc } from "../../../../shared/bloc";
import { ActiveEntiy, ActiveRequest } from "../../../../../domain/ActiveSearch/models/ActiveSearch.model";
import GetActiveUseCase from "../../../../../domain/ActiveSearch/useCase/GetAvtivesUseCase";
import { ActiveItem, ActiveSearchState, initStateActiveSearch } from "./ActiveSearchState";

export class ActiveSearchBloc extends Bloc<ActiveSearchState> {

    constructor(
        private getActiveUseCase: GetActiveUseCase
    ) {
        super(initStateActiveSearch)
    }

    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async loadActivesSearch(request?: ActiveRequest, moreData: boolean = false) {
        let query: ActiveRequest = {
            perPage: 50,
            page: 1,
            sortDirection: 'ASC',
            accountMain: 0,
            textQuery: ''
        };
        const totalPages = this.state.data.totalPages;
        const currentPage = this.state.data.query.page;

        if (currentPage > totalPages && moreData) {
            return
        }

        if (moreData) {
            query = {
                ...this.state.data.query,
                page: currentPage
            }
            this.changeState({
                kind: 'LoadingActiveSearchState',
                data: this.state.data
            })
        } else {
            if (request) {
                query = {
                    ...request,
                    page: 1
                }
            }
            this.changeState({
                kind: 'LoadingActiveSearchState',
                data: {
                    ...this.state.data,
                    items: [],
                    totalRows: 0,
                    totalPages: 1,
                    query: query
                }
            })
        }

        await this.sleep(500);

        try {
            const { data, config } = await this.getActiveUseCase.invoke(query);
            const response = data.data;
            const items = this.getItemData(response.data)
            this.changeState({
                kind: 'LoadedActiveSearchState',
                data: {
                    items: [...this.state.data.items, ...items],
                    totalPages: response.total_pages,
                    totalRows: response.total_rows,
                    query: {
                        ...query,
                        page: response.page + 1
                    }
                }
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'ErrorActiveSearchState',
                    error: data?.message ?? "Error",
                    data: this.state.data
                });
            } else {
                this.changeState({
                    kind: 'ErrorActiveSearchState',
                    error: 'Error generico',
                    data: this.state.data
                });
            }
        }
    }

    setSeelected(active: ActiveItem) {
        this.changeState({
            kind: 'LoadedActiveSearchState',
            data: {
                ...this.state.data,
                items: this.state.data.items.map((item) => {
                    return {
                        ...item,
                        isSelected: item.id === active.id
                    }
                }),
            }
        })
    }

    private getItemData(data: ActiveEntiy[]): ActiveItem[] {
        return data.map((item) => {
            return {
                id: item.id,
                idTinc: item.id_tinc,
                model: item.model,
                asset_brand_name: item.asset_brand_name,
                serialNumber: item.serial_number,
                assetCategoryName: item.asset_category_name,
                locationName: item.location_name,
                sublocationName: item.sublocation_name,
                image: item.asset_picture ?? '',
                asset_type_name: item.asset_type_name,
                is_account_location_id: item.is_account_location_id,
                is_account_main_id: item.is_account_main_id,
                isSelected: false,
                is_asset_status_cat_id: item.is_asset_status_cat_id
            }
        })
    }
}