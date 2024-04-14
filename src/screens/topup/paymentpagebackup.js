import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { CardField, useStripe, useConfirmPayment, useGooglePay } from '@stripe/stripe-react-native';
import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal';
import PayPal from 'react-native-paypal-gateway';


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

  const { confirmPayment, loading } = useConfirmPayment();
  const { isGooglePaySupported, initGooglePay } = useGooglePay();

  const isFocused = useIsFocused();
  const [coupon, setCoupon] = useState('')

  const [countryIcon, setCountryIcon] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [currency, setCurrency] = useState('')
  const [localValue, setLocalValue] = useState('')
  const [retailValue, setRetailValue] = useState('')
  const [payModal, setPayModal] = useState(false)

  const [card, setCard] = useState();


  useEffect(() => {
    if (isFocused) {
      // console.log("data ", route.params.plan)
      setCountryIcon(route.params.plan.icon)
      setPhone(route.params.plan.number)
      setCode(route.params.plan.code)
      setCurrency(route.params.plan.currency)
      setLocalValue(route.params.plan.local)
      setRetailValue(route.params.plan.usd)
      setPayModal(false)
      setCard()
      initializeGPay()
    }
    // console.log("screen name", isFocused)
  }, [props, isFocused]);

  const handleCouponButton = async () => {
    if (!coupon) {
      alert('Please enter coupon code');
      return;
    }

    // setLoading(true)
    await homeActions.applyCoupon(coupon).then(res => {
      //setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('data set')

        } else {
          alert(res.data.msg)
        }

      } else {
        alert('Something went Wrong')
      }
    })


  }

  const initializeGPay = async () => {
    if (!(await isGooglePaySupported({ testEnv: true }))) {
      alert('Google Pay is not supported.');
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
      alert(error.code, error.message);
      return;
    }
  }

  const fetchPaymentIntentClientSecret = async () => {
    if (!card || card.complete == false) {
      alert("Enter complete card details")
      return;
    }
    const details = {
      line1: 'line1 addres',
      postal_code: '500001',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    }

    let formData = new FormData();
    formData.append('amount', retailValue)
    formData.append('currency', 'INR')
    //formData.append('address',details)
    formData.append("paymentMethodType", 'card',)
    formData.append('description', 'Topup reacharge for orbit app jdf;dk jjl jlkjs sjdod jfdkf k[vd')


    await homeActions.stripe_payment_intent(authToken, formData).then(res => {
      // setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('pay intent', res.data)
          handlePay(res.data.secret)

        } else {
          alert(res.data.msg)
        }

      } else {
        alert('Something went Wrong')
      }
    })
    //return clientSecret;
  };

  const handlePay = async (clientSecret) => {

    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodData: {
        card,
      },
      name: 'Vaibhav',
      address: {
        line1: 'line1 addres',
        postal_code: '500001',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
      },
      shipping: {
        name: 'Jenny Shipping',
        address: {
          line1: '1 Main street',
          city: 'San Francisco',
          postal_code: '90210',
          state: 'CA',
          country: 'US',
        },
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'IN'],
      },
      type: 'Card',
      desciption: 'Orbit Topup Recharge',
      three_d_secure_usage: {
        "supported": true
      },
    });

    if (error) {
      // console.log('Payment confirmation error', error);
      alert(error.message)
      // console.log(error)
    } else if (paymentIntent) {
      // console.log('Success from promise', paymentIntent);
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

  const handle_Paypal = async () => {

    let payToken = "A21AAIznOCBpAXaNKSPC9PoqQ0YQpzsQAjKOde-1GvIl0QxKWS5KFLb_ti6Hc3KYGRlYfMKbiWYf1Sj7LNHI1RD1tf9fwnY4w";

    // const {
    //   nonce,
    //   payerId,
    //   email,
    //   firstName,
    //   lastName,
    //   phone
    // } = await requestOneTimePayment(
    //   payToken,
    //   {
    //     amount: '5',
    //     currency: 'USD',
    //     //localeCode: 'en_GB', 
    //     shippingAddressRequired: false,
    //     userAction: 'commit', // display 'Pay Now' on the PayPal review page
    //     // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
    //     intent: 'authorize', 
    //   }
    // );
    PayPal.initialize(PayPal.SANDBOX, "AdFErbZy50FLttb2hupyLJ2zfjji1hHSNnaVKqP2fvAiAncQhZFX2xER0OBfK1KIbYXG-C42JtRDeiTx");
    PayPal.pay({
      price: '10.70',
      currency: 'USD',
      description: 'Your description goes here',
    }).then(confirm => console.log('-PayMentPage',confirm))
      .catch(error => console.log(error));

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


      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
        <HomeHeader />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>

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
              <View style={[styles.couponBox, { height: 50, width: wp('55%') }]}>
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

            <TouchableOpacity onPress={() => handle_Paypal()} style={[styles.paypalButton, { marginTop: 30 }]}>
              <Image resizeMode='contain' style={{ height: 22, width: 70 }} source={require('../../../src/assets/paypal.png')} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPayModal(true)} style={[styles.sendButton, { marginTop: 20 }]}>
              <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>DEBIT OR CREDIT CARD</Text>
            </TouchableOpacity>


          </View>

        </ScrollView>

      </LinearGradient>

      <Modal
        animationType='fade'

        transparent={true}
        visible={payModal}
        onRequestClose={() => { setPayModal(false) }}
      >
        <TouchableWithoutFeedback onPress={() => setPayModal(false)} >
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
                  }}
                  onFocus={(focusedField) => {
                    // console.log('focusField', focusedField);
                  }}
                />

                <TouchableOpacity onPress={() => fetchPaymentIntentClientSecret()} style={[styles.sendButton, { marginTop: 5 }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>PAY</Text>
                </TouchableOpacity>
              </View>



            </LinearGradient>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Step3);