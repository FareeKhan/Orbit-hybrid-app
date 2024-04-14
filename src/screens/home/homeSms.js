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
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../shares/Loader';

//import styles from './style';
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
    countryList: state.home_Reducer.countryList,
    authToken: state.auth_Reducer.authToken,
  }
}


const HomeSMS = ({ navigation,homeActions, countryList,authToken }) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('')
  const [countryAbv, setCountryAbv] = useState('');
  const [icon, setIcon] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [authModal, setAuthModal] = useState(false)


  const [showList, setShowList] = useState(false)
  const [list, setList] = useState([])

  const[search, setSearch]= useState('');
  const[filterList, SetFilterList]= useState([]);
  const[nodata, setNodata] = useState(false);

  const [count, setCount] = useState('')
  const [price, setPrice] = useState('');


  useEffect(() => {
    setList(countryList.data)
    SetFilterList(countryList.data)
    //credit_details('IN')
  }, []);

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
        alert('Something went Wrong')       
      }
    })
   
    
  }

  const handle_sendSms = ()=>{
    
     
      
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
        <ScrollView
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
                          //credit_details(item.abbreviation)
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

            <View style={[styles.numberBox,{height:120, alignItems:'flex-start'}]}>
            <TextInput
              style={styles.dropdownText}
              keyboardType="default"
              placeholder='Write your message...'
              multiline={true}
              onChangeText={(text) => setMessage(text)}
            />
            </View>


            <TouchableOpacity onPress={()=>setAuthModal(true)} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>SEND</Text>
            </TouchableOpacity>

           
            
          </View>

        </ScrollView>

      </LinearGradient>

      <Modal
                animationType='fade'

                transparent={true}
                visible={authModal}
                onRequestClose={() => {setAuthModal(false)}}
              >
                <TouchableWithoutFeedback  onPress={() => setAuthModal(false)} >
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
                    height:hp('20%'),
                    backgroundColor: 'white',
                    borderTopLeftRadius:30,
                    borderTopRightRadius:30,
                    alignItems: 'center',


                  }}>
                    <TouchableOpacity onPress={()=> setAuthModal(false)}
                    style={{marginTop:10, height:5, width:100, backgroundColor:'rgba(196, 196, 196, 0.5)', borderRadius:20}}>
                    
                    </TouchableOpacity>
                    <View style={{marginTop:45, width:wp('90%'), height:50,flexDirection:'row',justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={()=>{navigation.navigate('Signup'),setAuthModal(false) }} style={[styles.chooseAuthBox,{ backgroundColor:'#1877F2'}]}>
                          <Text style={styles.couponButtonText} >SIGN UP</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{navigation.navigate('Login'),setAuthModal(false)}} style={[styles.chooseAuthBox,{borderWidth:1, borderColor:'#1877F2'}]}>
                          <Text style={[styles.couponButtonText,{color:'#1877F2'}]} >LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                    
                  
                  </LinearGradient>

                </View>
                </TouchableWithoutFeedback>
              </Modal>
              </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeSMS);

const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor: '#fffff',
  
  
    },
    container: {
      flex:1, 
      height:hp('100%'), 
      width:wp('100%'), 
      alignItems:'center'
    },
    topText:{
      fontFamily:'RobotoCondensed-Regular',
      fontWeight:'400',
      fontSize:RFValue(18),
      color:'#565656',
      textAlign:'justify'
    },
    LabelText:{
      fontFamily:'RobotoCondensed-Bold',
      fontSize:RFValue(20),
      textAlign:'left',
      lineHeight:23,
      color:'#1E1E1E'
    },
    numberBox:{
      flexDirection:'row',
      marginTop:5, 
      width:'100%', 
      height:56,
      backgroundColor:'#ffffff',
      borderRadius:5,
      //borderWidth:StyleSheet.hairlineWidth,
      shadowColor: '#000000',
      shadowOffset: {width:0, height: 6,},
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    codeText:{
      fontFamily:'RobotoCondensed-Bold',
      fontSize:RFValue(14),
      lineHeight:21,
      color:'#707070',
      textAlign:'left'
  
    },
    dropDownContainer:{
      height:200,
      width:'100%',
      marginTop:5, 
      alignItems:'flex-end',
  
    },
    dropdown:{
      height:200, 
      width:300,
      backgroundColor:'#ffffff',
      borderRadius:5,
     // borderWidth:StyleSheet.hairlineWidth,
      shadowColor: '#000000',
      shadowOffset: {width:0, height: 4,},
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    dropdownText:{
      fontFamily:'RobotoCondensed-Regular',
      fontWeight:'400',
      fontSize:RFValue(16),
      color:'#707070',
      paddingLeft:15
    },
    searchBox:{
      height:40, 
      width:'92%', 
      alignSelf:'center', 
      justifyContent:'center',
      paddingVertical:0,
      marginHorizontal:5,
      marginVertical:5, 
      shadowColor: '#000000',
      shadowOffset: {width:0, height: 6,},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      borderWidth:1,
      borderColor:'#f2f2f2'
    },
    sendButton:{
      marginTop:30,
      width:'100%',
      height:56,
      backgroundColor:'#008cba',
      borderRadius:5,
      shadowColor: '#000000',
      shadowOffset: {width:0, height: 6,},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      alignItems:'center',
      justifyContent:'center'
    },
    sendButtonText:{
      fontFamily:'RobotoCondensed-Bold',
      fontSize:RFValue(20),
      color:'#ffffff'
  
    },
    packageCard:{
      marginTop:30, 
      width:'100%',
      height:157, 
      borderRadius:12,
      backgroundColor:'#39475D',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: {width:0, height: 6,},
      flexDirection:'row',
     // shadowOpacity: 0.2,
     // shadowRadius: 12,
  },
  cardText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#FFFFFF',
  },
  purchseButton:{
    width:120,
    height:40,
    backgroundColor:'#008cba',
    borderRadius:5,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  paypalButton:{
    width:'100%',
    height:50,
    backgroundColor:'#003087',
    borderRadius:5,
    //borderWidth:StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  couponButtonText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#ffffff'

  },
  chooseAuthBox:{ 
    width:wp('43%'), 
    height:46,
    borderRadius:5,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 4,},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
    
  });
 