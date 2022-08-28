import axios, { AxiosError } from "axios";
import { PartData } from "../../../../../domain/PartsSearch/models/Parts.model";
import { PartsMaterialEntity } from "../../../../../domain/PartsSearch/models/PartsMaterial.model";
import GetPartMaterialUseCase from "../../../../../domain/ServiceItem/useCases/GetPartsMaterialUseCaseById";
import GetPartsUseCase from "../../../../../domain/PartsSearch/useCase/GetPartsUseCase";
import { Bloc } from "../../../../shared/bloc";
import { initStatePartsSearch, PartItem, PartMaterialItem, PartsSearchKinds, PartsSearchState } from "./PartsSearchState";

export class PartsSearchBloc extends Bloc<PartsSearchState> {

    constructor(
        private getPartsUseCase: GetPartsUseCase,
        private getPartMaterialUseCase: GetPartMaterialUseCase
    ) {
        super(initStatePartsSearch)
    }

    async loadParts(perpage: number, accountId: string) {
        try {
            this.changeState({
                ...this.state,
                kind: PartsSearchKinds.LoadingPartsSearchState
            })
            const { data } = await this.getPartsUseCase.invoke({
                perpage: perpage,
                is_account_main_id: Number(accountId)
            });
            const response = data.data;
           
            const items = this.getEntity(response.data);
            const dataSort = items.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });
            this.changeState({
                ...this.state,
                kind: PartsSearchKinds.LoadedPartsSearchState,
                allData: dataSort,
                filterData: dataSort,
                orderAsc: true
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: PartsSearchKinds.ErrorPartsSearchState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: PartsSearchKinds.ErrorPartsSearchState,
                    error: 'Error generico',
                });
            }
        }
    }

    async loadMaterials(partId: string, accountId: string) {
        try {
            this.changeState({
                ...this.state,
                kind: PartsSearchKinds.LoadingPartsSearchState
            })
            const { data } = await this.getPartMaterialUseCase.invoke({
                is_account_main_id: Number(accountId),
                is_account_part_id: Number(partId),
                perpage: 50,
                is_part_movement_cat_name: 'Entrada',
                is_part_material_related_with_movement_id: 'NULL'
            });
            const response = data.data;            
            const items = this.getMaterials(response.data)
            
            const allData = this.state.allData.map((item) => {
                if (item.id === partId) {                    
                    return {
                        ...item,
                        material: items,
                        isSelected: true
                    }
                }
                return {
                    ...item,
                    isSelected: false
                }
            })
            this.changeState({
                ...this.state,
                kind: PartsSearchKinds.LoadedPartsSearchState,
                allData: allData,
                filterData: allData.filter((item) => {
                    return (
                        item.name.toLocaleLowerCase().includes(this.state.textFilter)
                        || item.numPart.toLocaleLowerCase().includes(this.state.textFilter)
                        || item.brand.toLocaleLowerCase().includes(this.state.textFilter)
                        || item.type.toLocaleLowerCase().includes(this.state.textFilter)
                    )
                }),
            })

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    ...this.state,
                    kind: PartsSearchKinds.ErrorPartsSearchState,
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    ...this.state,
                    kind: PartsSearchKinds.ErrorPartsSearchState,
                    error: 'Error generico',
                });
            }
        }
    }

    filterData(text: string) {
        this.changeState({
            ...this.state,
            filterData: this.state.allData.filter((item) => {
                return (
                    item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
                    || item.numPart.toLocaleLowerCase().includes(text.toLocaleLowerCase())
                    || item.brand.toLocaleLowerCase().includes(text.toLocaleLowerCase())
                    || item.type.toLocaleLowerCase().includes(text.toLocaleLowerCase())
                    || item.classPart.toLocaleLowerCase().includes(text.toLocaleLowerCase())
                )
            }),
            textFilter: text,
        })
    }

    orderData(orderAsc: boolean) {
        const dataSort = this.state.filterData.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        })
        if (!orderAsc) {
            dataSort.reverse();
        }
        this.changeState({
            ...this.state,
            filterData: dataSort,
            orderAsc: orderAsc
        })
    }

    private getEntity(items: PartData[]): PartItem[] {
        return items.map((item) => {
            return {
                id: item.id,
                name: item.name,
                numPart: item.number,
                brand: item.part_brand,
                type: item.category_name,
                stock: Number(item.quantity),
                image: item.picture,
                classPart: item.is_part_class_cat_name,
                isSelected: false,
                material: [],
                unitPrice: item.unit_price,
                lot: item.lot  
            }
        });

    }

    private getMaterials(items: PartsMaterialEntity[]): PartMaterialItem[] {
        return items.map((item) => {
            return {
                id: item.id,
                serial: (item.serial_number === '' || item.serial_number === null) ? 'N/A' : item.serial_number,
                dueDate: (item.expiration_date === '0000-00-00') ? 'N/A' : item.expiration_date,
                isSelected: false,
                supplierId: item.es_supplier_main_id,
                accountPartId: item.is_account_part_id,
                currency: item.gc_currency_cat_id,
                lot:item.lot
            }
        })
    }
}