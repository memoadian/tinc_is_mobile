import { ServiceResponse } from "../../../../../domain/Home/models/Home.model";

export interface LoadingHomeState {
    kind: 'LoadingHomeState';
}

export interface ErrorHomeState {
    kind: 'ErrorHomeState';
    error: string;
}

export interface LoadedHomeState {
    kind: 'LoadedHomeState';
    resume: Resume[];
}

export interface Resume {
    title: string;
    data: ResumeCellEntity[];
}

export interface ResumeCellEntity {
    subtitle: string;
    resume: string;
    section: 'service' | 'ticket';
    query: string;
    enable: boolean;
}

export type HomeState = LoadingHomeState | ErrorHomeState | LoadedHomeState;

export const homeInitState: HomeState = {
    kind: 'LoadingHomeState'
}