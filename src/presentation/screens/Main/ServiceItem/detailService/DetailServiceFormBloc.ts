import { Bloc } from "../../../../shared/bloc";
import { ServiceData } from "../../../../../domain/ListService/models/Service.model";
import { detailServiceFormInitialState, DetailServiceFormState } from "./DetailServiceFormStates";

export class DetailServiceFormBloc extends Bloc<DetailServiceFormState> {

    constructor(/*serviceData: ServiceData*/) {
        super(detailServiceFormInitialState)
        //this.initDataForm(serviceData)
    }

    initDataForm(serviceData: ServiceData) {
        this.changeState({ ...this.state, engineerName: serviceData.assigned_technician_from_fk });
    }
}