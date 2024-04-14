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
  Alert,
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
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


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


const RequestSubmit = ({ navigation, route, props, authToken, homeActions }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [countryIcon, setCountryIcon] = useState('')
  const [countryId, setCountryId] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [currency, setCurrency] = useState('')
  const [localValue, setLocalValue] = useState('')
  const [retailValue, setRetailValue] = useState('')
  const [wholesale, SetWholesale] = useState('')

  const [firstName, setFirstName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [email, setEmail] = useState('')
  const [reqPhone, setReqPhone] = useState('')

  const [token, setToken] = useState('')


  useEffect(() => {
    if (isFocused) {
      // console.log("data ", route.params.plan)
      setCountryIcon(route.params.plan.icon)
      setCountryId(route.params.plan.countryId)
      setPhone(route.params.plan.number)
      setCode(route.params.plan.code)
      setCurrency(route.params.plan.currency)
      setLocalValue(route.params.plan.local)
      setRetailValue(route.params.plan.usd)
      SetWholesale(route.params.plan.wholesale)

    }
    AsyncStorage.getItem("user_token").then((value) => {
      if (value) {
        setToken(value)
        // console.log("user token", value)
      } else {
        setToken('')
        // console.log("not logged in")
      }
    })
    // console.log("screen name", isFocused)
  }, [props, isFocused]);

  const handleSubmitRequest1 = () => {
    navigation.navigate('RequestSuccess')
  }

  const handleSubmitRequest = () => {

    const userData = {
      'code': code,
      "number": phone,
      'fname': firstName,
      'lname': secondName,
      'email': email,
      'topup': retailValue,
    }

    if (!firstName) {
      Platform.OS === 'ios' ?
        alert('Please enter details') :
        showMessage({
          message: "Alert !!!",
          description: "Please enter details",
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
    formData.append('retail', retailValue)
    formData.append('local', localValue)
    formData.append('wholesale', wholesale)
    formData.append('currency', currency)
    formData.append('code', code)
    formData.append('countryid', countryId)
    formData.append('number', phone)
    formData.append('fname', firstName)
    formData.append('lname', secondName)
    formData.append('email', email)

    setLoading(true)
    homeActions.submitRequest(authToken, formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log("Request Created")
          Platform.OS === 'ios' ?
            Alert.alert(res.data.msg) :
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
          navigation.navigate('RequestSuccess', { "data": userData, "url": res.data.url, 'title':res.data.title })
        }
        if (res.data.status == false) {
          if (res.data.msgs && res.data.msgs.email) {
            Platform.OS === 'ios' ?
              alert(res.data.msgs.email) :
              showMessage({
                message: "Alert !!!",
                description: res.data.msgs.email,
                titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                type: "default",
                backgroundColor: "#39475D", // background color
                color: "#fff", // text color
                style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
              });
          }
          if (res.data.msgs && res.data.msgs.lname) {
            Platform.OS === 'ios' ?
              alert(res.data.msgs.lname) :
              showMessage({
                message: "Alert !!!",
                description: res.data.msgs.lname,
                titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                type: "default",
                backgroundColor: "#39475D", // background color
                color: "#fff", // text color
                style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
              });
          }
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


                <View style={{ marginTop: 30, width: '100%' }} >
                  <Text style={styles.LabelText}>{"Destination"}</Text>
                </View>

                <NumberBox />

                <View style={{ marginTop: 8, width: '100%' }} >
                  <Text onPress={() => navigation.navigate(token ? 'Request' : 'HomeRequest')} style={styles.blueText}>{"Change Number?"}</Text>
                </View>

                <View style={{ marginTop: 7, width: '100%' }} >
                  <Text style={styles.LabelText}>{"Amount"}</Text>
                </View>

                <AmountBox />

                <View style={{ marginTop: 8, width: '100%' }} >
                  <Text onPress={() => navigation.goBack()} style={styles.blueText}>{"Change Amount?"}</Text>
                </View>

                <View style={{ marginTop: 7, width: '100%' }} >
                  <Text style={styles.LabelText}>{"Enter your details"}</Text>
                </View>

                <View style={[styles.numberBox, { marginTop: 5 }]}>
                  <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
                    <TextInput
                      style={styles.dropdownText}
                      autoFocus={true}
                      placeholder={'First Name'}
                      onChangeText={(text) => setFirstName(text)}
                      returnKeyType="done"
                    />
                  </View>
                </View>

                <View style={[styles.numberBox, { marginTop: 10 }]}>
                  <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
                    <TextInput
                      style={styles.dropdownText}
                      autoFocus={true}
                      placeholder={'Last Name'}
                      onChangeText={(text) => setSecondName(text)}
                      returnKeyType="done"
                    />
                  </View>
                </View>

                <View style={[styles.numberBox, { marginTop: 10 }]}>
                  <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
                    <TextInput
                      style={styles.dropdownText}
                      autoFocus={true}
                      placeholder={'E-mail'}
                      onChangeText={(text) => setEmail(text)}
                      returnKeyType="done"
                    />
                  </View>
                </View>

                <View style={[styles.numberBox, {  flexDirection:'column',marginTop: 10,justifyContent:'center' }]}>
                  <Text style={[styles.dropdownText, { textAlignVertical: 'center' }]}>{code} {phone} </Text>
                </View>




                <TouchableOpacity onPress={() => handleSubmitRequest()} style={[styles.sendButton, { marginTop: 20 }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>SUBMIT REQUEST</Text>
                </TouchableOpacity>


              </View>

            </ScrollView>

          </LinearGradient>
        </KeyboardAwareScrollView>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestSubmit);