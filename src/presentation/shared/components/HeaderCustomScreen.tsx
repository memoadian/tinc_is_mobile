import { Text } from '@rneui/themed'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontelloIcon } from './Icon'
import { TouchableFeedback } from './TouchableFeedback'

export interface Props {
    title: string;
    backButton?: 'back' | 'close'
    titleButtonRight?: string;
    showContinue?: boolean;
    backgroundColor?: string;
    onBack?: () => void;
    onContinue?: () => void;
    isBlueHeader?: boolean;
}

export const HeaderCustomScreen = ({
    title,
    backButton = 'back',
    showContinue = true,
    titleButtonRight = 'Continuar',
    backgroundColor = '#E8E7E7',
    onBack,
    onContinue, 
    isBlueHeader = false }: Props) => {
    return (
        <View>{ !isBlueHeader ? <View style={{
            ...styles.header,
            backgroundColor
        }}>
            <TouchableFeedback onPress={onBack} >
                <View style={{
                    height: '100%',
                    justifyContent: 'center',
                }}>
                    {backButton === 'back' && <FontelloIcon
                        name='001-arrow'
                        size={20}
                    />}
                    {backButton === 'close' && <Icon
                        name='times-circle'
                        size={20}
                    />}
                </View>
            </TouchableFeedback>
            {}
            <View style={{
                height: '100%',
                justifyContent: 'center',
                marginHorizontal: 8
            }}>
                <Text style={styles.title}>{title}</Text>
            </View>
            {showContinue && <View style={{
                flex: 1,
                height: '100%',
                justifyContent: 'center',
            }}>
                {
                    titleButtonRight != '' &&
                    <TouchableFeedback onPress={onContinue}>
                    <Text style={[styles.title, { alignSelf: 'flex-end' }]}>{titleButtonRight}</Text>
                    </TouchableFeedback>
                }
                
            </View>}
        </View>
    : <View style={{
                        ...styles.headerGradient,
                        backgroundColor
                    }}>
                        <LinearGradient
                            style={{
                                flex:1,
                                flexDirection: 'row',
                                padding: 8
                            }}
                            colors={['#0D419A', '#4596E7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                        <TouchableFeedback onPress={onBack} >
                            <View style={{
                                height: '100%',
                                justifyContent: 'center',
                            }}>
                                {backButton === 'back' && <FontelloIcon
                                    name='001-arrow'
                                    size={20}
                                    color='white'
                                />}
                                {backButton === 'close' && <Icon
                                    name='times-circle'
                                    size={20}
                                    color='white'
                                />}
                            </View>
                        </TouchableFeedback>
                        <View style={{
                            height: '100%',
                            justifyContent: 'center',
                            marginHorizontal: 8
                        }}>
                            <Text style={styles.titleGradient}>{title}</Text>
                        </View>
                        {showContinue && <View style={{
                            flex: 1,
                            height: '100%',
                            justifyContent: 'center',
                        }}>
                            {
                                titleButtonRight != '' &&
                                <TouchableFeedback onPress={onContinue}>
                                <Text style={[styles.title, { alignSelf: 'flex-end' }]}>{titleButtonRight}</Text>
                                </TouchableFeedback>
                            }
                            
                        </View>}
                        </LinearGradient>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 8,
        height: 50,
        marginBottom: 5,
        shadowColor: 'black',
        shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowOpacity: 0.35,
          shadowRadius: 10, 
          elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize:16
    },
    button: {
        fontWeight: '400',
        color: 'black'
    },
    headerGradient: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        marginBottom: 5,
        shadowColor: 'black',
        shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowOpacity: 0.35,
          shadowRadius: 10, 
          elevation: 5,
    },
    titleGradient: {
        color: '#ffffff',
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    buttonGradient: {
        fontWeight: '400',
        color: 'white'
    },
})