import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  FlatList,
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

import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import NormalHeader from '../../shares/Normal_Header';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../actions/index';
import { sms_Credits } from '../../actions/home_actions';
const mapDispatchToProps = (dispatch) => {
  return ({
    homeActions: bindActionCreators(homeActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),

  })
};

const mapStateToProps = (state) => {
  return {
    countryList: state.home_Reducer.countryList,
    authToken: state.auth_Reducer.authToken,
  }
}


const SMS_Package = ({ navigation,homeActions, countryList,authToken }) => {


  const [packA, setPackA] = useState('')
  const [packB, setPackB] = useState('')

  

  useEffect(() => {
    getPacks()
   
  }, []);

  

const getPacks = ()=>{
   homeActions.get_sms_packages(authToken).then(res=>{
     // setLoading(false)
      if (res.status == '200') {
        if(res.data){
            setPackA(res?.data)
        }
      } else {
        alert('Something went Wrong')       
      }
    })
   
    
  }


  console.log('-->>packA',packA)

  

  return (
    <View style={styles.mainBody}>


      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
      <NormalHeader title={"SMS Package"} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>

          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>
          
          <View style={{ marginTop: 13, width: '100%' }} >
              <Text style={styles.topText}>{"You don't have enough balance. Please purchase a package."}</Text>
            </View>

            {
            packA&&  packA?.map((item,index) => {
                return (
                  <View style={styles.packageCard} key={index} >
                    <ImageBackground resizeMode={'contain'} style={{ height: '100%', width: '100%', flexDirection: 'row' }} source={require('../../assets/sms-bg.png')}>
                      <View style={{ height: '100%', width: '50%', paddingLeft: 19, justifyContent: 'space-evenly', }}>
                        <Text style={[styles.cardText, { fontWeight: '400', opacity: 0.5 }]}>{item?.description}</Text>
                        <Text style={[styles.cardText, { fontSize: RFValue(26) }]}>{item?.title}</Text>
                        <Text style={[styles.cardText, { fontSize: RFValue(22), color: '#FFC107' }]}>{"$"}{item?.amount}</Text>
                      </View>

                      <View style={{ height: '100%', width: '50%', alignItems: 'flex-end', justifyContent: 'center', paddingRight: 20 }}>

                        <TouchableOpacity onPress={() => navigation.navigate('Buy_SMS', { "pack": 'A', "slug": item?.slug })} style={styles.purchseButton}>
                          <Text style={[styles.cardText, { fontWeight: '400' }]}>PURCHASE</Text>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>

                  </View>
                )
              })
            } 

          {/* <View style={styles.packageCard} >
            <ImageBackground resizeMode={'contain'}style={{height:'100%', width:'100%', flexDirection:'row'}} source={require('../../assets/sms-bg.png')}> 
            <View style={{height:'100%', width:'50%', paddingLeft:19, justifyContent:'space-evenly',}}>
                <Text style={[styles.cardText,{ fontWeight:'400', opacity:0.5}]}>{packB.description}</Text>
                <Text style={[styles.cardText,{fontSize:RFValue(26)}]}>{packB.title}</Text>
                <Text style={[styles.cardText,{fontSize:RFValue(22),color:'#FFC107' }]}>{"$"}{packB.amount}</Text>
            </View>
            
            <View style={{height:'100%', width:'50%',alignItems:'flex-end',justifyContent:'center', paddingRight:20}}>

            <TouchableOpacity onPress={()=>navigation.navigate('Buy_SMS',{"pack":'B',"slug":packB.slug})} style={styles.purchseButton}>
                <Text style={[styles.cardText,{fontWeight:'400'}]}>PURCHASE</Text>
            </TouchableOpacity>
            </View>
            </ImageBackground>

          </View> */}

           
            
          </View>

        </ScrollView>

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SMS_Package);