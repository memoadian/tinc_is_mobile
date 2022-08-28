import axios, { AxiosError } from "axios";
import { Bloc } from "../../../shared/bloc";
import { LocationRequest } from "../../../../domain/Locations/models/Location.model";
import GetLocationUseCase from "../../../../domain/Locations/useCases/GetLocationUseCase";
import { locationsInitState, LocationState } from "./LocationState";

export class LocationBloc extends Bloc<LocationState> {

    constructor(private getLocationServiceUseCase: GetLocationUseCase) {
        super(locationsInitState)
    }

    async loadLocation(request: LocationRequest) {
        try {
            const { data } = await this.getLocationServiceUseCase.invoke(request)
            const locations = data.data.data
            this.changeState({
                kind: 'LoadedLocationsState',
                data: locations
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                const data = err.response?.data
                this.changeState({
                    kind: 'ErrorLocationState',
                    error: data?.message ?? "Error",
                });
            } else {
                this.changeState({
                    kind: 'ErrorLocationState',
                    error: 'Error generico',
                });
            }
        }
    }
}