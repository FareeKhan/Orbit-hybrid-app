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
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
    remitPacks: state.home_Reducer.remitPacks,
    authToken: state.auth_Reducer.authToken,
  }
}


const ChoosePlan = ({ navigation, route, props, homeActions, authToken, rechargePacks, remitPacks }) => {
  const isFocused = useIsFocused();
  const [plans, setPlans] = useState([])
  const [remitPlans, setRemitPlans] = useState([])

  const [countryIcon, setCountryIcon] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [currency, setCurrency] = useState('')

  const [showPacks, setShowPacks] = useState(true);
  const [showRemit, setShowRemit] = useState(false);
  const [showText , setText] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [remitEnabled, setRemitEnabled] = useState('')


  useEffect(() => {
    if (isFocused) {
     
      if (route.params.from == 'home') {
        setCountryIcon(route.params.icon)
        setPhone(route.params.number)
        setCode(route.params.code)
       
        setText(route.params.promotional_text)
      }
      //checkData()
      checkBack()
      remitSettings()
      // console.log('params', route.params)

      if (rechargePacks && rechargePacks.data) {
        setPlans(rechargePacks.data.packageitems)
        setCurrency(rechargePacks.data.destination_currency)
        setText(route.params.promotional_text)
        // console.log(rechargePacks.data.packageitems)
      }
      if (rechargePacks && rechargePacks.data) {
        setText(route.params.promotional_text)
        setRemitPlans(remitPacks.data)
        // console.log(remitPacks.data)
      }
    }
  }, [props, isFocused]);

  const checkBack = () => {
    if (route.params.from == "back") {
      // console.log("yes back")
      checkData()
    } else {
      setCountryIcon(route.params.icon)
      setPhone(route.params.number)
      setCode(route.params.code)
    }
  }

  const remitSettings = () => {

    setLoading(true)
    homeActions.get_RemitSettings(authToken).then(res => {
      setLoading(false)
      if (res.status == '200') {
        // console.log("remit settings", res.data)
        if (res.data && res.data.airtime_remit) {
          res.data.airtime_remit == '1' ? setRemitEnabled(true) : setRemitEnabled(false);
        }
      } else {
        alert('Something went Wrong')
      }
    })


  }

  // const checkData=async()=>{
  //   AsyncStorage.getItem("TopupData").then((value)=>{
  //     if(value){
        // console.log("asun data",value)
  //     let x = JSON.parse(value)
  //     setCountryIcon(x.icon)
  //     setPhone(x.number)
  //     setCode(x.prefix)
  //     }

  //   }
  // )}

  const checkData = async () => {
    AsyncStorage.getItem("planData").then((value) => {
      if (value) {
        // console.log("plan data", value)
        let x = JSON.parse(value)
        setCountryIcon(x.icon)
        setPhone(x.number)
        setCode(x.code)
        // setCurrency(x.currency)
        // setLocalValue(x.local)
        // setRetailValue(x.usd)
        // setWholesale(x.wholesale)
        // setCoupon(x.coupon)
        // setCouponCount(x.couponCount)
        // setApplied(x.applied)
      }


    }
    )
  }

  const onRechargeClick = () => {
    setShowPacks(true);
    setShowRemit(false);

  }

  const onRemitClick = () => {
    setShowPacks(false);
    setShowRemit(true);

  }

  const handlePlan = (data) => {
    const planInfo = {
      'code': code,
      "number": phone,
      "icon": countryIcon,
      "currency": currency,
      "local": data.local_value,
      'usd': data.retail_value,
      'wholesale': data.wholesale_price_list
    }
    // console.log('pack', planInfo)
    AsyncStorage.setItem("planData", JSON.stringify(planInfo));
    navigation.navigate('Step3', { "plan": planInfo })
  }

  const handleRemitPlan = (data) => {

    const planInfo = {
      'code': code,
      "number": phone,
      'package': data.id,
      "usd": data.payment_amount,
      "etb": data.remit_amount
    }

    // console.log('plan clicked', data)
    navigation.navigate('RemitForm', { "plan": planInfo })
  }

  

  const NumberBox = () => {
    return (
      <View style={[styles.numberBox, { marginTop: 10 }]}>
        <View style={{ height: '100%', width: '27%', flexDirection: 'row', borderRightWidth: 1, borderColor: '#e7edd3' }}>
          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 26, width: 26, borderRadius: 13 }} source={countryIcon ? { uri: countryIcon } : require('../../../src/assets/vector.png')} />
          </View>

          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.codeText}>{code ? code : '+91'}</Text>
          </View>
        </View>

        <View style={{ height: '100%', width: '73%', flexDirection: 'row', }}>
          <View style={{ height: '100%', width: '70%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 19 }}>
            <Text style={styles.codeText}>{phone}</Text>
          </View>



        </View>


      </View>
    )

  }

  const OperatorBox = () => {
    return (
      <View style={[styles.numberBox, { marginTop: 10 }]}>
        <View style={{ height: '100%', width: '17%', flexDirection: 'row', borderRightWidth: 1, borderColor: '#e7edd3' }}>
          <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='contain' style={{ height: 28, width: 28, borderRadius: 14 }} source={rechargePacks && rechargePacks.data ? { uri: rechargePacks.data.operator_logo } : require('../../../src/assets/vector.png')} />
          </View>
        </View>

        <View style={{ height: '100%', width: '83%', flexDirection: 'row', }}>
          <View style={{ height: '100%', width: '100%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 19 }}>
            <Text style={styles.codeText}>{rechargePacks && rechargePacks.data.operator}</Text>
          </View>



        </View>


      </View>
    )

  }

  const PlansList = () => {
    return (
      <View style={{ width: '100%', marginTop: 10, }}>
        <FlatList
          data={plans}
          style={{}}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View key={index} style={{ margin: wp('1%') }}>

              <TouchableOpacity onPress={() => handlePlan(item)} style={styles.planBox} >
                <View style={{ height: '100%', width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.whiteText}>{item.local_value} {currency}</Text>
                  <Text style={[styles.yellowText, { marginTop: 4 }]}>{"(" + item.retail_value + " USD)"}</Text>
                </View>
                <View style={{ height: '100%', width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageBackground resizeMode='cover' style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }} source={require('../../assets/arrowbg.png')} >
                    <Image resizeMode='cover' style={{ height: 8, width: 4, alignSelf: 'center', marginBottom: 3 }} source={require('../../assets/arrow.png')} />
                  </ImageBackground>
                </View>
              </TouchableOpacity>

            </View>
          )}

        />
      </View>
    )
  }

  const RemitPlansList = () => {
    return (
      <View style={{ width: '100%', marginTop: 10, }}>
        <FlatList
          data={remitPlans}
          style={{}}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View key={index} style={{ margin: wp('1%') }}>

              <TouchableOpacity onPress={() => handleRemitPlan(item)} style={[styles.planBox, { backgroundColor: '#E2E2E2' }]} >
                <View style={{ height: '100%', width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[styles.whiteText, { color: '#1E1E1E' }]}>{item.payment_amount} {item.payment_currency}</Text>
                  <Text style={[styles.yellowText, { color: '#428BC1', marginTop: 4 }]}>{"(" + item.remit_amount + " ETB)"}</Text>
                </View>
                <View style={{ height: '100%', width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageBackground resizeMode='cover' style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }} source={require('../../assets/arrowbgWhite.png')} >
                    <Image resizeMode='cover' style={{ height: 8, width: 4, alignSelf: 'center', marginBottom: 3 }} source={require('../../assets/arrowBlack.png')} />
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
        <HomeHeader />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>

          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

            <View style={{ height: 50, width: '100%', marginTop: 20 }}>
              <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../../src/assets/bar1.png')} />
            </View>

            <View style={{ marginTop: 30, width: '100%' }} >
              <Text style={styles.LabelText}>{"Destination"}</Text>
            </View>

            <NumberBox />

            <View style={{ marginTop: 8, width: '100%' }} >
              <Text onPress={() => navigation.navigate('Topup')} style={styles.blueText}>{"Change Number?"}</Text>
            </View>

            <View style={{ marginTop: 7, width: '100%' }} >
              <Text style={styles.LabelText}>{"Carrier"}</Text>
            </View>

            <OperatorBox />

            {code == '+251' && remitEnabled == true ?
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
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                  <Text style={{ fontFamily: 'RobotoCondensed-Regular', fontWeight: '500', fontSize: RFValue(16), color: !showPacks ? '#428BC1' : '#707070' }}>Airtime Remit</Text>
                </TouchableOpacity>
              </View> : null}

            <View style={{ marginTop: 38, width: '100%' }} >
              <Text style={styles.LabelText}>{"Select amount you want to request"}</Text>
            </View>
          
            {showPacks ?
              <PlansList />
              : <RemitPlansList />
            }

          </View>

        </ScrollView>
        {showText?
        <View style={{backgroundColor:'orange',width: '100%',height:40,justifyContent:'center' }} >
          <Text style={[styles.LabelText,{textAlign:'center',fontSize:18,color:"#fff"}]} onPress={()=>setModalVisible(!modalVisible)}>{"Pormotional Message"}</Text>
        </View>
        :
        null
        }
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{showText}</Text>
                <TouchableOpacity style={[styles.button, styles.buttonClose]}>
                  <Text style={{color: 'white',}} onPress={()=>setModalVisible(!modalVisible)}>Done</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </Modal>
      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePlan);