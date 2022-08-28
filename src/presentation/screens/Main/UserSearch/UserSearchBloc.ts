import axios, { AxiosError } from "axios";
import { UserEntity } from "../../../../domain/UserSearch/models/UserSearch.model";
import GetUserSearchUseCase from "../../../../domain/UserSearch/useCase/GetUserSearchUseCase";
import { Bloc } from "../../../shared/bloc";
import { initStateUserSearch, UserItem, UserSearchState } from "./UserSearchState";

export class UserSearchBloc extends Bloc<UserSearchState> {

    constructor(
        private getUserSearchUseCase: GetUserSearchUseCase
    ) {
        super(initStateUserSearch)
    }

    async loadUserSearch(perpage: number, is_account_main_id: number) {
        try {
            const { data } = await this.getUserSearchUseCase.invoke(perpage, is_account_main_id);
            const response = data.data;
            const items = this.getUserItemData(response.data);
            const dataSort = items.sort((a, b) => {
                return a.fullname > b.fullname ? 1 : -1;
            });
            this.changeState({
                kind: 'LoadedUserSeachState',
                data: dataSort,
                filter: dataSort,
                orderAsc: true
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'ErrorUserSeachState',
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    kind: 'ErrorUserSeachState',
                    error: 'Error generico',
                });
            }
        }
    }

    setSelected(user: UserItem) {
        if (this.state.kind === 'LoadedUserSeachState' || this.state.kind === 'SleepUserSearchState') {
            this.changeState({
                kind: 'LoadedUserSeachState',
                data: this.state.data.map((item) => {
                    return {
                        ...item,
                        isSelected: item.id === user.id
                    }
                }),
                filter: this.state.filter.map((item) => {
                    return {
                        ...item,
                        isSelected: item.id === user.id
                    }
                }),
                orderAsc: this.state.orderAsc
            })
        }
    }

    filterData(text: string) {
        if (this.state.kind === 'LoadedUserSeachState' || this.state.kind === 'SleepUserSearchState') {
            this.changeState({
                kind: 'LoadedUserSeachState',
                data: this.state.data,
                filter: this.state.data.filter((item) => {
                    return (item.fullname.toLocaleLowerCase().includes(text.toLocaleLowerCase())
                        || item.rolName.toLocaleLowerCase().includes(text.toLocaleLowerCase()))
                }),
                orderAsc: this.state.orderAsc
            })
        }
    }

    orderData(orderAsc: boolean) {
        if (this.state.kind === 'LoadedUserSeachState' || this.state.kind === 'SleepUserSearchState') {
            const dataSort = this.state.filter.sort((a, b) => {
                return a.fullname > b.fullname ? 1 : -1;
            });
            if (!orderAsc) {
                dataSort.reverse();
            }
            this.changeState({
                kind: 'LoadedUserSeachState',
                data: this.state.data,
                filter: dataSort,
                orderAsc: orderAsc
            })
        }
    }

    private getUserItemData(data: UserEntity[]): UserItem[] {
        return data.map((item) => {
            return {
                id: item.id,
                image: '',
                rolName: item.is_user_role_cat_name,
                fullname: item.full_name,
                isSelected: false,
                profile_picture: item.profile_picture
            }
        })
    }
}