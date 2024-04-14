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
  ImageBackground,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

import styles from './style';
import { AppIcons } from '../../../shares/Icons';
import LinearGradient from 'react-native-linear-gradient';

import NormalHeader from '../../../shares/Normal_Header';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { homeActions, authActions } from '../../../actions/index';
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


const SentDetails = ({route, navigation, homeActions,authToken }) => {

  const [data, setData] = useState(route.params.data)
  const [amount, setAmount] = useState('')
  const [charge, setCharge] = useState('')
  
  const total=  parseFloat(amount)+parseFloat(charge)

  

  useEffect(() => {
  //  console.log('details page')
   setData(route.params.data)
   setAmount(route.params.data.payment_amount)
   setCharge(route.params.data.payment_charge == null ? 0 : route.params.data.payment_charge)
  }, []);

  const EachTab=(title, data)=>{
    return(
    <View style={[styles.detailTab,{marginTop:10}]}>
            <View style={styles.singleTab}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
            <View style={styles.singleTab}>
                <Text numberOfLines={1} style={styles.detailText}>{data ? data : null} </Text>
            </View>
          </View>
          )
  }

  const trxStatus = (status)=>{
    if(status==0){
      return "Pending"
    }
    if(status==1){
      return "In Process"
    }
    if(status==2){
      return "Paid"
    }
    if(status==3){
      return "Failed"
    }
  
  }


  return (
    <View style={styles.mainBody}>


      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
      <NormalHeader title={"Remit Sent Details"} />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>

          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'center' }}> 

          <View style={[styles.detailTab,{marginTop:10}]}>
            <View style={styles.singleTab}>
                <Text style={styles.titleText}>Date </Text>
            </View>
            <View style={styles.singleTab}>
                <Text style={styles.detailText}>{moment(data.created_at).format('YYYY-MM-DD')} </Text>
            </View>
          </View>

          {EachTab("Reciever Name", data.receiver_fname)}
          {EachTab("Reciever Phone", data.receiver_phone)}
          {EachTab("Reciever Email", data.receiver_email)}
          {EachTab("Payment Status", data.payment_status)}
          {EachTab("Payment Date", moment(data.payment_date).format('YYYY-MM-DD'))}
          {EachTab("Payment TRX ID", data.payment_txnid)}
          {EachTab("Payment Via", data.payment_gateway)}
          {EachTab("Paid", "USD "+total)}
          {EachTab("Remit Amount", "ETB "+data.receiver_amount)}
          {EachTab("Bank", data.bank_name)}
          {EachTab("Account Number", data.account_number)}
          {EachTab("Process Status", trxStatus(data.txn_status))}
          {EachTab("Process TXN ID", data.txn_id)}
          {EachTab("Process Date", moment(data.payment_date).format('YYYY-MM-DD'))}

          </View>

        </ScrollView>

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SentDetails);