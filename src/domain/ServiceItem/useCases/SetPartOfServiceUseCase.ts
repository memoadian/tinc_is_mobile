import ServiceRepository from '../repository/ServiceRepository';
import {PartToService} from '../../../presentation/screens/Main/ServiceItem/ServiceItemState';
import {AxiosResponse} from 'axios';
import {PartsServiceResponse} from '../models/Service.model';

export default class SetPartOfServiceUseCase {
  
  private serviceRepository: ServiceRepository;
  
  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }
  
  invoke(part: PartToService): Promise<AxiosResponse<PartsServiceResponse>> {
    return this.serviceRepository.setPartOfService(part);
  }
  
}
