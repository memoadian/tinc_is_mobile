import React, { useState } from "react"
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ServiceData } from "../../../../../domain/ListService/models/Service.model";
import { BlocBuilder } from "../../../../shared/bloc";
import { TextField } from "../../../../shared/components/TextField";
import { GeneralStyles } from "../../../../shared/styles/generalStyles";
import { ServiceItemState } from "../ServiceItemState";
import { servicesBloc } from "./ServiceItemPage";
import { SignatureModal } from "./SignatureModal";
import { createContext } from "../../../../shared/bloc/ContextFactory";
import { ServiceItemBloc, TabService } from "../ServiceItemBloc";
import * as DependenciesServiceProvider from '../di/ServiceItemProvider';
import { LoadingComponent } from "../../../../shared/components/LoadingComponent";

const { width } = Dimensions.get('window');
export interface Props {hasPermissions: boolean;}
const [internalServicesBlock, internalUseServicesBloc] = createContext<ServiceItemBloc>();
export const internal = internalUseServicesBloc;

export const TabSignatureComponent = (props: Props) => {
    return (
        <internalServicesBlock.Provider value={DependenciesServiceProvider.provideServiceItemBloc()}>
            <TabSignatureView 
                hasPermissions={props.hasPermissions}/>
        </internalServicesBlock.Provider>
    )
}

export const TabSignatureView = ({ hasPermissions }: Props) => {
    const serviceItemBloc = servicesBloc();
    const internalBloc = internal()

    enum SignatureType {
        Chief,
        Specialist,
        EndUser,
      }

    /**
     * Data.
     */
    const [chiefName, setChiefName] = useState('');
    const [specialistName, setSpecialistName] = useState('');
    const [endUserName, setEndUserName] = useState('');
    const [chiefSignature, setChiefSignature] = useState('');
    const [specialistSignature, setSpecialistSignature] = useState(null);
    const [endUserSignature, setEndUserSignature] = useState(null);
    const [currentSign, setCurrentSign] = useState(SignatureType.Chief);
    const [editName, setEditName] = useState('');
    const[isFirstTime, setIsFirstTime] = useState(true)

    const [isVisibleSignModal, setIsVisibleSignModal] = useState(false);
    const [currentServiceData, setCurrentServiceData] = useState<ServiceData | undefined>()

    const initForm = (serviceData: ServiceData | undefined) => {
        if(serviceData?.service_chief_name)
            setChiefName(serviceData?.service_chief_name)
        if(serviceData?.service_specialist_name)
            setSpecialistName(serviceData?.service_specialist_name)
        if(serviceData?.end_user_name)
            setEndUserName(serviceData?.end_user_name)
        if(serviceData?.service_chief_signature)
            setChiefSignature(serviceData?.service_chief_signature)
        //if(serviceData?.service_specialist_signature)
            //setSpecialistSignature(serviceData?.service_specialist_signature)
        //if(serviceData?.end_user_signature)
            //setEndUserSignature(serviceData?.end_user_signature)
    }

    const handleOK = (signature, name) => {
        switch ( currentSign ) {
            case SignatureType.Chief:
                setChiefSignature(signature)
                setChiefName(name)
                setEditName('')
            break;
            case SignatureType.EndUser:
                setEndUserSignature(signature)
                setEndUserName(name)
                setEditName('')
            break;
            case SignatureType.Specialist:
                setSpecialistSignature(signature)
                setSpecialistName(name)
                setEditName('')
            break;
        }
        updateSignature(signature, name)
      };
    
    const updateSignature = (currentSignature : string, signatureName: string) => {
        switch ( currentSign ) {
            case SignatureType.Chief:
                internalBloc.updateServiceR(`${currentServiceData?.id}`, {
                    service_chief_signature: currentSignature,
                    service_chief_name: signatureName
                  }, TabService.SignatureView)
            break;
            case SignatureType.Specialist:
                internalBloc.updateServiceR(`${currentServiceData?.id}`, {
                    service_specialist_signature: currentSignature,
                    service_specialist_name: signatureName

                  }, TabService.SignatureView)
            break;
            case SignatureType.EndUser:
                internalBloc.updateServiceR(`${currentServiceData?.id}`, {
                    end_user_signature: currentSignature,
                    end_user_name: signatureName
                  }, TabService.SignatureView)
            break;
        }
    }
    
    return (
        <View>
            {/*
            <BlocBuilder
                bloc={internalBloc}
                builder={(state: ServiceItemState) => {
                    if (state.kindServiceTabs === 'LoadingUpdateSignatureViewState') { 
                        return <View style={{height: '100%', width}}>
                                    <LoadingComponent/>
                                </View>
                    } else {
                        return <></>
                    }
                }}
            >
            </BlocBuilder>*/}
            <View
                style={{
                    flex: 1,
                    width,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                }}
            >
                {/*<BlocBuilder
                    bloc={serviceItemBloc}
                    builder={(state: ServiceItemState) => {
                        if (state.kind === 'LoadedProviderServiceItemState') {
                            if(isFirstTime === true) {
                                setIsFirstTime(false)
                                setCurrentServiceData(state.data[0])
                                initForm(state.data[0])
                            }
                            return <></>
                        }
                    }}
                >
                </BlocBuilder>
                 */}
                <ScrollView>
                    <View style={[GeneralStyles.simpleCardView, styles.centerView,{paddingBottom:20}]}>                
                        <Text
                            style={[styles.title, { marginTop: 15 }]}
                        >
                            Jefe de Servicio
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (hasPermissions) {
                                    setCurrentSign(SignatureType.Chief)
                                    setEditName(chiefName)
                                    setIsVisibleSignModal(true)
                                }                            
                            }}
                        >
                            <Image resizeMode={"stretch"} style={{width: 250, height: 120,  borderWidth: 1, borderColor: 'black'}} source={{uri: chiefSignature}}/>        
                        </TouchableOpacity>
    
                        <TextField
                                multiline={false}
                                autoCapitalize='none'
                                value={chiefName}
                                editable={false}
                            />
                        <Text
                            style={[styles.title]}
                        >
                            Ingeniero de Servicio
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (hasPermissions) {
                                    setEditName(specialistName)
                                    setCurrentSign(SignatureType.Specialist)
                                    setIsVisibleSignModal(true)
                                }                            
                            }}
                        >
                            {/*<Image resizeMode={"stretch"} style={{width: 250, height: 120,  borderWidth: 1, borderColor: 'black'}} source={{uri: specialistSignature}}/>*/}
                        </TouchableOpacity> 
                        <TextField
                                multiline={false}
                                autoCapitalize='none'
                                value={specialistName}
                                editable={false}
                            />
                        <Text
                            style={[styles.title]}
                        >
                            Usuario final
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (hasPermissions) {
                                    setEditName(endUserName)
                                    setCurrentSign(SignatureType.EndUser)
                                    setIsVisibleSignModal(true)
                                }
                            }}
                        >
                            {/*<Image 
                            resizeMode={"stretch"} 
                            style={{width: 250, height: 120,  borderWidth: 1, borderColor: 'black'}} 
                            source={{uri: endUserSignature}}/>*/}
                        </TouchableOpacity>
                        <TextField
                                multiline={false}
                                autoCapitalize='none'
                                value={endUserName}
                                editable={false}
                            />

                        <SignatureModal
                            isVisible={isVisibleSignModal}
                            signatureName = {editName}
                            onCloseModalPressed={() => {
                                setEditName('')
                                setIsVisibleSignModal(false)
                            }}
                            onSavePressed={(signatureName, signature) => {
                                setIsVisibleSignModal(false)
                                handleOK(signature, signatureName)
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    centerView: {
        alignItems: 'center'
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold'

    },
    modal: {
        backgroundColor: '#FFFFFF',
        width: 350,
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 4,
        borderRadius: 8,
        paddingBottom: 12
    },
    titleInput: {
    marginHorizontal: 10,
    marginBottom: 4,
    marginTop: 8
    },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
    }
})