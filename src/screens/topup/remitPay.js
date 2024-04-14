import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { StripeContainer,CardField, useStripe, useConfirmPayment, useGooglePay, ApplePayButton, useApplePay } from '@stripe/stripe-react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showMessage, hideMessage } from "react-native-flash-message";
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
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { Base_URL } from '../../config/index';
import { GooglePay } from 'react-native-google-pay';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import Loader from '../../shares/Loader';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';


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


const RemitPay = ({ navigation, route, props, authToken, homeActions }) => {

  const { confirmPayment, loadingPayment } = useConfirmPayment();
  const { isGooglePaySupported, initGooglePay, presentGooglePay } = useGooglePay();

  const { presentApplePay, isApplePaySupported, confirmApplePayPayment } = useApplePay();

  const allowedCardNetworks = ['VISA', 'MASTERCARD'];
  const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];



  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [extra, setExtra] = useState('')
  const [usd, setUsd] = useState('')
  const [etb, setEtb] = useState('')
  const [requestID, setRequestId] = useState('')
  const [pack, setPack] = useState('')

  const [countryIcon, setCountryIcon] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [currency, setCurrency] = useState('')
  const [localValue, setLocalValue] = useState('')
  const [retailValue, setRetailValue] = useState('')
  const [payModal, setPayModal] = useState(false)
  const [total, setTotal] = useState('')

  const [card, setCard] = useState();
  const totalVal = parseFloat(usd) + parseFloat(extra);

  useEffect(() => {
    // console.log('token', authToken)

    if (isFocused) {

        // console.log("data ", route.params.plan)
      //   setCountryIcon(route.params.plan.icon)
      //   setPhone(route.params.plan.number)
      //   setCode(route.params.plan.code)
      //   setCurrency(route.params.plan.currency)
      //   setLocalValue(route.params.plan.local)
      //   setRetailValue(route.params.plan.usd)
      setUsd(route.params.usdAmount)
      setEtb(route.params.etbAmount)
      setRequestId(route.params.rId)
      setPhone(route.params.plan.number)
      setCode(route.params.plan.code)
      setPack(route.params.package)
      setPayModal(false)
      setCard()
      //initializeGPay()    
    }
    // console.log("screen name", isFocused)
    remitExtraCharge()
  }, [props, isFocused]);



  const remitExtraCharge = async () => {

    setLoading(true)
    await homeActions.remit_extra_charge(authToken).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data && res.data.remit_extra_charge) {
          // console.log('data', res.data.remit_extra_charge)
          setExtra(res.data.remit_extra_charge)
          setTotal(parseFloat(usd) + parseFloat(res.data.remit_extra_charge))
        }

      } else {
        // console.log('Something went Wrong')
      }
    })


  }
  const getamount = () => {
    return parseFloat(usd) + parseFloat(extra)
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
      totalPrice: totalVal.toString(),
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

    // formData.append('usd',usd)
    // formData.append('real',etb)
    // formData.append('whole',usd)
    // formData.append('phone',phone)
    // formData.append('code',code)
    // formData.append("amount",totalVal)
    // formData.append("country_currency","ETB")
    // formData.append('pToken',payId)
    // formData.append('request_id',requestID)

    formData.append('paymentintent_id', payId)
    formData.append('req_id', requestID)

    setLoading(true)
    homeActions.gpay_remitPayment_complete(authToken, formData, pack).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Google pay api', res.data)
          // Alert.alert(res.data.msg)
          showMessage({
            message: "Success !",
            description: res.data.msg,
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
          navigation.navigate('BottomTabRoutes')
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

  // Apple pay

  const apay = async () => {
    if (!isApplePaySupported) {
      alert("Apple Pay is not supported")
      return;
    }
    let price = parseFloat(usd) + parseFloat(extra);
    // console.log(price)
    // ...
    const { error } = await presentApplePay({
      cartItems: [{ label: 'Orbit Airtime Remit', amount: usd, paymentType: 'Immediate' }],
      country: 'US',
      currency: 'USD',
      shippingMethods: [
        {
          amount: usd,
          identifier: 'Airtime Remit',
          label: 'Airtime Remit',
          detail: 'Orbit Airtime Recharge',
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
    formData.append('usd', usd)
    formData.append('real', etb)
    formData.append('whole', usd)
    formData.append('phone', phone)
    formData.append('code', code)
    formData.append("amount", totalVal)
    formData.append("country_currency", "ETB")
    formData.append('paymentintent_id', payId)
    formData.append('request_id', requestID)

    setLoading(true)
    homeActions.Applepay_Payment_complete(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Google pay api', res.data)
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
    formData.append('amount', totalVal)
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
        Platform.OS === "ios" ?
          alert('Payment Failed.') :
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
         
      }
    })
    //return clientSecret;
  };

  // End Apple Pay

  const stripePayApi = (payId) => {
    let formData = new FormData();
    formData.append('paymentintent_id', payId)
    formData.append('req_id', requestID)

    setLoading(true)
    homeActions.Stripe_Remit_Payment_complete(authToken, formData, pack).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('Stripe pay api', res.data)
          setPayModal(false)
          //Alert.alert(res.data.msg)
          Platform.OS === 'android' ?
            showMessage({
              message: "Success !",
              description: res.data.msg,
              titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            })
            : Alert.alert(res.data.msg)
          navigation.navigate('BottomTabRoutes')
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
          // navigation.navigate('BottomTabRoutes')
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

  const initializeGPay = async () => {
    if (!(await isGooglePaySupported({ testEnv: true }))) {
      //alert('Google Pay is not supported.');
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
      // alert(error.code, error.message);
      return;
    }
  }

  const fetchPaymentIntentClientSecret = async () => {
    
    if (!card || card.complete == false) {
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
    formData.append('amount', totalVal)
    formData.append('currency', 'USD')
    formData.append("paymentMethodType", 'card',)
    formData.append('description', 'Airtime Remit for orbit app ')

    setLoading(true)
    await homeActions.stripe_payment_intent(authToken, formData).then(res => {
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('pay intent', res.data)
          setPayModal(false)
          handlePay(res.data.secret)
        } else {
          setLoading(false)
          Platform.OS === 'android' ?
            showMessage({
              message: "Alert !!!",
              description: res.data.msg,
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            }) : alert(res.data.msg)
        }

      } else {
        setLoading(false)
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
   
  };

  const handlePay = async (clientSecret) => {

    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodData: {
        card,
      },
      paymentMethodType: 'Card',
      desciption: 'Orbit Airtime remit',
      three_d_secure_usage: {
        "supported": true
      },
    });

    if (error) {
      // console.log('Payment confirmation error', error);
      setLoading(false)
      //alert(error.message)
      showMessage({
        message: "Alert !!!",
        description: error.message,
        titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
        textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
        type: "default",
        backgroundColor: "#39475D", // background color
        color: "#fff", // text color
        style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
      });
      // console.log(error)
    } else if (paymentIntent) {
      // console.log('Success from promise', paymentIntent);
      stripePayApi(paymentIntent.id)
    }

  };

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
          <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
            <Text style={[styles.amountBlueText, {}]}>{localValue} {currency}</Text>
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

              <View style={styles.detailsCard}>
                <View style={{ height: '100%', width: '90%', alignItems: 'center', flexDirection: 'row' }}>
                  <View style={{ height: '100%', width: '50%', }}>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.titleText} >{"You send"}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.titleText}>{'They receive'}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.titleText}>{"Estimated fee"}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.detailsText}>{"Total to pay"}</Text>
                    </View>
                    <View style={[styles.detailsContainer, { backgroundColor: '#428BC1' }]}>
                      <Text style={[styles.detailsText, { color: '#fff' }]}>{"They recieve in ETB"}</Text>
                    </View>
                  </View>

                  <View style={{ height: '100%', width: '50%', }}>
                    <View style={[styles.detailsContainer, { paddingLeft: 25 }]}>
                      <Text style={styles.titleText}>{usd} {"USD"}</Text>
                    </View>
                    <View style={[styles.detailsContainer, { paddingLeft: 25 }]}>
                      <Text style={styles.titleText}>{usd} {"USD"}</Text>
                    </View>
                    <View style={[styles.detailsContainer, { paddingLeft: 25 }]}>
                      <Text style={styles.titleText}>{'+'}{extra} {"USD"}</Text>
                    </View>
                    <View style={[styles.detailsContainer, { paddingLeft: 25 }]}>
                      <Text style={styles.detailsText}>{totalVal} {"USD"} </Text>
                    </View>
                    <View style={[styles.detailsContainer, { backgroundColor: '#428BC1', paddingLeft: 25 }]}>
                      <Text style={[styles.detailsText, { color: '#fff' }]}>{etb} {"ETB"}</Text>
                    </View>
                  </View>

                </View>

              </View>
              <TouchableOpacity onPress={() => setPayModal(true)} style={[styles.payButton, { marginTop: 60, }]}>
                <Image style={{ height: '100%', width: '100%' }} source={require('../../../src/assets/stripeButton.png')} />
              </TouchableOpacity>
              {Platform.OS === "android" ?
                <TouchableOpacity onPress={() => demogpay()} style={[styles.payButton, { marginTop: 10, }]}>
                  <Image style={{ height: '100%', width: '100%' }} source={require('../../../src/assets/gpayButton.png')} />
                </TouchableOpacity> : null}

              {Platform.OS === 'ios' ?
                <ApplePayButton
                  onPress={apay}
                  type="plain"
                  buttonStyle="black"
                  borderRadius={4}
                  style={{
                    width: '90%',
                    height: 45,
                    marginTop: 10
                  }}
                /> : null}


             
            </View>

          </ScrollView>
          <Modal
          animationType='fade'
          transparent={true}
          visible={payModal}
          onRequestClose={() => { setPayModal(false) }}
        >
          <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
        
          <StripeContainer>
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
                        setCard(cardDetails)
                        // cardDetails.complete == true ? console.log("ok") : null
                      }}

                      onFocus={(focusedField) => {
                        // console.log('focusField', focusedField);
                      }}
                    />

                    <TouchableOpacity onPress={() => { fetchPaymentIntentClientSecret() }} style={[styles.sendButton, { marginTop: 5 }]}>
                      <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>PAY</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {setPayModal(false)}} style={[styles.sendButton, { marginTop: 5,backgroundColor:'none' }]}>
                      <Text style={[styles.couponButtonText, { fontSize: RFValue(18),color:'#008CBA' }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>



                </LinearGradient>

              </View>
             
              </StripeContainer>
            
          </KeyboardAwareScrollView>
        </Modal> 
        </LinearGradient>
        
        
      </AlertNotificationRoot>
    </View>
    
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RemitPay);