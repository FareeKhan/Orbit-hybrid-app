import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef, useCallback } from 'react';

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
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';
import { showMessage, hideMessage } from "react-native-flash-message";
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDown from 'react-native-countdown-component';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../actions/index';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const mapDispatchToProps = (dispatch) => {
  return ({
    homeActions: bindActionCreators(homeActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),

  })
};

const mapStateToProps = (state) => {
  return {
    countryList: state.home_Reducer.countryList,

  }
}



const CELL_COUNT = 6;



const Verify_otp = ({ navigation, route, authActions }) => {
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(route.params.confirm);
  const [phone, setPhone] = useState(route.params.phone);
  const [type, setType] = useState(route.params.type);

  const [fcmToken, setFcmToken] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const deviceType = Platform.OS === 'android' ? 'android' : 'ios';

  const [nav, setNav] = useState(route.params && route.params.route ? route.params.route : '');

  const [showPopup, setShowPopup] = useState(false)
  const [token, setToken] = useState('')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [timer, setTimer] = useState(60);
  const timeOutCallback = useCallback(() => setTimer(timer => timer - 1), []);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
    if (isFocused) {
      AsyncStorage.getItem("fcm_token").then((value) => {
        setFcmToken(value)
      })
      DeviceInfo.getUniqueId().then((res) => {
        console.log('id', res)
        setDeviceId(res)
      })
    }
  }, [isFocused, timer, timeOutCallback]);

  const confirmCode = async () => {

    const res = await confirm.confirm(otp);
    console.log(res.user.phoneNumber);
    handleLoginByOtp(res.user.uid, res.user.phoneNumber);
    // }catch(error){
    //   console.log("invalid code")
    // }
  }



  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  //  const confirmVerificationCode= ()=> {
  //   try {
  //     const json = JSON.stringify(confirm);
  //     console.log("this is try block",json)
  //      confirm.confirm(otp);
  //     //setConfirm(null);
  //     alert("verified", json)
  //    // handleLoginByOtp(confirm.user.uid,confirm.user.phoneNumber)
  //   } catch (error) {
  //     alert('Invalid code');
  //   }
  // }

  const setNotificationToken = (token) => {

    console.log('method called')
    let formData = new FormData();
    formData.append('fcm_token', fcmToken)
    formData.append('device_id', deviceId)
    formData.append('device_type', deviceType)
    console.log(formData);

    setLoading(true)
    authActions.addFCMToken(formData, token).then(res => {
      setLoading(false)
      console.log('Api response data', res);
      if (res.status == '200') {
        console.log("token set")
      }
    })


  }

  const handleLoginByOtp = (uid, number) => {
    //navigation.navigate('BottomTabRoutes')

    let formData = new FormData();
    formData.append('uid', uid)
    formData.append('phone', phone)
    console.log(formData);

    setLoading(true)
    authActions.LoginByOtp(formData, type).then(res => {
      setLoading(false)
      console.log('Api response data', res);
      if (res.status == '200') {
        AsyncStorage.setItem("user_token", res.data.access_token);
        AsyncStorage.setItem("facebook_uuid", '0');
        setToken(res.data.access_token)
        setNotificationToken(res.data.access_token)
        // alert("Login Successful")
        if (res.data.popup == true) {
          setShowPopup(true)
        }
        else {
          navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes', { screen: 'Topup' })
        }

      }
      else if (res.response.status == "400") {
        if (res.response.data && res.response.data.errors) {
          if (res.response.data.errors.email) {
            alert(res.response.data.errors.email)
          }
          if (res.response.data.errors.phone) {
            alert(res.response.data.errors.phone)
          }
        }
      }
      else if (res.response.status == "401") {
        if (res.response.data && res.response.data) {
          alert(res.response.data.message)
        }
      }
      else if (res.response.status == '422') {
        //setLoading(false);
        alert("Something went wrong")
      }

      else {
        //setLoading(false);
        alert("Something went wrong")
      }
    }).then(error => {
      console.log(error)
    })
  }

  const submitDetails = () => {
    if (!name) {
      Platform.OS === 'ios' ?
        alert('Please fill name') :
        showMessage({
          message: "Alert !!!",
          description: 'Please fill name',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!email) {
      Platform.OS === 'ios' ?
        alert('Please fill email') :
        showMessage({
          message: "Alert !!!",
          description: 'Please fill email',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    let formData = new FormData();
    formData.append('name', name)
    formData.append('email', email)

    setLoading(true)
    authActions.updateProfile(token, formData).then(res => {
      setLoading(false)
      console.log('Update Profile response data', res);
      if (res.status == '200') {
        navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes')
      }
      else if (res.response.status == "400") {
        if (res.response.data && res.response.data.errors) {
          if (res.response.data.errors.email) {
            //alert(res.response.data.errors.email)
            showMessage({
              message: "Alert !!!",
              description: res.response.data.errors.email,
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });
          }
          if (res.response.data.errors.password) {
            alert(res.response.data.errors.password)
          }
        } else {
          alert("Something went wrong")
        }


      }

      else {
        setLoading(false)
        alert("Something went wrong")
      }
    })
      .catch((err) => {
        console.log('Api error', err)
        return err
      })

  }



  return (
    <View style={styles.mainBody}>

      <AlertNotificationRoot>
        <LinearGradient colors={['#ffffff', '#EAF6FF']} style={styles.container}>






          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}>
            {loading && <Loader loading={loading} />}
            <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

              <View style={{ marginTop: 130, width: '100%' }} >
                <Text style={styles.topText}>{"Verify Phone"}</Text>
              </View>

              <View style={{ marginTop: 7, width: '100%' }} >
                <Text style={styles.titleText}>{"OTP code sent to "}{phone}</Text>
              </View>

              {/* <View style={{ marginTop: 46, width: wp('78%'), height: 46, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <OTPInputView
                  style={{ width: '100%', height: '100%', }}
                  pinCount={6}
                  autoFocusOnLoad
                  codeInputFieldStyle={styles.otpInputBox}
                  codeInputHighlightStyle={styles.otpInputBox}
                  onCodeFilled={(code => {
                    setOtp(code)
                    console.log(`Code is ${code}, you are good to go!`)
                  })}
                />
              </View> */}


              <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={otp}
                onChangeText={setOtp}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                testID="my-code-input"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />




              <View style={{ marginTop: 20, height: 20, width: wp('78%'), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <Text style={[styles.titleText, { fontSize: RFValue(14) }]}>{"Time remaining 00:"} {timer} {"sec"}</Text>
                <Text onPress={() => navigation.goBack()} style={[styles.blueText, { textAlignVertical: 'center', paddingBottom: -5 }]} >Resend</Text>
              </View>

              <TouchableOpacity onPress={() => confirmCode()} style={[styles.sendButton, { marginTop: 35 }]}>
                <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>VERIFY CODE</Text>
              </TouchableOpacity>

            </View>

          </ScrollView>










        </LinearGradient>

        <Modal
          animationType='fade'

          transparent={true}
          visible={showPopup}
          onRequestClose={() => { setShowPopup(false) }}
        >
          <TouchableWithoutFeedback onPress={() => setShowPopup(false)} >
            <View style={{
              flex: 1,
              width: wp('100%'),
              height: hp('100%'),
              marginTop: 'auto',
              marginBottom: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              opacity: 1,
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>

              <LinearGradient colors={['#ffffff', '#EFE1D3']} style={{
                width: wp('100%'),
                height: hp('50%'),
                backgroundColor: 'white',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                alignItems: 'center',


              }}>
                <TouchableOpacity onPress={() => setShowPopup(false)}
                  style={{ marginTop: 10, height: 5, width: 100, backgroundColor: 'rgba(196, 196, 196, 0.5)', borderRadius: 20 }}>

                </TouchableOpacity>

                <View style={{ marginTop: 20, width: '100%' }} >
                  <Text style={[styles.LabelText, { textAlign: 'center' }]}>{"ENTER YOUR DETAILS"}</Text>
                </View>

                <ScrollView style={{ flex: 1, width: '90%', marginTop: 10 }}>

                  <View style={styles.numberBox}>
                    <TextInput
                      style={styles.dropdownText}
                      autoFocus={true}
                      placeholder={'Full name'}
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                  <View style={[styles.numberBox, { marginTop: 10 }]}>
                    <TextInput
                      style={styles.dropdownText}
                      placeholder={'E-mail'}
                      onChangeText={(text) => setEmail(text)}
                    />
                  </View>

                  <TouchableOpacity onPress={() => submitDetails()} style={[styles.sendButton, { marginTop: 20 }]}>
                    <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>SUBMIT</Text>
                  </TouchableOpacity>
                </ScrollView>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify_otp);