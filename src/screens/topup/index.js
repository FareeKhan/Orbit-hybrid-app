import { NavigationContainer, TabRouter } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { showMessage, hideMessage } from "react-native-flash-message";
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
  RefreshControl,
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
    authToken: state.auth_Reducer.authToken,
  }
}


const Topup = ({ navigation, homeActions, authToken, props,route }) => {
  const {newCode ,newPhone,newIcon} = route.params ? route.params : {newCode:'',newPhone:"",newIcon:""}
 
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [code, setCode] = useState('')
  const [icon, setIcon] = useState('');
  const [phone, setPhone] = useState('');



  const [prefix, setPrefix] = useState('')

  const [showList, setShowList] = useState(false)
  const [list, setList] = useState([])
  const [recent, setRecent] = useState([])

  const [search, setSearch] = useState('');
  const [filterList, SetFilterList] = useState([]);
  const [nodata, setNodata] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    if (isFocused) {
      // showMessage({
      //   message: "",
      //   description: "",
      //   titleStyle: {fontSize: 20, color: '#39475D', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'center' },
      //   textStyle: { fontSize: 18, color: '#39475D', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'center' },
      //   type: "default",
      //   //backgroundColor: "#39475D", // background color
      //   color: "#39475D", // text color
      //   style: { maxHeight: 150, width: "92%", borderRadius: 5, marginBottom:190,backgroundColor:'#fff' },
      //   duration:4000,
      //   icon: ({ style, ...props }) =>  <View style={{width:'100%',}}>
      //          <Image  resizeMode='contain' style={{ height: 20, width: 20,alignSelf:'center',top:0 }} source={require('../../../src/assets/paySuccess.png')}  {...props}/>
      //          <Text style={{ fontSize: 18, color: '#39475D', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'center' }}>Your payment was successfully and your recharge has been sent!</Text>
      //     </View>             
      // });
      setPhone(newPhone?newPhone:'')
      setCode(newCode?newCode:'')
      setIcon(newIcon ? newIcon :"")
      getCountryList()
      getSelfInfo(authToken)
      getTransactions()
    }
  }, [props, isFocused]);

  const getTransactions = async () => {
    await homeActions.get_history(authToken).then(res => {
      // console.log('Country response', res)
      if (res.status == '200') {
        // console.log('data set')
        setRecent(res.data)
        //SetFilterList(res.data)
      } else {
        // console.log('data not recieved')
        setRecent('')
      }

    })

  }

  const refreshTransactions = async () => {
    setIsRefresh(true)
    await homeActions.get_history(authToken).then(res => {
      // console.log('Country response', res)
      if (res.status == '200') {
        // console.log('data set')
        setIsRefresh(false)
        setRecent(res.data)
        //SetFilterList(res.data)
      } else {
        // console.log('data not recieved')
        setIsRefresh(false)
        setRecent('')
      }

    })

  }

  const getSelfInfo = (token) => {
    homeActions.get_SelfInfo(token).then(res => {
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('self data set')
        }

      }
    })
  }

  const SearchText = (text) => {
    if (text) {
      const newData = list.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() :
          ''.toUpperCase();

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      SetFilterList(newData);
      setSearch(text);
    } else {
      SetFilterList(list);
      setSearch(text)
    }

  }


  const handleResend = async (code, phone) => {


    let number = phone;

    let cod = code.charAt(0) == "+" ? code : "+" + code;
    // console.log('edited code', cod)

    if (code.charAt(0) == "+") {
      setPrefix(code)
    }
    else {
      let newcode = "+" + code;
      // console.log(newcode)
      setPrefix(newcode)

    }

    let formData = new FormData();
    formData.append('prefix', cod)
    formData.append('number', number)
    let z = {
      'prefix': code,
      'number': phone,
      "icon": icon
    }

    setLoading(true)
    await homeActions.get_Recharge_Packages(formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('data set')
          AsyncStorage.setItem("TopupData", JSON.stringify(z));
          navigation.navigate('choosePlan', { 'code': code, "number": phone, "icon": icon, 'from': 'home' });
        } else {
          Platform.OS === "ios" ?
            alert(res.data.msg) :
            showMessage({
              message: "Alert !!!",
              description: res.data.msg,
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });

        }

      } else {
        Platform.OS === "ios" ?
          alert('Something went Wrong') :
          showMessage({
            message: "Alert !!!",
            description: "Something went wrong",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      }
    })


  }

  const handleSendButton = async () => {
    //navigation.navigate('choosePlan',{'code' : code, "number" : phone, "icon": icon});  
    if (!phone) {
      Platform.OS === "ios" ?
        alert('Please enter details') :
        showMessage({
          message: "Alert !!!",
          description: "Please enter details",
          titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
          type: "default",
          backgroundColor: "#39475D", // background color
          color: "#fff", // text color
          style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
        });
      return;
    }

    let formData = new FormData();
    formData.append('prefix', code)
    formData.append('number', phone)
    let z = {
      'prefix': code,
      'number': phone,
      "icon": icon
    }

    setLoading(true)
    await homeActions.get_Recharge_Packages(formData).then(res => {
      setLoading(false)
      if (res.status == '200') {
        if (res.data.status == true) {
          // console.log('data set',res.data.promotiond)
          AsyncStorage.setItem("TopupData", JSON.stringify(z));
          navigation.navigate('choosePlan', { 'code': code, "number": phone, "icon": icon, 'from': 'home', 'promotional_text': res.data.promotiond });
        } else {
          Platform.OS === "ios" ?
            alert(res.data.msg) :
            showMessage({
              message: "Alert !!!",
              description: res.data.msg,
              titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
              type: "default",
              backgroundColor: "#39475D", // background color
              color: "#fff", // text color
              style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
            });

        }

      } else {
        Platform.OS === "ios" ?
          alert('Something went Wrong') :
          showMessage({
            message: "Alert !!!",
            description: "Something went wrong",
            titleStyle: { fontSize: 20, color: 'red', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            textStyle: { fontSize: 18, color: '#FFF', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'left' },
            type: "default",
            backgroundColor: "#39475D", // background color
            color: "#fff", // text color
            style: { maxHeight: 150, width: "92%", borderRadius: 12, borderWidth: 3, borderColor: '#f2f2f2', },
          });
      }
    })


  }



  const getCountryList = async () => {
    await homeActions.get_Country_Data().then(res => {
      // console.log('Country response', res)
      if (res.status == '200') {
        // console.log('data set')
        setList(res.data)
        SetFilterList(res.data)
      } else {
        // console.log('data not recieved')
        setList('')
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
            <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
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

  const RecentTab = (data) => {
    return (
      <View style={{ height: 50, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#D9D9D9' }}>
        <View style={{ height: '100%', width: '33.33%' }}>
          <Text style={styles.smallText}>To</Text>
          <Text numberOfLines={1} style={styles.recentText}>{data.country_code} {data.mobile_no}</Text>
        </View>
        <View style={{ height: '100%', width: '33.33%' }}>
          <Text style={styles.smallText}>Amount</Text>
          <Text numberOfLines={1} style={styles.recentText}>{data.country_amount} {data.country_currency} <Text style={{ color: '#F2B200' }}>{"($ " + data.amount}{")"}</Text></Text>
        </View>
        <View style={{ height: '100%', width: '33.33%', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => {
            handleResend(data.country_code, data.mobile_no)
          }}
            style={[styles.sendButton, { marginTop: 0, height: 30 }]}>
            <Text style={styles.resendButtonText}>RESEND</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }



  return (
    <View style={styles.mainBody}>
      <AlertNotificationRoot>

        <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
          <HomeHeader />

          {loading && <Loader loading={loading} />}
          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

            <View style={{ marginTop: 70, width: '100%' }} >
              <Text
                //onPress={()=>navigation.navigate('Complete')}
                style={[styles.topText, { fontSize: RFValue(34), textAlign: 'left', color: '#39475d' }]}>{"Mobile Recharge To All Your Friends & Family"}</Text>
            </View>

            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ width: '100%' }}
              refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={refreshTransactions} />}
              >
        
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
                        style={[styles.dropdownText, { height: 40, paddingVertical: 0 }]}
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

              <TouchableOpacity onPress={() => handleSendButton()} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>SEND</Text>
              </TouchableOpacity>
            
              <View style={{ marginTop: 30, width: '100%' }} >
                <Text style={styles.LabelText}>{"Recent Activity"}</Text>
              </View>
              <View style={{ width: wp('100%'), borderColor: '#D9D9D9', marginTop: 5, borderWidth: 2 }} />
            
              {/* {RecentTab()} */}
              {recent ? recent.length > 0 && recent.map((item, key) => (
                key < 5 && RecentTab(item)

              )) : null}
            </ScrollView>
          </View>




        </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Topup);