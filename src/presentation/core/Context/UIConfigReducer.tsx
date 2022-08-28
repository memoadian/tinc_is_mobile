
type UIConfigAction =
    | { type: 'setBtnAccount', payload: boolean }

export interface UIConfig {
    showBtnAccount: boolean;
}

export const uiConfigReducer = (state: UIConfig, action: UIConfigAction): UIConfig => {
    switch (action.type) {
        case 'setBtnAccount':
            return {
                ...state,
                showBtnAccount: action.payload
            }
        default: return state;

    }
}