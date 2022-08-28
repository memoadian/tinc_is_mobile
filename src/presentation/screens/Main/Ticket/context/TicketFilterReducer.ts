type TicketFilterAction =
    | { type: 'search', search: string | null }
    | { type: 'myWork', myWork: string | null }
    | { type: 'date', date: number[] | null }
    | { type: 'status', status: string | null }
    | { type: 'priority', priority: number[] | null }
    | { type: 'location', location: string | null }
    | { type: 'requestType', requestType: number[] | null }
    | { type: 'queryPath', queryPath: string | null }
    | { type: 'clean' }

export interface TicketFilterState {
    search: string | null;
    myWork: string | null;
    date: number[] | null;
    status: string | null;
    priority: number[] | null;
    location: string | null;
    requestType: number[] | null;
    queryPath: string | null;
}

export const ticketFilterState: TicketFilterState = {
    search: null,
    myWork: null,
    date: null,
    status: null,
    priority: null,
    location: null,
    requestType: null,
    queryPath: null
}

export const ticketFilterReducer = (state: TicketFilterState, action: TicketFilterAction): TicketFilterState => {
    switch (action.type) {
        case 'search':
            return {
                ...state,
                search: action.search
            }
        case 'myWork':
            return {
                ...state,
                myWork: action.myWork
            }
        case 'date':
            return {
                ...state,
                date: action.date
            }
        case 'status':
            return {
                ...state,
                status: action.status
            }
        case 'priority':
            return {
                ...state,
                priority: action.priority
            }
        case 'location':
            return {
                ...state,
                location: action.location
            }
        case 'requestType':
            return {
                ...state,
                requestType: action.requestType
            }
        case 'queryPath':
            return {
                search: '',
                myWork: null,
                date: null,
                status: null,
                priority: null,
                location: null,
                requestType: null,
                queryPath: action.queryPath,
            }
        case 'clean':
            return {
                search: null,
                myWork: null,
                date: null,
                status: null,
                priority: null,
                location: null,
                requestType: null,
                queryPath: null,
            }
        default: return state
    }
}