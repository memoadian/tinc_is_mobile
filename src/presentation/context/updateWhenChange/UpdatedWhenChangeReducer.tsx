type UpdateAction =
    | { type: 'updatePrincipal', payload: number }
    | { type: 'updateTickets', payload: number }
    | { type: 'updateService', payload: number }
    | { type: 'updateServiceTabExpenses', payload: number }

export interface UpdatedState {
    updatePrincipal: number;
    updateTickets: number;
    updateService: number;
    updateServiceTabExpenses: number;
}

export const updatedWhenChangeReducer = (state: UpdatedState, action: UpdateAction): UpdatedState => {
    switch (action.type) {
        case "updatePrincipal":
            return {
                ...state,
                updatePrincipal: action.payload
            }
        case "updateTickets":
            return {
                ...state,
                updateTickets: action.payload
            }
        case "updateService":
            return {
                ...state,
                updateService: action.payload
            }
        case "updateServiceTabExpenses":
            return {
                ...state,
                updateServiceTabExpenses: action.payload
            }
        default:
            return state
    }
}