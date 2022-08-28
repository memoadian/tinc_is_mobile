import { TimTheme } from './ThemeReducer';

const lightTheme: TimTheme = {
    currentTheme: 'ligth',
    dark: false,
    disableButton: {
        backgroundColor: '#dce0e2'
    },
    disableTextButton: {
        color: '#879097'
    },
    primaryButton: {
        height: 40,
        borderRadius: 5,
        backgroundColor: '#20BFC8',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },   
    primaryTextButton: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    cancelButton: {
        height: 40,
        width:100,
        borderRadius: 5,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignContent:'center',
        alignItems:'center',
        alignSelf:'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    cancelTextButton: {
        paddingHorizontal: 7,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff'
    },  
    acceptButton: {
        height: 40,
        width:100,
        borderRadius: 5,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignContent:'center',
        alignItems:'center',
        alignSelf:'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    acceptTextButton: {
        paddingHorizontal: 7,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff'
    },   
    secondaryButton: {
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 8,
        backgroundColor: '#e92267',
        justifyContent: 'center',
        alignContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    secondaryTextButton: {
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 14,
    },
    primaryRoundedButton: {
        backgroundColor: '#20BFC8',
        height: 30,
        borderRadius: 25,
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.5,
        elevation: 4,
        paddingHorizontal:10
    },
    secondaryRoundedButton: {
        backgroundColor: '#e92267',
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.5,
        elevation: 4,
    },
    primaryRoundedTextButton: {
        paddingHorizontal: 7,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    secondaryRoundedTextButton: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#ffffff'
    },
    colors: {
        primary: '#20BFC8',
        background: '#ffffff',
        card: '#ffffff',
        text: '#0c0c0c',
        border: '#f0efef',
        notification: '#0c0c0c'
    },

}

export default lightTheme;