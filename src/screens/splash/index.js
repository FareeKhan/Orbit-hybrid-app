import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';

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
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';

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
    rechargePacks: state.home_Reducer.rechargePacks,

  }
}


const Splash = ({ navigation,homeActions }) => {
  
    useEffect(() => {
      getRemitPacks()
      getBankList()
      setTimeout(function(){  
        AsyncStorage.getItem("user_token").then((value) => {
          if (value) {
            // console.log("user token", value)
            getSelfInfo(value)
            //navigation.navigate("BottomTabRoutes")
          }else{
            navigation.navigate("HomeRoutes")
          }
        })
        //navigation.navigate('NavigationRoutes')  
      }, 2000);  
  }, []);

  const getSelfInfo =(token)=>{
    homeActions.get_SelfInfo(token).then(res=>{
       if (res.status == '200') {
         if(res.data.status == true){
          //  console.log('self data set', res.data.pin)
           if(res.data.pin && res.data.pin.code){
            // console.log(res.data.pin.code)
            navigation.navigate('Pin_Auth')
           }
           else{
            navigation.navigate("BottomTabRoutes")
           }
         }
         
       } 
     })
   }

  const getRemitPacks =()=>{
   homeActions.get_Remit_Packages().then(res=>{
      if (res.status == '200') {
        if(res.data.status == true){
          // console.log('remit data set')
        }
        
      } 
    })
  }

  const getBankList = async () => {
    await homeActions.get_Bank_List().then(res => {
      if (res.status == '200') {
        // console.log('data set',res.data.remit_bank )
      } else {
        // console.log('data not recieved') 
      }

    })

  }

  

  return (
    <View style={styles.container}>
     <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.logoContainer}>
        <View style={{height:hp('8%'), width:wp('56%')}} >
          <Image source={require("../../assets/orbit-logo.png")} style={{ width: '100%', height: '100%', }} resizeMode='contain' />
        </View>
      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);