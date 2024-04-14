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
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import TouchID from 'react-native-touch-id';
import Loader from '../../shares/Loader';
import NormalHeader from '../../shares/Normal_Header';

import styles from './style';
import { useIsFocused,useNavigation  } from "@react-navigation/native";

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
    authToken: state.auth_Reducer.authToken,
  }
}


const Check_pin = ({authActions,authToken }) => {
  const [loading, setLoading] = useState(false); 
    const [bio, setBio] = useState(false);
    const navigation = useNavigation();

    const [code, setCode] = useState('');

    useEffect(() => {
        
      
  }, []);

  

 

  const handleVerifyPin=async(code)=>{
    setLoading(true)
    await authActions.verifyPin(authToken,code).then(res=>{
        setLoading(false)
        if (res.status == '200') {
        //alert(res.data.msg)
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: 'Success',
        //   textBody: res.data.msg,
        //   button: 'Done',
        // })
        navigation.navigate("BottomTabRoutes")
        }
        if (res.response.status == '400') {
          Platform.OS === "ios"?
            alert(res.response.data.msg):
            showMessage({
              message: "Alert !!!",
              description: res.response.data.msg,
              titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
             });
            }

         else {
          Platform.OS === "ios"?
          alert('Something went Wrong'):
          showMessage({
            message: "Alert !!!",
            description: 'Something went Wrong',
            titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
           });       
        }
      })
  }

  const handleCheckPin =async()=>{
   // navigation.navigate("ResetPin")
    if (!code) {
      Platform.OS === "ios"?
       alert('Please enter otp'):
       showMessage({
        message: "Alert !!!",
        description: 'Please enter otp',
        titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        type: "default",
        backgroundColor: "#39475D", // background color
        color: "#fff", // text color
        style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
       });
        return;
    }

    let formData = new FormData();
    formData.append('otp', code)
      setLoading(true)
    await authActions.CheckPin(authToken,formData).then(res=>{
        setLoading(false)
        if (res.status == '200') {
        // console.log("check otp api",res.data)
        if(res.data.status == true){
          Platform.OS === "ios"?  
          Alert.alert(res.data.msg):
          showMessage({
            message: "Success !!!",
            description: res.data.msg,
            titleStyle:{fontSize:20, color:'green', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
           });
            navigation.navigate("ResetPin")
        }
        else{
          Platform.OS === "ios"?
            alert(res.data.msg):
            showMessage({
              message: "Alert !!!",
              description: res.data.msg,
              titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
             });
        }
        
        }
        if (res.response.status == '400') {
          Platform.OS === "ios"?
            alert(res.response.data.msg):
            showMessage({
              message: "Alert !!!",
              description:res.response.data.msg,
              titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
             });
            }

         else {
          Platform.OS === "ios"?
          alert('Something went Wrong') :
          showMessage({
            message: "Alert !!!",
            description: 'Something went Wrong',
            titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
           });    
        }
      })
  }
  


  return (
    <View style={styles.mainBody}>
      <AlertNotificationRoot>
     <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
     {/*     */}
     <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}>
{loading && <Loader loading={loading}/>}
            <View style={{flex:1, width:wp('92%'),  alignItems:'center'}}>

          
            <View style={{marginTop:130, width:'100%'}} >
            <Text style={styles.otpTopText}>{"Verify OTP"}</Text>
            </View>


            <View style={{marginTop:46, width:wp('78%'), height:46, flexDirection:'row', justifyContent:'space-evenly' }}>
           
           <OTPInputView
    style={{width: '100%', height:'100%',}}
    pinCount={6}
    autoFocusOnLoad
    codeInputFieldStyle={styles.otpInputBox}
    codeInputHighlightStyle={styles.otpInputBox}
    onCodeFilled = {(code => { setCode(code)
        // console.log(`Code is ${code}, you are good to go!`)
    })}
/>               

                    
            </View>


            

<TouchableOpacity onPress={()=>handleCheckPin()} style={[styles.sendButton,{marginTop:35}]}>
                <Text style={[styles.couponButtonText,{fontSize:RFValue(18)}]}>VERIFY CODE</Text>
            </TouchableOpacity>

            
          
                </View>
                </ScrollView>
       
      </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Check_pin);