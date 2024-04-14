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
import { AppIcons } from '../../../shares/Icons';
import LinearGradient from 'react-native-linear-gradient';

import NormalHeader from '../../../shares/Normal_Header';
import { useIsFocused } from "@react-navigation/native";
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


const RequestHistory = ({ navigation, homeActions, authToken, props }) => {

  const [list, setList] = useState([])
  const [searchData, setSearchData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [refreshRequest, setRefreshRequest] = useState(false)
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getTransactions()
      setSearchData([])
    }
  }, [props, isFocused]);

  const getTransactions = async () => {

    await homeActions.get_request_history(authToken).then(res => {
      setRefreshRequest(true)

      if (res.status == '200') {
        // console.log('data set', res.data)
        setList(res.data)

      } else {
        // console.log('data not recieved')
        setList('')
      }

    })

  } 
  
  const refreshRequestHistory = async () => {
    setRefreshRequest(true)
    await homeActions.get_request_history(authToken).then(res => {

      if (res.status == '200') {
    setRefreshRequest(false)

        // console.log('data set', res.data)
        setList(res.data)

      } else {
        // console.log('data not recieved')
    setRefreshRequest(false)

        setList('')
      }

    })

  }

  const getSearchDataList = (text) => {
    let fd = new FormData();
    fd.append('search', searchText && searchText.length > 0 ? searchText : '')

    {
      searchText.length > 0 &&
        homeActions.get_search_request(authToken, fd).then(res => {
          if (res.status == '200') {
            // console.log('data set', res.data)
            setSearchData(res.data)
            //SetFilterList(res.data)
          } else {
            // console.log('data not recieved')
            setSearchData('')
          }

        })

    }


  }

  const TransactionCard = (data) => {
    return (
      <View style={styles.trxBox}>
        <View style={{ height: '100%', width: '13%', alignItems: 'center', justifyContent: 'center', }}>
          <Image resizeMode='contain' style={{ height: 24, width: 24 }} source={AppIcons.success} />
        </View>
        <View style={{ height: '100%', width: '87%', }}>
          <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
            <Text style={[styles.trxText]} >{data.prefix + "-" + data.phone}</Text>
            <Text style={[styles.trxText, { color: '#1877F2', fontSize: RFValue(14) }]}>{data.currency + " " + data.amount.local + ' (' + data.amount.retail + ' USD)'}</Text>
          </View>
          <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, }}>
            <Text style={styles.entryText}>{'payer: '}{data.fname} {data.lname}</Text>
            <Text numberOfLines={1} style={[styles.entryText, { width: '40%' }]}>{''}</Text>
            <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text>
          </View>
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
        <NormalHeader title={"Request History"} />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>

          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ marginTop: 16, width: '100%' }} >
              <Text style={styles.LabelText}>{"Request History"}</Text>
            </View>
            {/* searchBox */}
            <View style={styles.searchBox}>
              <View style={{ height: '100%', width: '85%', justifyContent: 'center' }}>
                <TextInput
                  style={[styles.searchText, {}]}
                  keyboardType="default"
                  value={searchText}
                  placeholder='Search here . . . '
                  onChangeText={(text) => { getSearchDataList(text), setSearchText(text) }}
                />
              </View>

              <View style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Image resizeMode='cover' style={{ height: 26, width: 19 }} source={require('../../../assets/search.png')} />
              </View>

            </View>

            <View style={{ marginTop: 7, marginBottom: 6, width: '100%' }}>
              <Text style={styles.entryText}>{"Showing "}{list ? list.length : '0'} {" entries"}</Text>
            </View>

            <ScrollView
            refreshControl={<RefreshControl refreshing={refreshRequest} onRefresh={refreshRequestHistory}  />}
            >

              {searchText && searchText.length > 0 ?

                showSearch() : showAll()

              }
            </ScrollView>



          </View>

        </ScrollView>

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestHistory);