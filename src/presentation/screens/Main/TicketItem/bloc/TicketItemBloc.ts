import {Bloc} from '../../../../shared/bloc';
import {initTicketItemState, TicketAssetKinds, TicketItemKinds, TicketItemState} from './TicketItemState';
import GetTicketUseCase from '../../../../../domain/TicketItem/useCases/GetTicketUseCase';
import axios, {AxiosError} from 'axios';
import {TicketData} from '../../../../../domain/ListTickets/models/Ticket.model';
import UpdateTicketUseCase from '../../../../../domain/TicketItem/useCases/UpdateTicketUseCase';
import {TicketModel} from '../../../../../domain/TicketItem/models/Ticket.model';
import GetTicketServicesUseCase from '../../../../../domain/TicketItem/useCases/GetTicketServicesUseCase';
import GetActiveDetailUseCase from '../../../../../domain/FormOrderService/useCase/GetActiveDetailUseCase';
import { ActiveEntiy } from '../../../../../domain/ActiveSearch/models/ActiveSearch.model';
import { ActiveItem } from '../../ActiveSearch/bloc/ActiveSearchState';
import { ToastModule } from '../../../../shared/components/Toast';

export class TicketItemBloc extends Bloc<TicketItemState> {
  constructor(
    private getTicketUseCase: GetTicketUseCase,
    private updateTicketUseCase: UpdateTicketUseCase,
    private getTicketServicesUseCase: GetTicketServicesUseCase,
    private getActiveDetailUseCase: GetActiveDetailUseCase
  ) {
    super(initTicketItemState);
  }

  sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  async getTicket(idTicket: string) {
    try {
      this.changeState({
        ...this.state,
        kind: TicketItemKinds.LoadingTicketItemState
      });
      const { data } = await this.getTicketUseCase.invoke(idTicket);
      const response = data.data;
      this.changeState({
        ...this.state,
        kind: TicketItemKinds.LoadedTicketItemState,
        data: response as TicketData[]
      });
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        const data = err.response?.data;
        this.changeState({
          ...this.state,
          kind: TicketItemKinds.ErrorTicketItemState,
          error: data?.message ?? 'Error'
        });
      } else {
        this.changeState({
          ...this.state,
          kind: TicketItemKinds.ErrorTicketItemState,
          error: 'Error generico'
        });
      }
    }
  }
  
  async updateTicket(idTicket: string, ticket: TicketModel) {
    if(
      (ticket.end_user_signature?.length ?? 0) > 20000 ||
      (ticket.service_chief_signature?.length ?? 0) > 20000 ||
      (ticket.service_specialist_signature?.length ?? 0) > 20000
      )
    {
      ToastModule.show("success","La firma es demasiado grande favor de intentar con una firma mas simple")
      return;
    }
    console.log(idTicket)
    console.log(ticket)
    try {
      this.changeState({
        ...this.state,
        kind: TicketItemKinds.LoadingTicketItemState
      });
      const { data } = await this.updateTicketUseCase.invoke(idTicket, ticket);
     
      this.changeState({
        ...this.state,
        kind: TicketItemKinds.UpdateTicketState
      });
      console.log(data)
      ToastModule.show("success","Los datos se han actualizado correctamente")
      await this.getTicket(idTicket);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        const data = err.response?.data;
        this.changeState({
          ...this.state,
          kind: TicketItemKinds.ErrorTicketItemState,
          error: data?.message ?? 'Error'
        });
      } else {
        this.changeState({
          ...this.state,
          kind: TicketItemKinds.ErrorTicketItemState,
          error: 'Error generico'
        });
      }
    }
  }

  async getActiveDetail(idActive: string) {
    this.changeState({
        ...this.state,
        kindAsset: TicketAssetKinds.LoadingProviderTicketAssetState            
    })
    await this.sleep(500);
    try {
        const data = await this.getActiveDetailUseCase.invoke(idActive);
        const response = data.data  
        this.changeState({
            ...this.state,
            kindAsset: TicketAssetKinds.LoadedProviderTicketAssetState,
            assetData: this.toActiveItem(response.data[0])
        })         
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            const data = err.response?.data;
            this.changeState({
                ...this.state,
                kindAsset: TicketAssetKinds.ErrorProviderTicketAssetState,
                error: data?.message ?? "Error",
            })
        } else {
            this.changeState({
                ...this.state,
                kindAsset: TicketAssetKinds.ErrorProviderTicketAssetState,
                error: (error as AxiosError).message,
            });
        }
    }
}

private toActiveItem(item: ActiveEntiy): ActiveItem {
  return {
      id: item.id,
      idTinc: item.id_tinc,
      model: item.model,
      asset_brand_name: item.asset_brand_name,
      serialNumber: item.serial_number,
      assetCategoryName: item.asset_category_name,
      locationName: item.location_name,
      sublocationName: item.sublocation_name,
      image: item.asset_picture ?? '',
      isSelected: false,
      asset_type_name: item.asset_type_name,
      is_account_location_id: item.is_account_location_id,
      is_account_main_id: item.is_account_main_id,
      is_asset_status_cat_id: item.is_asset_status_cat_id,
  }
}
  
  async getTicketServices(folio: string) {
    try {
      this.changeState({
        ...this.state,
        kind: TicketItemKinds.LoadingTicketItemState
      });
      const { data } = await this.getTicketServicesUseCase.invoke(folio);
      this.changeState({
        ...this.state,
        kind: TicketItemKinds.LoadedTicketItemState,
        services: data.data.data
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        const data = err.response?.data;
        this.changeState({
          ...this.state,
          kind: TicketItemKinds.ErrorTicketItemState,
          error: data?.message ?? 'Error'
        });
      } else {
        this.changeState({
          ...this.state,
          kind: TicketItemKinds.ErrorTicketItemState,
          error: 'Error generico'
        });
      }
    }
  }
}
