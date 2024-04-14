import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import { useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  ImageBackground,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

import styles from './style';
import { AppIcons } from '../../shares/Icons';
import LinearGradient from 'react-native-linear-gradient';

import NormalHeader from '../../shares/Normal_Header';

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


const Notification = ({ navigation, homeActions,authToken ,props }) => {

  const [list, setList] = useState([])
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getNotificationList()
    }
  }, [props, isFocused]);

  const getNotificationList = async () => {
    await homeActions.get_NotificationList(authToken).then(res => {
      if (res.status == '200') {
        // console.log('data set')
        setList(res.data.notifications)
      } else {
        // console.log('data not recieved')
        setList('')
      }

    })

  }

  const readSingleNotification = async (id) => {
    await homeActions.read_singleNotification(authToken,id).then(res => {
      if (res.status == '200') {
        // console.log('data set')
        getNotificationList()
      } else {
        // console.log('Something went wrong')
      }
    })

  }

  const readAllNotifications = async () => {
    await homeActions.read_allNotification(authToken).then(res => {
      if (res.status == '200') {
        // console.log('data set')
        getNotificationList()
      } else {
        // console.log('Something went wrong')
      }
    })

  }

  const deleteAllNotifications = async () => {
    await homeActions.delete_allNotification(authToken).then(res => {
      if (res.status == '200') {
        // console.log('data set')
        getNotificationList()
      } else {
        // console.log('Something went wrong')
      }
    })

  }

  const onPressNotification= (data)=>{
      if(data.read == false){
        // console.log("read individual api run krdo")
        readSingleNotification(data.uuid)
      }
      if(data.source_type == "recharge"){
        navigation.navigate('History')
      }
      if(data.source_type == "sms"){
        navigation.navigate('SMSHistory')
      }
      if(data.source_type == "sms_pack"){
        navigation.navigate('PurchaseHistory')
      }
      if(data.source_type == "remit"){
        navigation.navigate('RemitDashboard')
      }
  }

  
  const renderNotificationView = (data) => {
    return (
      <TouchableOpacity onPress={()=>onPressNotification(data)} style={styles.trxBox}>

        <View style={{ height: '100%', width: '13%', alignItems: 'center', justifyContent: 'center' }}>
          <Image resizeMode='contain' style={{ height: 40, width: 40 }} source={AppIcons.notiBell} />
        </View>
        <View style={{ height: '100%', width: '87%', }}>
          <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
            <Text style={[styles.trxText]}>{data.title}</Text>
            {data.read == false ? 
            <View style={{ height: 6, width: 6, borderRadius: 3, alignSelf: 'flex-end', backgroundColor: '#068BB6' }}></View>
             : null }
          </View>
          <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, }}>
            <Text numberOfLines={2} style={[styles.entryText,{maxWidth:'72%', alignSelf:'flex-start', fontSize:RFValue(10)}]}>{data.content}</Text>
            <Text numberOfLines={1} style={[styles.entryText,{alignSelf:'center', color:'#068BB6',paddingHorizontal:1}]}>{data.time}</Text>
            {/* <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text> */}
          </View>
        </View>

      </TouchableOpacity>
    )
  }
  

  


  return (
    <View style={styles.mainBody}>


      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
      <NormalHeader title={"Notifications"} />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>

          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'center' }}>

          <View style={styles.topTab} >
                            <TouchableOpacity onPress={()=>readAllNotifications()} style={[styles.topBtn, { backgroundColor:  '#008CBA'  }]}>
                                
                                <Text style={[styles.btnText, { color:  '#FFFFFF' }]}>MARK AS READ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>deleteAllNotifications()} style={[styles.topBtn, { backgroundColor:  '#fff' }]}>
                                <Text style={[styles.btnText, { color:  '#008CBA' }]}>DELETE ALL</Text>
                            </TouchableOpacity>
            </View>

{/* {renderNotificationView()}
{renderNotificationView()}
{renderNotificationView()} */}

{list ? list.length > 0 && list.map((item, key) => (
      renderNotificationView(item)
    )) : null}
          </View>

        </ScrollView>

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);