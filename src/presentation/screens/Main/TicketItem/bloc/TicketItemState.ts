import {TicketData} from '../../../../../domain/ListTickets/models/Ticket.model';
import {ServiceData} from '../../../../../domain/ListService/models/Service.model';
import { ActiveItem } from '../../ActiveSearch/bloc/ActiveSearchState';

export interface TicketItemState {
  kind: TicketItemKinds;
  kindAsset: TicketAssetKinds
  data: TicketData[];  
  services: ServiceData[];
  assetData:ActiveItem | undefined,
  error: string;
}

export enum TicketItemKinds {
  LoadingTicketItemState = 'LoadingTicketItemState',
  LoadedTicketItemState = 'LoadedTicketItemState',
  ErrorTicketItemState = 'ErrorTicketItemState',
  UpdateTicketState = 'UpdateTicketState',
  Empty = ''
}

export enum TicketAssetKinds {
  LoadingProviderTicketAssetState = 'LoadingProviderTicketAssetState',
  LoadedProviderTicketAssetState = 'LoadedProviderTicketAssetState',
  ErrorProviderTicketAssetState = 'ErrorProviderTicketAssetState',
  Empty = ''
}

export const initTicketItemState: TicketItemState = {
  kind: TicketItemKinds.Empty,
  kindAsset: TicketAssetKinds.Empty,
  data: [],
  services: [],
  error: '',
  assetData: undefined
}
