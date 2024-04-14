import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';

import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    Modal,
    ScrollView,
    ImageBackground,
    Keyboard,
    Platform,
    Button,
    Linking,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import NormalHeader from '../../shares/Normal_Header';

import styles from './style';
import { showMessage, hideMessage } from "react-native-flash-message";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions } from '../../actions/index';
const mapDispatchToProps = (dispatch) => {
    return ({
        homeActions: bindActionCreators(homeActions, dispatch),
    })
};

const mapStateToProps = (state) => {
    return {
        rechargePacks: state.home_Reducer.rechargePacks,
        authToken: state.auth_Reducer.authToken,
    }
}


const FBpage = ({ navigation, homeActions, authToken }) => {


    const [text, setText] = useState('');

    const handleSubmit = () => {
        // handle submission logic here
        // console.log('Submitted text:', authToken);
        let fd = new FormData();
        fd.append('reason', text)
        // console.log(fd);

        homeActions.logoutFacebookaccount(authToken, fd).then(res => {
            // console.log('------',res)
            
            
                if (res.data.status == true) {
                    showMessage({
                        message: "Success !!!",
                        description: res.data.msg,
                        titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                        textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                        type: "default",
                        backgroundColor: "#39475D", // background color
                        color: "#fff", // text color
                        style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
                      });
                      navigation.navigate('BottomTabRoutes',{screen:'Topup'})
                }
             else {
                showMessage({
                    message: "Alert !!!",
                    description: res.data.msg,
                    titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                    textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                    type: "default",
                    backgroundColor: "#39475D", // background color
                    color: "#fff", // text color
                    style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
                  });
            }
        })
    }


    useEffect(() => {
        // console.log("contact")

    }, []);




    return (
        <View style={styles.mainBody}>
            <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
                <NormalHeader title={"Delete facebook data"} />

                <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'center' }}>

                    
                    <Text style={styles.contentText}>Reason To Erase Data</Text>
                    <TextInput
                        placeholder="Type here..."
                        value={text}
                        onChangeText={setText}
                        style={{
                            borderWidth: 1,
                            height: 120,
                            borderColor: '#ccc', padding: 10,
                            marginBottom: 20, width: '100%',
                        }}
                        multiline={true}
                        numberOfLines={4}
                    />
                    <TouchableOpacity onPress={() => handleSubmit()} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Submit</Text>
                    </TouchableOpacity>

                </View>


            </LinearGradient>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(FBpage);