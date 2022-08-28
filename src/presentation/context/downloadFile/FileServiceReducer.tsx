export interface ServiceFileState {
    status: 'success-down' | 'error-down' | 'success-up' | 'error-up' | 'error-user' | 'empty',
    message: string;
    url: string;
    fileName: string;
    fileSize: number;
}

type ServiceFileAction =
    | {
        type: 'finished',
        payload: {
            result: 'success-down' | 'error-down' | 'success-up' | 'error-up' | 'error-user' | 'empty',
            message: string;
            url: string;
            fileName: string;
            fileSize: number;
        }
    }

export const fileServiceReducer = (state: ServiceFileState, action: ServiceFileAction) => {
    switch (action.type) {
        case 'finished':
            return {
                status: action.payload.result,
                message: action.payload.message,
                url: action.payload.url,
                fileName: action.payload.fileName,
                fileSize: action.payload.fileSize
            }
        default: return state
    }
}