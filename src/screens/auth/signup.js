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
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage, hideMessage } from "react-native-flash-message";
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
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../actions/index';
import { get_SelfInfo } from '../../actions/home_actions';
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


const Signup = ({ navigation, countryList, authActions, route }) => {

  const [byPhone, setByPhone] = useState(true);
  const [byEmail, setByEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('')
  const [icon, setIcon] = useState('');
  const [phone, setPhone] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPass, setShowPass] = useState(true);
  const [showConfirmPass, setShowConfirmPass] = useState(true);

  const [showList, setShowList] = useState(false)
  const [list, setList] = useState([])

  const [search, setSearch] = useState('');
  const [filterList, SetFilterList] = useState([]);
  const [nodata, setNodata] = useState(false);

  const [fcmToken, setFcmToken] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const deviceType = Platform.OS === 'android' ? 'android' : 'ios';

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

  const loginWithOtp = async () => {
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
        navigation.navigate('Verify_otp', { "confirm": confirmation, "phone": phoneNumber, "type": 'signup', 'route': nav })
      } catch (error) {
        alert(error);
      }
    }

  }

  const handleSignupByEmail = () => {
    //navigation.navigate('BottomTabRoutes')
    if (!name) {
      Platform.OS === "ios" ?
        alert('Please fill name') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter name',
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
      Platform.OS === "ios" ?
        alert('Please fill email') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter email',
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
        alert('Please fill password') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter password',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
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
        alert('Please confirm password') :
        showMessage({
          message: "Alert !!!",
          description: 'Please enter confirm password',
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
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
          description: 'Password does not match',
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
    formData.append('password', password)
    formData.append('password_confirmation', confirmPassword)

    setLoading(true)
    authActions.SignupByEmail(formData).then(res => {
      setLoading(false)
      // console.log('Register Api  response data', res);
      if (res.status == '200') {
        setNotificationToken(res.data.access_token)
        AsyncStorage.setItem("user_token", res.data.access_token);
        AsyncStorage.setItem("facebook_uuid", '0');
        // navigation.navigate(nav== "topup" ? "Step3":'BottomTabRoutes')
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
          handleLoginByFacebook(user)
          // console.log('result:', user);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const onFacebookAuth = async () => {
    await LoginManager.logOut();
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(["email", "public_profile"]).then(

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
        setNotificationToken(res.data.access_token)
        AsyncStorage.setItem("user_token", res.data.access_token);
        AsyncStorage.setItem("facebook_uuid", '1');
        //alert("Login Successful")
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: "Login Successful",
        //   button: 'Done',
        // })
        navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes')
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
          if (res.response.data.errors.phone) {
            Platform.OS === "ios" ?
              alert(res.response.data.errors.phone) :
              showMessage({
                message: "Alert !!!",
                description: res.response.data.errors.phone,
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
    }).then(error => {
      // console.log(error)
    })
  }

  const onGoogleAuth = () => {
    GoogleSignin.configure({
      androidClientId: '922141319415-vtkqh7s562ej238prctkk2d8upjcmngp.apps.googleusercontent.com',
      iosClientId: '922141319415-feq2k8hs399ro7mjc4l687lobfsg1stb.apps.googleusercontent.com',
    });

    GoogleSignin.hasPlayServices().then((hasPlayService) => {
      if (hasPlayService) {
        GoogleSignin.signOut();

        GoogleSignin.signIn().then((userInfo) => {
          // console.log(JSON.stringify(userInfo))
          handleLoginByGoogle(userInfo.user)

        })
      }
    }).catch((e) => {
      // console.log("ERROR IS: " + JSON.stringify(e));
      // console.log('something went wrong')
    })

  }

  const handleLoginByGoogle = (user) => {
    //navigation.navigate('BottomTabRoutes')
    // console.log(user.email, user.id, user.name)
    let formData = new FormData();
    formData.append('email', user.email)
    formData.append('name', user.name)
    formData.append('google_id', user.id)
    formData.append('phone', user.phone ? user.phone : '123456789')
    // console.log(formData);

    setLoading(true)
    authActions.LoginByGoogle(formData).then(res => {
      setLoading(false)
      // console.log('Api response data', res);
      if (res.status == '200') {
        AsyncStorage.setItem("user_token", res.data.access_token);
        AsyncStorage.setItem("facebook_uuid", '0');
        setNotificationToken(res.data.access_token)
        //alert("Login Successful")
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: "Login Successful",
        //   button: 'Done',
        // })
        navigation.navigate(nav == "topup" ? "Step3" : 'BottomTabRoutes')
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
        <View style={[styles.numberBox, styles.borderStyle,]}>
          <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
            <TextInput
              style={styles.dropdownText}
              autoFocus={true}
              placeholder={'Full name'}
              onChangeText={(text) => setName(text)}
            />
          </View>
        </View>,
        <View style={[styles.numberBox, styles.borderStyle, { marginTop: 10 }]}>
          <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
            <TextInput
              style={styles.dropdownText}
              placeholder={'E-mail'}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>,
        <View style={[styles.numberBox, styles.borderStyle, { marginTop: 10 }]}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={styles.dropdownText}
              placeholder={'Password'}
              secureTextEntry={showPass}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../../src/assets/eye.png')} />
          </TouchableOpacity>
        </View>,
        <View style={[styles.numberBox, styles.borderStyle, { marginTop: 10 }]}>
          <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
            <TextInput
              style={styles.dropdownText}
              placeholder={'Confirm password'}
              secureTextEntry={showConfirmPass}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>
          <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../../src/assets/eye.png')} />
          </TouchableOpacity>
        </View>,

      ]
    )
  }

  return (
    <View style={styles.mainBody}>
      <AlertNotificationRoot>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          {/* <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}> */}
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
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}>
            {loading && <Loader loading={loading} />}
            <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

              <View style={{ marginTop: 40, width: '100%' }} >
                <Text style={styles.topText}>{"SIGN UP"}</Text>
              </View>

              {/* <View style={{ marginTop: 20, width: '100%' }} >
                <Text style={styles.topText}>{"Welcome!"}</Text>
              </View> */}

              <View style={{ marginTop: 7, width: '100%' }} >
                <Text style={styles.titleText}>{"Welcome to Orbit Recharge, let’s sign-up and enjoy...!"}</Text>
              </View>
              {/* <Text style={[styles.titleText,{alignSelf:"flex-start",marginTop:30}]}>Signup Through <Text onPress={()=>setByPhone(byPhone == 'phone' ? 'email' : 'phone')} style={{color:'blue', backgroundColor: '#008cba',height:40}}>{byPhone == 'phone' ? 'Email' : 'Phone'}</Text></Text>
   */}







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

              {byPhone ?
                <TouchableOpacity onPress={() => loginWithOtp()} style={[styles.sendButton, { marginTop: 20 }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>GET OTP</Text>
                </TouchableOpacity> :

                <TouchableOpacity onPress={() => handleSignupByEmail()} style={[styles.sendButton, { marginTop: 20 }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18) }]}>REGISTER NOW</Text>
                </TouchableOpacity>
              }


              {/* 
              <View style={{ height: 16, width: 272, marginTop: 20 }}>
                <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../assets/continue.png')} />
              </View> */}
              <Text style={{ marginVertical: 15 }}>Already Have an account? <Text onPress={() => navigation.navigate('Login')} style={{ color: "blue" }}>Login</Text></Text>


              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <View style={{ width: '47%', height: 1, backgroundColor: "gray" }} />
                <Text>Or</Text>
                <View style={{ width: '47%', height: 1, backgroundColor: "gray" }} />
              </View>

              {/* <View style={{ marginTop: 60, height: 46, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}> */}

              {/* <TouchableOpacity onPress={() => onFacebookAuth()} style={{ height: '100%', width: wp('46%'), }}>
                  <Image resizeMode='cover' style={{ height: '100%', width: '100%' }} source={require('../../assets/fb.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onGoogleAuth()} style={{ height: '100%', width: wp('46%') }}>
                  <Image resizeMode='cover' style={{ height: '100%', width: '100%' }} source={require('../../assets/google.png')} />
                </TouchableOpacity> */}
              {/* </View> */}


              <View style={{ marginBottom: 20 }}>

                <TouchableOpacity onPress={() => setByPhone(byPhone == 'phone' ? 'email' : 'phone')}
                  style={[styles.sendButton, { marginTop: 20, justifyContent: "flex-start", flexDirection: "row" }]}>
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18), marginLeft: "auto", marginRight: "auto" }]}>Signup With {byPhone == 'phone' ? 'Email' : 'Phone'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onFacebookAuth()} style={[styles.sendButton, { marginTop: 20, justifyContent: "flex-start", flexDirection: "row" }]}>
                  <Image style={{ width: 30, height: 30, marginLeft: 10, marginRight: -15 }} source={require('../../assets/facebook.png')} />
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18), marginLeft: "auto", marginRight: "auto" }]}>Signup With Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onGoogleAuth()} style={[styles.sendButton, { marginTop: 20, justifyContent: "flex-start", flexDirection: "row", backgroundColor: "#fff", borderWidth: 1, borderColor: "#cecece" }]}>
                  <Image style={{ width: 30, height: 30, marginLeft: 10, marginRight: -15 }} source={require('../../assets/googles.png')} borderRadius={50} />
                  <Text style={[styles.couponButtonText, { fontSize: RFValue(18), marginLeft: "auto", marginRight: "auto", color: "#000" }]}>Signup With Google</Text>
                </TouchableOpacity>
              </View>



            </View>

          </ScrollView>

          {/* </LinearGradient> */}
        </KeyboardAwareScrollView>
      </AlertNotificationRoot>
    </View >
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);