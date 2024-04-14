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

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';
import LinearGradient from 'react-native-linear-gradient';

import BackHeader from '../../shares/Back_Header';
import Loader from '../../shares/Loader';
import { showMessage, hideMessage } from "react-native-flash-message";

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


const Complete = ({ navigation, homeActions, authToken, props, route }) => {
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [code, setCode] = useState('')
  const [filterList, SetFilterList] = useState([]);
  const [showList, setShowList] = useState(false)
  const [phone, setPhone] = useState('');
  const [icon, setIcon] = useState('');
  const [list, setList] = useState([])

  const [search, setSearch] = useState('');


  
  let z = {
    'prefix': code,
    'number': phone,
    "icon": icon
  }


  useEffect(() => {
    if (isFocused) {
      // console.log('complete screen',route.params.api_response)
      // setTimeout(function () {
      showMessage({
        message: "",
        description: "",
        titleStyle: { fontSize: 20, color: '#39475D', fontWeight: '500', marginTop: 10, fontFamily: 'RobotoCondensed-Regular', textAlign: 'center' },
        textStyle: { fontSize: 18, color: '#39475D', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'center' },
        type: "default",
        //backgroundColor: "#39475D", // background color
        color: "#39475D", // text color
        style: { maxHeight: 150, width: "92%", borderRadius: 5, marginBottom: 190, backgroundColor: '#fff' },
        duration: 4000,
        icon: ({ style, ...props }) => <View style={{ width: '100%', }}>
          <Image resizeMode='contain' style={{ height: 20, width: 20, alignSelf: 'center', top: 0 }} source={require('../../../src/assets/paySuccess.png')}  {...props} />
          <Text style={{ fontSize: 18, color: '#39475D', fontWeight: '500', marginTop: 5, fontFamily: 'RobotoCondensed-Regular', textAlign: 'center' }}>{route.params.api_response}</Text>
        </View>
      });
      // navigation.navigate('BottomTabRoutes', { screen: 'Topup' })

      // }, 9000);

    }
  }, [props, isFocused]);


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

  useEffect(() => {
    getCountryList()
  }, []);

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



  return (
    <View style={styles.mainBody}>
      <AlertNotificationRoot>
        <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
          <BackHeader />
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {loading && <Loader loading={loading} />}
            <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

              <View style={{ height: 50, width: '100%', marginTop: 20 }}>
                <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../../src/assets/bar3.png')} />
              </View>

              <View style={{ height: 100, width: '100%', marginTop: 70, justifyContent: 'center', alignItems: 'center' }}>
                <Image resizeMode='contain' style={{ height: 50, width: 50 }} source={require('../../../src/assets/paySuccess.png')} />
              </View>

              <View style={{  height: 70, width: '100%' }} >
                <Text numberOfLines={2} style={styles.successText}>{"Your payment was successful and your rechange has been sent!"}</Text>
              </View>

              <Text style={{color:"gray",fontSize:18,fontWeight:"300",}}>Send a new mobile recharge to</Text>





              <View style={{ flex: 1, width: wp('92%'), alignItems: 'center' }}>

               
                {NumberBox()}
                {/* <NumberBox/> */}
                {showList &&
                  <View style={styles.dropDownContainer}>
                    <View style={styles.dropdown}>
                      <View style={styles.searchBox}>
                        <TextInput
                          style={[styles.dropdownText, { height: 40, paddingVertical: 0 }]}
                          value={search}
                          placeholder={"search country"}
                          onChangeText={(text) => SearchText(text)}
                        />
                      </View>
                      <FlatList
                        data={filterList}
                        style={{ height: '85%', width: '100%' }}
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

                <TouchableOpacity
                onPress={() => navigation.replace('BottomTabRoutes', {
                  screen: 'Topup',
                  params: {
                    newPhone: phone,
                    newCode: code,
                    newIcon: icon,
                  },
                })}
                style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>SEND</Text>
                </TouchableOpacity>


                <TouchableOpacity
                onPress={() => navigation.replace('BottomTabRoutes', {
                  screen: 'Topup',
                })}
                style={[styles.sendButton]}>
                  <Text style={styles.sendButtonText}>Go Back</Text>
                </TouchableOpacity>
              
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </AlertNotificationRoot>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Complete);