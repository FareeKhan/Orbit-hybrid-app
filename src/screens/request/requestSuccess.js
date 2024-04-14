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

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';
import LinearGradient from 'react-native-linear-gradient';

import HomeHeader from '../../shares/Home_Header';
import Share from 'react-native-share';

const RequestSuccess = ({ navigation, route }) => {

    const [firstName, setFirstName] = useState('')
    const [secondName, setSecondName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [topup, setTopup] = useState('')
    const [title,setTitle] = useState('')
    const [url,setUrl] = useState('')

  
    useEffect(() => {
      // console.log(route.params.url)
      setTitle(route.params.title)
      setUrl(route.params.url)
      if(route.params.data){
        setFirstName(route.params.data.fname)
        setSecondName(route.params.data.lname)
        setEmail(route.params.data.email)
        setCode(route.params.data.code)
        setPhone(route.params.data.number)
        setTopup(route.params.data.topup)
      }
  }, []);

  const handleShare = ()=>{
    // console.log('encodeURI',encodeURI(url))
    // console.log('decodeURI',decodeURI(url))
    const shareOptions = {
        message : title,
        title: title,
        failOnCancel: false,
        url: url,
      };
      Share.open(shareOptions)
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      // err && console.log(err);
    });
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
            
              <View style={{height:140, width:'100%',marginTop:20, alignItems:'center' }}>
                <View style={{height:140, width:140}}>
                <Image resizeMode='cover' style={{ height:'100%', width:'100%',  }} source={require('../../../src/assets/success.png')} />
                </View>
              </View>

              <Text style={styles.successTextBlue}>{'Request Success'}</Text>

              <View style={{marginTop:64, width:'100%',}}> 
              <Text style={styles.successLine}>{'Please share the link with you family memebers or friends.'}</Text>
                </View>  

                <View style={styles.detailsCard}>
                    <View style={{height:'100%', width:'90%',alignItems:'center',flexDirection:'row'}}>
                        <View style={{height:'100%', width:'50%',}}>
                            <View style={styles.detailsContainer}>
                             <Text style={styles.titleText} >{"Your Name"}</Text>   
                            </View>
                            <View style={styles.detailsContainer}>
                             <Text style={styles.titleText}>{'Your Email'}</Text>   
                            </View>
                            <View style={styles.detailsContainer}>
                             <Text style={styles.titleText}>{"Phone No"}</Text>   
                            </View>
                            <View style={styles.detailsContainer}>
                             <Text style={styles.titleText}>{"Topup"}</Text>   
                            </View>
                        </View>

                        <View style={{height:'100%', width:'50%', }}>
                            <View style={styles.detailsContainer}>
                             <Text numberOfLines={1} style={styles.detailsText}>{firstName} {secondName}</Text>   
                            </View>
                            <View style={styles.detailsContainer}>
                             <Text numberOfLines={1} style={styles.detailsText}>{email}</Text>   
                            </View>
                            <View style={styles.detailsContainer}>
                             <Text style={styles.detailsText}>{code} {phone}</Text>   
                            </View>
                            <View style={styles.detailsContainer}>
                             <Text style={styles.detailsText}>{topup}</Text>   
                            </View>
                        </View>

                    </View>

                </View>

                <TouchableOpacity onPress={()=> handleShare()} style={[styles.sendButton,{marginTop:30}]}>
                <Text style={[styles.couponButtonText,{fontSize:RFValue(18)}]}>SHARE</Text>
            </TouchableOpacity>

              

            </View>
            
    </ScrollView>  

      </LinearGradient>
    </View>
  );
}

export default (RequestSuccess);