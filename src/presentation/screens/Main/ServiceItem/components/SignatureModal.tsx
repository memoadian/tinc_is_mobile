import React, { useEffect, useRef } from "react"
import { Button, Modal, StyleSheet, Text, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome5';
//import {Signature } from 'react-native-signature-canvas';
import SignatureScreen from "react-native-signature-canvas";
import { TextField } from "../../../../shared/components/TextField";
import { useForm } from "../../../../shared/hooks/useForm";
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { TButton } from "../../../../shared/components/TButton";
  
export interface SignatureModalProps { 
    isVisible?: boolean;
    signatureName: string;
    onCloseModalPressed?: () => void; 
    onSavePressed?: (name: string, signature: string) => void;
}
export const SignatureModal = ({
        isVisible,
        signatureName,
        onCloseModalPressed,
        onSavePressed
    }: SignatureModalProps) => {
        const ref = useRef();

    const { value, onChange } = useForm({value: 'asd'});

    useEffect(() => {
        onChange(signatureName, 'value')
    }, [signatureName]);

    useEffect(() => {
        onChange(signatureName, 'value')
    }, [signatureName]);
    
    const styles = StyleSheet.create({
        modal: {
            backgroundColor: '#FFFFFF',
            width: '90%',
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
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          },
    },
    )

    const imgHeight = 270;

    const webStyle = `.m-signature-pad--footer
    .save {
        color: #FFF;
        marginRight:10px;
    }
    .button.clear  {
        background-color: red;
        color: #FFF;
    }
    body,html {height: ${imgHeight}px;}`;

    const imgWidth = 300;


    const style = `.m-signature-pad {box-shadow: solid; border: none; } 
              .m-signature-pad--body {border: none;}             
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;

    const handleOK = (signature) => {
        ImageResizer.createResizedImage(signature, 300, 150, 'PNG', 95, 0, undefined)
        .then(async response => {        
                RNFS.readFile(response.uri, 'base64')
                .then(res =>{
                    
                    onChange("","value")
                    onSavePressed?.(value, "data:image/png;base64,"+ res)
                });

        })
        .catch(err => {
            console.error(err);
        });
        //onSavePressed?.(value, signature)
    }    

    
    const handleConfirm = () => {
        console.log("end");
        if(ref != undefined){
            ref.current.readSignature();
        }        
      };

    const handleClear = () => {
        ref.current.clearSignature();
    };
    

    return (
        <Modal
            animationType='fade'
            visible={isVisible ? isVisible : false}
            transparent={true}>
            <View style={{
                
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}>
                <View style={styles.modal}>
                    <View style={{alignItems: 'flex-end', margin: 12}}>
                        <Icon
                            name='times'
                            size={28}
                            color="#000"
                            onPress={() => {
                                if (onCloseModalPressed) {
                                    onChange("","value")
                                    onCloseModalPressed()
                                }             
                            }}
                        />
                    </View>
                    <View style={{height: 350}}>
                    

                        <Text style={[styles.titleInput]}>Actualizar Firma</Text>
                        <SignatureScreen 
                            ref={ref}
                            onOK={handleOK}
                            onBegin={() => {}}
                            onEnd={() => {}}
                            descriptionText=""
                            clearText="Limpiar"
                            confirmText="Guardar"
                            
                        //    webStyle={style}
                            bgHeight={imgHeight}
                            minWidth={0.3}
                            maxWidth={0.3}
                            trimWhitespace={true}
                            
                        />
                        <Text style={[styles.titleInput]}>Nombre</Text>
                        <TextField
                            multiline={false}
                            value={value}
                            editable={true}
                            onChangeText={(text) => {
                                onChange(text, 'value')
                            }}
                        />

<View style={{marginTop:10, display:'flex', flexDirection:'row', justifyContent:'flex-end', marginRight:15}}>
    <TButton title={"Limpiar"} type={'cancel'} onPress={handleClear} styleButton={{marginRight:15}}/>
    <TButton title={"Guardar"} type={"accept"} onPress={handleConfirm}/>
</View>
    

    
                    </View>           
                   
                   
                        
                </View>
            </View>
        </Modal>
    )
    
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 250,
      padding: 10,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
    },
  });
