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
import NormalHeader from '../../shares/Normal_Header';

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
    authToken: state.auth_Reducer.authToken,
  }
}


const FAQ = ({ navigation,homeActions,authToken }) => {
  
   const up = require('../../../src/assets/up.png')
   const down = require('../../../src/assets/down.png')
   
   const [show1, setShow1] = useState(false);
   const [show2, setShow2] = useState(false);
   const [show3, setShow3] = useState(false);
   const [show4, setShow4] = useState(false);
   const [show5, setShow5] = useState(false);
   const [show6, setShow6] = useState(false);
   const [show7, setShow7] = useState(false);

    useEffect(() => {
      getFAQ()
      
  }, []);

  const getFAQ =()=>{
    homeActions.get_faq(authToken).then(res=>{
       if (res.status == '200') {
         if(res.data.status == true){
          //  console.log('faq data', res.data)
         }
         
       } 
     })
   }
   const handle1 =()=>{
    setShow1(!show1)
    setShow2(false)
    setShow3(false)
    setShow4(false)
    setShow5(false)
    setShow6(false)
    setShow7(false)
   }
   const handle2 =()=>{
    setShow1(false)
    setShow2(!show2)
    setShow3(false)
    setShow4(false)
    setShow5(false)
    setShow6(false)
    setShow7(false)
   }
   const handle3 =()=>{
    setShow1(false)
    setShow2(false)
    setShow3(!show3)
    setShow4(false)
    setShow5(false)
    setShow6(false)
    setShow7(false)
   }
   const handle4 =()=>{
    setShow1(false)
    setShow2(false)
    setShow3(false)
    setShow4(!show4)
    setShow5(false)
    setShow6(false)
    setShow7(false)
   }
   const handle5 =()=>{
    setShow1(false)
    setShow2(false)
    setShow3(false)
    setShow4(false)
    setShow5(!show5)
    setShow6(false)
    setShow7(false)
   }
   const handle6 =()=>{
    setShow1(false)
    setShow2(false)
    setShow3(false)
    setShow4(false)
    setShow5(false)
    setShow6(!show6)
    setShow7(false)
   }
   const handle7 =()=>{
    setShow1(false)
    setShow2(false)
    setShow3(false)
    setShow4(false)
    setShow5(false)
    setShow6(false)
    setShow7(!show7)
   }


  return (
    <View style={styles.mainBody}>
     <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
     <NormalHeader title={"FAQ’s"} />
     <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}>

            <View style={{flex:1, width:wp('92%'),  alignItems:'center'}}>
          
          {/* ques 1   */}
          
            <TouchableOpacity onPress={()=>handle1()} style={[styles.headCard,{borderBottomRightRadius : show1? 0 : 10, borderBottomLeftRadius: show1? 0 :10}]} >
                <Text style={[styles.headText,{width:'85%',textAlignVertical:'center',}]}>{'How do I send Air time?'}</Text>
                <View style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}} >
                <Image resizeMode='contain' style={{ height:8, width:14, }} source={show1 ? up :down} />
                </View>
            </TouchableOpacity>
          {show1 &&   
            <View style={styles.answerCard}>
                <Text style={styles.answerText}>{"1. choose country"}</Text>
                <Text style={styles.answerText}>{"2. select amount you want to send"} </Text>
                <Text style={styles.answerText}>{"3. Pay and the air time will be delivered instantly"}</Text>
            </View>
            }

            {/* ques 2   */}
          
            <TouchableOpacity onPress={()=>handle2()} style={[styles.headCard,{marginTop:12, borderBottomRightRadius : show2? 0 : 10, borderBottomLeftRadius: show2? 0 :10}]} >
                <Text style={[styles.headText,{width:'85%',textAlignVertical:'center',}]}>{'To which countries can I send air time?'}</Text>
                <View style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}} >
                <Image resizeMode='contain' style={{ height:8, width:14, }} source={show2 ? up :down} />
                </View>
            </TouchableOpacity>
          {show2 &&   
            <View style={styles.answerCard}>
                <Text style={styles.answerText}>{"Over 150 countries with over 500 telecom Operators are supported."}</Text>
            </View>
            }

            {/* ques 3   */}
          
            <TouchableOpacity onPress={()=>handle3()} style={[styles.headCard,{marginTop:12, borderBottomRightRadius : show3? 0 : 10, borderBottomLeftRadius: show3? 0 :10}]} >
                <Text style={[styles.headText,{width:'85%',textAlignVertical:'center',}]}>{'Which payment methods are supported?'}</Text>
                <View style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}} >
                <Image resizeMode='contain' style={{ height:8, width:14, }} source={show3 ? up :down} />
                </View>
            </TouchableOpacity>
          {show3 &&   
            <View style={styles.answerCard}>
                <Text style={styles.answerText} >{"We support major credit and debit cards and PayPal."}</Text>
            </View>
            }

            {/* ques 4   */}
          
            <TouchableOpacity onPress={()=>handle4()} style={[styles.headCard,{height:63, marginTop:12, borderBottomRightRadius : show4? 0 : 10, borderBottomLeftRadius: show4? 0 :10}]} >
                <Text style={[styles.headText,{width:'85%',textAlignVertical:'center',}]}>{'How do I recognize my payment on my card statement or bank account?'}</Text>
                <View style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}} >
                <Image resizeMode='contain' style={{ height:8, width:14, }} source={show4 ? up :down} />
                </View>
            </TouchableOpacity>
          {show4 &&   
            <View style={styles.answerCard}>
                <Text style={styles.answerText}>{"Our payments will appear on your card statement and bank account as Orbit."}</Text>
            </View>
            }

            {/* ques 5   */}
          
            <TouchableOpacity onPress={()=>handle5()} style={[styles.headCard,{height:63, marginTop:12, borderBottomRightRadius : show5? 0 : 10, borderBottomLeftRadius: show5? 0 :10}]} >
                <Text style={[styles.headText,{width:'85%',textAlignVertical:'center',}]}>{'How long does it take to send a mobile air time?'}</Text>
                <View style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}} >
                <Image resizeMode='contain' style={{ height:8, width:14, }} source={show5 ? up :down} />
                </View>
            </TouchableOpacity>
          {show5 &&   
            <View style={styles.answerCard}>
                <Text style={styles.answerText} >{"Normally the air time will be delivered instantly. We will always inform you the result of the transaction by email."}</Text>
            </View>
            }
               
               {/* ques 6   */}
          
            <TouchableOpacity onPress={()=>handle6()} style={[styles.headCard,{height:80, marginTop:12, borderBottomRightRadius : show6? 0 : 10, borderBottomLeftRadius: show6? 0 :10}]} >
                <Text style={[styles.headText,{width:'85%',textAlignVertical:'center',}]}>{'I think I entered a wrong phone number, but my transaction was completed. What can I do?'}</Text>
                <View style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}} >
                <Image resizeMode='contain' style={{ height:8, width:14, }} source={show6 ? up :down} />
                </View>
            </TouchableOpacity>
          {show6 &&   
            <View style={styles.answerCard}>
                <Text style={styles.answerText} >{"If the mobile air time is completed, no refund will be issued. Always double check correctness of the destination phone number."}</Text>
            </View>
            }

            {/* ques 7   */}
          
            <TouchableOpacity onPress={()=>handle7()} style={[styles.headCard,{height:80, marginTop:12, borderBottomRightRadius : show7? 0 : 10, borderBottomLeftRadius: show7? 0 :10}]} >
                <Text style={[styles.headText,{width:'85%',textAlignVertical:'center',}]}>{"I made a successful payment but the recipient claimed he/she didn't receive the air time"}</Text>
                <View style={{height:'100%', width:'15%', alignItems:'center', justifyContent:'center'}} >
                <Image resizeMode='contain' style={{ height:8, width:14, }} source={show7 ? up :down} />
                </View>
            </TouchableOpacity>
          {show7 &&   
            <View style={styles.answerCard}>
                <Text style={styles.answerText} >{"At times, there may be system failure of your telecom operator. Contact us and we may initiate redelivery. If no redelivery is possible, your money will be automatically refunded."}</Text>
            </View>
            }
                </View>
                </ScrollView>
       
      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(FAQ);