import { Text, Alert, View, StyleSheet, Linking, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { Component, useEffect, useState, useCallback } from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../src/actions/index';

const mapDispatchToProps = (dispatch) => {
  return ({
    homeActions: bindActionCreators(homeActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),

  })
};

const mapStateToProps = (state) => {
  return {
    authToken: state.auth_Reducer.authToken,
    userData: state.home_Reducer.userData,
  }
}

const HomeHeader = ({ props, title, userData, homeActions }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [token, setToken] = useState('');

  const [name, setName] = useState('')
  const [facebook_id,setFacebookID] = useState('')
  const [count,setCount ] = useState()

  useEffect(() => {
    if (isFocused) {
      setMenuVisible(false)
      getFaceBookID()
      getCurrentUser()
      
    }
  }, [props, isFocused]);
  
  const getFaceBookID= async ()=>{
    await AsyncStorage.getItem("facebook_uuid").then((value) => {
      if (value) {
        // console.log("facebook deta",value)
          setFacebookID(value)
      }
    })
  } 
  const getCurrentUser = async()=>{
    await AsyncStorage.getItem("user_token").then((value) => {
      if (value) {
        getNotificationList(value)
        setToken(value)
        getSelfInfo(value)
        if (userData && userData.data) {
          setName(userData.data.name)
        }
        // console.log("user token", value)
      } else {
        setToken('')
        // console.log("not logged in")
      }
    })
  }

  const getNotificationList = async (token) => {
    await homeActions.get_NotificationList(token).then(res => {
      if (res.status == '200') {
        // console.log('data set')
        let total = []
        res.data.notifications.map((item,index)=>{
         if(item.read == false){
          total.push(item)
         }
        })
        // console.log('total',total.length)
        setCount(total.length)
      } else {
        // console.log('data not recieved')
        setList('')
      }

    })

  }
  const getSelfInfo = (token) => {
    homeActions.get_SelfInfo(token).then(res => {
      if (res.status == '200') {
        if (res.data.status) {
          setName(res.data.name)
          // console.log('self data set', res.data.name)
        }

      }
    })
  }

  const handleLogout = () => {
    AsyncStorage.clear()
    setMenuVisible(false)
    navigation.navigate('HomeRoutes', { screen: 'Home1' })
  }

  const goTo = (screen) => {
    // console.log(screen)
    navigation.navigate(screen);
  }


  const OpenURLButton = async (url) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }

  return (
    <View style={styles.headerbox}>
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={{ height: 26, width: 35 }}>
        <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../src/assets/menu-icon.png')} />
      </TouchableOpacity>

      <View style={{ height: 34, width: 107 }}>
        <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../src/assets/orbit-logo.png')} />
      </View>

      <TouchableOpacity onPress={() => { navigation.navigate("Notification") }} style={{ height: 26, width: 21, }}>
        <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../src/assets/bell.png')} />
        {count>0?<View style={styles.count}>
            <Text style={styles.countText}>{count}</Text>
          </View>
          :
          null
        }
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(!menuVisible)}  >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(!menuVisible)} >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>


              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={{ height: 27, width: 27, paddingLeft: 20, marginTop: 50 }}>
                <Image resizeMode='cover' style={{ height: 27, width: 27 }} source={require('../assets/close.png')}></Image>
              </TouchableOpacity>

              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginTop: 15 }}>
                <Image resizeMode='cover' style={{ height: 32, width: 32, borderRadius: 16 }} source={require('../assets/user-icon.png')}></Image>
                <Text style={styles.userName}>{token ? name : "User"}</Text>
              </View>

              <View style={{ height: 1, opacity: 0.1, marginTop: 27, width: '100%', borderWidth: 1, backgroundColor: '#000' }}></View>

              {/* <TouchableOpacity onPress={() => { navigation.navigate(token ? 'Complete' : 'Complete'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"Top Up"}</Text>
              </TouchableOpacity> */}

              <TouchableOpacity onPress={() => { navigation.navigate(token ? 'Topup' : 'Home1'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"Top Up"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate(token ? 'SMS' : 'HomeSMS'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"SMS"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate(token ? 'Request' : 'HomeRequest'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"Request"}</Text>
              </TouchableOpacity>

              {token == "" ? null :
                <TouchableOpacity onPress={() => { navigation.navigate('SetPin'), setMenuVisible(false) }} style={styles.item}>
                  <Text style={styles.itemText}>{"Set Pin"}</Text>
                </TouchableOpacity>}

              {token ? null :
                <TouchableOpacity onPress={() => { navigation.navigate('Login'), setMenuVisible(false) }} style={styles.item}>
                  <Text style={styles.itemText}>{"Login"}</Text>
                </TouchableOpacity>}

              {token ? null :
                <TouchableOpacity onPress={() => { navigation.navigate('Signup'), setMenuVisible(false) }} style={styles.item}>
                  <Text style={styles.itemText}>{"Sign Up"}</Text>
                </TouchableOpacity>}

              {facebook_id == 1?
              <TouchableOpacity onPress={() => { navigation.navigate('FBpage'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"Delete Facebook Data"}</Text>
              </TouchableOpacity>
              :
              null
              }  

              {token == "" ? null :
                <TouchableOpacity onPress={() => handleLogout()} style={styles.item}>
                  <Text style={styles.itemText}>{"Logout"}</Text>
                </TouchableOpacity>}

              <TouchableOpacity onPress={() => { navigation.navigate('FAQ'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"FAQ"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate('TermsPolicy'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"Terms/Privacy"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate('Contact'), setMenuVisible(false) }} style={styles.item}>
                <Text style={styles.itemText}>{"Contact"}</Text>
              </TouchableOpacity>


            </View>

          </View>
        </TouchableWithoutFeedback>

      </Modal>


    </View>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);

const styles = StyleSheet.create({
  headerbox: {
    height: heightPercentageToDP('8%'),
    width: widthPercentageToDP('92%'),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: RFValue(22),
    fontFamily: 'SpaceMono-Bold',
    color: "#00BE77",
    textTransform: 'uppercase',
    lineHeight: 24,
  },
  buttonBox: {
    height: 30,
    width: 100,
    backgroundColor: '#00be77',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginRight: 10
  },
  buttonText: {
    fontSize: RFValue(12),
    fontFamily: 'SpaceMono-Bold',
    color: "#fff",
    textAlign: 'center',
    lineHeight: 19,
    textTransform: 'uppercase'
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    //borderWidth:2,
    //marginTop: 50,
    backgroundColor: '#5555'
  },
  modalView: {
    backgroundColor: '#fff',
    // borderTopLeftRadius:50,
    //borderBottomLeftRadius:50,
    height: heightPercentageToDP('100%'),
    width: widthPercentageToDP('72%'),
    //borderWidth:StyleSheet.hairlineWidth,

  },
  userName: {
    fontSize: RFValue(20),
    fontWeight: '500',
    color: '#1E1E1E',
    fontFamily: 'RobotoCondensed-Bold',
    marginLeft: 9,
  },
  item: {
    width: '92%',
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
    height: 60,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  itemText: {
    fontSize: RFValue(20),
    fontWeight: '400',
    color: '#707070',
    fontFamily: 'RobotoCondensed-Regular',
  },
  count: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },


})