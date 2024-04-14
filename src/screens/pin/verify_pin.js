import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { showMessage, hideMessage } from "react-native-flash-message";
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
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import TouchID from 'react-native-touch-id';

import NormalHeader from '../../shares/Normal_Header';
import SuccessAlert from '../../shares/Success_Alert';
import Loader from '../../shares/Loader';

import styles from './style';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../actions/index';
const mapDispatchToProps = (dispatch) => {
  return ({
    homeActions: bindActionCreators(homeActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),
  })
};

const mapStateToProps = (state) => {
  return {
    authToken: state.auth_Reducer.authToken,
    userData: state.home_Reducer.userData,
  }
}


const Pin_Auth = ({ authActions, authToken, userData }) => {

  const [bio, setBio] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {


    setName(userData.data ? userData.data.name : '')
    TouchID.isSupported()
      .then(biometryType => {
        // Success code
        // console.log("getting data", biometryType)
        if (biometryType === 'FaceID') {
          // console.log('FaceID is supported.');
          setBio(true)
        } else {
          // console.log('TouchID is supported.');
          setBio(true)
        }
      })
      .catch(error => {
        setBio(false)
        // console.log(error);
      });

  }, []);



  const checkBioSupport = () => {
    // bio ? pressHandler() : console.log("Not Supported");
  }

  const pressHandler = () => {
    const optionalConfigObject = {
      title: 'Authentication Required', // Android
      imageColor: '#1877F2', // Android
      imageErrorColor: '#1877F2', // Android
      sensorDescription: 'Touch sensor', // Android
      sensorErrorDescription: 'Failed', // Android
      cancelText: 'Cancel', // Android
      fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    TouchID.authenticate("Please verify", optionalConfigObject)
      .then(success => {
        //Platform.OS === "ios"?
        // Alert.alert('Authenticated Successfully'):
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: 'Authenticated Successfully',
        //   button: 'Done',
        // })
        navigation.navigate("BottomTabRoutes")
      })
      .catch(error => {
        Platform.OS === "ios" ?
          alert('Authentication Failed') :
          showMessage({
            message: "Alert !!!",
            description: 'Authentication Failed',
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      });
  }

  const handleVerifyPin = async (code) => {
    setLoading(true)
    await authActions.verifyPin(authToken, code).then(res => {
      setLoading(false)
      if (res.status == '200') {
        //   Platform.OS === "ios"?
        //   Alert.alert(res.data.msg):
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: res.data.msg,
        //   button: 'Done',
        // })
        navigation.navigate("BottomTabRoutes")
      }
      if (res.response.status == '400') {
        Platform.OS === "ios" ?
          alert(res.response.data.msg) :
          showMessage({
            message: "Alert !!!",
            description: res.response.data.msg,
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      }

      else {

        showMessage({
          message: "Alert !!!",
          description: "Something went wrong",
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

  const handleForgetPin = async () => {
    setLoading(true)
    await authActions.ForgetPin(authToken).then(res => {
      setLoading(false)
      if (res.status == '200') {
        // console.log("forget api", res.data)
        Platform.OS === "android" ?
          showMessage({
            message: "Success !",
            description: res.data.msg,
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          }) :
          Alert.alert(res.data.msg)
        navigation.navigate("Check_pin")
      }
      if (res.response.status == '400') {
        Platform.OS === 'ios' ?
          alert(res.response.data.msg) :
          showMessage({
            message: "Alert !!!",
            description: res.response.data.msg,
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      }

      else {
        Platform.OS === 'ios' ?
          alert('Something went Wrong') :
          showMessage({
            message: "Alert !!!",
            description: 'Something went Wrong',
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



  return (
    <View style={styles.mainBody}>
      <AlertNotificationRoot>
        <KeyboardAwareScrollView >
          <LinearGradient colors={['#068BB6', '#068BB6']} style={styles.container}>

            {/* <NormalHeader title={"Pin Auth"} /> */}
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}>
              {loading && <Loader loading={loading} />}
              <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

                <View style={{ height: 53, width: 170, marginTop: 70, }}>
                  <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/logoWhite.png')} />
                </View>

                <View style={styles.authBox}>

                  <View style={{ height: 40, width: 80, bottom: 40, borderRadius: 40 }}>
                    <Image style={{ height: 80, width: '100%', borderWidth: 5, borderColor: "#ffffff", borderRadius: 40 }} source={require('../../assets/test-user.png')} />
                  </View>
                 

                  <Text style={[styles.boldText, { marginTop: 6, }]} >{"Welcome " + name}</Text>
                  <Text onPress={() => checkBioSupport()} style={[styles.LabelText, { marginTop: 14, fontSize: RFValue(12) }]} >Login with touch ID</Text>

                  {/* FingerPrint Box  */}

                  <TouchableOpacity onPress={() => checkBioSupport()} style={{ height: 60, width: 60, borderColor: '#c4c4c4', borderWidth: 1, borderRadius: 30, marginTop: 8, }}>
                    <Image style={{ height: '100%', width: '100%', borderRadius: 30 }} source={require('../../assets/fingerPrint.png')} />
                  </TouchableOpacity>
                  <Text style={[styles.LabelText, { marginTop: 14, fontSize: RFValue(12) }]} >or, login with PIN</Text>

                  <View style={{ marginTop: 6, width: wp('60%'), height: 40, flexDirection: 'row', justifyContent: 'space-evenly' }}>

                    <OTPInputView
                      style={{ width: '100%', height: '100%', }}
                      pinCount={4}
                      //autoFocusOnLoad ={true}
                      secureTextEntry={true}
                      codeInputFieldStyle={styles.otpInputBox}
                      codeInputHighlightStyle={styles.otpInputBox}
                      onCodeFilled={(code => {
                        // console.log('you are good to go!', code)
                        handleVerifyPin(code)
                      })}
                    />


                  </View>

                  <Text onPress={() => handleForgetPin()} style={[styles.blueText, { marginTop: 12 }]}>Forget PIN?</Text>

                  <View style={styles.line} ></View>

                  <Text onPress={() => navigation.navigate('HomeRoutes', { screen: 'Login' })} style={[styles.blueText, {}]}>Not you? Log in as a different user</Text>
                  <Text></Text>
                </View>

              </View>
            </ScrollView>

          </LinearGradient>
        </KeyboardAwareScrollView>
      </AlertNotificationRoot>
    </View>

  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Pin_Auth);