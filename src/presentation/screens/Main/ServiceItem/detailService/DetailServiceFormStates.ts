export interface DetailServicePageFormData {
    engineerName: String | undefined
}

export type DetailServiceFormState =  DetailServicePageFormData

export const detailServiceFormInitialState: DetailServiceFormState = {
    engineerName: ''
}