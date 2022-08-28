import { ListItem } from '@rneui/themed';
import React, { useEffect, useContext } from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../../../../core/Context/AuthContext';
import { BlocBuilder } from '../../../../../shared/bloc';
import { createContext } from '../../../../../shared/bloc/ContextFactory';
import { LoadingComponent } from '../../../../../shared/components/LoadingComponent';
import { LocationEntity } from '../../../../../../domain/Locations/models/Location.model';
import { LocationBloc } from '../../LocationBloc';
import { LocationState } from '../../LocationState';
import * as DependenciesLocationProvider from "../di/LocationProvider";
import { PresentantionModal, ItemUnicSelection } from '../../../../../shared/components/Selections';

const [locationBloc, uselocationBloc] = createContext<LocationBloc>();
export const useLocationBloc = uselocationBloc;

export interface Props {
    isVisible: boolean;
    idSelected: string | null;
    showAllRow?: boolean;
    onOutsidePressed: () => void;
    onSelected: (item: LocationEntity | null) => void;
}

export const LocationModal = ({
    isVisible = false,
    idSelected = null,
    showAllRow = true,
    onOutsidePressed,
    onSelected = () => { },
}: Props) => {
    const bloc = useLocationBloc()
    const { account } = useContext(AuthContext)
    useEffect(() => {
        bloc.loadLocation({
            is_account_main_id: account,
            orderby: "is_account_main_name,name_wo_account",
            ordertype: "ASC",
            perpage: 10000
        });
    })
    return (
        <PresentantionModal
            isVisible={isVisible}
            onOutsidePressed={onOutsidePressed}>
            <View style={styles.modal}>
                <BlocBuilder
                    bloc={bloc}
                    builder={(state: LocationState) => {
                        switch (state.kind) {
                            case 'LoadingLocationsState':
                                return <View style={{
                                    width: '100%',
                                    height: 350
                                }}>
                                    <LoadingComponent />
                                </View>
                            case 'LoadedLocationsState':
                                return (
                                    <ScrollView style={{
                                        maxHeight: Dimensions.get('window').height - 150
                                    }}>
                                        {showAllRow && <ListItem
                                            key={-1}
                                            bottomDivider
                                            onPress={() => {
                                                onSelected(null)
                                            }}
                                        >
                                            <ItemUnicSelection
                                                title={'Todo (predeterminado)'}
                                                checked={idSelected == null}
                                                value={null}
                                                onPressed={(value: any, checked: boolean) => {
                                                    onSelected(null)
                                                }}
                                            />
                                        </ListItem>}
                                        {state.data.map((item: any, index) => (
                                            <ListItem
                                                key={index}
                                                bottomDivider
                                                onPress={() => { }}>
                                                <ItemUnicSelection
                                                    title={`${item.name}`}
                                                    checked={(idSelected === item.id)}
                                                    value={item}
                                                    onPressed={(value: any, checked: boolean) => {
                                                        onSelected(value)
                                                    }}
                                                />
                                            </ListItem>
                                        ))
                                        }
                                    </ScrollView>
                                )
                            default: return <View />
                        }
                    }}
                />
            </View>
        </PresentantionModal>
    )
}

export const LocationModalComponent = (props: Props) => {
    return (
        <locationBloc.Provider value={DependenciesLocationProvider.provideTicketBloc()} >
            <LocationModal
                idSelected={props.idSelected}
                isVisible={props.isVisible}
                onSelected={props.onSelected}
                showAllRow={props.showAllRow}
                onOutsidePressed={props.onOutsidePressed} />
        </locationBloc.Provider>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        maxHeight: '90%',
        padding: 4,
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 4,
        borderRadius: 8
    }
})