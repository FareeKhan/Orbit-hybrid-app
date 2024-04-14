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
  Alert,
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


const ResetPin = ({ navigation,authActions,authToken }) => {
  const [loading, setLoading] = useState(false); 
  const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')

    const [showPin, setShowPin] = useState(true)
    const [showConfirmPin, setShowConfirmPin] = useState(true)
  
    useEffect(() => {
      
      
  }, []);

  const handleResetPin=()=>{
    if (!pin) {
      Platform.OS === "ios"?
      alert('Please enter PIN'):
      showMessage({
        message: "Alert !!!",
        description: 'Please enter PIN',
        titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        type: "default",
        backgroundColor: "#39475D", // background color
        color: "#fff", // text color
        style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
       });
      return;
  }
  if (pin.length<4 ) {
    Platform.OS === "ios"?
    alert('Please enter pin of 4 digits.'):
    showMessage({
      message: "Alert !!!",
      description: 'Please enter pin of 4 digits.',
      titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      type: "default",
      backgroundColor: "#39475D", // background color
      color: "#fff", // text color
      style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
     });
    return;
}
  if (!confirmPin) {
    Platform.OS === "ios"?
      alert('Please enter confirm pin'):
      showMessage({
        message: "Alert !!!",
        description: 'Please enter confirm pin',
        titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        type: "default",
        backgroundColor: "#39475D", // background color
        color: "#fff", // text color
        style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
       });
      return;
  }
  if (pin != confirmPin) {
    Platform.OS === "ios"?
      alert('Pins does not match'):
      showMessage({
        message: "Alert !!!",
        description: 'Pins does not match',
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
  formData.append('pin', pin)
  formData.append('confirm_pin', confirmPin)
  
      setLoading(true)
      authActions.resetPin(authToken,formData).then(res => {
        setLoading(false)
        // console.log('Reset Pin response data', res);
        if (res.status == '200') {
            if(res.data.status == true){
              Platform.OS === "ios"?
                Alert.alert(res.data.msg):
                showMessage({
                  message: "Success !",
                  description: res.data.msg,
                  titleStyle:{fontSize:20, color:'green', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
                  textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
                  type: "default",
                  backgroundColor: "#39475D", // background color
                  color: "#fff", // text color
                  style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
                 });
                navigation.navigate("BottomTabRoutes")
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
        else if(res.response.status == "422"){
          if(res.response.data && res.response.data.errors){
              if(res.response.data.errors.old){
                Platform.OS === "ios"?
                  alert("You already set pin. Please select change pin to update."):
                  showMessage({
                    message: "Alert !!!",
                    description: "You already set pin. Please select change pin to update.",
                    titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
                    textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
                    type: "default",
                    backgroundColor: "#39475D", // background color
                    color: "#fff", // text color
                    style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
                   });
              }
              if(res.response.data.errors.password){
                Platform.OS === "ios"?
                  alert(res.response.data.errors.password):
                  showMessage({
                    message: "Alert !!!",
                    description: res.response.data.errors.password,
                    titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
                    textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
                    type: "default",
                    backgroundColor: "#39475D", // background color
                    color: "#fff", // text color
                    style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
                   });
              }
          }else{
            Platform.OS === "ios"?
            alert("Something went wrong"):
            showMessage({
              message: "Alert !!!",
              description: "Something went wrong",
              titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
             });
          }
          
         
        }
        
        else{
          setLoading(false)
          Platform.OS === "ios"?
          alert("Something went wrong"):
          showMessage({
            message: "Alert !!!",
            description: "Something went wrong",
            titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
           });
        }
      })
        .catch((err) => {
          // console.log('Api error', err)
          return err
        })
  
  }


const pinSetInputs = ()=>{
    return(
        <View style={{flex:1, height:'100%', width:'100%'}}>
             <View style={{ marginTop: 30, width: '100%' }} >
              <Text style={styles.LabelText}> {"Set A Pin"}</Text>
            </View>

            <View style={styles.inputBox}>
            <View style={{ height: '100%', width: '85%', justifyContent:'center' }}>
            <TextInput
            style={[styles.inputText,{}] }
            keyboardType="numeric"
            maxLength={4}
            placeholder='Enter Pin'
            secureTextEntry={showPin}
            onChangeText={(text) => setPin(text)}
             />
             </View>
             <TouchableOpacity onPress={()=>setShowPin(!showPin)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Image resizeMode='cover' style={{ height: 14, width: 20 }} source={require('../../assets/eye.png')} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 18, width: '100%' }} >
              <Text style={styles.LabelText}>{"Confirm Pin"}</Text>
            </View>

            <View style={styles.inputBox}>
            <View style={{ height: '100%', width: '85%', justifyContent:'center' }}>
            <TextInput
            style={[styles.inputText,{}] }
            keyboardType="numeric"
            maxLength={4}
            placeholder='Enter Confirm Pin'
            secureTextEntry={showConfirmPin}
            onChangeText={(text) => setConfirmPin(text)}
             />
             </View>
             <TouchableOpacity onPress={()=>setShowConfirmPin(!showConfirmPin)} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
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
     <NormalHeader title={"Reset Pin"}/>
     <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}>
{loading && <Loader loading={loading}/>}
            <View style={{flex:1, width:wp('92%'),  alignItems:'center'}}>
            <View style={{ marginTop: 13, width: '100%' }} >
              <Text style={styles.topText}>{"Reset your pin"}</Text>
            </View>

{ pinSetInputs()}

           

            <TouchableOpacity onPress={()=>{handleResetPin()}} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>SUBMIT NOW</Text>
            </TouchableOpacity>


                </View>
                </ScrollView>
       
      </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPin);