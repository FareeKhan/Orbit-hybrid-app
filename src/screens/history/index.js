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
  Clipboard,
  ScrollView,
  ImageBackground,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  RefreshControl,
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


const History = ({ navigation, homeActions, authToken, props }) => {

  const [list, setList] = useState([])
  const [searchData, setSearchData] = useState([])
  const [searchText, setSearchText] = useState('')
  const isFocused = useIsFocused();
  const [totalLength, setTotalLength] = useState('0');
  const [emptyMsg, setMsg] = useState('Loading...')
  const [modalVisible, setModalVisible] = useState(false);
  const [txn_id, setTxn_id] = useState();
  const [isRefreshTransaction, setIsRefreshTransaction] = useState(false);
  useEffect(() => {
    if (isFocused) {
      getTransactions()
      setSearchData([])
    }
  }, [props, isFocused]);

  const getTransactions = async () => {
    await homeActions.get_history(authToken).then(res => {
      //console.log('Country response', res)
      if (res.status == '200') {
        // console.log('data set', res.data)
        setIsRefreshTransaction(false)
        setTotalLength(res.data.length)
        setList(res.data)
        setMsg("No record Found")
        //SetFilterList(res.data)
      } else {
        // console.log('data not recieved')
        setTotalLength('0')
        setMsg("No record Found")
        setList('')
      }

    })

  }

  const refreshTransactions = async () => {
    setIsRefreshTransaction(true)
    await homeActions.get_history(authToken).then(res => {
      //console.log('Country response', res)
      if (res.status == '200') {
        // console.log('data set', res.data)
        setIsRefreshTransaction(false)
        setTotalLength(res.data.length)
        setList(res.data)
        setMsg("No record Found")
        //SetFilterList(res.data)
      } else {
        // console.log('data not recieved')
        setIsRefreshTransaction(false)
        setTotalLength('0')
        setMsg("No record Found")
        setList('')
      }

    })

  }

  const getSearchDataList = (text) => {
    let fd = new FormData();
    fd.append('search', text)

    {
      text == '' ?
        getTransactions()
        :
        homeActions.get_search_history(authToken, fd).then(res => {
          if (res.status == '200') {
            // console.log('data set', res.data)
            setTotalLength(res.data.length)
            setList(res.data)
            //setSearchData(res.data)
            //SetFilterList(res.data)
          } else {
            // console.log('data not recieved')
            setTotalLength('0')
            setSearchData('')
          }

        })

    }


  }

  const showTrx = (id) => {

    setModalVisible(true)
    setTxn_id(id)

  }
  const copyToClipboard = (id) => {
    Clipboard.setString(id);
    setModalVisible(false)
    alert("Transaction id copied")
  };

  // const TransactionCard = (data) => {
  //   return (
  //     <View style={styles.trxBox}>

  //       <View style={{ height: '100%', width: '13%', alignItems: 'center', justifyContent: 'center', }}>
  //         <Image resizeMode='contain' style={{ height: 24, width: 24 }} source={AppIcons.success} />
  //       </View>
  //       <View style={{ height: '100%', width: '87%', }}>
  //         <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
  //           <Text numberOfLines={1} style={[styles.trxText]} >{data.country_currency + " " + data.country_amount + ' to ' + data.country_code + "" + data.mobile_no}</Text>
  //           <Text style={[styles.trxText, { color: '#1877F2', fontSize: RFValue(14) }]}>{'(' + data.amount + ' USD)'}</Text>
  //         </View>
  //         <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, }}>
  //           <Text style={styles.entryText}>{'with: '}{data.payment_method == 'Stripe' ? 'Card' :data.payment_method }</Text>
  //           <Text onPress={() => showTrx(data.transaction_id)} numberOfLines={1} style={[styles.entryText, { width: '40%' }]}>{'TRX ID: '}{data.transaction_id}</Text>
  //           <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text>
  //         </View>
  //       </View>

  //     </View>
  //   )
  // }


  const TransactionCard = (data) => {
    return (
      <View style={styles.trxBox}>


        <View style={{ height: '100%', width: '87%', }}>

          <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, }}>
            <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text>
            <Text style={styles.entryText}>{'with: '}{data.payment_method == 'Stripe' ? 'Card' : data.payment_method}</Text>
            <Text onPress={() => showTrx(data.transaction_id)} numberOfLines={1} style={[styles.entryText, { width: '40%' }]}>{'TRX ID: '}{data.transaction_id}</Text>
          </View>
          <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
            <Text numberOfLines={1} style={[styles.trxText]} >{data.country_currency + " " + data.country_amount + ' to ' + data.country_code + "" + data.mobile_no}</Text>
            <Text style={[styles.trxText, { color: '#1877F2', fontSize: RFValue(14) }]}>{'(' + data.amount + ' USD)'}</Text>
          </View>

        </View>

        <View style={{ height: '100%', width: '13%', alignItems: 'center', justifyContent: 'center', }}>
          <Image resizeMode='contain' style={{ height: 24, width: 24 }} source={AppIcons.success} />
        </View>

      </View>
    )
  }

  const showSearch = () => {
    return (
      <View>
        {searchData ? searchData.length > 0 && searchData.map((item, key) => (
          TransactionCard(item)
        )) : null}
      </View>
    )

  }

  const showAll = () => {
    return (<View>
      {list ? list.length > 0 && list.map((item, key) => (
        TransactionCard(item)
      )) : null}
    </View>)
  }


  return (
    <View style={styles.mainBody}>
      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
        <HomeHeader />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          
          refreshControl={<RefreshControl refreshing={isRefreshTransaction} onRefresh={refreshTransactions} />}

          >

          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ marginTop: 16, width: '100%' }} >
              <Text style={styles.LabelText}>{"Most Recent Transactions"}</Text>
            </View>
            {/* searchBox */}
            <View style={styles.searchBox}>
              <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
                <TextInput
                  style={[styles.searchText, { textAlignVertical: 'center' }]}
                  keyboardType="default"
                  value={searchText}
                  placeholder='Search here . . . '
                  onChangeText={(text) => { getSearchDataList(text), setSearchText(text) }}
                />
              </View>

              <View style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Image resizeMode='cover' style={{ height: 26, width: 19 }} source={require('../../assets/search.png')} />
              </View>

            </View>

            <View style={{ marginTop: 7, marginBottom: 6, width: '100%' }}>
              <Text style={styles.entryText}>{"Showing "}{totalLength} {" entries"}</Text>
            </View>

            {/* {searchText && searchText.length > 0 ?

              showSearch() : showAll()

            }
 */}
           

              {totalLength > 0 ?
                showAll()
                :
                <View style={{ marginTop: '50%', justifyContent: 'center', alignContent: 'center' }}>
                  <Text style={styles.entryText}>{emptyMsg}</Text>
                </View>
              }

            
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{'TRX ID: '} {txn_id}</Text>
                <View style={{ width: 24, height: 24 }}>
                  <TouchableOpacity onPress={() => copyToClipboard(txn_id)}>
                    <Image source={require('../../assets/copy_icon.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.textStyle, { marginTop: 10 }]}>
                  <Text style={{ width: 30, color: '#000', }} onPress={() => setModalVisible(!modalVisible)}>Done</Text>
                </Text>
              </View>

            </View>
          </Modal>
        </ScrollView>

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(History);