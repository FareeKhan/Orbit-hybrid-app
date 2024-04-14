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
import DateTimePicker from '@react-native-community/datetimepicker';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { useIsFocused } from "@react-navigation/native";
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


const RequestDashboard = ({ navigation, homeActions, authToken, props }) => {

  const [list, setList] = useState([])
  const [searchData, setSearchData] = useState([])
  const [searchDate, setSearchDate] = useState('')
  const [searchText, setSearchText] = useState('')
  const isFocused = useIsFocused();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getTransactions()
      setSearchData([])
    }
  }, [props, isFocused]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setSearchDate(moment(currentDate).format("DD/MM/YYYY"));
    getSearchDataList(moment(currentDate).format("YYYY-MM-DD"))
    // console.log('This is selected date', moment(currentDate).format("DD/MM/YYYY"))
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const getTransactions = async () => {

    await homeActions.get_request_dashboard(authToken).then(res => {
      
      if (res.status == '200') {
        // console.log('data set', res.data)
        setList(res.data)

      } else {
        // console.log('data not recieved')
        setList('')
      }

    })

  }

  const getSearchDataList = (date) => {
    let fd = new FormData();
    fd.append('search', date)


    homeActions.get_search_requestDashboard(authToken, fd).then(res => {
      if (res.status == '200') {
        // console.log('data set', res.data)
        setList(res.data)
        //SetFilterList(res.data)
      } else {
        // console.log('data not recieved')
        setList('')
      }

    })




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
            <Text style={[styles.trxText, { color: '#1877F2', fontSize: RFValue(14) }]}>{data.currency + data.amount.local + ' (' + data.amount.retail + ' USD)'}</Text>
          </View>
          <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, }}>
            <Text style={styles.entryText}>{data.fname} {data.lname}</Text>
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
        )) :
          <View style={{ justifyContent: 'center', alignContent: 'center' }}>
            <Text style={styles.entryText}>No Record Found</Text>
          </View>
        }
      </View>
    )

  }

  const showAll = () => {
    return (<View>
      {list ? list.length > 0 && list.map((item, key) => (
        TransactionCard(item)
      ))
        :
        <View style={{ marginTop: '50%', justifyContent: 'center', alignContent: 'center' }}>
          <Text style={styles.entryText}>No Record Found</Text>
        </View>
      }
    </View>)
  }


  return (
    <View style={styles.mainBody}>


      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
        <NormalHeader title={"Request Dashboard"} />


        <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'flex-start' }}>

          <View style={{ marginTop: 16, width: '100%' }} >
            <Text style={styles.LabelText}>{"Request History"}</Text>
          </View>

          <TouchableOpacity onPress={showDatepicker} style={styles.filterBtn}>
            <View style={{ height: '100%', width: '85%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }}>
              <Text numberOfLines={1} style={[styles.trxText, { fontWeight: '500', color: '#1E1E1E' }]}>{"Filter by"} {searchDate ? searchDate : " date"}</Text>
            </View>

            <TouchableOpacity onPress={showDatepicker} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
              <Image resizeMode='contain' style={{ height: 10, width: 16 }} source={require('../../../assets/down.png')} />
            </TouchableOpacity>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          {/* {searchDate && searchData.length > 0 ?

              showSearch() 
              :
              showAll()
            } */}
          {list && list.length > 0 ?
            <View style={{ width: '100%', justifyContent: 'flex-start', }}>
              {list.map((data, key) => (
                <ScrollView>
                  <View style={styles.trxBox}>
                    <View style={{ height: '100%', width: '13%', alignItems: 'center', justifyContent: 'center', }}>
                      <Image resizeMode='contain' style={{ height: 24, width: 24 }} source={AppIcons.success} />
                    </View>
                    <View style={{ height: '100%', width: '87%', }}>
                      <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
                        <Text style={[styles.trxText]} >{data.prefix + "-" + data.phone}</Text>
                        <Text style={[styles.trxText, { color: '#1877F2', fontSize: RFValue(14) }]}>{data.currency + data.amount.local + ' (' + data.amount.retail + ' USD)'}</Text>
                      </View>
                      <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, }}>
                        <Text style={styles.entryText}>{data.fname} {data.lname}</Text>
                        <Text numberOfLines={1} style={[styles.entryText, { width: '40%' }]}>{''}</Text>
                        <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text>
                      </View>
                    </View>

                  </View>
                </ScrollView>

              ))
              }
            </View>
            :

            <View style={{ marginTop: '50%', justifyContent: 'center', alignContent: 'center' }}>
              <Text style={styles.entryText}>No Record Found</Text>
            </View>
          }
        </View>


      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestDashboard);