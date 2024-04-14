import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Modal,
  Alert,
  ScrollView,
  ImageBackground,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import { showMessage, hideMessage } from "react-native-flash-message";
import NormalHeader from '../../shares/Normal_Header';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../actions/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const mapDispatchToProps = (dispatch) => {
  return ({
    homeActions: bindActionCreators(homeActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),

  })
};

const mapStateToProps = (state) => {
  return {
    userData: state.home_Reducer.userData,
    authToken: state.auth_Reducer.authToken,
  }
}


const My_Account = ({ navigation, userData, authToken, homeActions, authActions }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [edit, setEdit] = useState(false)

  useEffect(() => {
    // console.log("info", userData.data.name)
    setName(userData.data.name)
    setEmail(userData.data.email)
  }, []);

  const submitDetails = () => {
    if (!name) {
      Platform.OS === "ios" ?
        alert('Please fill name') :
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: 'Please fill name',
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
    authActions.updateProfile(authToken, formData).then(res => {
      setLoading(false)
      // console.log('Update Profile response data', res);
      if (res.status == '200') {
        getSelfInfo()
        setEdit(false)
        Platform.OS === 'ios' ?
          Alert.alert('Profile updated.') :
          showMessage({
            message: "Success !",
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: 'Profile updated.',
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      }
      else if (res.response.status == "400") {
        if (res.response.data && res.response.data.errors) {
          if (res.response.data.errors.email) {
            alert(res.response.data.errors.email)

          }
          if (res.response.data.errors.password) {
            alert(res.response.data.errors.password)
          }
        } else {
          // alert("Something went wrong")
          showMessage({
            message: "Alert !!!",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: "Something went wrong",
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
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: "Something went wrong",
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

  const changePassword = () => {
    if (!password) {
      Platform.OS === "ios" ?
        alert('Please fill password') :
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: 'Please fill password',
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (password.length < 8) {
      Platform.OS === "ios" ?
        alert('Please enter password of atleast 8 characters.') :
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: 'Please enter password of atleast 8 characters.',
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!confirmPassword) {
      Platform.OS === "ios" ?
        alert('Please enter confirm password') :
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: 'Please enter confirm password',
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (password != confirmPassword) {
      Platform.OS === "ios" ?
        alert('Password does not match') :
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: 'Password does not match',
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }

    let formData = new FormData();
    formData.append('password', password)
    formData.append('confirm_password', confirmPassword)

    setLoading(true)
    authActions.updatePassword(authToken, formData).then(res => {
      setLoading(false)
      // console.log('Update Password response data', res);
      if (res.status == '200') {
        Platform.OS === "ios" ?
          Alert.alert("Password updated.") :
          showMessage({
            message: "Success !",
            titleStyle: { fontSize: 20, color: 'green', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            description: "Password updated.",
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
        navigation.goBack()
      }
      else if (res.response.status == "400") {
        if (res.response.data && res.response.data.errors) {
          if (res.response.data.errors.email) {
            Platform.OS === "ios" ?
              alert(res.response.data.errors.email) :
              showMessage({
                message: "Alert !!!",
                titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                description: res.response.data.errors.email,
                textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                type: "default",
                backgroundColor: "#39475D", // background color
                color: "#fff", // text color
                style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
              });
          }
          if (res.response.data.errors.password) {
            Platform.OS === "ios" ?
              alert(res.response.data.errors.password) :
              showMessage({
                message: "Alert !!!",
                titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
                description: res.response.data.errors.password,
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
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              description: "Something went wrong",
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
        //alert("Something went wrong")
        showMessage({
          message: "Alert !!!",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          description: 'Something went wrong',
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

  const getSelfInfo = () => {
    homeActions.get_SelfInfo(authToken).then(res => {
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('self data set')
        }

      }
    })
  }


  return (
    <AlertNotificationRoot>
      <View style={styles.mainBody}>


        <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
          <NormalHeader title={"My Account"} />
          <KeyboardAwareScrollView >
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}>
            {loading && <Loader loading={loading} />}
            <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

              <View style={{ height: 100, width: '100%', marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ height: 100, width: '30%' }}>
                  <Image resizeMode='cover' style={{ height: 100, width: 100, borderRadius: 50, }} source={require('../../../src/assets/test-user.png')} />
                </View>
              
                  <View style={{ height: 100, width: '70%',justifyContent:'center' }}>
                <Text style={{
                  fontFamily:'RobotoCondensed-Bold',
                  fontWeight:'500',
                  fontSize:RFValue(20),
                  
                  //paddingLeft:20,
                 // textAlign:'left',
                  //lineHeight:14,
                  color:'#1E1E1E'
                }}>{name}</Text>
                <TouchableOpacity onPress={() => { edit == true ? submitDetails() : setEdit(true) }} style={[styles.sendButton, { height: 30, width: 110, marginTop: 0, }]}>
                  <Text style={styles.editButtonText}>{edit ? "SAVE" : "EDIT PROFILE"}</Text>
                </TouchableOpacity>
                </View>
               
                

              </View>

              <View style={{ marginTop: 35, width: '100%' }} >
                <Text style={styles.LabelText}>{"Name"}</Text>
              </View>

              <View style={styles.inputBox}>
                <TextInput
                  style={[styles.inputText, {}]}
                  keyboardType="default"
                  editable={edit}
                  placeholder='Name'
                  value={name}
                  autoFocus={edit}
                  onChangeText={(text) => setName(text)}
                />
              </View>

              <View style={{ marginTop: 13, width: '100%' }} >
                <Text style={styles.LabelText}>{"E-mail Address"}</Text>
              </View>

              <View style={styles.inputBox}>
                <TextInput
                  style={[styles.inputText, {}]}
                  keyboardType="default"
                  editable={false}
                  placeholder='Email'
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>

              <View style={{ height: 1, width: '100%', backgroundColor: '#D8D8D8', marginTop: 30 }} />

              <View style={{ marginTop: 10, width: '100%' }} >
                <Text style={[styles.LabelText, { fontSize: RFValue(16) }]}>{"Change Password"}</Text>
              </View>

              <View style={{ marginTop: 15, width: '100%' }} >
                <Text style={styles.LabelText}>{"Set A Password"}</Text>
              </View>

              <View style={styles.inputBox}>
                <TextInput
                  style={[styles.inputText, {}]}
                  keyboardType="default"
                  placeholder='Enter Password'
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                />
              </View>

              <View style={{ marginTop: 13, width: '100%' }} >
                <Text style={styles.LabelText}>{"Confirm Password"}</Text>
              </View>

              <View style={styles.inputBox}>
                <TextInput
                  style={[styles.inputText, {}]}
                  keyboardType="default"
                  placeholder='Enter Confirm Password'
                  secureTextEntry={true}
                  onChangeText={(text) => setConfirmPassword(text)}
                />
              </View>

              <TouchableOpacity onPress={() => changePassword()} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>SUBMIT</Text>
              </TouchableOpacity>

            </View>

          </ScrollView>
          </KeyboardAwareScrollView>
        </LinearGradient>
        
      </View>
    </AlertNotificationRoot>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(My_Account);