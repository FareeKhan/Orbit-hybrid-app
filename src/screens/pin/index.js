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
  Switch,
  ImageBackground,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import NormalHeader from '../../shares/Normal_Header';
import Loader from '../../shares/Loader';
import styles from './style';

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
    rechargePacks: state.home_Reducer.rechargePacks,
    authToken: state.auth_Reducer.authToken,
  }
}


const SetPin = ({ navigation, authActions, authToken }) => {

  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmNewPin, setConfirmNewPin] = useState('')

  const [showPin, setShowPin] = useState(true)
  const [showConfirmPin, setShowConfirmPin] = useState(true)
  const [showOldPin, setShowOldPin] = useState(true)
  const [showNewPin, setShowNewPin] = useState(true)
  const [showConfirmNewPin, setShowConfirmNewPin] = useState(true)

  const up = require('../../../src/assets/up.png')
  const down = require('../../../src/assets/down.png')



  useEffect(() => {


  }, []);

  const handleSetPin = () => {
    if (!pin) {
      Platform.OS === "ios" ?
        alert("Please enter pin") :
        showMessage({
          message: "Alert !!!",
          description: "Please enter pin",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (pin.length < 4) {
      Platform.OS === "ios" ?
        alert("Please enter pin of 4 digits.") :
        showMessage({
          message: "Alert !!!",
          description: "Please enter pin of 4 digits.",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!confirmPin) {
      Platform.OS === "ios" ?
        alert('Please enter confirm pin') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter confirm pin',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (pin != confirmPin) {
      Platform.OS === "ios" ?
        alert('Pins does not match') :
        showMessage({
          message: "Alert !!!",
          description: 'Pins does not match',
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
    formData.append('new', pin)
    formData.append('confirm', confirmPin)

    setLoading(true)
    authActions.setPin(authToken, formData).then(res => {
      setLoading(false)
      // console.log('Set Pin response data', res);
      if (res.status == '200') {
        Platform.OS === "ios" ?
          Alert.alert('PIN Set') :
          showMessage({
            message: "Success !",
            description: "PIN Set",
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
        navigation.goBack()
      }
      else if (res.response.status == "422") {
        if (res.response.data && res.response.data.errors) {
          if (res.response.data.errors.old) {
            // alert("You already set pin. Please select change pin to update.")
            Platform.OS === "android" ?
              showMessage({
                message: "Alert !!!",
                description: "You already set pin. Please select change pin to update.",
                titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                type: "default",
                backgroundColor: "#39475D", // background color
                color: "#fff", // text color
                style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
              }) :
              alert("You already set pin. Please select change pin to update.")
          }
          if (res.response.data.errors.password) {
            Platform.OS === "ios" ?
              alert(res.response.data.errors.password) :
              showMessage({
                message: "Alert !!!",
                description: res.response.data.errors.password,
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
            alert("Something went wrong") :
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


      }

      else {
        setLoading(false)
        Platform.OS === "ios" ?
          alert("Something went wrong") :
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
      .catch((err) => {
        // console.log('Api error', err)
        return err
      })

  }

  const handleUpdatePin = () => {
    if (!oldPin) {
      Platform.OS === "ios" ?
        alert('Please enter old pin') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter old pin',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (oldPin.length < 4) {
      Platform.OS === "ios" ?
        alert('Please enter old pin of 4 digits.') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter old pin of 4 digits.',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!newPin) {
      Platform.OS === "ios" ?
        alert('Please enter new pin') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter new pin',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (newPin.length < 4) {
      Platform.OS === "ios" ?
        alert('Please enter new pin of 4 digits.') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter new pin of 4 digits.',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!confirmNewPin) {
      Platform.OS === "ios" ?
        alert('Please enter confirm new pin') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter confirm new pin',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (newPin != confirmNewPin) {
      Platform.OS === "ios" ?
        alert('New pins does not match') :
        showMessage({
          message: "Alert !!!",
          description: 'New pins does not match',
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
    formData.append('new', newPin)
    formData.append('confirm', confirmNewPin)
    formData.append('old', oldPin)

    setLoading(true)
    authActions.setPin(authToken, formData).then(res => {
      setLoading(false)
      // console.log('Update Pin response data', res);
      if (res.status == '200') {
        Platform.OS === "ios" ?
          Alert.alert("PIN Updated.") :
          showMessage({
            message: "Success !",
            description: "PIN Updated.",
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
        navigation.navigate('BottomTabRoutes')
      }
      else if (res.response.status == "422") {
        if (res.response.data && res.response.data.message) {
          Platform.OS === "ios" ?
            alert(res.response.data.message) :
            showMessage({
              message: "Alert !!!",
              description: res.response.data.message,
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });
        } else {
          if (res.response.data && res.response.data.errors) {
            if (res.response.data.errors.old) {
              Platform.OS === "ios" ?
                alert(res.response.data.errors.old) :
                showMessage({
                  message: "Alert !!!",
                  description: res.response.data.errors.old,
                  titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                  textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                  type: "default",
                  backgroundColor: "#39475D", // background color
                  color: "#fff", // text color
                  style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
                });
            }
            if (res.response.data.errors.new) {
              Platform.OS === "ios" ?
                alert(res.response.data.errors.new) :
                showMessage({
                  message: "Alert !!!",
                  description: res.response.data.errors.new,
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
              alert("Something went wrong") :
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
        }

      }

      else {
        setLoading(false)
        //alert("Something went wrong")
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
      .catch((err) => {
        // console.log('Api error', err)
        return err
      })

  }

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const pinSetInputs = () => {
    return (
      <View style={{ flex: 1, height: '100%', width: '100%' }}>
        <View style={{ marginTop: 30, width: '100%' }} >
          <Text style={styles.LabelText}> {"Set A Pin"}</Text>
        </View>

        <View style={styles.inputBox}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={[styles.inputText, {}]}
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              placeholder='Enter Pin'
              secureTextEntry={showPin}
              onChangeText={(text) => setPin(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowPin(!showPin)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../assets/eye.png')} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 18, width: '100%' }} >
          <Text style={styles.LabelText}>{"Confirm Pin"}</Text>
        </View>

        <View style={styles.inputBox}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={[styles.inputText, {}]}
              keyboardType="numeric"
              maxLength={4}
              value={confirmPin}
              placeholder='Enter Confirm Pin'
              secureTextEntry={showConfirmPin}
              onChangeText={(text) => setConfirmPin(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowConfirmPin(!showConfirmPin)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../assets/eye.png')} />
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  const updatePinInputs = () => {
    return (
      <View style={{ flex: 1, height: '100%', width: '100%' }}>
        <View style={{ marginTop: 30, width: '100%' }} >
          <Text style={styles.LabelText}>{"Enter Old Pin"}</Text>
        </View>

        <View style={styles.inputBox}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={[styles.inputText, {}]}
              keyboardType="numeric"
              maxLength={4}
              value={oldPin}
              placeholder='Enter old Pin'
              secureTextEntry={showOldPin}
              onChangeText={(text) => setOldPin(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowOldPin(!showOldPin)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../assets/eye.png')} />
          </TouchableOpacity>

        </View>

        <View style={{ marginTop: 18, width: '100%' }} >
          <Text style={styles.LabelText}>{"Enter New Pin"}</Text>
        </View>

        <View style={styles.inputBox}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={[styles.inputText, {}]}
              keyboardType="numeric"
              maxLength={4}
              value={newPin}
              placeholder='Enter new pin'
              secureTextEntry={showNewPin}
              onChangeText={(text) => setNewPin(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowNewPin(!showNewPin)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../assets/eye.png')} />
          </TouchableOpacity>

        </View>

        <View style={{ marginTop: 18, width: '100%' }} >
          <Text style={styles.LabelText}>{"Confirm New Pin"}</Text>
        </View>

        <View style={styles.inputBox}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={[styles.inputText, {}]}
              keyboardType="numeric"
              maxLength={4}
              value={confirmNewPin}
              placeholder='Confirm new pin'
              secureTextEntry={showConfirmNewPin}
              onChangeText={(text) => setConfirmNewPin(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowConfirmNewPin(!showConfirmNewPin)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../assets/eye.png')} />
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  return (
    <View style={styles.mainBody}>
      <AlertNotificationRoot>
        <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
          <NormalHeader title={"Set Pin"} />
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}>
            {loading && <Loader loading={loading} />}
            <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>
              <View style={{ marginTop: 13, width: '100%' }} >
                <Text style={styles.topText}>{"Set your new pin or change pin for instant login, anytime, anywhere."}</Text>
              </View>
              <View style={{ marginTop: 30, width: '98%', flexDirection: 'row', alignItems: 'center',marginLeft:'auto',marginRight:'auto' }}>
                <View style={[styles.switchStyle, { borderColor: isEnabled ? '#1AB68CB2' : '#C4C4C4B2' }]}>
                  <Switch
                    trackColor={{ false: "#fcf8f5", true: "#fcf8f5" }}
                    thumbColor={isEnabled ? "#008CBA" : "#D9D9D9"}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>

                <Text style={styles.boldText} >Change Pin</Text>
              </View>

              {isEnabled ? updatePinInputs() : pinSetInputs()}



              <TouchableOpacity onPress={() => { isEnabled ? handleUpdatePin() : handleSetPin() }} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>SUBMIT NOW</Text>
              </TouchableOpacity>


            </View>
          </ScrollView>

        </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPin);