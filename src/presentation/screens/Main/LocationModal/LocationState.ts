import { LocationEntity } from "../../../../domain/Locations/models/Location.model";

export interface LoadingLocationsState {
    kind: 'LoadingLocationsState';
}

export interface ErrorLocationState {
    kind: 'ErrorLocationState';
    error: string;
}

export interface LoadedLocationsState {
    kind: 'LoadedLocationsState';
    data: LocationEntity[];
}

export type LocationState = LoadingLocationsState | ErrorLocationState | LoadedLocationsState;

export const locationsInitState: LocationState = {
    kind: 'LoadingLocationsState',
}