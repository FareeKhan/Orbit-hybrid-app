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


const SMSHistory = ({ navigation, homeActions,authToken ,props}) => {

  const [list, setList] = useState([])
  const [searchData, setSearchData] = useState([])
  const [searchText, setSearchText] = useState('')
  const isFocused = useIsFocused();
  const [total_length,setLength] = useState('0')
  const [emptyMsg ,setMsg] = useState('Loading')
  useEffect(() => {
    if (isFocused) {
    getTransactions()
    setSearchData([])
    }
  }, [props, isFocused]);

  const getTransactions = async () => {
   
    await homeActions.get_sms_history(authToken).then(res => {
      
      if (res.status == '200') {
        // console.log('data set', res.data,'0000',res.data.length)
        setLength(res.data.length)
        setList(res.data)
        setMsg("No record Found")
       
        
      } else {
        // console.log('data not recieved')
        setMsg("No record Found")
        setList('')
      }

    })

  }

  const getSearchDataList = (text)=>{
   
    let fd = new FormData();
    fd.append('search', text)
    // console.log(fd,"rrrrr",text)
    {text.length==''? 
     getTransactions()
    :
    homeActions.get_search_sms(authToken, fd).then(res => {  
      if (res.status == '200') {
        // console.log('data set', res.data)
        setLength(res.data.length)
        //setSearchData(res.data)
        setList(res.data)
        //SetFilterList(res.data)
        setMsg("No record Found")
      } else {
        // console.log('data not recieved')
        setMsg("No record Found")
        setSearchData('')
      }

    }) 
  }


  }

  const TransactionCard = (data)=>{
    return(
      <View style={styles.trxBox}>

        <View style={{height:'100%', width:'13%', alignItems:'center', justifyContent:'center',}}>
        <Image resizeMode='contain' style={{ height: 24, width:24 }} source={AppIcons.success} />
        </View>
        <View style={{height:'100%', width:'87%',}}>
          <View style={{height:'50%', width:'100%',flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:5}}>
            <Text style={[styles.trxText]} >{data.receiver}</Text>
            <Text style={[styles.trxText,{color:'#1877F2', fontSize:RFValue(14)}]}>{"$ "+data.sms_price+' /sms'}</Text>
          </View>
          <View style={{height:'50%', width:'100%',flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:5,}}>
            <Text style={styles.entryText}>{"$ "+data.sms_price}</Text>
            <Text numberOfLines={1} style={[styles.entryText,{width:'40%'}]}>{data.country}</Text>
            <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text>
          </View>
        </View>

      </View>
    )
  }

  const showSearch = ()=>{
    return(
      <View>
        {searchData ? searchData.length > 0 && searchData.map((item, key) => (
      TransactionCard(item)
    )) : null}
      </View>
    )
    
  }
 
  const showAll = () =>{
    return(<View>
    {list ? list.length > 0 && list.map((item, key) => (
      TransactionCard(item)
    )) : null}
    </View>)
  }


  return (
    <View style={styles.mainBody}>


      <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
      <NormalHeader title={"SMS History"} />
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}>

          <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ marginTop: 16, width: '100%' }} >
              <Text style={styles.LabelText}>{"Most Recent SMS History"}</Text>
            </View>
   {/* searchBox */}
            <View style={styles.searchBox}>
              <View style={{ height: '100%', width: '85%',justifyContent:'center' }}>
              <TextInput
            style={[styles.searchText,{}] }
            keyboardType="default"
            value={searchText}
            placeholder='Search here . . . '
            onChangeText={(text) => {
              getSearchDataList(text), setSearchText(text)
            }}
             />
              </View>

              <View style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Image resizeMode='cover' style={{ height: 26, width: 19 }} source={require('../../../assets/search.png')} />
              </View>

            </View>

            <View style={{marginTop: 7, marginBottom:6, width: '100%' }}>
              <Text style={styles.entryText}>{"Showing "}{total_length} {" entries"}</Text>
            </View>

            {/* {searchText && searchText.length>0 ? 
             
             showSearch() : showAll()
            
            } */}
            { total_length >0 ?
              showAll() 
             :
             <View style={{ marginTop: '50%', justifyContent: 'center', alignContent: 'center' }}>
                <Text style={styles.entryText}>{emptyMsg}</Text>
             </View>
            }



          </View>

        </ScrollView>

      </LinearGradient>
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SMSHistory);