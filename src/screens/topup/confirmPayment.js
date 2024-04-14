import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { CardField, CardForm, useStripe, useConfirmPayment, useGooglePay, ApplePayButton, useApplePay } from '@stripe/stripe-react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { WebView } from 'react-native-webview';
import { GooglePay } from 'react-native-google-pay';
//import ApplePay, { DetailsData, MethodData } from 'react-native-apple-payment';
import { GooglePayButton } from '@stripe/stripe-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  Image,
  Modal,
  ScrollView,
  FlatList,
  ImageBackground,
  Keyboard,
  Platform,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { Base_URL } from '../../config/index';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';

import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

import Loader from '../../shares/Loader';
import HomeHeader from '../../shares/Home_Header';
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
    authToken: state.auth_Reducer.authToken,

  }
}


const Step3 = ({ navigation, route, props, authToken, homeActions }) => {
  const [loading, setLoading] = useState(false);
  const { confirmPayment, loadingPayment } = useConfirmPayment();
  const { isGooglePaySupported, initGooglePay, presentGooglePay } = useGooglePay();

  const { presentApplePay, isApplePaySupported, confirmApplePayPayment } = useApplePay();

  const allowedCardNetworks = ['VISA', 'MASTERCARD'];
  const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
  const MethodData = {
    countryCode: 'USA',
    currencyCode: 'USD',
    //merchantIdentifier: 'merchant.orbitrecharge.com',
    merchantIdentifier: 'merchant.com.orbitrecharge.com',
    supportedNetworks: ['Visa', 'MasterCard', 'AmEx'],
  };

  const DetailsData = {
    total: {
      label: 'Orbit Recharge',
      amount: 10,
    },
  };

  //const payment = new ApplePay(MethodData, DetailsData);

  const isFocused = useIsFocused();
  const [coupon, setCoupon] = useState('')
  const [couponCount, setCouponCount] = useState(0);

  const [countryIcon, setCountryIcon] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [currency, setCurrency] = useState('')
  const [localValue, setLocalValue] = useState('')
  const [retailValue, setRetailValue] = useState('')
  const [wholesaleValue, setWholesale] = useState('')
  const [payModal, setPayModal] = useState(false)
  const [applied, setApplied] = useState(false);
  const [percent, setPercent] = useState('');
  const [card, setCard] = useState();

  const [accessToken, setAccessToken] = useState(null);
  const [approvalUrl, setApprovalUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [details, setDetails] = useState();



  useEffect(() => {
    if (isFocused) {
      setCouponCount(0)
      checkData()

      // console.log("data ", route.params.plan)
      // setCountryIcon(route.params.plan.icon)
      // setPhone(route.params.plan.number)
      // setCode(route.params.plan.code)
      // setCurrency(route.params.plan.currency)
      // setLocalValue(route.params.plan.local)
      // setRetailValue(route.params.plan.usd)
      setPayModal(false)
      setCard()
      //initializeGPay()    
    }
    // console.log("screen name", isFocused)
  }, [props, isFocused]);


  const apay = async () => {
    if (!isApplePaySupported) {
      alert("Apple pay is not supported")

      return;
    }
    // ...
    const { error } = await presentApplePay({
      cartItems: [{ label: 'Orbit Recharge', amount: retailValue, paymentType: 'Immediate' }],
      country: 'US',
      currency: 'USD',
      shippingMethods: [
        {
          amount: retailValue,
          identifier: 'Orbit',
          label: 'Orbit Recharge',
          // detail: 'Orbit Airtime Recharge',
        },
      ],
      requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    });
    if(error) {
      // console.log("apple error", error)
      alert(error)
    }
    else {
      const clientSecret = await fetchAppleIntentClientSecret();

    }
  };

  const finalApplePayment = async (secret, id) => {

    const clientSecret = secret;
    // console.log("client key", clientSecret)


    const { error: confirmError } = await confirmApplePayPayment(
      clientSecret
    );

    if (confirmError) {
      // console.log("error", confirmError)
    }

    else {
      // console.log("Payment success ")
      ApplePayApi(id)
    }

  }

  const ApplePayApi = (payId) => {
    let formData = new FormData();
    formData.append('usd', retailValue)
    formData.append('real', localValue)
    formData.append('whole', wholesaleValue)
    formData.append('phone', phone)
    formData.append('code', code)
    formData.append("amount", retailValue)
    formData.append("country_currency", currency)
    formData.append('paymentintent_id', payId)

    setLoading(true)
    homeActions.Applepay_Payment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Apple pay api', res.data)
          Alert.alert(res.data.msg)
          // Dialog.show({
          //   type: ALERT_TYPE.SUCCESS,
          //   title: 'Success',
          //   textBody: res.data.msg,
          //   button: 'Done',
          // })
          navigation.navigate('Complete')
        } else {
          alert('Payment failed')
          // Dialog.show({
          //   type: ALERT_TYPE.DANGER,
          //   title: 'Alert',
          //   textBody: 'Payment failed',
          //   button: 'Back',
          // })
          navigation.navigate('BottomTabRoutes')
        }

      } else {
        alert('Something went Wrong')
        // Dialog.show({
        //   type: ALERT_TYPE.DANGER,
        //   title: 'Alert',
        //   textBody: 'Something went Wrong',
        //   button: 'Back',
        // })       
      }
    })
  }

  const fetchAppleIntentClientSecret = async () => {
    // console.log("intent method callled")
    let formData = new FormData();
    formData.append('amount', retailValue)
    formData.append('currency', 'USD')
    //formData.append('address',details)
    formData.append("paymentMethodType", 'card',)
    formData.append('description', 'Topup reacharge for orbit')


    await homeActions.stripe_payment_intent(authToken, formData).then(res => {
      // setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('pay intent', res.data)
          finalApplePayment(res.data.secret, res.data.paymentintent_id)
          return res.data.secret
          // stripePayApi(res.data.paymentintent_id)
        } else {
          alert(res.data.msg)
          //  Dialog.show({
          //   type: ALERT_TYPE.DANGER,
          //   title: 'Alert',
          //   textBody: res.data.msg,
          //   button: 'Back',
          // })
        }

      } else {
        alert('Payment Failed.')
        // Dialog.show({
        //   type: ALERT_TYPE.DANGER,
        //   title: 'Alert',
        //   textBody: 'Payment Failed.',
        //   button: 'Back',
        // })
        // navigation.navigate('BottomTabRoutes')       
      }
    })
    //return clientSecret;
  };



  const handleApplePay = () => {
    payment.canMakePayments().then((can) => {
      // console.log("isApple ?", can);
      if (can) {
        // payment.initApplePay().then((data => console.log("pay data", data)));
      }
    });
  }


  // g-pay
  const requestData = {
    cardPaymentMethod: {
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        // stripe (see Example):
        gateway: 'stripe',
        gatewayMerchantId: 'BCR2DN4TTCLPHLB4',
        stripe: {
          publishableKey: 'pk_test_fDGlHWY1Cg8vftd23bO0GgHx',
          version: '2022-12-01',
        },
      },
      allowedCardNetworks,
      allowedCardAuthMethods,
    },
    transaction: {
      totalPrice: '10',
      totalPriceStatus: 'FINAL',
      currencyCode: 'USD',
    },
    merchantName: 'Orbit Reacharge',
  };

  const demogpay = () => {
    GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

    // Check if Google Pay is available
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
      .then((ready) => {

        // console.log("================ gpayis ready ?", ready)
        if (ready) {
          // Request payment token
          GooglePay.requestPayment(requestData)
            .then((token) => {
              // console.log("gpay token", token)
              // alert("gpay token",token)
              const gpayData = JSON.parse(token)
              // console.log("token", gpayData.id)
              GooglePayApi(gpayData.id)
              // Send a token to your payment gateway
            })
            .catch((error) => {
              // console.log(error.code, error.message)
              alert(error.message)
            }
            );
        }
      })
  }


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
        setCoupon(x.coupon)
        setCouponCount(x.couponCount ? parseInt(x.couponCount) : 0)
        setApplied(x.applied)
      }


    }
    )
  }

  const applyDiscount = (dis) => {

    const disAmount = (retailValue / 100) * dis;
    const fin = retailValue - disAmount;


    // console.log("After to fix", fin.toFixed(2))

    setRetailValue(fin.toFixed(2))
  }

  const handleCouponButton = async () => {
    // console.log('coupon count', couponCount)
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
      Platform.OS === 'ios' ?
        alert('Please enter coupon code') :
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
          setCouponCount(parseInt(couponCount + 1))
          Platform.OS === "ios" ?
            alert("Coupon Applied") :
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
        alert('Something went Wrong')
        // Dialog.show({
        //   type: ALERT_TYPE.DANGER,
        //   title: 'Alert',
        //   textBody: 'Something went Wrong',
        //   button: 'Back',
        // })      
      }
    })


  }

  const stripePayApi = (payId) => {
    let formData = new FormData();
    formData.append('usd', retailValue)
    formData.append('real', localValue)
    formData.append('whole', wholesaleValue)
    formData.append('phone', phone)
    formData.append('code', code)
    formData.append("amount", retailValue)
    formData.append("country_currency", currency)
    formData.append('paymentintent_id', payId)

    setLoading(true)
    homeActions.Stripe_Payment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Stripe pay api', res.data)
          //alert(res.data.msg)
          setPayModal(false)
          // Platform.OS === 'android' ?
          // showMessage({
          //   message: "Success !",
          //   description: res.data.msg,
          //   titleStyle:{fontSize:20, color:'green', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          //   textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          //   type: "default",
          //   backgroundColor: "#39475D", // background color
          //   color: "#fff", // text color
          //   style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
          //  }):
          //   Alert.alert(res.data.msg)
          //navigation.navigate('BottomTabRoutes',{screen :'Topup'})
          navigation.navigate('Complete',{"api_response":res.data.msg})
        } else {
          //alert('Payment failed')
          Platform.OS === 'android' ?
            showMessage({
              message: "Alert !!!",
              description: "Payment failed",
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            }) : alert('Payment failed')
          //navigation.navigate('BottomTabRoutes')
        }

      } else {
        //alert('Something went Wrong')
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

  const PaypalPayApi = (payId) => {
    let formData = new FormData();
    formData.append('usd', retailValue)
    formData.append('real', localValue)
    formData.append('whole', wholesaleValue)
    formData.append('phone', phone)
    formData.append('code', code)
    formData.append("amount", retailValue)
    formData.append("country_currency", currency)
    formData.append('payment_id', payId)

    setLoading(true)
    homeActions.Paypal_Payment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Paypal pay api', res.data)
          // Alert.alert(res.data.msg)
          // Platform.OS==='ios'?
          // alert(res.data.msg):
          // showMessage({
          //   message: "Success !",
          //   description: res.data.msg,
          //   titleStyle:{fontSize:20, color:'green', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          //   textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          //   type: "default",
          //   backgroundColor: "#39475D", // background color
          //   color: "#fff", // text color
          //   style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
          //  });
          navigation.navigate('Complete',{"api_response":res.data.msg})
        } else {
          Platform.OS === 'ios' ?
            alert('Payment failed') :
            showMessage({
              message: "Alert !!!",
              description: "Payment failed",
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });
          navigation.navigate('BottomTabRoutes')
        }

      } else {
        Platform.OS === 'ios' ?
          alert('Something went Wrong') :
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

  const GooglePayApi = (payId) => {
    let formData = new FormData();
    formData.append('usd', retailValue)
    formData.append('real', localValue)
    formData.append('whole', wholesaleValue)
    formData.append('phone', phone)
    formData.append('code', code)
    formData.append("amount", retailValue)
    formData.append("country_currency", currency)
    formData.append('pToken', payId)

    setLoading(true)
    homeActions.gpay_Payment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Google pay api', res.data)
          //   Platform.OS==='ios'?
          //  Alert.alert(res.data.msg):
          //  showMessage({
          //   message: "Success !",
          //   description: res.data.msg,
          //   titleStyle:{fontSize:20, color:'green', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          //   textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          //   type: "default",
          //   backgroundColor: "#39475D", // background color
          //   color: "#fff", // text color
          //   style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
          //  });
          navigation.navigate('Complete',{"api_response":res.data.msg})
        } else {
          Platform.OS === 'ios' ?
            alert('Payment failed') :
            showMessage({
              message: "Alert !!!",
              description: 'Payment failed',
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });
          navigation.navigate('BottomTabRoutes')
        }

      } else {
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

  const initializeGPay = async () => {
    if (!(await isGooglePaySupported({ testEnv: true }))) {
      // console.log('Google Pay is not supported.');
      return;
    }

    const { error } = await initGooglePay({
      testEnv: true,
      merchantName: 'com.orbit',
      countryCode: 'US',
      billingAddressConfig: {
        format: 'FULL',
        isPhoneNumberRequired: true,
        isRequired: false,
      },
      existingPaymentMethodRequired: false,
      isEmailRequired: true,
    });

    if (error) {
      // console.log(error.code, error.message);
      return;
    }
  }

  const fetchPaymentIntentClientSecret = async () => {
    if (!details || details.complete == false) {
      // alert("Enter complete card details")
      showMessage({
        message: "Alert !!!",
        description: "Enter complete card details",
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
    formData.append('amount', retailValue)
    formData.append('currency', 'USD')
    formData.append("paymentMethodType", 'card',)
    formData.append('description', 'Topup reacharge for orbit app jdf;dk jjl jlkjs sjdod jfdkf k[vd')

    setLoading(true)
    await homeActions.stripe_payment_intent(authToken, formData).then(res => {
      // setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('-----------------', res.data)
          handlePayIOS(res.data.secret)
          // stripePayApi(res.data.paymentintent_id)
        } else {
          setLoading(false)
          Platform.OS === 'ios' ?
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
        setLoading(false)
        Platform.OS === 'ios' ?
          alert('Payment Failed.') :
          showMessage({
            message: "Alert !!!",
            description: "Payment Failed",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
        navigation.navigate('BottomTabRoutes')
      }
    })
    //return clientSecret;
  };
  const handlePayIOS = async (clientSecret) => {
    setPayModal(false)
    // console.log("carddetail", details)
    // console.log("clientSecret", clientSecret)
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodData: {
        details,
      },
      paymentMethodType: 'Card',
      desciption: 'Hamsatech.com',
      three_d_secure_usage: {
        "supported": true
      },
    })
    if (error) {
      setLoading(false)
      // console.log('Payment confirmation error', error);
      // alert(error.message)

    } else if (paymentIntent) {
      // console.log(paymentIntent)
      stripePayApi(paymentIntent.id)
    }
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

  const handle_Paypal1 = () => {
    const dataDetail = JSON.stringify({
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "transactions": [{
        "amount": {
          "total": retailValue,
          "currency": "USD",
          "details": {
            "subtotal": retailValue,
            "tax": "0",
            "shipping": "0",
            "handling_fee": "0",
            "shipping_discount": "0",
            "insurance": "0"
          }
        }

      }],
      "redirect_urls": {
        "return_url": "https://example.com",
        "cancel_url": "https://example.com"
      }
    })




    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Basic QVRlVFZST2JMOEdneWxqRVEwakVSTVJvYmRnOEgzNkV5LS1oVUtPRDBEY2hacDFCcy1RZHVRZ2VwSnljMjctckU5cFA2N1BiRHU4OVBmVGk6RUtBeXZVUHdoMUpvVl9Kc3hlb2R4Z0N0d2JxT1RMZV9RaldkVno2a2NYakg2VHZqemZqa1R4YzZLTWtQODBYRUVTaGg3d01MeHFsZ0pJcnA=");


    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      // body: JSON.stringify(urlencoded),
      redirect: 'follow'
    };



    fetch("https://api.sandbox.paypal.com/v1/oauth2/token?grant_type=client_credentials", requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log("this is result", result)
        // console.log("this is parsed result ",JSON.parse(result)) 
        let parsedData = JSON.parse(result);
        // console.log("pased token", parsedData.access_token)
        setAccessToken(parsedData.access_token)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + parsedData.access_token);

        // console.log(result.access_token, myHeaders)
        var requestOptions2 = {
          method: 'POST',
          headers: myHeaders,
          body: dataDetail,
          redirect: 'follow'
        };

        fetch("https://api.sandbox.paypal.com/v1/payments/payment", requestOptions2)
          .then(pay_res => pay_res.text())
          .then(res => {
            // console.log("second api res", res)
            let payData = JSON.parse(res);
            // console.log("link url data", payData)
            // const { id, links } = payData.data
            const id = payData.id;
            const approvalUrl = payData.links.find(data => data.rel == "approval_url")
            // console.log(id)
            // console.log(approvalUrl)
            setPaymentId(id)
            setApprovalUrl(approvalUrl.href)
          }).catch(err => {
            // console.log({ ...err })
          })

      })
      // .catch(error => console.log('error', error));

  }

  const onNavigationStateChange = (webViewState) => {
    // console.log("webview state", webViewState)
    if (webViewState.url.includes('https://example.com/')) {
      setApprovalUrl(null)
      // this.setState({
      //     approvalUrl: null
      // })

      const { PayerID } = webViewState.url
      // console.log("pay id", webViewState.url.PayerID);
      var Pid = webViewState.url.substring(webViewState.url.lastIndexOf('=') + 1);
      // console.log("splited", Pid)

      axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, { payer_id: Pid },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
        .then(response => {
          // console.log("final pay response", response)
          PaypalPayApi(paymentId)
        }).catch(err => {
          // console.log("Final error", { ...err })
        })

    }
  }



  const AmountBox = () => {
    return (
      <View style={[styles.numberBox, { marginTop: 10 }]}>
        <View style={{ height: '100%', width: '27%', flexDirection: 'row', borderRightWidth: 1, borderColor: '#e7edd3' }}>
          <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
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
            {
              approvalUrl ? <WebView
                style={{ height: hp('100%'), width: wp('100%') }}
                source={{ uri: approvalUrl }}
                onNavigationStateChange={onNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
              // style={{ marginTop: 20 }}
              /> :

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  style={{ flex: 1 }}>
                  {loading && <Loader loading={loading} />}


                  <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>
                    {/* {
                    approvalUrl ? <WebView
                        style={{ height: hp('100%'), width:wp('100%') }}
                        source={{ uri: approvalUrl }}
                        onNavigationStateChange={onNavigationStateChange}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={false}
                       // style={{ marginTop: 20 }}
                    /> : null
                } */}

                    <View style={{ height: 50, width: '100%', marginTop: 20 }}>
                      <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../../src/assets/bar2.png')} />
                    </View>

                    <View style={{ marginTop: 30, width: '100%' }} >
                      <Text style={styles.LabelText}>{"Destination"}</Text>
                    </View>

                    <NumberBox />

                    <View style={{ marginTop: 8, width: '100%' }} >
                      <Text onPress={() => navigation.navigate('BottomTabRoutes', { screen: 'Topup' })} style={styles.blueText}>{"Change Number?"}</Text>
                    </View>

                    <View style={{ marginTop: 7, width: '100%' }} >
                      <Text style={styles.LabelText}>{"Amount"}</Text>
                    </View>

                    <AmountBox />

                    <View style={{ marginTop: 8, width: '100%' }} >
                      <Text onPress={() => navigation.navigate('choosePlan', { "from": 'back' })} style={styles.blueText}>{"Change Amount?"}</Text>
                    </View>

                    <View style={{ marginTop: 7, width: '100%' }} >
                      <Text style={styles.LabelText}>{"Coupon"}</Text>
                    </View>

                    <View style={{ height: 50, width: '100%', marginTop: 9, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={[styles.couponBox, { height: 50, width: wp('55%'), justifyContent: 'center' }]}>
                        <TextInput
                          style={[styles.dropdownText, { paddingLeft: 10, }]}
                          keyboardType="default"
                          placeholder='Coupon Code'
                          value={coupon}
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

                    <TouchableOpacity onPress={() => handle_Paypal1()} style={[styles.paypalButton, { marginTop: 20 }]}>
                      <Image resizeMode='contain' style={{ height: 22, width: 70 }} source={require('../../../src/assets/paypal.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPayModal(true)} style={[styles.sendButton, { marginTop: 20 }]}>
                      <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>DEBIT OR CREDIT CARD</Text>
                    </TouchableOpacity>

                    {Platform.OS === "android" ?
                      <TouchableOpacity onPress={() => demogpay()} style={[styles.payButton, { marginTop: 20, height: 50, }]}>
                        <Image resizeMode="cover" style={{ height: '100%', width: '100%', borderRadius: 5 }} source={require('../../../src/assets/gpay.png')} />
                      </TouchableOpacity> :
                      null
                    }

                    {Platform.OS === 'ios' ?
                      <ApplePayButton
                        onPress={apay}
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
            }
          </LinearGradient>
        </KeyboardAwareScrollView>
        <Modal
          animationType='fade'
          transparent={true}
          visible={payModal}
          onRequestClose={() => { setPayModal(false) }}
        >
          <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
            <TouchableWithoutFeedback>
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
                  height: hp('40%'),
                  backgroundColor: 'white',
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  alignItems: 'center',


                }}>

                  <TouchableOpacity onPress={() => setPayModal(false)}
                    style={{ marginTop: 10, height: 5, width: 100, backgroundColor: 'rgba(196, 196, 196, 0.5)', borderRadius: 20 }}>

                  </TouchableOpacity>

                  <View style={{ marginTop: 20, width: '100%' }} >
                    <Text style={[styles.LabelText, { textAlign: 'center' }]}>{"ADD CARD DETAILS"}</Text>
                  </View>



                  <View style={{ marginTop: 10, width: '90%' }}>
                    <CardField
                      postalCodeEnabled={false}
                      placeholders={{
                        number: '4242 4242 4242 4242',
                      }}
                      cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                        borderWidth: StyleSheet.hairlineWidth
                      }}
                      style={{
                        width: '100%',
                        height: 50,
                        marginVertical: 30,
                      }}
                      onCardChange={(cardDetails) => {
                        // console.log('cardDetails', cardDetails);
                        setDetails(cardDetails)
                      }}
                      onFocus={(focusedField) => {
                        // console.log('focusField', focusedField);
                      }}
                    />



                    <TouchableOpacity onPress={() => {

                      fetchPaymentIntentClientSecret()

                    }} style={[styles.sendButton, { marginTop: 5 }]}>
                      <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>PAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setPayModal(false)}} style={[styles.sendButton, { marginTop: 5,backgroundColor:'none' }]}>
                      <Text style={[styles.couponButtonText, { fontSize: RFValue(18),color:'#008CBA' }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>



                </LinearGradient>

              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
        </Modal>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Step3);