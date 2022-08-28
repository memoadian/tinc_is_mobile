import axios, { AxiosError } from "axios";
import { Bloc } from "../../../../shared/bloc";
import { NotificationState, initStateNotificationState, NotificationDataState } from './NotificationState';
import GetNotificationUseCase from "../../../../../domain/Configuration/useCase/GetNotificationUseCase";
import UpdateNotificationUseCase from '../../../../../domain/Configuration/useCase/UpdateNotificationUseCase';
import { NotificationGetData } from "../../../../../domain/Configuration/models/NotificationGet.model";

export class NotificationBloc extends Bloc<NotificationState> {

    constructor(
        private getNotificationUseCase: GetNotificationUseCase,
        private updateNotificationUseCase: UpdateNotificationUseCase
    ) {
        super(initStateNotificationState)
    }

    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async getNotification() {
        this.changeState({
            kind: 'LoadingNotificationState'
        })
        await this.sleep(500);
        try {
            const data = await this.getNotificationUseCase.invoke();
            const response = data.data           
            this.changeState({
                kind: 'PrintNotificationState',
                data: this.toNotification(response.data)
            })            
            this.changeState({
                kind: 'EmptyNotificationState'
            }) 
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    kind: 'ErrorNotificationState',
                    error: data?.message ?? "Error",
                })
            } else {
                this.changeState({
                    kind: 'ErrorNotificationState',
                    error: (error as AxiosError).message,
                });
            }
        }
    }
    async updateNotification(id: string, enabled: boolean) {
      /*   console.log('entro update!')
        console.log('enabled')
        console.log(enabled)
        
        console.log('id')
        console.log(id) */
        try {
            var enabledString = '0'
            if (enabled){
                enabledString = '1'
            } 
           /*  console.log('enabledString')
            console.log(enabledString) */
            const {data, config} = await this.updateNotificationUseCase.invoke({
                option: id,
                enabled: enabledString
            });
           /*  console.log('config')
            console.log(JSON.stringify(config,null,2))
            console.log('data')
            console.log(data) */
            this.changeState({
                kind: 'EmptyNotificationState',
            }) 
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data;
                this.changeState({
                    kind: 'ErrorNotificationState',
                    error: data?.message ?? "Error",
                })
            } else {
                this.changeState({
                    kind: 'ErrorNotificationState',
                    error: (error as AxiosError).message,
                });
            }
        }
    }
    private toNotification(notification: NotificationGetData): NotificationDataState[] {
        return notification.data.flatMap((item) => {
            return {
                id: item.id,
                is_user_alert_cat_id: item.is_user_alert_cat_id,
                is_user_alert_cat_name: item.is_user_alert_cat_name,
                enabled: item.enabled
            }
        })
    }
}