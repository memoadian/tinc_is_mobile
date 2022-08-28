
export interface LoadingUserSearchState {
    kind: 'LoadingUserSearchState',
}

export interface LoadedUserSeachState {
    kind: 'LoadedUserSeachState',
    data: UserItem[],
    filter: UserItem[],
    orderAsc: boolean
}

export interface ErrorUserSeachState {
    kind: 'ErrorUserSeachState',
    error: string,
}

export interface SleepUserSearchState {
    kind: 'SleepUserSearchState',
    data: UserItem[],
    filter: UserItem[],
    orderAsc: boolean
}


export interface UserItem {
    id: string;
    image: string;
    rolName: string;
    fullname: string;
    isSelected: boolean;
    profile_picture: string;
}

export type UserSearchState =
    | LoadingUserSearchState
    | LoadedUserSeachState
    | ErrorUserSeachState
    | SleepUserSearchState

export const initStateUserSearch: UserSearchState = {
    kind: 'LoadingUserSearchState'
}