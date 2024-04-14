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


const Contact = ({ navigation, homeActions, authToken }) => {




    useEffect(() => {
        // console.log("contact")

    }, []);




    return (
        <View style={styles.mainBody}>
            <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
                <NormalHeader title={"Contact Us"} />

                {/* <View style={{ flex: 1, width: wp('92%'), alignItems: 'center',justifyContent:'center' }}>
                       <Text style={styles.contentText}>In case of any queries,</Text>  
                       <Text style={styles.contentText}>please write to us at : </Text>  
                       <Text style={styles.emailText} onPress={() => Linking.openURL('mailto:support@orbitrecharge.com')}>support@orbitrecharge.com</Text>  
                    </View> */}



                <View style={{ marginHorizontal: 15, marginTop: 15 }}>
                    <TextInput
                        placeholder='Name'
                        style={[styles.dropdownText,{height:40}]}
                    />

                    <TextInput
                        placeholder='Email'
                        style={[styles.dropdownText,{height:40}]}
                    />

                    <TextInput
                        placeholder='Phone'
                        style={[styles.dropdownText,{height:40}]}
                    />

                    <TextInput
                        placeholder='Message'
                        style={[styles.dropdownText, { height: 100, textAlignVertical: "top" }]}
                        multiline={true}
                    />

                    <TouchableOpacity style={[styles.sendButton, { marginTop: 20 }]}>
                        <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>SUBMIT</Text>
                    </TouchableOpacity>


                </View>

            </LinearGradient>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);