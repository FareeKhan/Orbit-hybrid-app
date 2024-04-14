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
  FlatList,
  Keyboard,
  Platform,
  Alert,
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
import { showMessage, hideMessage } from "react-native-flash-message";
//import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../shares/Loader';
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

  }
}


const HomeRequest = ({ navigation, countryList, homeActions }) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('')
  const [icon, setIcon] = useState('');
  const [countryId, setCountryId] = useState('');
  const [phone, setPhone] = useState('');

  const [showList, setShowList] = useState(false)
  const [list, setList] = useState([])

  const[search, setSearch]= useState('');
  const[filterList, SetFilterList]= useState([]);
  const[nodata, setNodata] = useState(false);

  const [requestEnabled, setRequestEnabled] = useState()

  useEffect(() => {
    remitSettings()
    setList(countryList.data)
    SetFilterList(countryList.data)
  }, []);

  const remitSettings = ()=>{
  
    setLoading(true)
   homeActions.get_RemitSettings().then(res=>{
    setLoading(false)
      if (res.status == '200') {
        // console.log("remit settings",res.data)
        if(res.data && res.data.airtime_request){
          res.data.airtime_request == '1' ? setRequestEnabled(true) :  setRequestEnabled(false) ;
        }
      } else {
        alert('Something went Wrong')       
      }
    })
   
    
  }

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

const handleRequestButton = async()=>{
  if(!requestEnabled){
    Platform.OS === 'ios'?
    alert('This feature is currently unavailable'):
    showMessage({
      message: "Alert !!!",
      description: 'This feature is currently unavailable',
      titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
      type: "default",
      backgroundColor: "#39475D", // background color
      color: "#fff", // text color
      style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
     });
    return;
  }
  
    if (!phone) {
      Platform.OS === "ios"?
      alert("Please enter details"):
      showMessage({
        message: "Alert !!!",
        description: "Please enter details",
        titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
        type: "default",
        backgroundColor: "#39475D", // background color
        color: "#fff", // text color
        style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
       });
      return;
  }
  
    let formData = new FormData();
    formData.append('prefix', code)
    formData.append('number', phone)

    setLoading(true)
    await homeActions.get_Recharge_Packages(formData).then(res=>{
      setLoading(false)
      if (res.status == '200') {
        if(res.data.status == true){
          // console.log('data set')
        navigation.navigate('RequestPlans',{'code' : code, "number" : phone, "icon": icon, 'id':countryId});
        }else{
          Platform.OS === "ios"?
          alert(res.data.msg):
          showMessage({
            message: "Alert !!!",
            description: res.data.msg,
            titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
           });
        }
        
      } else { 
        Platform.OS === "ios"?
        alert('Something went wrong'):
        showMessage({
          message: "Alert !!!",
          description: 'Something went wrong',
          titleStyle:{fontSize:20, color:'red', fontWeight:'500', marginTop:10, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          textStyle:{fontSize:18, color:'#FFF', fontWeight:'500', marginTop:5, fontFamily:'RobotoCondensed-Regular', textAlign:'left'},
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style:{maxHeight:150, width:"92%", borderRadius:12, borderWidth:3,borderColor:'#f2f2f2', },
         });     
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
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>
{loading && <Loader loading={loading}/>}
          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

            <View style={{ marginTop: 13, width: '100%' }} >
              <Text style={styles.topText}>{"Request your family members living abroad to recharge your phone."}</Text>
              <Text style={[styles.topText, { marginTop: 10 }]}>{"Provide your name and phone number and we can forward your request"}</Text>
            </View>

            {NumberBox()}

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
                          setCode(item.prefix)
                          setIcon(item.icon)
                          setCountryId(item.country_id)
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

            <TouchableOpacity onPress={()=>handleRequestButton()} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>REQUEST</Text>
            </TouchableOpacity>


          </View>

        </ScrollView>

      </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeRequest);

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
      textAlign:'left',
      lineHeight:26,
    },
    numberBox:{
      flexDirection:'row',
      marginTop:35, 
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
  
    }
})