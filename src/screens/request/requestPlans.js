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
  FlatList,
  ImageBackground,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';


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
    rechargePacks: state.home_Reducer.rechargePacks,
    remitPacks : state.home_Reducer.remitPacks,
  }
}


const RequestPlans = ({ navigation , route, props, homeActions, rechargePacks, remitPacks}) => {
    const isFocused = useIsFocused();
    const [plans, setPlans] = useState([])
    const [remitPlans, setRemitPlans] = useState([])
    const [countryIcon, setCountryIcon] = useState('')
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [id, setId] = useState('')
    const [currency, setCurrency] = useState('')

    const [showPacks, setShowPacks] = useState(true);
    const [showRemit, setShowRemit] = useState(false);
    const [loading, setLoading] = useState(false);

  
    useEffect(() => {
        if (isFocused) {
                // console.log('params', route.params)
                setCountryIcon(route.params.icon)
                setPhone(route.params.number)
                setCode(route.params.code)
                setId(route.params.id)
            if(rechargePacks && rechargePacks.data){
                setPlans(rechargePacks.data.packageitems)
                setCurrency(rechargePacks.data.destination_currency)
                // console.log(rechargePacks.data.packageitems)
            }
            if(rechargePacks && rechargePacks.data){
                setRemitPlans(remitPacks.data)
                // console.log(remitPacks.data)
            }   
        }      
  }, [props, isFocused]);

  const onRechargeClick = () => {
    setShowPacks(true);
    setShowRemit(false);

  }

  const onRemitClick = () => {
    setShowPacks(false);
    setShowRemit(true);

  }

  const handlePlan=(data)=>{
    const planInfo ={ 
        'code' : code, 
    "number" : phone, 
    "icon": countryIcon,
    "currency":currency,
    "countryId":id,
    "local" : data.local_value,
    'usd': data.retail_value,
    'wholesale': data.wholesale_price_list,
}
// console.log('pack', planInfo)

    navigation.navigate('RequestSubmit',{"plan":planInfo})
  }

  const handleRemitPlan = (data)=>{
    // console.log('plan clicked', data)
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
                                          <View style={{ height: '100%', width: '20%', alignItems:'center', justifyContent:'center'  }}>
                                            <ImageBackground resizeMode='cover' style={{height:30, width:30, alignItems:'center', justifyContent:'center'}} source={require('../../assets/arrowbg.png')} >
                                                      <Image resizeMode='cover' style={{height:8, width:4, alignSelf:'center', marginBottom:3}} source={require('../../assets/arrow.png')}/>
                                            </ImageBackground>
                                          </View>
                                      </TouchableOpacity>

                                  </View>
                              )}

                          />
                      </View>
    )
  }

  const RemitPlansList = ()=>{
    return(
        <View style={{ width: '100%', marginTop: 10, }}>
                          <FlatList
                              data={remitPlans}
                              style={{}}
                              keyExtractor={(item, index) => index.toString()}
                              showsVerticalScrollIndicator={false}
                              numColumns={2}
                              renderItem={({ item, index }) => (
                                  <View key={index} style={{ margin:wp('1%')  }}>

                                      <TouchableOpacity onPress={()=> handleRemitPlan(item)} style={[styles.planBox,{backgroundColor:'#E2E2E2'}]} >
                                          <View style={{ height: '100%', width: '80%', paddingLeft: 15, justifyContent: 'center' }}>
                                              <Text style={[styles.whiteText,{color:'#1E1E1E'}]}>{item.payment_amount} {item.payment_currency}</Text>
                                              <Text style={[styles.yellowText, {color:'#428BC1', marginTop: 4 }]}>{"("+item.remit_amount+" ETB)"}</Text>
                                          </View>
                                          <View style={{ height: '100%', width: '20%', alignItems:'center', justifyContent:'center'  }}>
                                            <ImageBackground resizeMode='cover' style={{height:30, width:30, alignItems:'center', justifyContent:'center'}} source={require('../../assets/arrowbgWhite.png')} >
                                                      <Image resizeMode='cover' style={{height:8, width:4, alignSelf:'center', marginBottom:3}} source={require('../../assets/arrowBlack.png')}/>
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
            

            <View style={{marginTop:30, width:'100%'}} >
            <Text style={styles.LabelText}>{"Destination"}</Text>
            </View>

            <NumberBox/>

            <View style={{marginTop:8, width:'100%'}} >
            <Text onPress={()=>navigation.goBack()} style={styles.blueText}>{"Change Number?"}</Text>
            </View>

            <View style={{marginTop:7, width:'100%'}} >
            <Text style={styles.LabelText}>{"Carrier"}</Text>
            </View>

            <OperatorBox/>

            {/* { code == '+251' ? 
                <View style={{ height: 50, width: wp('100%'), flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => onRechargeClick()}
            style={{
              height: '100%', width: '50%',
              backgroundColor: showPacks ? '#edf3f9' : '#f8faf2',
              //opacity : byPhone? '0.1' :'0.3',
              borderBottomWidth: 2,
              borderBottomColor: showPacks ? '#428BC1' : '#E7EDD3',
              alignItems: 'center', justifyContent: 'center'
            }}>
            <Text style={{ fontFamily: 'RobotoCondensed-Regular', fontWeight: '500', fontSize: RFValue(16), color: showPacks ? '#428BC1' : '#707070' }}>Airtime</Text>

          </TouchableOpacity>

          <TouchableOpacity onPress={() => onRemitClick()}
            style={{
              height: '100%', width: '50%',
              backgroundColor: !showPacks ? '#edf3f9' : '#f8faf2',
              //opacity : !byPhone? '0.1' :'0.3',
              borderBottomWidth: 2,
              borderBottomColor: !showPacks ? '#428BC1' : '#E7EDD3',
              alignItems: 'center', justifyContent: 'center'f
            }}>
            <Text style={{ fontFamily: 'RobotoCondensed-Regular', fontWeight: '500', fontSize: RFValue(16), color: !showPacks ? '#428BC1' : '#707070' }}>Airtime Remit</Text>
          </TouchableOpacity>
        </View> : null} */}

            <View style={{marginTop:38, width:'100%'}} >
            <Text style={styles.LabelText}>{"Select amount you want to request"}</Text>
            </View>

            {showPacks ? 
                <PlansList/>
                : <RemitPlansList/>
            }

                      

            

            </View>
            
    </ScrollView>  

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPlans);