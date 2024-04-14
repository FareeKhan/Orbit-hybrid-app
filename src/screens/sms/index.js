import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef, useRef } from 'react';

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  FlatList,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../shares/Home_Header';
import { useIsFocused } from "@react-navigation/native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../actions/index';
import { sms_Credits } from '../../actions/home_actions';
import { showMessage, hideMessage } from "react-native-flash-message";
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


const SMS = ({ navigation,homeActions, countryList,authToken, props }) => {
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [code, setCode] = useState('')
  const [countryAbv, setCountryAbv] = useState('');
  const [icon, setIcon] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const refInput = createRef();

  const [showList, setShowList] = useState(false)
  const [list, setList] = useState([])

  const[search, setSearch]= useState('');
  const[filterList, SetFilterList]= useState([]);
  const[nodata, setNodata] = useState(false);

  const [count, setCount] = useState('')
  const [price, setPrice] = useState('');


  useEffect(() => {
    if (isFocused) {
      setMessage('')
    setList(countryList.data)
    SetFilterList(countryList.data)
    //credit_details('IN')
    }
  }, [props, isFocused]);

  const SearchText =(text)=>{
    if(text){
      const newData = list.filter((item)=>{
        const itemData = item.name ? item.name.toUpperCase() : 
        ''.toUpperCase();

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      SetFilterList(newData);
      setSearch(text);
    }else{
      SetFilterList(list);
      setSearch(text)
    }

}
const boxClick=() =>{
  refInput.current &&
  refInput.current.focus()
}

const credit_details = (abv)=>{
  //navigation.navigate('choosePlan',{'code' : code, "number" : phone, "icon": icon});  
  //  console.log("abbreviation",abv)
  let formData = new FormData();
    formData.append('code', abv)
   

    setLoading(true)
   homeActions.get_credits(authToken,formData).then(res=>{
    setLoading(false)
      if (res.status == '200') {
        setCount(res.data.sms)
        setPrice(res.data.price)
      } else {
        //alert('Something went Wrong')       
      }
    })
   
    
  }

  const handle_sendSms = ()=>{
    if (!phone) {
      Platform.OS === "ios" ?
      alert('Please enter details'):
      // Dialog.show({
      //   type: ALERT_TYPE.DANGER,
      //   title: 'Alert',
      //   textBody: 'Please enter details',
      //   button: 'Back',
      // });
     // alert('Please enter details')
      showMessage({
        message: "Alert !!!",
        titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        description: "Please enter details",
        textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        type: "default",
        backgroundColor: "#39475D", // background color
        color: "#fff", // text color
        style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
       });
      return;
  }
  if (!message) {
    Platform.OS === "ios" ?
    alert('Please enter message'):
    // Dialog.show({
    //   type: ALERT_TYPE.DANGER,
    //   title: 'Alert',
    //   textBody: 'Please enter message',
    //   button: 'Back',
    // });
    showMessage({
      message: "Alert !!!",
      titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      description: "Please enter message",
      textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      type: "default",
      backgroundColor: "#39475D", // background color
      color: "#fff", // text color
      style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
     });
    return;
}

if (count == 0) {
  Platform.OS === "ios" ?
  alert('You dont have enough credits to send sms.'):
  // Dialog.show({
  //   type: ALERT_TYPE.DANGER,
  //   title: 'Alert',
  //   textBody: 'You dont have enough credits to send sms.',
  //   button: 'Back',
  // });
  showMessage({
    message: "Alert !!!",
    titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
    description: "You dont have enough credits to send sms.",
    textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
    type: "default",
    backgroundColor: "#39475D", // background color
    color: "#fff", // text color
    style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
   });
  return;
}
     
    let formData = new FormData();
      formData.append('selected_code', countryAbv)
      formData.append('number', phone)
      formData.append('message', message)
      formData.append('selected_cnt', code)
     
      setLoading(true)
     homeActions.send_sms(authToken,formData).then(res=>{
      setLoading(false)
        if (res.status == '200') {
          //Alert.alert("SMS Sent.")
          Platform.OS === "ios" ?
          alert("SMS Sent.") :
          showMessage({
            message: "Success !",
            titleStyle:{fontSize:20, color:'green', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            description: "SMS Sent.",
            textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
           });
          // Dialog.show({
          //   type: ALERT_TYPE.SUCCESS,
          //   title: 'Success',
          //   textBody: 'SMS Sent.',
          //   button: 'Done',
          // });  
          setMessage('')
          setCode('')
          setIcon('')
          setPhone('')
          navigation.navigate('BottomTabRoutes',{screen:'Topup'})
        } else {
          showMessage({
            message: "Alert !!!",
            titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            description: "Something went Wrong",
            textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
           });
         // alert('Something went Wrong')  
          // Dialog.show({
          //   type: ALERT_TYPE.DANGER,
          //   title: 'Alert',
          //   textBody: 'Something went Wrong',
          //   button: 'Back',
          // });     
        }
      })
     
      
    }

  const NumberBox = () => {
    return (
      <View style={styles.numberBox}>
        <TouchableOpacity onPress={() => { setShowList(!showList) }} style={{ height: '100%', width: '27%', flexDirection: 'row', borderRightWidth: 1, borderColor: '#e7edd3' }}>
          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Image resizeMode='cover' style={{ height: 26, width: 26, borderRadius: 13, }} source={icon ? { uri: icon } : require('../../../src/assets/vector.png')} />
          </View>

          <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.codeText}>{code ? code : "+00"}</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: '100%', width: '73%', flexDirection: 'row', }}>
          {code ?
          <View style={{ height: '100%', width: '100%', justifyContent:'center' }}>
            <TextInput
              style={styles.dropdownText}
              keyboardType="numeric"
              autoFocus={true}
              maxLength={10}
              value={phone}
              onChangeText={(text) => setPhone(text)}
            />
            </View> :

            [<TouchableOpacity onPress={() => { setShowList(!showList) }} style={{ height: '100%', width: '70%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 19 }}>
              <Text style={styles.codeText}>Select Country</Text>
            </TouchableOpacity>
              ,
            <TouchableOpacity onPress={() => { setShowList(!showList) }} style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center', paddingRight: 19 }}>
              <Image resizeMode='contain' style={{ height: 10, width: 16 }} source={require('../../../src/assets/down-arrow.png')} />
            </TouchableOpacity>]
          }
        </View>


      </View>
    )

  }


  return (
    <View style={styles.mainBody}>

<AlertNotificationRoot>
      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
        <HomeHeader />
        <KeyboardAwareScrollView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>
{loading && <Loader loading={loading}/>}
          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>
            
            <View style={{ marginTop: 13, width: '100%' }} >
              <Text style={styles.topText}>{"You wanted to call your loved one on WhatsApp but they are offline and want to tell them to go online? Or just want to send a quick text message for any reason?"}</Text>
            </View>
            <View style={{ marginTop: 30, width: '100%' }} >
              <Text style={styles.LabelText}>{"Receiver"}</Text>
            </View>

            {NumberBox()}
            {/* <NumberBox/> */}
            {showList &&
              <View style={styles.dropDownContainer}>
                <View style={styles.dropdown}>
                <View style={styles.searchBox}>
                <TextInput
                numberOfLines={1}
                multiline={false}
                scrollEnabled={false}
                caretHidden={false}
            style={[styles.dropdownText,{height:40,paddingVertical:0}] }
           value={search}
           placeholder={"search country"}
            onChangeText={(text) => SearchText(text)}
          />
                </View>
                  <FlatList
                    data={filterList}
                    style={{ height: '100%', width: '100%' }}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    numColumns={1}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity style={{ width: '100%', height: 30 }} key={index}
                        onPress={() => {
                          credit_details(item.abbreviation)
                          setCountryAbv(item.abbreviation)
                          setCode(item.prefix)
                          setIcon(item.icon)
                          setShowList(false)
                          // console.log(item.name)
                        }}>
                        <Text style={[styles.dropdownText, {}]}>{item.name}  </Text>
                      </TouchableOpacity>
                    )}

                  />
                </View>
              </View>
            }

            <View style={{ marginTop: 26, width: '100%' }} >
              <Text style={styles.LabelText}>{"Message"}</Text>
            </View>

            <TouchableOpacity onPress={()=> boxClick()} style={[styles.numberBox,{height:120, alignItems:'flex-start'}]}>
            <View style={{height:'100%', width:'100%'}}>
            <TextInput
              style={styles.dropdownText}
              keyboardType="default"
              placeholder='Write your message...'
              multiline={true}
              value={message}
              ref={refInput}
              //autoFocus={true}
              focusable={true}
              onChangeText={(text) => setMessage(text)}
            /></View>
            </TouchableOpacity>
{ price ? 
            <View style={{ marginTop: 16, width: '100%' }} >
              <Text style={styles.dropdownText}>{"Credits: "+count+" SMS($"+ price+"/per-sms)"}</Text>
            </View> : null
}

            <TouchableOpacity onPress={()=>handle_sendSms()} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>SEND</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 70, width: '100%' }} >
              <Text style={[styles.dropdownText,{fontSize:18}]}>{"Need More Credits?"} <Text onPress={()=>{navigation.navigate('SMS_Package')}} style={{color:'#1877F2'}}>{"Goto Packages"}</Text></Text>
            </View>
            
          </View>

        </ScrollView>
        </KeyboardAwareScrollView>
      </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SMS);