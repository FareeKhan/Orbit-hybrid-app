import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { showMessage, hideMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  FlatList,
  ImageBackground,
  Keyboard,
  Alert,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';


import HomeHeader from '../../shares/Home_Header';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions } from '../../actions/index';
import { CardField, CardForm, useStripe, useConfirmPayment, useGooglePay, ApplePayButton, useApplePay } from '@stripe/stripe-react-native';

const mapDispatchToProps = (dispatch) => {
  return ({
    homeActions: bindActionCreators(homeActions, dispatch),
  })
};

const mapStateToProps = (state) => {
  return {
    rechargePacks: state.home_Reducer.rechargePacks,

  }
}


const Home3 = ({ navigation, route, props, homeActions }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('')
  const [couponCount, setCouponCount] = useState(0);
  const [authModal, setAuthModal] = useState(false)

  const [countryIcon, setCountryIcon] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [currency, setCurrency] = useState('')
  const [localValue, setLocalValue] = useState('')
  const [retailValue, setRetailValue] = useState('')
  const [applied, setApplied] = useState(false);
  const [percent, setPercent] = useState('');
  const [wholesaleValue, setWholesale] = useState('')


  useEffect(() => {
    if (isFocused) {
      //checkData()
      // console.log("data ", route.params.plan)
      setCountryIcon(route.params.plan.icon)
      setPhone(route.params.plan.number)
      setCode(route.params.plan.code)
      setCurrency(route.params.plan.currency)
      setLocalValue(route.params.plan.local)
      setRetailValue(route.params.plan.usd)
      setWholesale(route.params.plan.wholesale)
      setAuthModal(false)
    }
    // console.log("screen name", isFocused)
  }, [props, isFocused]);

  const checkData = async () => {
    AsyncStorage.getItem("planData").then((value) => {
      if (value) {
        // console.log("plan data", value)
        let x = JSON.parse(value)
        setCountryIcon(x.icon)
        setPhone(x.number)
        setCode(x.code)
        setCurrency(x.currency)
        setLocalValue(x.local)
        setRetailValue(x.usd)
        setWholesale(x.wholesale)
      }


    }
    )
  }

  const setPlan = () => {
    // console.log("set plan called ")
    const planInfo = {
      'code': code,
      "number": phone,
      "icon": countryIcon,
      "currency": currency,
      "local": localValue,
      'usd': retailValue,
      'wholesale': wholesaleValue,
      "coupon": coupon,
      "couponCount": couponCount,
      "applied": applied,
    }
    //console.log('pack', planInfo)
    AsyncStorage.setItem("planData", JSON.stringify(planInfo));
  }

  const handleCouponButton = async () => {
    if (couponCount > 0) {
      Platform.OS === 'ios' ?
        alert('coupon code already applied') :
        showMessage({
          message: "Alert !!!",
          description: "coupon code already applied",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!coupon) {
      Platform.OS === "ios" ?
        alert("Please enter coupon code") :
        showMessage({
          message: "Alert !!!",
          description: "Please enter coupon code",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }

    setLoading(true)
    await homeActions.applyCoupon(coupon).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('data set')
          setApplied(true)
          setCouponCount(couponCount + 1)
          showMessage({
            message: "Success !",
            description: "Coupon Applied",
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
          setPercent(res.data.dis_percentage)
          applyDiscount(res.data.dis_percentage)
        } else {
          Platform.OS === "ios" ?
            alert(res.data.msg) :
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

      } else {
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
  const applyDiscount = (dis) => {

    const disAmount = (retailValue / 100) * dis;
    const fin = retailValue - disAmount;


    // console.log("After to fix", fin.toFixed(2))

    setRetailValue(fin.toFixed(2))
  }


  const apay = async () => {
    alert("Login Please")
  }

  const NumberBox = () => {
    return (
      <View style={[styles.numberBox, { marginTop: 10 }]}>
        <View style={{ height: '100%', width: '27%', flexDirection: 'row', borderRightWidth: 1, borderColor: '#e7edd3' }}>
          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 26, width: 26, borderRadius: 13 }} source={countryIcon ? { uri: countryIcon } : require('../../../src/assets/vector.png')} />
          </View>

          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.codeText}>{code ? code : ''}</Text>
          </View>
        </View>

        <View style={{ height: '100%', width: '73%', flexDirection: 'row', }}>
          <View style={{ height: '100%', width: '70%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 19 }}>
            <Text style={styles.codeText}>{phone ? phone : ''}</Text>
          </View>



        </View>


      </View>
    )

  }

  const AmountBox = () => {
    return (
      <View style={[styles.numberBox, { marginTop: 10 }]}>
        <View style={{ height: '100%', width: '27%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#e7edd3' }}>
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', }}>
            <Text style={[styles.amountBlueText, { paddingTop: Platform.OS == 'ios' ? 20 : 0 }]}>{localValue} {currency}</Text>
          </View>
        </View>

        <View style={{ height: '100%', width: '73%', flexDirection: 'row', }}>
          <View style={{ height: '100%', width: '100%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 19 }}>
            <Text style={styles.codeText}>{"(" + retailValue + " USD)"}</Text>
          </View>



        </View>


      </View>
    )

  }



  return (
    <View style={styles.mainBody}>

      <AlertNotificationRoot>
      <KeyboardAwareScrollView >
        <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
          <HomeHeader />
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}>
            {loading && <Loader loading={loading} />}
            <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

              <View style={{ height: 50, width: '100%', marginTop: 20 }}>
                <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../../src/assets/bar2.png')} />
              </View>

              <View style={{ marginTop: 30, width: '100%' }} >
                <Text style={styles.LabelText}>{"Destination"}</Text>
              </View>

              <NumberBox />

              <View style={{ marginTop: 8, width: '100%' }} >
                <Text onPress={() => navigation.navigate('Home1')} style={styles.blueText}>{"Change Number?"}</Text>
              </View>

              <View style={{ marginTop: 7, width: '100%' }} >
                <Text style={styles.LabelText}>{"Amount"}</Text>
              </View>

              <AmountBox />

              <View style={{ marginTop: 8, width: '100%' }} >
                <Text onPress={() => navigation.goBack()} style={styles.blueText}>{"Change Amount?"}</Text>
              </View>

              <View style={{ marginTop: 7, width: '100%' }} >
                <Text style={styles.LabelText}>{"Coupon"}</Text>
              </View>

              <View style={{ height: 50, width: '100%', marginTop: 9, flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={[styles.couponBox, { height: 50, width: wp('55%'), justifyContent: 'center' }]}>
                  <TextInput
                    style={[styles.dropdownText, { paddingLeft: 10 }]}
                    keyboardType="default"
                    placeholder='Coupon Code'
                    onChangeText={(text) => setCoupon(text)}
                  />
                </View>

                <TouchableOpacity onPress={() => handleCouponButton()} style={[styles.sendButton, { width: wp('33%'), height: 50, marginTop: 0 }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(16) }]}>APPLY COUPON</Text>
                </TouchableOpacity>
                
              </View>

              {applied &&
                <View style={{ width: '100%', }}>
                  <Text style={{ color: 'green', textAlign: 'left', marginTop: 5 }} >{"Coupon Code Applied. Payable Amount is $ " + retailValue}</Text>
                </View>
              }

              <TouchableOpacity onPress={() => { setAuthModal(true), setPlan() }} style={[styles.paypalButton, { marginTop: 30 }]}>
                <Image resizeMode='contain' style={{ height: 22, width: 70 }} source={require('../../../src/assets/paypal.png')} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setAuthModal(true), setPlan() }} style={[styles.sendButton, { marginTop: 20 }]}>
                <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>DEBIT OR CREDIT CARD</Text>
              </TouchableOpacity>

              {Platform.OS === "android" ?
                <TouchableOpacity onPress={() => { setAuthModal(true), setPlan() }} style={[styles.payButton, { marginTop: 20, height: 50, }]}>
                  <Image resizeMode="cover" style={{ height: '100%', width: '100%', borderRadius: 5 }} source={require('../../../src/assets/gpay.png')} />
                </TouchableOpacity> :
                null
              }


              {Platform.OS === 'ios' ?
                <ApplePayButton
                  onPress={() => { setAuthModal(true), setPlan() }}
                  type="plain"
                  buttonStyle="black"
                  borderRadius={4}
                  style={{
                    width: '100%',
                    height: 60,
                    marginTop: 20
                  }}
                /> : null}




            </View>

          </ScrollView>

        </LinearGradient>
        </KeyboardAwareScrollView>
        <Modal
          animationType='fade'

          transparent={true}
          visible={authModal}
          onRequestClose={() => { setAuthModal(false) }}
        >
          <TouchableWithoutFeedback onPress={() => setAuthModal(false)} >
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
                height: hp('20%'),
                backgroundColor: 'white',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                alignItems: 'center',


              }}>
                <TouchableOpacity onPress={() => setAuthModal(false)}
                  style={{ marginTop: 10, height: 5, width: 100, backgroundColor: 'rgba(196, 196, 196, 0.5)', borderRadius: 20 }}>

                </TouchableOpacity>
                <View style={{ marginTop: 45, width: wp('90%'), height: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => { navigation.navigate('Signup', { 'navRoute': 'topup' }), setAuthModal(false) }} style={[styles.chooseAuthBox, { backgroundColor: '#1877F2' }]}>
                    <Text style={styles.couponButtonText} >SIGN UP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => { navigation.navigate('Login', { 'navRoute': 'topup' }), setAuthModal(false) }} style={[styles.chooseAuthBox, { borderWidth: 1, borderColor: '#1877F2' }]}>
                    <Text style={[styles.couponButtonText, { color: '#1877F2' }]} >LOGIN</Text>
                  </TouchableOpacity>
                </View>


              </LinearGradient>

            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home3);