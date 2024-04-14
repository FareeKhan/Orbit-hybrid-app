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
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

import Loader from '../../shares/Loader';
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
    bankList : state.home_Reducer.bankList,
  }
}


const RemitForm = ({ navigation, route, props, authToken, homeActions, bankList }) => {
  
    
  const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [recieverPhone, setRecieverPhone] = useState('')
  const [email, setEmail] = useState('')
  const [bank, setBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [remitPack, setPack] = useState('')

  const [usd, setUsd] = useState('')
  const [etb, setEtb] = useState('')


  const [countryIcon, setCountryIcon] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [currency, setCurrency] = useState('')
  const [localValue, setLocalValue] = useState('')
  const [retailValue, setRetailValue] = useState('')

  const [showBankList,setShowBankList] = useState(false)
  const [banks, setBanks] = useState([])
  
  useEffect(() => {
   // getBankList()
    if (isFocused) {
        getBankList()
      //setBanks(bankList.data.remit_bank)
      setRecieverPhone(route.params.plan.number)
      setCode(route.params.plan.code)
      setPack(route.params.plan.package)
      setUsd(route.params.plan.usd)
      setEtb(route.params.plan.etb)  

      // console.log("Remi pack =========",route.params.plan.package)
    }
    // console.log("screen name",isFocused)
  }, [props, isFocused]);

  const getBankList = async () => {
    setLoading(true)
    await homeActions.get_Bank_List(authToken).then(res => {
      setLoading(false)
      //  console.log('Country response', res)
      if (res.status == '200') {
        // console.log('data set',res.data.remit_bank )
        setBanks(res.data.remit_bank)
       
      } else {
        // console.log('data not recieved')
        setBanks([])
      }

    })

  }
  const handleProceed1 = async()=>{
    navigation.navigate('RemitPay',{"usdAmount":usd, "etbAmount":etb})
  }
  const handleProceed = async()=>{
    if (!firstName) {
      Platform.OS === 'ios'?
      alert('Please enter name'):
      showMessage({
        message: "Alert !!!",
        description: "Please enter name",
        titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        type: "default",
        backgroundColor: "#39475D", // background color
        color: "#fff", // text color
        style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
       });
      return;
  }
  if (!lastName) {
    Platform.OS === 'ios'?
    alert('Please enter last name'):
    showMessage({
      message: "Alert !!!",
      description: 'Please enter last name',
      titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      type: "default",
      backgroundColor: "#39475D", // background color
      color: "#fff", // text color
      style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
     });
    return;
}
  if (!email) {
    Platform.OS === 'ios'?
    alert('Please enter email'):
    showMessage({
      message: "Alert !!!",
      description: 'Please enter email',
      titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      type: "default",
      backgroundColor: "#39475D", // background color
      color: "#fff", // text color
      style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
     });
    return;
}
if (!recieverPhone) {
  Platform.OS === 'ios'?
  alert('Please enter phone number'):
  showMessage({
    message: "Alert !!!",
    description: 'Please enter phone number',
    titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
    textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
    type: "default",
    backgroundColor: "#39475D", // background color
    color: "#fff", // text color
    style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
   });
  return;
}
if (!bank) {
  Platform.OS === 'ios'?
  alert('Please choose bank'):
  showMessage({
    message: "Alert !!!",
    description: 'Please choose bank',
    titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
    textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
    type: "default",
    backgroundColor: "#39475D", // background color
    color: "#fff", // text color
    style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
   });
  return;
}
if (!accountNumber) {
  Platform.OS === 'ios'?
alert('Please enter account  number'):
showMessage({
  message: "Alert !!!",
  description: 'Please enter account  number',
  titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
  textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
  type: "default",
  backgroundColor: "#39475D", // background color
  color: "#fff", // text color
  style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
 });
return;
}

const planInfo ={ 
  'code' : code, 
"number" : recieverPhone,
"retail" : usd,
"local" : etb
}


  let formData = new FormData();
  formData.append('sphone', recieverPhone)
  formData.append('fname', firstName)
  formData.append('lname', lastName)
  formData.append('mname', middleName)
  formData.append('email', email)
  formData.append('phone', recieverPhone)
  formData.append('bname', bank)
  formData.append('acc', accountNumber)

    setLoading(true)
    await homeActions.process_remit(authToken,formData,remitPack).then(res=>{
      setLoading(false)
      if (res.status == '200') {
        if(res.data.status == true){
          // console.log('data set')
          navigation.navigate('RemitPay',{"usdAmount":usd, "etbAmount":etb, "plan":planInfo, "rId":res.data.request, "package" : remitPack})
        }else{
          Platform.OS === 'ios'?
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
        
      } else {
        Platform.OS === 'ios'?
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
      <HomeHeader/>
      <KeyboardAwareScrollView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}>
{loading && <Loader loading={loading}/>}
            <View style={{flex:1, width:wp('92%'),  alignItems:'center'}}>
            
            <View style={{ marginTop: 11, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"Your Contact Phone"}</Text>
            </View>

            <View style={[styles.remitinputBox,{backgroundColor:'#E1E7EC'}]}>
            <TextInput
            style={[styles.dropdownText,{paddingLeft:10,paddingVertical:0}] }
            keyboardType="phone-pad"
            placeholder='+251-955561971'
            onChangeText={(text) => setPhone(text)}
             />
            </View>

            <View style={styles.line}></View>
        
            <View style={{width:'100%'}} >
            <Text style={styles.LabelText}>{"Receiver Information"}</Text>
            </View>

            <View style={{ marginTop: 7, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"First Name"}</Text>
            </View>

            <View style={styles.remitinputBox}>
            <View style={{ height: '100%', width: '100%', justifyContent:'center', paddingVertical:0 }}>
            <TextInput
            style={[styles.dropdownText,{paddingLeft:10, paddingVertical:0 }] }
            keyboardType="default"
            placeholder='Jane'
            onChangeText={(text) => setFirstName(text)}
             />
             </View>
            </View>

            <View style={{ marginTop: 12, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"Middle Name"}</Text>
            </View>

            <View style={styles.remitinputBox}>
            <View style={{ height: '100%', width: '100%', justifyContent:'center', paddingVertical:0 }}>
            <TextInput
            style={[styles.dropdownText,{paddingLeft:10, paddingVertical:0}] }
            keyboardType="default"
            placeholder='Corner'
            onChangeText={(text) => setMiddleName(text)}
             />
             </View>
            </View>

            <View style={{ marginTop: 12, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"Last Name"}</Text>
            </View>

            <View style={styles.remitinputBox}>
            <View style={{ height: '100%', width: '100%', justifyContent:'center', paddingVertical:0 }}>
            <TextInput
            style={[styles.dropdownText,{paddingLeft:10, paddingVertical:0}] }
            keyboardType="default"
            placeholder='Doe'
            onChangeText={(text) => setLastName(text)}
             />
             </View>
            </View>

            <View style={{ marginTop: 12, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"Phone"}</Text>
            </View>

            <View style={styles.remitinputBox}>
            <View style={{ height: '100%', width: '100%', justifyContent:'center', paddingVertical:0 }}>
            <Text style={[styles.remitLabelBold,{fontWeight:'500', paddingLeft:10, color:'#1E1E1E',paddingVertical:0}]}>{code} {recieverPhone}</Text>
            </View>
            </View>

            <View style={{ marginTop: 12, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"Email"}</Text>
            </View>

            <View style={styles.remitinputBox}>
            <View style={{ height: '100%', width: '100%', justifyContent:'center', paddingVertical:0 }}>
            <TextInput
            style={[styles.dropdownText,{paddingLeft:10,paddingVertical:0}] }
            keyboardType="default"
            placeholder='jane123@gmail.com'
            onChangeText={(text) => setEmail(text)}
             />
             </View>
            </View>

            <View style={{ marginTop: 12, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"Bank Name"}</Text>
            </View>

            <TouchableOpacity onPress={()=> {setShowBankList(!showBankList)}} style={[styles.remitinputBox,{flexDirection:'row'}]}>
            <View style={{height:'100%', width:'85%',alignItems:'flex-start', justifyContent:'center', paddingLeft:10}}>
                    <Text numberOfLines={1} style={[styles.remitLabelBold,{fontWeight:'500', color:'#1E1E1E'}]}>{bank ? bank : "Select Bank Name"}</Text>
                </View>

                <TouchableOpacity onPress={()=> {setShowBankList(!showBankList)}} style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}}>
                <Image resizeMode='contain' style={{ height:10, width:16 }} source={require('../../../src/assets/down-arrow.png')} />
                </TouchableOpacity>
            </TouchableOpacity>

            <View style={{ marginTop: 12, width: '100%' }} >
              <Text style={styles.remitLabelText}>{"Account No."}</Text>
            </View>

            <View style={styles.remitinputBox}>
            <View style={{ height: '100%', width: '100%', justifyContent:'center', paddingVertical:0 }}>
            <TextInput
            style={[styles.dropdownText,{paddingLeft:10, paddingVertical:0}] }
            keyboardType="default"
            placeholder='Account Number'
            onChangeText={(text) => setAccountNumber(text)}
             />
             </View>
            </View>

            <TouchableOpacity onPress={()=> handleProceed()} style={[styles.sendButton,{marginVertical:20 }]}>
                <Text style={[styles.couponButtonText,{fontSize:RFValue(18)}]}>PROCEED TO PAY</Text>
            </TouchableOpacity> 
            

            </View>
            
    </ScrollView>  
    </KeyboardAwareScrollView>
      </LinearGradient>

      <Modal
                animationType='fade'

                transparent={true}
                visible={showBankList}
                onRequestClose={() => {setShowBankList(false)}}
              >
                <TouchableWithoutFeedback  onPress={() => setShowBankList(false)} >
                <View style={{
                  flex:1,
                  width: wp('100%'),
                  height: hp('100%'),
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  opacity:1,
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}>

<LinearGradient colors={['#ffffff', '#EFE1D3']} style={{
                    width: wp('100%'),
                    height:hp('50%'),
                    backgroundColor: 'white',
                    borderTopLeftRadius:30,
                    borderTopRightRadius:30,
                    alignItems: 'center',


                  }}>
                    <TouchableOpacity onPress={()=> setShowBankList(false)}
                    style={{marginTop:10, height:5, width:100, backgroundColor:'rgba(196, 196, 196, 0.5)', borderRadius:20}}>
                    
                    </TouchableOpacity>

                    <View style={{marginTop:20, width:'100%'}} >
            <Text style={[styles.LabelText,{textAlign:'center'}]}>{"SELECT BANK NAME"}</Text>
            </View>

            <ScrollView style={{flex:1, width:'90%', marginTop:10}}>
           
           {banks && banks.length > 1 ? banks.map((item, key) => (
          
              <TouchableOpacity onPress={()=>{setBank(item),setShowBankList(false) }} key={key} style={{height:40, width:'90%', justifyContent:'center'}} >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))
          : [
              <Text> Data not found</Text>
          ]}

</ScrollView>





                    
                    
                    
                  
                  </LinearGradient>

                </View>
                </TouchableWithoutFeedback>
              </Modal>

      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RemitForm);