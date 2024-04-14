import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';

import { CardField, useStripe, useConfirmPayment, useGooglePay, ApplePayButton, useApplePay } from '@stripe/stripe-react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { GooglePay } from 'react-native-google-pay';
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  FlatList,
  Keyboard,
  Alert,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../shares/Home_Header';
import NormalHeader from '../../shares/Normal_Header';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../actions/index';
import { sms_Credits } from '../../actions/home_actions';
const mapDispatchToProps = (dispatch) => {
  return ({
    homeActions: bindActionCreators(homeActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),

  })
};

const mapStateToProps = (state) => {
  return {
    countryList: state.home_Reducer.countryList,
    authToken: state.auth_Reducer.authToken,
  }
}


const Buy_SMS = ({ navigation, route, homeActions, countryList, authToken }) => {

  const { confirmPayment, loadingPayment } = useConfirmPayment();
  const { isGooglePaySupported, initGooglePay, presentGooglePay } = useGooglePay();

  const { presentApplePay, isApplePaySupported, confirmApplePayPayment } = useApplePay();
  const allowedCardNetworks = ['VISA', 'MASTERCARD'];
  const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(route.params.pack == "A" ? 1.99 : 2.99)
  const [packDetails, setPackDetails] = useState('')

  const [payModal, setPayModal] = useState(false)
  const [card, setCard] = useState();
  const [details, setDetails] = useState();

  const [accessToken, setAccessToken] = useState(null);
  const [approvalUrl, setApprovalUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    // console.log("purchase sms package")
    getPackDetail(route.params.slug)
  }, []);

  const getPackDetail = (slug) => {
    homeActions.get_package_detail(authToken, slug).then(res => {
      // setLoading(false)
      if (res.status == '200') {
        if (res.data) {
          // console.log("SMS Pack to buy ===", res)
          setPackDetails(res.data)
        }

      } else {
        alert('Something went Wrong')
      }
    })


  }

  // G-pay
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
      totalPrice: packDetails.amount,
      totalPriceStatus: 'FINAL',
      currencyCode: 'USD',
    },
    merchantName: 'Orbit SMS PACKAGE',
  };

  const demogpay = () => {
    GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

    // Check if Google Pay is available
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
      .then((ready) => {
        // console.log("is ready ?", ready)
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

  const GooglePayApi = (payId) => {
    let formData = new FormData();
    formData.append("amount", packDetails.amount)
    formData.append("package_id", packDetails.id)
    formData.append('pToken', payId)

    setLoading(true)
    homeActions.Gpay_smsPayment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Google pay api', res.data)
          showMessage({
            message: "Success !",
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: res.data.msg,
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
          //Alert.alert(res.data.msg)
          // Dialog.show({
          //   type: ALERT_TYPE.SUCCESS,
          //   title: 'Success',
          //   textBody: res.data.msg,
          //   button: 'Done',
          // })
          navigation.navigate('BottomTabRoutes')
        } else {
          //alert('Payment failed')
          showMessage({
            message: "Alert !!!",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: "Payment failed",
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
          navigation.navigate('BottomTabRoutes')
        }

      } else {
        //alert('Something went Wrong')
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: "Something went Wrong",
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      }
    })
  }

  // Apple Pay

  const apay = async () => {
    if (!isApplePaySupported) {
      alert("Apple Pay is not supported")
      return;
    }
    // ...
    const { error } = await presentApplePay({
      cartItems: [{ label: 'Orbit Recharge', amount: packDetails.amount, paymentType: 'Immediate' }],
      country: 'US',
      currency: 'USD',
      shippingMethods: [
        {
          amount: packDetails.amount,
          identifier: 'Orbit',
          label: 'Orbit Recharge',
          // detail: 'Orbit Airtime Recharge',
        },
      ],
      requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    });
    if (error) {
      // console.log("apple error", error)
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
    formData.append("amount", packDetails.amount)
    formData.append("package_id", packDetails.id)
    formData.append('paymentintent_id', payId)

    setLoading(true)
    homeActions.Apple_smsPayment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Apple pay api', res.data)
          Platform.OS === "ios" ?
            alert(res.data.msg) :
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Success',
              textBody: res.data.msg,
              button: 'Done',
            })
          navigation.navigate('BottomTabRoutes')
        } else {
          Platform.OS === "ios" ?
            alert('Payment failed') :
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Alert',
              textBody: 'Payment failed',
              button: 'Back',
            })
          navigation.navigate('BottomTabRoutes')
        }

      } else {
        Platform.OS === "ios" ?
          alert('Something went Wrong') :
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Alert',
            textBody: 'Something went Wrong',
            button: 'Back',
          })
      }
    })
  }

  const fetchAppleIntentClientSecret = async () => {
    // console.log("intent method callled")
    let formData = new FormData();
    formData.append('amount', packDetails.amount)
    formData.append('currency', 'USD')
    //formData.append('address',details)
    formData.append("paymentMethodType", 'card',)
    formData.append('description', 'SMS Package purchase for orbit')


    await homeActions.stripe_payment_intent(authToken, formData).then(res => {
      // setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('pay intent', res.data)
          finalApplePayment(res.data.secret, res.data.paymentintent_id)
          return res.data.secret

        } else {
          Platform.OS === "ios" ?
            alert(res.data.msg) :
            showMessage({
              message: "Alert !!!",
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              description: res.data.msg,
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });
        }

      } else {
        Platform.OS === "ios" ?
          alert('Payment Failed.') :
          showMessage({
            message: "Alert !!!",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: "Payment Failed.",
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
        // navigation.navigate('BottomTabRoutes')       
      }
    })
    //return clientSecret;
  };



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
    // console.log('intent method called ')
    let formData = new FormData();
    formData.append('amount', packDetails.amount)
    formData.append('currency', 'USD')
    formData.append("paymentMethodType", 'card',)
    formData.append('description', 'Airtime Renit for orbit app ')

    setLoading(true)
    await homeActions.stripe_payment_intent(authToken, formData).then(res => {
      // setLoading(false)

      if (res.data.status == true && res.status == '200') {
        // console.log('pay intent', res.data)
        setPayModal(false)
        handlePayIOS(res.data.secret)
      }
      else {
        Platform.OS === "ios" ?
          alert(res.data.msg) :
          showMessage({
            message: "Alert !!!",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: res.data.msg,
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      }


      // else {
      //   setLoading(false)
      //   Platform.OS === "ios"?
      //   alert('Something went Wrong'):
      //   showMessage({
      //     message: "Alert !!!",
      //     titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      //     description: "Something went Wrong",
      //     textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      //     type: "default",
      //     backgroundColor: "#39475D", // background color
      //     color: "#fff", // text color
      //     style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
      //    });
      // }
    })
    //return clientSecret;
  };

  const handlePayIOS = async (clientSecret) => {
    // console.log("carddetail", details)
    // console.log("clientSecret", clientSecret)
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        details,
      },

      desciption: 'Orbit SMS PAck',
      three_d_secure_usage: {
        "supported": true
      },
    })
    if (error) {
      setLoading(false)
      // console.log('Payment confirmation error', error);
      alert(error.message)

    } else if (paymentIntent) {
      // console.log('00000000000')
      stripePayApi(paymentIntent.id)
    }
  }

  // const handlePay = async (clientSecret) => {

  //   const {paymentIntent, error} = await confirmPayment(clientSecret, {
  //       paymentMethodData: {
  //         card,
  //       },
  //       // For IOS use paymentMethodType here
  //       paymentMethodType:'Card',
  //       desciption:'Orbit SMS Package Purchase',      
  //       three_d_secure_usage: {
  //         "supported": true
  //       },
  //     });

  //     if (error) {
  //       setLoading(false)
        // console.log('Payment confirmation error', error);
  //       setLoading(false)
  //      // alert(error.message)
        // console.log(error)
  //     } else if (paymentIntent) {
        // console.log('Success from promise', paymentIntent);
  //       stripePayApi(paymentIntent.id)
  //     }


  // };

  const stripePayApi = (payId) => {
    let formData = new FormData();
    formData.append("amount", packDetails.amount)
    formData.append("package_id", packDetails.id)
    formData.append('paymentintent_id', payId)

    setLoading(true)
    homeActions.Stripe_smsPayment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Stripe pay api', res.data)

          Platform.OS === 'android' ?
            showMessage({
              message: "Success !",
              titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              description: res.data.msg,
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            }) :
            Alert.alert(res.data.msg)
          navigation.navigate('BottomTabRoutes')
        } else {
          //alert('Payment failed')
          Platform.OS === 'android' ?
            showMessage({
              message: "Alert !!!",
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              description: 'Payment failed',
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            }) : alert('Payment failed')
          navigation.navigate('BottomTabRoutes')
        }

      } else {
        //alert('Something went Wrong') 
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: 'Something went Wrong',
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        })
      }
    })
  }

  const handle_Paypal = () => {
    const dataDetail = JSON.stringify({
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "transactions": [{
        "amount": {
          "total": packDetails.amount,
          "currency": "USD",
          "details": {
            "subtotal": packDetails.amount,
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
      .catch((error )=> 
        console.log('buySMS', error)
        );

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

  const PaypalPayApi = (payId) => {
    let formData = new FormData();
    formData.append("amount", packDetails.amount)
    formData.append("package_id", packDetails.id)
    formData.append('payment_id', payId)
    // console.log(formData,"payId",payId)

    setLoading(true)
    homeActions.Paypal_smsPayment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          setPayModal(false)
          // console.log('Paypal pay api', res.data)
          // alert(res.data.msg)
          Platform.OS === "ios" ?
            alert(res.data.msg) :
            showMessage({
              message: "Success !",
              titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              description: res.data.msg,
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });
          navigation.navigate('BottomTabRoutes')
        } else {
          Platform.OS === "ios" ?
            alert('Payment failed') :
            showMessage({
              message: "Alert !!!",
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              description: 'Payment failed',
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });
          navigation.navigate('BottomTabRoutes')
        }

      } else {
        Platform.OS === "ios" ?
          alert('Something went Wrong') :
          showMessage({
            message: "Alert !!!",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: 'Something went Wrong',
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

        <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
          <NormalHeader title={"Buy SMS Package"} />
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
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}>
                {loading && <Loader loading={loading} />}
                <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

                  {/* <View style={{ marginTop: 13, width: '100%' }} >
              <Text style={[styles.topText,{}]}>{"You don't have enough balance. Please purchase a package."}</Text>
            </View> */}

                  <View style={styles.packageCard} >
                    <ImageBackground resizeMode={'contain'} style={{ height: '100%', width: '100%', flexDirection: 'row' }} source={require('../../assets/sms-bg.png')}>
                      <View style={{ height: '100%', width: '50%', paddingLeft: 19, justifyContent: 'space-evenly', }}>
                        <Text style={[styles.cardText, { fontWeight: '400', opacity: 0.5 }]}>{packDetails ? packDetails.description : null}</Text>
                        <Text style={[styles.cardText, { fontSize: RFValue(26) }]}>{packDetails ? packDetails.title : null}</Text>

                      </View>

                      <View style={{ height: '100%', width: '50%', alignItems: 'flex-end', justifyContent: 'center', paddingRight: 20 }}>

                        <Text style={[styles.cardText, { fontSize: RFValue(36), color: '#FFC107', fontWeight: '700' }]}>{"$"}{packDetails ? packDetails.amount : null}</Text>
                      </View>
                    </ImageBackground>

                  </View>

                  <TouchableOpacity onPress={() => handle_Paypal()} style={[styles.paypalButton, { marginTop: 30 }]}>
                    <Image resizeMode='contain' style={{ height: 22, width: 70 }} source={require('../../../src/assets/paypal.png')} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setPayModal(true)} style={[styles.sendButton, { marginTop: 20 }]}>
                    <Text style={[styles.cardText, { fontSize: RFValue(18) }]}>DEBIT OR CREDIT CARD</Text>
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
                        height: 50,
                        marginTop: 20
                      }}
                    /> : null}




                </View>

              </ScrollView>
          }
        </LinearGradient>

        <Modal
          animationType='fade'

          transparent={true}
          visible={payModal}
          onRequestClose={() => { setPayModal(false) }}
        >
          {/* <TouchableWithoutFeedback> */}
          <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
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

                <TouchableOpacity onPress={() => setPayModal(false)} style={{ alignSelf: 'flex-end', marginRight: 25 }} >
                  <Image style={{ height: 20, width: 20, alignSelf: 'flex-end' }} source={require('../../assets/close.png')}></Image>
                </TouchableOpacity>

                <View style={{ marginTop: 5, width: '100%' }} >
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

                  <TouchableOpacity onPress={() => { fetchPaymentIntentClientSecret() }} style={[styles.sendButton, { marginTop: 5 }]}>
                    <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>PAY</Text>
                  </TouchableOpacity>
                </View>



              </LinearGradient>

            </View>
          </KeyboardAwareScrollView>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Buy_SMS);