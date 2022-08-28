import axios, { AxiosError } from "axios";
import { Bloc } from "../../../shared/bloc";
import { ProviderEntity, ProviderRequest } from "../../../../domain/ProviderSearch/models/ProviderSearch.model";
import GetProvidersUseCase from "../../../../domain/ProviderSearch/useCase/GetProvidersUseCase";
import { initStateProviderSearch, ProviderItem, ProviderSearchState } from "./ProviderSearchState";

export class ProviderSearchBloc extends Bloc<ProviderSearchState> {

    constructor(
        private getProvidersUseCase: GetProvidersUseCase
    ) {
        super(initStateProviderSearch)
    }
    async loadProviderSearch(request?: ProviderRequest, moreData: boolean = false) {
        var query: ProviderRequest = {
            perPage: 1000,
            page: 1,
            sortDirection: 'ASC',
            textQuery: ''
        }
        var totalPages = this.state.data.totalPages;
        var currentPage = this.state.data.page;

        if (currentPage > totalPages && moreData) { return }

        if (moreData) {
            query = {
                ...this.state.data.query,
                page: currentPage
            }
            this.changeState({
                kind: 'LoadingProviderSearchState',
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
                kind: 'LoadingProviderSearchState',
                data: {
                    ...this.state.data,
                    items: [],
                    totalRows: 0,
                    totalPages: 1,
                    page: 1,
                    query: query
                }
            })
        }

        try {
            const { data } = await this.getProvidersUseCase.invoke(query);
            const response = data.data;
            const items = this.getItemData(response.data)
            this.changeState({
                kind: 'LoadedProviderSearchState',
                data: {
                    items: [...this.state.data.items, ...items],
                    totalPages: response.total_pages,
                    totalRows: response.total_rows,
                    page: this.state.data.page + 1,
                    query: query
                }
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'ErrorProviderSearchState',
                    error: data?.message ?? "Error",
                    data: this.state.data
                });
            } else {
                this.changeState({
                    kind: 'ErrorProviderSearchState',
                    error: 'Error generico',
                    data: this.state.data
                });
            }
        }
    }

    setSeelected(provider: ProviderItem) {
        this.changeState({
            kind: 'LoadedProviderSearchState',
            data: {
                ...this.state.data,
                items: this.state.data.items.map((item) => {
                    return {
                        ...item,
                        isSelected: item.id === provider.id
                    }
                }),
            }
        })
    }

    private getItemData(data: ProviderEntity[]): ProviderItem[] {
        return data.map((item) => {
            return {
                id: item.id,
                id_tinc: item.id_tinc,
                name: item.name,
                country_name: item.country_name,
                state: item.gc_state_cat_name,
                city: item.gc_city_cat_name,
                image: item.logo_url ?? '',
                bussinessName: item.legal_name, 
                isSelected: false
            }
        })
    }
}