import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Platform,
    PermissionsAndroid,
    Alert
} from 'react-native';
import {BlocBuilder} from "../../../../shared/bloc";
import {StackNavigationProp} from '@react-navigation/stack';
import {createContext} from '../../../../shared/bloc/ContextFactory';
import {LoadingComponent} from '../../../../shared/components/LoadingComponent';
import {AuthContext} from '../../../../core/Context/AuthContext';
import {ToastModule} from '../../../../shared/components/Toast';
import uuid from 'react-native-uuid';
import {Divider} from '../../../../shared/components/Divider';
import {TButton} from '../../../../shared/components/TButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import {FileDownloadContext, FileDownloadProvier} from '../../../../context/downloadFile/FileServiceContext';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker, {DocumentPickerResponse} from 'react-native-document-picker';
import {Asset, CameraOptions, launchCamera} from 'react-native-image-picker';
import {AlertInput} from '../../../../shared/components';
import {AnnexesTicketBloc} from '../bloc/AnnexesTicketBloc';
import {annexesTikcetModule} from '../../../../../di/AnnexesTicket/ProviderAnnexesTicket';
import {AnnexesTicketData, TicketItemKindAnnexes, TicketItemKindAnnexesState} from '../bloc/AnnexesTicketState';
import {ItemAnnexView} from '../../ServiceItem/components/ItemAnnexeView';
import {MenuAlert} from '../../../../shared/components/MenuAlert';
import * as RNFS from "react-native-fs";

const [annexesServiceBlocContext, useBloc] = createContext<AnnexesTicketBloc>();
export const annexesServiceBloc = useBloc;
const {width} = Dimensions.get('window');

export interface Props {
    idTicket: string,
    hasPermissions: boolean
}

export const TabAnnexesTicketState = (props: Props) => {
    return (
        <FileDownloadProvier>
            <annexesServiceBlocContext.Provider value={annexesTikcetModule.providerBloc()}>
                <TabAnnexesTicketView
                    idTicket={props.idTicket}
                    hasPermissions={props.hasPermissions}/>
            </annexesServiceBlocContext.Provider>
        </FileDownloadProvier>
    )
}

export const TabAnnexesTicketView = ({idTicket, hasPermissions}: Props) => {

    const bloc = annexesServiceBloc();
    const {account} = useContext(AuthContext);
    const [isVisibleOptionMenu, setIsVisibleOptionMenu] = useState(false);
    const {
        status,
        url,
        fileName,
        fileSize,
        message,
        isLoading,
        downloadFile,
        uploadMPFile,
        getMime
    } = useContext(FileDownloadContext);
    const [fileResponse, setFileResponse] = useState<DocumentPickerResponse | null>();
    const [uriFile, setUriFile] = useState<string>("");
    const [pictureTook, setPictureTook] = useState<Asset | null>(null)
    const [nameAnnexe, setNameAnnexe] = useState('')
    const [isVisibleAlert, setIsVisibleAlert] = useState(false);
    const btmSheet = useRef<RBSheet>(null);
    const ticketRemove = useRef<AnnexesTicketData>()
    const menuOptions = [
        {
            id: 1,
            key: `${uuid.v4()}`,
            title: 'Escoger entre mis archivos',
        },
        {
            id: 2,
            key: `${uuid.v4()}`,
            title: 'Usar mi cámara',
        },
        {
            id: 3,
            key: `${uuid.v4()}`,
            title: 'Cancelar',
        }
    ];

    useEffect(() => {
        if (status === 'success-down') {
            Alert.alert(
                'Exito',
                "Archivo descargado correctamente",
                [
                    {
                        text: "Abrir",
                        onPress: () => {
                            if (url !== '') {
                                if (Platform.OS === 'ios') {
                                    RNFetchBlob.ios.previewDocument(url);
                                } else if (Platform.OS === 'android') {
                                    RNFetchBlob.android.actionViewIntent(url, getMime(url));
                                }
                            }
                        },
                    },
                ],
                {
                    cancelable: true,
                }
            );
        } else if (status === 'error-down') {
            Alert.alert(
                'Error',
                message,
                [
                    {
                        text: "Cerrar",
                        onPress: () => {
                        },
                    },
                ],
                {
                    cancelable: true,
                }
            );
        } else if (status === 'success-up') {
            bloc.saveAnnexe(
                idTicket,
                account,
                nameAnnexe,
                fileName,
                url,
                fileSize
            )
        } else if (status === 'error-up') {
            Alert.alert(
                'Error',
                message,
                [
                    {
                        text: "Cerrar",
                        onPress: () => {
                        },
                    },
                ],
                {
                    cancelable: true,
                }
            );
        } else if (status === 'error-user') {
            ToastModule.show(
                'error',
                message,
                'top'
            )
        }
    }, [status, url]);

    useEffect(() => {
        bloc.getAllAnnexes({
            orderby: 'update_at',
            ordertype: 'ordertype',
            like: 'es_ticket_main_id',
            match: idTicket,
            matchnot: 'undefined',
            notlike: 'undefined',
            is_account_main_id: account,
            perpage: 1000
        })
    }, [account, idTicket]);

    const checkReadStoragePermissions = async (
        pathFile: string,
        fileName: string,
        account: string,
        filetype: string,
    ) => {
        if (Platform.OS == 'ios') {
            await uploadMPFile(
                pathFile,
                fileName,
                account,
                filetype)
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: 'Permisos de lectura requeridos',
                        message: 'La app necesita permisos para leer archivos',
                        buttonPositive: 'Aceptar',
                        buttonNeutral: "Preguntar después",
                        buttonNegative: "Cancelar",
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    await uploadMPFile(
                        pathFile,
                        fileName,
                        account,
                        filetype)
                } else {
                    Alert.alert(
                        'Advertencia',
                        "Permisos no concedidos, no es posible descargar el archivo.",
                        [
                            {
                                text: "Ok",
                                onPress: () => {
                                },
                            },
                        ],
                        {
                            cancelable: true,
                        }
                    );
                }
            } catch (err) {
            }
        }
    }

    const checkPermissions = async (url: string) => {
        if (Platform.OS == 'ios') {
            downloadFile(url)
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permisos de almacenamiento requeridos',
                        message: 'La app necesita permisos para almacenar archivos',
                        buttonPositive: 'Aceptar',
                        buttonNeutral: "Preguntar despues",
                        buttonNegative: "Cancelar",
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    downloadFile(url)
                } else {
                    Alert.alert(
                        'Advertencia',
                        "Permisos no concedidos, no es posible descargar el archivo.",
                        [
                            {
                                text: "Ok",
                                onPress: () => {
                                },
                            },
                        ],
                        {
                            cancelable: true,
                        }
                    );
                }
            } catch (err) {
            }
        }
    }

    const checkCameraPermissions = async () => {
        if (Platform.OS == 'ios') {
            takePicture()
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Permisos de camara requeridos',
                        message: 'La app necesita permisos para tomar fotografías',
                        buttonPositive: 'Aceptar',
                        buttonNeutral: "Preguntar despues",
                        buttonNegative: "Cancelar",
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    takePicture()
                } else {
                    Alert.alert(
                        'Advertencia',
                        "Permisos no concedidos, no es posible realizar la acción.",
                        [
                            {
                                text: "Ok",
                                onPress: () => {
                                },
                            },
                        ],
                        {
                            cancelable: true,
                        }
                    );
                }
            } catch (err) {
            }
        }
    }

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pickSingle({
                presentationStyle: 'overFullScreen',
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker
                    .types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.images]
            });
            if (response.uri.startsWith("content://")) {
                const decodedURL = response.uri;
                const destPath = `${RNFS.TemporaryDirectoryPath}/${response.name}`;
                await RNFS.copyFile(decodedURL, destPath);
                setUriFile(destPath);
            } else {
                setUriFile(response.uri);
            }
            setFileResponse(response);
            setPictureTook(null);
            setIsVisibleAlert(true);
            btmSheet.current?.close();
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, []);

    const takePicture = async () => {
        let options: CameraOptions = {
            mediaType: 'photo'
        };
        const result = await launchCamera(options);
        if (result.assets && result.assets.length > 0) {
            let asset = result.assets[0];
            let uriAsset = asset.uri ?? '';
            if (uriAsset.startsWith("content://")) {
                const destPath = `${RNFS.TemporaryDirectoryPath}/${asset.fileName}`;
                await RNFS.copyFile(uriAsset, destPath);
                setUriFile(destPath);
            } else {
                setUriFile(uriAsset);
            }
            setPictureTook(result.assets[0]);
            setFileResponse(null);
            setIsVisibleAlert(true);
        } else if (result.errorMessage) {
            ToastModule.show('error', result.errorMessage)
        } else if (result.errorCode) {
            switch (result.errorCode) {
                case 'camera_unavailable':
                    break;
                case 'permission':
                    break;
                case 'others':
                    break;
            }
        }
    }

    const showAlertDelete = () => {
        Alert.alert(
            "Eliminar Anexo",
            "Estás seguro de querer eliminar el anexo relacionado al Ticket?",
            [
                {
                    text: "Cancelar",
                    style: 'cancel'
                },
                {
                    text: "Eliminar",
                    style: 'cancel',
                    onPress: () => {
                        if (ticketRemove.current) {
                            bloc.delete(`${ticketRemove.current?.id}`)
                        }
                    }
                }
            ],
            {
                cancelable: true,
                onDismiss: () => {
                }
            }
        );
    }

    return (
        <>
            {isLoading && <View style={{flex: 1, width}}>
                <LoadingComponent/>
            </View>
            }
            {
                !isLoading && <BlocBuilder
                    bloc={bloc}
                    builder={(state: TicketItemKindAnnexesState) => {
                        switch (state.kind) {
                            case TicketItemKindAnnexes.LoadingAnnexesOfTicketState:
                                return (
                                    <View style={{flex: 1, width}}>
                                        <LoadingComponent/>
                                    </View>
                                )
                            case TicketItemKindAnnexes.Empty:
                            case TicketItemKindAnnexes.AddAnnexeOfServiceState:
                            case TicketItemKindAnnexes.ErrorAnnexesOfTicketState:
                            case TicketItemKindAnnexes.DeletedAnnexesOfTicketState:
                            case TicketItemKindAnnexes.LoadedAnnexesOfTicketState:
                                if (state.kind === TicketItemKindAnnexes.DeletedAnnexesOfTicketState) {
                                    ToastModule.show('success', 'El anexo fue borrado correctamente.');
                                    bloc.setEmpty();
                                } else if (state.kind === TicketItemKindAnnexes.ErrorAnnexesOfTicketState) {
                                    ToastModule.show('error', state.error);
                                    bloc.setEmpty();
                                } else if (state.kind === TicketItemKindAnnexes.AddAnnexeOfServiceState) {
                                    ToastModule.show('success', 'Los datos han sido actualizados correctamente')
                                    bloc.getAllAnnexes({
                                        orderby: 'update_at',
                                        ordertype: 'ordertype',
                                        like: 'es_ticket_main_id',
                                        match: idTicket,
                                        matchnot: 'undefined',
                                        notlike: 'undefined',
                                        is_account_main_id: account,
                                        perpage: 1000
                                    });
                                }
                                return (
                                    <View style={{
                                        flex: 0.8,
                                        width: width
                                    }}>
                                        <View style={{
                                            flex: 1
                                        }}>
                                            {state.data.length > 0 && <View style={{
                                                margin: 8,
                                                borderColor: '#979797',
                                                borderWidth: 1,
                                                borderRadius: 10,
                                            }}>
                                                <FlatList
                                                    data={state.data}
                                                    keyExtractor={(item, index) => `${uuid.v4()}`}
                                                    renderItem={({item, index}) => (
                                                        <ItemAnnexView
                                                            item={item}
                                                            onOptionPress={(item) => {
                                                                ticketRemove.current = item
                                                                setIsVisibleOptionMenu(true)
                                                            }} onDownloadPress={(url) => {
                                                            checkPermissions(url)
                                                        }}/>
                                                    )}
                                                    ItemSeparatorComponent={() => <Divider/>}
                                                />
                                            </View>}
                                            {/* No contiene anexos */}
                                            {state.data.length == 0 && <View style={styles.emptyBox}>
                                                <Text style={styles.emptyTitle}>Sin Anexos</Text>
                                                <Text style={styles.emptyParagraph}>Aún no se han cargado Anexos en el
                                                    registro de esta Orden de Servicio.</Text>
                                            </View>}
                                        </View>
                                        {
                                            hasPermissions &&
                                            <TButton
                                                title='Agregar Anexo +'
                                                type='secondary'
                                                onPress={() => {
                                                    btmSheet?.current?.open()
                                                }}
                                                contentStyle={{
                                                    flex: 0.2,
                                                    alignSelf: 'flex-end',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginEnd: 8,
                                                    marginBottom: 16,
                                                }}
                                            />
                                        }
                                        <AlertInput
                                            isVisible={isVisibleAlert}
                                            title='Añadir Anexo'
                                            message='Para finalizar, define el nombre del Anexo a cargar.'
                                            placeholder='Nombre'
                                            onAcceptPressed={(input) => {
                                                if (input.length == 0) {
                                                    return
                                                }
                                                setIsVisibleAlert(false);
                                                setNameAnnexe(input);
                                                if (fileResponse) {
                                                    checkReadStoragePermissions(
                                                        uriFile,
                                                        fileResponse?.name ?? '',
                                                        account,
                                                        'ticket_attachments'
                                                    ).then();
                                                } else if (pictureTook) {
                                                    checkReadStoragePermissions(
                                                        uriFile,
                                                        pictureTook.fileName ?? '',
                                                        account,
                                                        'ticket_attachments'
                                                    ).then();
                                                }
                                            }}
                                            onCancelPressed={() => {
                                                setIsVisibleAlert(false)
                                            }}
                                            onOutsidePressed={() => {
                                            }}
                                        />
                                        <RBSheet
                                            ref={btmSheet}
                                            animationType='slide'
                                            closeOnDragDown={true}
                                            closeOnPressMask={true}
                                            customStyles={{
                                                container: {
                                                    borderTopLeftRadius: 25,
                                                    borderTopRightRadius: 25,
                                                    height: '20%'
                                                },
                                                wrapper: {
                                                    backgroundColor: "rgba(0,0,0,0.6)"
                                                },
                                                draggableIcon: {
                                                    backgroundColor: "#858585",
                                                    height: 3,
                                                    borderRadius: 0,
                                                    width: 100
                                                }
                                            }}
                                        >
                                            <View style={styles.contentContainer}>
                                                <View style={{borderBottomWidth: 1, borderBottomColor: '#c0bebf'}}>
                                                    <Text style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 18,
                                                        color: 'black',
                                                        marginBottom: 10,
                                                        marginLeft: 15
                                                    }}>Añadir Anexo</Text>
                                                </View>
                                                {
                                                    menuOptions.map((item, i) => (
                                                        <TouchableWithoutFeedback key={item.key} onPress={() => {
                                                            switch (item.id) {
                                                                case 1:
                                                                    handleDocumentSelection()
                                                                    break
                                                                case 2:
                                                                    checkCameraPermissions()
                                                                    btmSheet.current?.close()
                                                                    break;
                                                                case 3:
                                                                    btmSheet.current?.close()
                                                                    break;
                                                            }
                                                        }}>
                                                            <View style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginVertical: 4,
                                                                marginHorizontal: 8,
                                                            }}>
                                                                <Text style={[{
                                                                    fontWeight: '600',
                                                                    textAlign: 'center',
                                                                    fontSize: 14
                                                                },
                                                                    (item.id == 3) ? {color: '#b11520'} : {color: '#204ab0',}
                                                                ]}>{item.title}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    ))
                                                }
                                            </View>
                                        </RBSheet>
                                        <MenuAlert
                                            isVisible={isVisibleOptionMenu}
                                            options={[{
                                                text: 'Eliminar',
                                                textSytle: {
                                                    color: '#000'
                                                },
                                                onPressed: () => {
                                                    setIsVisibleOptionMenu(false);
                                                    showAlertDelete();
                                                }
                                            }]}
                                            onCancelPressed={() => {
                                                setIsVisibleOptionMenu(false);
                                            }} onOutsidePressed={() => {
                                            setIsVisibleOptionMenu(false)
                                        }}/>
                                    </View>
                                )
                            default:
                                return (<></>)
                        }
                    }}
                />
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width,
        height: 800,
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    emptyBox: {
        margin: 16,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 20
    },
    emptyTitle: {
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 20
    },
    emptyParagraph: {
        color: '#000000',
        textAlign: 'center'
    },
    withElementsBox: {
        flex: 1,
        borderColor: '#979797',
        borderWidth: 1,
        borderRadius: 10,
    },
    contentContainer: {
        flex: 1,
    },
    button: {
        marginHorizontal: width * .075,
        marginTop: 5,
    },
    text: {
        fontSize: 10,
        marginBottom: 0
    }
})
