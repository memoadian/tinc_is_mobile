import React, {createContext, useReducer, useState} from "react";
import RNFetchBlob from 'rn-fetch-blob'
import {fileServiceReducer, ServiceFileState} from "./FileServiceReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ApiCore} from "../../config/api";
import * as RNFS from 'react-native-fs';
import {Platform} from "react-native";


type FileDownloadContextProps = {
    status: 'success-down' | 'error-down' | 'success-up' | 'error-up' | 'error-user' | 'empty',
    message: string;
    url: string;
    fileName: string;
    fileSize: number;
    isLoading: boolean;
    getMime: (filePath: string) => string;
    downloadFile: (uri: string) => Promise<void>;
    uploadMPFile: (
        pathFile: string,
        fileName: string,
        account: string,
        filetype: string,
    ) => Promise<void>;
};

const downloadInitialState: ServiceFileState = {
    status: 'empty',
    message: '',
    url: '',
    fileName: '',
    fileSize: 0,
}

interface Response {
    status: number;
    message: string;
    name: string | undefined;
    url: string | undefined;
    file_size: number | undefined;
}

export const FileDownloadContext = createContext({} as FileDownloadContextProps);

export const FileDownloadProvier = ({children}: any) => {

    const [state, dispatch] = useReducer(fileServiceReducer, downloadInitialState)
    const [isLoading, setIsLoading] = useState(false)

    const getMime = (filePath: string): string => {
        if (filePath.includes(".doc") || filePath.includes(".docx")) {
            // Word document
            return "application/msword"
        } else if (filePath.includes(".pdf")) {
            // PDF file
            return "application/pdf";
        } else if (filePath.includes(".ppt") || filePath.includes(".pptx")) {
            // Powerpoint file
            return "application/vnd.ms-powerpoint";
        } else if (filePath.includes(".xls") || filePath.includes(".xlsx")) {
            // Excel file
            return "application/vnd.ms-excel";
        } else if (filePath.includes(".zip") || filePath.includes(".rar")) {
            // WAV audio file
            return "application/x-wav";
        } else if (filePath.includes(".rtf")) {
            // RTF file
            return "application/rtf";
        } else if (filePath.includes(".wav") || filePath.includes(".mp3")) {
            // WAV audio file
            return "audio/x-wav";
        } else if (filePath.includes(".gif")) {
            // GIF file
            return "image/gif";
        } else if (filePath.includes(".jpg") || filePath.includes(".jpeg") || filePath.includes(".png")) {
            // JPG file
            return "image/jpeg";
        } else if (filePath.includes(".txt")) {
            // Text file
            return "text/plain";
        } else if (filePath.includes(".3gp") || filePath.includes(".mpg") || filePath.includes(".mpeg") || filePath.includes(".mpe") || filePath.includes(".mp4") || filePath.includes(".avi")) {
            // Video files
            return "video/*";
        } else {
            //if you want you can also define the intent type for any other file
            //additionally use else clause below, to manage other unknown extensions
            //in this case, Android will show all applications installed on the device
            //so you can choose which application to use
            return "*/*";
        }
    }

    const getExtension = (path: string) => {
        return /[.]/.exec(path) ? /[^.]+$/.exec(path) : null
    }

    const downloadFile = async (url: string) => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem('token');
        let date = new Date();
        let fileURL = url;
        let extArray = getExtension(fileURL);
        let ext = '.' + ((extArray !== null && extArray.length > 0) ? extArray[0] : '')
        const {config, fs} = RNFetchBlob;
        let downloadDir = fs.dirs.DownloadDir;
        let path = downloadDir + '/tinc_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: path,
                mime: getMime(path),
                description: 'File downloaded by download manager.'
            }
        }
        config(options)
            .fetch('GET', `${ApiCore.BASE_URL}filews/manageFile/?url=${fileURL}`, {
                Authorization: `Bearer ${token}`,
            })
            .then(res => {
                setIsLoading(false)
                dispatch({
                    type: 'finished',
                    payload: {
                        result: 'success-down',
                        message: 'Archivo descargado exitosamente',
                        url: res.path(),
                        fileName: '',
                        fileSize: 0
                    }
                })
            }).catch((err) => {
            setIsLoading(false)
            dispatch({
                type: 'finished',
                payload: {
                    result: 'error-down',
                    message: 'No fue posible descargar el archivo',
                    url: '',
                    fileName: '',
                    fileSize: 0
                }
            })
        })
    }

    const uploadMPFile = async (
        pathFile: string,
        fileName: string,
        account: string,
        filetype: string,
    ) => {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');
        let fileUri = Platform.OS === 'ios' ? pathFile.replace('file://', '') : pathFile;
        let file;
        try {
            file = await RNFetchBlob.fs.stat(fileUri);
        } catch (e) {
            dispatch({
                type: 'finished',
                payload: {
                    result: 'error-user',
                    message: 'No fue posible leer el archivo, intenta nuevamente.',
                    url: '',
                    fileName: '',
                    fileSize: 0
                }
            })
            setIsLoading(false);
            return
        }
        if (byteToMB(file.size) >= 20) {
            dispatch({
                type: 'finished',
                payload: {
                    result: 'error-user',
                    message: 'El archivo seleccionado pesa más de 20MB',
                    url: '',
                    fileName: '',
                    fileSize: 0
                }
            })
            setIsLoading(false);
        } else {
            RNFetchBlob.fetch('POST', `${ApiCore.BASE_URL}filews/manageFile/`, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }, [
                {
                    name: 'file',
                    filename: fileName,
                    type: getMime(fileName),
                    data: RNFetchBlob.wrap(fileUri)
                },
                {
                    name: 'filetype',
                    data: filetype
                },
                {
                    name: 'is_account_main_id',
                    data: account
                },
                {
                    name: 'file_size',
                    data: `${file.size}`
                }
            ]).then((resp) => {
                const data: Response = resp.json();
                setIsLoading(false);
                if (data.status == 200) {
                    dispatch({
                        type: 'finished',
                        payload: {
                            result: 'success-up',
                            message: 'Archivo cargado exitosamente',
                            url: data.url ?? '',
                            fileName: data.name ?? '',
                            fileSize: data.file_size ?? 0
                        }
                    })
                } else {
                    setIsLoading(false);
                    dispatch({
                        type: 'finished',
                        payload: {
                            result: 'error-up',
                            message: data.message,
                            url: '',
                            fileName: '',
                            fileSize: 0
                        }
                    })
                }
            }).catch((err) => {
                console.error(err)
                setIsLoading(false)
                dispatch({
                    type: 'finished',
                    payload: {
                        result: 'error-up',
                        message: 'No fue posible cargar el archivo',
                        url: '',
                        fileName: '',
                        fileSize: 0
                    }
                })
            })
        }

    }

    /**
     * Convert number of bytes to megabytes
     * @param integer bytes     Number of bytes to convert
     */
    const byteToMB = (bytes: number) => bytes / (1024 ** 2);

    return (<FileDownloadContext.Provider
        value={{
            ...state,
            isLoading,
            downloadFile,
            uploadMPFile,
            getMime
        }}>
        {children}
    </FileDownloadContext.Provider>)
}