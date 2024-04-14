import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

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
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { showMessage, hideMessage } from "react-native-flash-message";

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';


import HomeHeader from '../../shares/Home_Header';
import Loader from '../../shares/Loader';

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


const Home2 = ({ navigation , route, props, homeActions, rechargePacks}) => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([])
    const [countryIcon, setCountryIcon] = useState('')
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [currency, setCurrency] = useState('')

  
    useEffect(() => {
        if (isFocused) {
                checkData()
                //AsyncStorage.setItem("TopupData", JSON.stringify(z));
                // console.log('params', route.params)
                // setCountryIcon(route.params.icon)
                // setPhone(route.params.number)
                // setCode(route.params.code)
            if(rechargePacks && rechargePacks.data){
                setPlans(rechargePacks.data.packageitems)
                setCurrency(rechargePacks.data.destination_currency)
                // console.log(rechargePacks.data.packageitems)
            }   
        }      
  }, [props, isFocused]);

  const checkData=async()=>{
    AsyncStorage.getItem("TopupData").then((value)=>{
      if(value){
        // console.log("asun data",value)
      let x = JSON.parse(value)
      setCountryIcon(x.icon)
      setPhone(x.number)
      setCode(x.prefix)
      }
      

    }
  )}

  const handlePlan=(data)=>{
    const planInfo ={ 
        'code' : code, 
    "number" : phone, 
    "icon": countryIcon,
    "currency":currency,
    "local" : data.local_value,
    'usd': data.retail_value,
    'wholesale':data.wholesale_price_list
}
//console.log('pack', planInfo)
AsyncStorage.setItem("planData", JSON.stringify(planInfo));
    navigation.navigate('Home3',{"plan":planInfo})
  }

  const NumberBox =()=>{
    return(
        <View style={[styles.numberBox,{marginTop:10}]}>
            <View style={{height:'100%', width:'27%', flexDirection:'row', borderRightWidth:1, borderColor:'#e7edd3'}}>
                <View style={{height:'100%', width:'50%', alignItems:'center', justifyContent:'center'}}>
                <Image resizeMode='cover' style={{ height:26, width:26, borderRadius:13 }} source={countryIcon? {uri: countryIcon} : require('../../../src/assets/vector.png')} />
                </View>

                <View style={{height:'100%', width:'50%',alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.codeText}>{code? code:'+91'}</Text>
                </View>
            </View>

            <View style={{height:'100%', width:'73%', flexDirection:'row',}}>
            <View style={{height:'100%', width:'70%',alignItems:'flex-start', justifyContent:'center', paddingLeft:19}}>
                    <Text style={styles.codeText}>{phone}</Text>
                </View>

                

            </View>
            

        </View>
    )

  }

  const OperatorBox =()=>{
    return(
        <View style={[styles.numberBox,{marginTop:10}]}>
            <View style={{height:'100%', width:'17%', flexDirection:'row', borderRightWidth:1, borderColor:'#e7edd3'}}>
                <View style={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <Image resizeMode='contain' style={{ height:26, width:26, borderRadius:13 }} source={rechargePacks && rechargePacks.data ? {uri :rechargePacks.data.operator_logo} : require('../../../src/assets/vector.png')} />
                </View>
            </View>

            <View style={{height:'100%', width:'83%', flexDirection:'row',}}>
            <View style={{height:'100%', width:'100%',alignItems:'flex-start', justifyContent:'center', paddingLeft:19}}>
                    <Text style={styles.codeText}>{rechargePacks&& rechargePacks.data.operator}</Text>
                </View>

                

            </View>
            

        </View>
    )

  }

  const PlansList = ()=>{
    return(
        <View style={{ width: '100%', marginTop: 10, }}>
                          <FlatList
                              data={plans}
                              style={{}}
                              keyExtractor={(item, index) => index.toString()}
                              showsVerticalScrollIndicator={false}
                              numColumns={2}
                              renderItem={({ item, index }) => (
                                  <View key={index} style={{ margin:wp('1%')  }}>

                                      <TouchableOpacity onPress={()=> handlePlan(item)} style={styles.planBox} >
                                          <View style={{ height: '100%', width: '80%', justifyContent: 'center', alignItems:'center' }}>
                                              <Text style={styles.whiteText}>{item.local_value} {currency}</Text>
                                              <Text style={[styles.yellowText, { marginTop: 4 }]}>{"("+item.retail_value+" USD)"}</Text>
                                          </View>
                                          <View style={{ height: '100%', width: '20%',alignItems:'center', justifyContent:'center' }}>
                                          <ImageBackground resizeMode='cover' style={{height:30, width:30, alignItems:'center', justifyContent:'center'}} source={require('../../../src/assets/arrowbg.png')} >
                                                      <Image resizeMode='cover' style={{height:8, width:4, alignSelf:'center', marginBottom:3}} source={require('../../../src/assets/arrow.png')}/>
                                            </ImageBackground>
                                          </View>
                                      </TouchableOpacity>

                                  </View>
                              )}

                          />
                      </View>
    )
  }

  
  return (
    <View style={styles.mainBody}>

      
      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
      <HomeHeader/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}>

            <View style={{flex:1, width:wp('92%'),  alignItems:'center'}}>
            
            <View style={{height:50, width:'100%', marginTop:20}}>
            <Image resizeMode='contain' style={{ height:'100%', width:'100%' }} source={require('../../../src/assets/bar1.png')} />
            </View>

            <View style={{marginTop:30, width:'100%'}} >
            <Text style={styles.LabelText}>{"Destination"}</Text>
            </View>

            <NumberBox/>

            <View style={{marginTop:8, width:'100%'}} >
            <Text onPress={()=>navigation.navigate('Home1')} style={styles.blueText}>{"Change Number?"}</Text>
            </View>

            <View style={{marginTop:7, width:'100%'}} >
            <Text style={styles.LabelText}>{"Carrier"}</Text>
            </View>

            <OperatorBox/>

            <View style={{marginTop:38, width:'100%'}} >
            <Text style={styles.LabelText}>{"Select amount you want to request"}</Text>
            </View>

            <PlansList/>

                      

            

            </View>
            
    </ScrollView>  

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home2);