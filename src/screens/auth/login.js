import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { showMessage, hideMessage } from "react-native-flash-message";
import DeviceInfo from 'react-native-device-info';
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
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../shares/Loader';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';
import LinearGradient from 'react-native-linear-gradient';

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
    countryList: state.home_Reducer.countryList,
  }
}


const Login = ({ navigation, countryList, authActions, route }) => {

  const [byPhone, setByPhone] = useState('phone');
  const [byEmail, setByEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('')
  const [icon, setIcon] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fcmToken, setFcmToken] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const deviceType = Platform.OS === 'android' ? 'android' : 'ios';

  const [showList, setShowList] = useState(false)
  const [list, setList] = useState([])

  const [showPassword, setShowPassword] = useState(true)

  const [search, setSearch] = useState('');
  const [filterList, SetFilterList] = useState([]);
  const [nodata, setNodata] = useState(false);

  const [nav, setNav] = useState(route.params && route.params.navRoute ? route.params.navRoute : '')

  useEffect(() => {
    // console.log(countryList)
    setList(countryList.data)
    SetFilterList(countryList.data)
    AsyncStorage.getItem("fcm_token").then((value) => {
      setFcmToken(value)
    })
    DeviceInfo.getUniqueId().then((res) => {
      // console.log('id', res)
      setDeviceId(res)
    })
  }, []);

  const setNotificationToken = (token) => {

    // console.log('method called')
    let formData = new FormData();
    formData.append('fcm_token', fcmToken)
    formData.append('device_id', deviceId)
    formData.append('device_type', deviceType)
    // console.log(formData);

    setLoading(true)
    authActions.addFCMToken(formData, token).then(res => {
      setLoading(false)
      // console.log('Api response data', res);
      if (res.status == '200') {
        // console.log("token set")
      }
    })


  }

  const SearchText = (text) => {
    if (text) {
      const newData = list.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() :
          ''.toUpperCase();

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      SetFilterList(newData);
      setSearch(text);
    } else {
      SetFilterList(list);
      setSearch(text)
    }

  }

  const PaymentScreen = () => {
    // console.log("pay method called")
    return (
      <View style={{ flex: 1 }}>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          onCardChange={(cardDetails) => {
            // console.log('cardDetails', cardDetails);
          }}
        />
      </View>
    );
  }

  const loginWithOtp = async () => {
    // console.log('otp method called ')
    if (!code) {
      Platform.OS === "ios" ?
        alert('Please enter phone details') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter phone details',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!phone) {
      Platform.OS === "ios" ?
        alert('Please enter phone') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter phone',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    let phoneNumber = code + phone;
    {
      try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        // console.log("get otp", confirmation)
        navigation.navigate('Verify_otp', { "confirm": confirmation, "phone": phoneNumber, "type": 'login', 'route': nav })
      } catch (error) {
        alert(error);
      }
    }

  }

  const handleLoginByEmail = () => {
    //navigation.navigate('BottomTabRoutes')
    if (!username) {
      Platform.OS === "ios" ?
        alert('Please fill Email') :
        showMessage({
          message: "Alert !!!",
          description: 'Please fill Email',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }
    if (!password) {
      Platform.OS === "ios" ?
        alert('Please fill Password') :
        showMessage({
          message: "Alert !!!",
          description: 'Please fill Password',
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
    formData.append('email', username)
    formData.append('password', password)
    // console.log(formData);

    setLoading(true)
    authActions.LoginByEmail(formData).then(res => {
      setLoading(false)
      // console.log('Api response data', res);
      if (res.status == '200') {
        setNotificationToken(res.data.access_token)
        AsyncStorage.setItem("user_token", res.data.access_token);
        AsyncStorage.setItem("facebook_uuid", '0');
        // alert("Login Successful")
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: "Login Successful",
        //   button: 'Done',
        // })
        navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes', { screen: 'Topup' })
      }
      else if (res.response.status == "400") {
        if (res.response.data && res.response.data.errors) {
          if (res.response.data.errors.email) {
            Platform.OS === "ios" ?
              alert(res.response.data.errors.email) :
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
        }
      }
      else if (res.response.status == '422') {
        //setLoading(false);
        Platform.OS === "ios" ?
          alert("Invalid Email") :
          showMessage({
            message: "Alert !!!",
            description: "Invalid Email",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      }

      else {
        //setLoading(false);
        //alert("Invalid credentials")
        showMessage({
          message: "Alert !!!",
          description: "Invalid credentials",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      }
    }).then(error => {
      // console.log(error)
    })
  }

  const onGoogleAuth = () => {
   try {
    GoogleSignin.configure({
      androidClientId: '922141319415-vtkqh7s562ej238prctkk2d8upjcmngp.apps.googleusercontent.com',
      iosClientId: '922141319415-feq2k8hs399ro7mjc4l687lobfsg1stb.apps.googleusercontent.com',
    });

    GoogleSignin.hasPlayServices().then((hasPlayService) => {
      
      if (hasPlayService) {
        GoogleSignin.signOut();

        GoogleSignin.signIn().then((userInfo) => {
          console.log('--->>>',JSON.stringify(userInfo))
          handleLoginByGoogle(userInfo.user)

        })
      }
    }).catch((e) => {
      console.log('sssssss',e)
      // console.log("ERROR IS: " + JSON.stringify(e));
      // console.log('something went wrong')
    })
   } catch (error) {
    console.log('-->>>>',error)
   }

  }

  const handleLoginByGoogle = (user) => {
    //navigation.navigate('BottomTabRoutes')
    // console.log(user.email, user.id, user.name)

    try {
      let formData = new FormData();
    formData.append('email', user.email)
    formData.append('name', user.name)
    formData.append('google_id', user.id)
    formData.append('phone', user.phone ? user.phone : '')
    // console.log(formData);

    setLoading(true)
    authActions.LoginByGoogle(formData).then(res => {
      console.log('--dasdasdassdasdasdasdasdasdasdasdasdasda',res)
      setLoading(false)
      // console.log('Api response data', res);
      if (res?.access_token) {
        AsyncStorage.setItem("user_token", res.access_token);
        AsyncStorage.setItem("facebook_uuid", '0');
        setNotificationToken(res.access_token)
        //alert("Login Successful")
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: "Login Successful",
        //   button: 'Done',
        // })
        navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes', { screen: 'Topup' })
    }})
    } catch (error) {
      console.log(error)
    }
    
    // let formData = new FormData();
    // formData.append('email', user.email)
    // formData.append('name', user.name)
    // formData.append('google_id', user.id)
    // formData.append('phone', user.phone ? user.phone : '')
    // // console.log(formData);

    // setLoading(true)
    // authActions.LoginByGoogle(formData).then(res => {
    //   console.log('--dasdasdassdasdasdasdasdasdasdasdasdasda',res)
    //   setLoading(false)
    //   // console.log('Api response data', res);
    //   if (res.status == '200') {
    //     AsyncStorage.setItem("user_token", res.access_token);
    //     AsyncStorage.setItem("facebook_uuid", '0');
    //     setNotificationToken(res.access_token)
    //     //alert("Login Successful")
    //     // Dialog.show({
    //     //   type: ALERT_TYPE.SUCCESS,
    //     //   title: 'Success',
    //     //   textBody: "Login Successful",
    //     //   button: 'Done',
    //     // })
    //     navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes', { screen: 'Topup' })
    //   }
    //   else if (res.response.status == "400") {
    //     if (res.response.data && res.response.data.errors) {
    //       if (res.response.data.errors.email) {
    //         Platform.OS === "ios" ?
    //           alert(res.response.data.errors.email) :
    //           showMessage({
    //             message: "Alert !!!",
    //             description: res.response.data.errors.email,
    //             titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
    //             textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
    //             type: "default",
    //             backgroundColor: "#39475D", // background color
    //             color: "#fff", // text color
    //             style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
    //           });
    //       }
    //       if (res.response.data.errors.phone) {
    //         Platform.OS === "ios" ?
    //           alert(res.response.data.errors.phone) :
    //           showMessage({
    //             message: "Alert !!!",
    //             description: res.response.data.errors.phone,
    //             titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
    //             textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
    //             type: "default",
    //             backgroundColor: "#39475D", // background color
    //             color: "#fff", // text color
    //             style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
    //           });
    //       }
    //     }
    //   }
    //   else if (res.response.status == '422') {
    //     //setLoading(false);
    //     alert("Invalid Email")
    //   }

    //   else {
    //     //setLoading(false);
    //     alert("Something went wrong")
    //   }
    // }).then(error => {


    //   console.log('GoogleLoginm000',error)
    // })
  }

  const getInfoFromToken = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name,email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, user) => {
        if (error) {
          // console.log('login info has error: ' + error);
        } else {
          //this.setState({userInfo: user});
          // console.log('result:', user);
          handleLoginByFacebook(user)

        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const onFacebookAuth = async () => {
    await LoginManager.logOut()
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }

    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile', "email"]).then(
      login => {
        if (login.isCancelled) {
          // console.log('Login cancelled');
        }
        else if (login.declinedPermissions && login.declinedPermissions.includes("email")) {
          // console.log("email require")
        }
        else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            // console.log('data', data)
            getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        // console.log('Login fail with error: ' + error);
      },
    );
  };

  const handleLoginByFacebook = (user) => {
    //navigation.navigate('BottomTabRoutes')
    // console.log(user.email, user.id, user.name)
    let formData = new FormData();
    formData.append('email', user.email ? user.email : "")
    formData.append('name', user.name)
    formData.append('facebook_id', user.id)
    formData.append('phone', user.phone ? user.phone : '')
    // console.log(formData);

    setLoading(true)
    authActions.LoginByFacebook(formData).then(res => {
      setLoading(false)
      // console.log('Api response data', res);
      if (res.status == '200') {
        AsyncStorage.setItem("user_token", res.data.access_token);
        AsyncStorage.setItem("facebook_uuid", '1');
        setNotificationToken(res.data.access_token)
        // alert("Login Successful")
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: "Login Successful",
        //   button: 'Done',
        // })
        navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes', { screen: 'Topup' })
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
      else if (res.response.status == '422') {
        //setLoading(false);
        alert("Invalid Email")
      }

      else {
        //setLoading(false);
        alert("Something went wrong")
      }
    }).then(error => {
      // console.log(error)
    })
  }

  const onPhoneClick = () => {
    setByPhone(true);
    setByEmail(false);

  }

  const onEmailClick = () => {
    setByPhone(false);
    setByEmail(true);

  }

  const NumberBox = () => {
    return (
      <View style={[styles.numberBox, styles.borderStyle]}>
        <TouchableOpacity onPress={() => { setShowList(!showList) }} style={{ height: '100%', width: '27%', flexDirection: 'row', borderRightWidth: 1, borderColor: '#e7edd3' }}>
          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 26, width: 26, borderRadius: 13, }} source={icon ? { uri: icon } : require('../../../src/assets/vector.png')} />
          </View>

          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.codeText}>{code ? code : "+00"}</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: '100%', width: '73%', flexDirection: 'row', }}>
          {code ?
            <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
              <TextInput
                style={styles.dropdownText}
                keyboardType="numeric"
                autoFocus={true}
                maxLength={10}
                value={phone}
                onChangeText={(text) => setPhone(text)}
              />
            </View> :

            [<TouchableOpacity onPress={() => { setShowList(!showList) }} style={{ height: '100%', width: '70%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 19 }}>
              <Text style={styles.codeText}>Select Country</Text>
            </TouchableOpacity>
              ,
            <TouchableOpacity onPress={() => { setShowList(!showList) }} style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center', paddingRight: 19 }}>
              <Image resizeMode='contain' style={{ height: 10, width: 16 }} source={require('../../../src/assets/down-arrow.png')} />
            </TouchableOpacity>]
          }
        </View>


      </View>
    )

  }

  const Inputs = () => {
    return (
      [
        <View style={[styles.numberBox, styles.borderStyle]}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={styles.dropdownText}
              autoFocus={true}
              placeholder={'Username/email/phone'}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 16, width: 16 }} source={require('../../../src/assets/user.png')} />
          </TouchableOpacity>
        </View>,
        <View style={[styles.numberBox, styles.borderStyle, { marginTop: 10 }]}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={styles.dropdownText}
              placeholder={'Password'}
              secureTextEntry={showPassword}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../../src/assets/eye.png')} />
          </TouchableOpacity>

        </View>,
        <TouchableOpacity onPress={() => alert('Reset Password')}  style={{marginLeft:"auto"}}>
          <Text style={[styles.titleText, { color: "blue", marginTop: 15, marginBottom: -5 ,color:"#008cba"}]}>Forgot Password?</Text>
        </TouchableOpacity>

      ]
    )
  }


  return (
    <View style={styles.mainBody}>

      <AlertNotificationRoot>
        <LinearGradient colors={['#ffffff', '#fff']} style={styles.container}>
          {/* <View style={{ height: 50, width: wp('100%'), flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => onPhoneClick()}
              style={{
                height: '100%', width: '50%',
                backgroundColor: byPhone ? '#edf3f9' : '#f8faf2',
                //opacity : byPhone? '0.1' :'0.3',
                borderBottomWidth: 2,
                borderBottomColor: byPhone ? '#428BC1' : '#E7EDD3',
                alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontFamily: 'RobotoCondensed-Regular', fontWeight: '500', fontSize: RFValue(16), color: byPhone ? '#428BC1' : '#707070' }}>By-Phone</Text>

            </TouchableOpacity>

            <TouchableOpacity onPress={() => onEmailClick()}
              style={{
                height: '100%', width: '50%',
                backgroundColor: !byPhone ? '#edf3f9' : '#f8faf2',
                //opacity : !byPhone? '0.1' :'0.3',
                borderBottomWidth: 2,
                borderBottomColor: !byPhone ? '#428BC1' : '#E7EDD3',
                alignItems: 'center', justifyContent: 'center'
              }}>
              <Text style={{ fontFamily: 'RobotoCondensed-Regular', fontWeight: '500', fontSize: RFValue(16), color: !byPhone ? '#428BC1' : '#707070' }}>By-Email</Text>
            </TouchableOpacity>
          </View> */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}>
            {loading && <Loader loading={loading} />}
            <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

              <View style={{ marginTop: 80, width: '100%' }} >
                <Text style={styles.topText}>{"Welcome!"}</Text>
              </View>

              <View style={{ marginTop: 7, width: '100%' }} >
                <Text style={styles.titleText}>{"Welcome back, let’s log-in and enjoy...!"}</Text>
              </View>

              {byPhone == 'phone' ? NumberBox() : Inputs()}


              {byPhone && showList &&
                <View style={styles.dropDownContainer}>
                  <View style={styles.dropdown}>
                    <View style={styles.searchBox}>
                      <TextInput
                        numberOfLines={1}
                        multiline={false}
                        scrollEnabled={false}
                        caretHidden={false}
                        style={[styles.dropdownText, { height: 40, paddingVertical: 0 }]}
                        value={search}
                        placeholder={"search country"}
                        onChangeText={(text) => SearchText(text)}
                      />
                    </View>
                    <FlatList
                      data={filterList}
                      style={{ height: '100%', width: '100%' }}
                      keyExtractor={(item, index) => index.toString()}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      numColumns={1}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity style={{ width: '100%', height: 30 }} key={index}
                          onPress={() => {
                            setCode(item.prefix)
                            setIcon(item.icon)
                            setShowList(false)
                            // console.log(item.name)
                          }}>
                          <Text style={[styles.dropdownText, {}]}>{item.name}  </Text>
                        </TouchableOpacity>
                      )}

                    />
                  </View>
                </View>
              }

              {byPhone == 'phone' ?
                <TouchableOpacity onPress={() => loginWithOtp()} style={[styles.sendButton, { marginTop: 20 }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>GET OTP</Text>
                </TouchableOpacity> :

                <TouchableOpacity onPress={() => handleLoginByEmail()} style={[styles.sendButton, { marginTop: 20 }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>LOG IN</Text>
                </TouchableOpacity>
              }

              <TouchableOpacity style={{ height: 16, width: 272, marginTop: 20 }}>
                <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../assets/continue.png')} />
              </TouchableOpacity>

              {/* <View style={{ marginTop: 60, height: 46, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

              <TouchableOpacity onPress={() => onFacebookAuth()} style={{ height: '100%', width: wp('46%'), }}>
                <Image resizeMode='cover' style={{ height: '100%', width: '100%' }} source={require('../../assets/fb.png')} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onGoogleAuth()} style={{ height: '100%', width: wp('46%') }}>
                <Image resizeMode='cover' style={{ height: '100%', width: '100%' }} source={require('../../assets/google.png')} />
              </TouchableOpacity>


            </View> */}


              <TouchableOpacity onPress={() => setByPhone(byPhone == 'phone' ? 'email' : 'phone')}
                style={[styles.sendButton, { marginTop: 20, justifyContent: "flex-start", flexDirection: "row" }]}>
                <Text style={[styles.couponButtonText, { fontSize: RFValue(18), marginLeft: "auto", marginRight: "auto" }]}>Login With {byPhone == 'phone' ? 'Email' : 'Phone'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onFacebookAuth()} style={[styles.sendButton, { marginTop: 20, justifyContent: "flex-start", flexDirection: "row" }]}>

                <Image style={{ width: 30, height: 30, marginLeft: 10, marginRight: -15 }} source={require('../../assets/facebook.png')} />
                <Text style={[styles.couponButtonText, { fontSize: RFValue(18), marginLeft: "auto", marginRight: "auto" }]}>Login With Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onGoogleAuth()} style={[styles.sendButton, { marginTop: 20, justifyContent: "flex-start", flexDirection: "row", backgroundColor: "#fff", borderWidth: 1, borderColor: "#cecece" }]}>

                <Image style={{ width: 30, height: 30, marginLeft: 10, marginRight: -15 }} source={require('../../assets/googles.png')} borderRadius={50} />
                <Text style={[styles.couponButtonText, { fontSize: RFValue(18), marginLeft: "auto", marginRight: "auto", color: "#000" }]}>Login With Google</Text>
              </TouchableOpacity>

            </View>

          </ScrollView>

        </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);