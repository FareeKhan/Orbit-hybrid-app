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
import { showMessage, hideMessage } from "react-native-flash-message";
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from "@react-navigation/native";

import styles from './style';
import LinearGradient from 'react-native-linear-gradient';

import HomeHeader from '../../shares/Home_Header';

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
    userData: state.home_Reducer.userData,
    authToken: state.auth_Reducer.authToken,
  }
}


const Account = ({ navigation, userData, props, authToken, homeActions }) => {
  const isFocused = useIsFocused();
  const [name, setName] = useState('')
  const [credit, setCredit] = useState('')
  const [remitEnabled, setRemitEnabled] = useState()

    useEffect(() => {
      if (isFocused) {
        getSelfInfo()
        remitSettings()
      setName(userData.data.name)
      setCredit(userData.data.sms_credit)
      }
  }, [props, isFocused]);


  const getSelfInfo =()=>{
    homeActions.get_SelfInfo(authToken).then(res=>{
       if (res.status == '200') {
         if(res.data.status == true){
           console.log('self data set',res.data)
         }
         
       } 
     })
   }

  const remitSettings = ()=>{
  
    
   homeActions.get_RemitSettings(authToken).then(res=>{
   
      if (res.status == '200') {
        // console.log("remit settings",res.data)
        if(res.data && res.data.airtime_remit){
          res.data.airtime_remit == '1' ? setRemitEnabled(true) :  setRemitEnabled(false) ;
        }
      } else {
        alert('Something went Wrong')       
      }
    })
   
    
  }

  const handleLogout =()=>{
    AsyncStorage.clear()
    navigation.navigate('HomeRoutes',{screen:'Home1'})
  }

  
  return (
    <View style={styles.mainBody}>

      
      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
      <HomeHeader/>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}>

            <View style={{flex:1, width:wp('92%'),  alignItems:'center'}}>
            
              <View style={{height:100, width:'100%',marginTop:20, flexDirection:'row',}}>
                <View style={{height:100, width:100}}>
                <Image resizeMode='cover' style={{ height:100, width:100, borderRadius: 50, }} source={require('../../../src/assets/test-user.png')} />
                </View>
                <Text style={[styles.username,{}]}>{name? name: "User"}</Text>
              </View>

              <TouchableOpacity onPress={()=> navigation.navigate('My_Account')} style={[styles.tab, {marginTop:9}]}>
                <Text style={styles.tabText}>{"Account"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('History')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"History"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('SMS')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"Send SMS"}{credit ? " -$"+credit : null} </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('SMSHistory')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"SMS History"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('PurchaseHistory')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"SMS Purchase History"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('SMS_Package')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"SMS Packages"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('RequestHistory')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"Request History"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigation.navigate('RequestDashboard')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"Request Dashboard"}</Text>
              </TouchableOpacity>
              
              {remitEnabled && 
              <TouchableOpacity onPress={()=>navigation.navigate('RemitDashboard')} style={[styles.tab,{}]}>
                <Text style={styles.tabText}>{"Remit Dashboard"}</Text>
              </TouchableOpacity> }

              <TouchableOpacity onPress={()=>handleLogout()} style={[styles.tab,{}]}>
                <Text style={[styles.tabText,{color:'#FF3D00'}]}>{"Log Out"}</Text>
              </TouchableOpacity>

            </View>
            
    </ScrollView>  

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);