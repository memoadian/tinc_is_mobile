
import * as React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Dimensions, } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../../../config.json';
const Icon = createIconSetFromFontello(fontelloConfig);
import RBSheet from 'react-native-raw-bottom-sheet';
import { AuthContext } from '../../core/Context/AuthContext';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const AddBottomSheet = () => {
    const { logout } = React.useContext(AuthContext)
    // Creates a reference to the DOM element that we can interact with
    const refRBSheet: any = React.useRef<RBSheet>();
    const nav = useNavigation();
    const menuOptions = [
        {
            uuid: '48cbd7b86e88',
            id: 1,
            title: 'Configuración',
            icon: '008-settings'
        },
        {
            uuid: 'fd16847934a0',
            id: 2,
            title: 'Cerrar Sesión',
            icon: '009-logout'
        }
    ];
    const doMenuAction = (title: string) => {
        if (title === 'Cerrar Sesión') {
            logout();
        } else if (title === 'Configuración') {
            refRBSheet.current?.close()
            nav.navigate('ConfigurationScreen');
        }
    }

    return (
        <>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
            }}>
                <TouchableWithoutFeedback onPress={() => refRBSheet.current.open()}>
                    <Icon
                        name='006-menu'
                        color='#000000'
                        size={30}
                        style={styles.button} />
                </TouchableWithoutFeedback>
                <Text style={styles.text} onPress={() => refRBSheet.current.open()}>Menu</Text>
            </View>
            <RBSheet
                ref={refRBSheet}
                animationType='slide'
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        height: '25%'
                    },
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,.6)"
                    },
                    draggableIcon: {
                        backgroundColor: "#c0bebf",
                        width: 150
                    }
                }}
            >
                <View style={styles.contentContainer}>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#c0bebf' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black', marginBottom: 10, marginLeft: 15 }}>Módulos</Text>
                    </View>
                    {
                        menuOptions.map((item, i) => (
                            <View key={item.uuid} style={{ marginVertical: 10, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#c0bebf' }}>
                                <View style={{ width: '20%', alignItems: 'center' }}>
                                    <Icon name={item.icon} size={30} style={{ paddingBottom: 5, color: 'black' }} onPress={() => {
                                        doMenuAction(item.title)
                                    }} />
                                </View>
                                <View style={{ width: "80%" }} >
                                    <Text style={{ color: 'black', fontSize: 18 }} onPress={() => {
                                        doMenuAction(item.title)
                                    }}>{item.title}</Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </RBSheet>
        </>
    )
}

export default AddBottomSheet;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
    },
    button: {
        marginHorizontal: width * .075,
        marginTop: 5,
    },
    text: {
        fontSize: 11,
        marginBottom: 0,
        color: '#000000'
    }
});
