import ServiceRepository from '../repository/ServiceRepository';
import { AxiosResponse } from 'axios';
import { PartsServiceResponse } from '../models/Service.model';

export default class GetServiceAccountPartByIdUserCase {

  private serviceRepository: ServiceRepository;

  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  invoke(idPart: string): Promise<AxiosResponse<PartsServiceResponse>> {
    return this.serviceRepository.getServiceAccountPartById(idPart);
  }

}
