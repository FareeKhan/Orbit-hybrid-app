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
import DateTimePicker from '@react-native-community/datetimepicker';

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


const RemitDashboard = ({ navigation, homeActions, authToken }) => {

    const [sentList, setSentList] = useState([])
    const [recieveList, setRecieveList] = useState([])

    const [searchData, setSearchData] = useState([])
    const [sentSearchData, setSentSearchData] = useState([])
    const [recieveSearchData, setRecieveSearchData] = useState([])
    const [searchText, setSearchText] = useState('')

    const [showSent, setShowSent] = useState(true)
    const [showRecieve, setShowRecieve] = useState(false)

    const [sentDate, setSentDate] = useState('')
    const [recieveDate, setRecieveDate] = useState('')

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [date1, setDate1] = useState(new Date());
    const [mode1, setMode1] = useState('date');
    const [show1, setShow1] = useState(false);

    const send = require('../../../assets/send.png');
    const sendBlue = require('../../../assets/sendBlue.png');
    const recieve = require('../../../assets/recieve.png');
    const recieveBlue = require('../../../assets/recieveBlue.png');

    useEffect(() => {
        getTransactions()
        setSearchData([])
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setSentDate(moment(currentDate).format("DD/MM/YYYY"));
        getSentSearchData(moment(currentDate).format("YYYY-MM-DD"))
        // console.log('This is selected date', moment(currentDate).format("DD/MM/YYYY"))
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const onChange1 = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow1(Platform.OS === 'ios');
        setDate1(currentDate);
        setRecieveDate(moment(currentDate).format("DD/MM/YYYY"));
        getRecieveSearchData(moment(currentDate).format("YYYY-MM-DD"))
        // console.log('This is selected date', moment(currentDate).format("DD/MM/YYYY"))
    };

    const showMode1 = (currentMode) => {
        setShow1(true);
        setMode1(currentMode);
    };

    const showDatepicker1 = () => {
        showMode1('date');
    };

    const getTransactions = async () => {

        await homeActions.get_remit_dashboard(authToken).then(res => {

            if (res.status == '200') {
                // console.log('data set', res.data)
                setRecieveList(res.data.recieved)
                setSentList(res.data.history)

            } else {
                // console.log('data not recieved')
                setRecieveList('')
                setSentList('')
            }

        })

    }

    const getSentSearchData = (date) => {
        let fd = new FormData();
        fd.append('search', date)


        homeActions.get_search_sentRemit(authToken, fd).then(res => {
            if (res.status == '200') {
                // console.log('data set', res.data)
                setSentSearchData(res.data)
                //SetFilterList(res.data)
            } else {
                // console.log('data not recieved')
                setSentSearchData('')
            }

        })

    }

    const getRecieveSearchData = (date) => {
        let fd = new FormData();
        fd.append('search', date)


        homeActions.get_search_recieveRemit(authToken, fd).then(res => {
            if (res.status == '200') {
                // console.log('data set', res.data)
                setRecieveSearchData(res.data)
                //SetFilterList(res.data)
            } else {
                // console.log('data not recieved')
                setRecieveSearchData('')
            }

        })

    }

    const RecieveTransactionCard = (data) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('RecieveDetails', { "data": data })} style={styles.trxBox}>

                <View style={{ height: '100%', width: '13%', alignItems: 'center', justifyContent: 'center', }}>
                    <Image resizeMode='contain' style={{ height: 24, width: 24 }} source={AppIcons.success} />
                </View>
                <View style={{ height: '100%', width: '87%', }}>
                    <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
                        <Text style={[styles.trxText]}>{data.sender_fname} {data.sender_lname == null ? "" : data.sender_lname}</Text>
                        <Text style={[styles.trxText, { color: '#1877F2', fontSize: RFValue(14) }]}>{data.receiver_amount}{data.receiver_currency} {'($' + data.payment_amount + ")"}</Text>
                    </View>
                    <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, }}>
                        <Text style={styles.entryText}>{data.sender_phone}</Text>
                        <Text numberOfLines={1} style={[styles.entryText, { width: '40%' }]}>{''}</Text>
                        <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const SentTransactionCard = (data) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('SentDetails', { "data": data })} style={styles.trxBox}>

                <View style={{ height: '100%', width: '13%', alignItems: 'center', justifyContent: 'center', }}>
                    <Image resizeMode='contain' style={{ height: 24, width: 24 }} source={AppIcons.success} />
                </View>
                <View style={{ height: '100%', width: '87%', }}>
                    <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
                        <Text style={[styles.trxText]}>{data.receiver_fname + " " + data.receiver_lname}</Text>
                        <Text style={[styles.trxText, { color: '#1877F2', fontSize: RFValue(14) }]}>{data.receiver_amount}{data.receiver_currency} {'($' + data.payment_amount + ")"}</Text>
                    </View>
                    <View style={{ height: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, }}>
                        <Text style={styles.entryText}>{data.receiver_phone}</Text>
                        <Text numberOfLines={1} style={[styles.entryText, { width: '40%' }]}>{''}</Text>
                        <Text style={styles.entryText}>{moment(data.created_at).format('YYYY-MM-DD')}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }


    const showSentData = () => {
        return (<View>
            {sentList ? sentList.length > 0 && sentList.map((item, key) => (
                SentTransactionCard(item)
            )) : null}
        </View>)
    }

    const showSentSearchData = () => {
        return (<View>
            {sentSearchData ? sentSearchData.length > 0 && sentSearchData.map((item, key) => (
                SentTransactionCard(item)
            )) : null}
        </View>)
    }

    const showRecieveData = () => {
        return (<View>
            {recieveList ? recieveList.length > 0 && recieveList.map((item, key) => (
                RecieveTransactionCard(item)
            )) : null}
        </View>)
    }

    const showRecieveSearchData = () => {
        return (<View>
            {recieveSearchData ? recieveSearchData.length > 0 && recieveSearchData.map((item, key) => (
                RecieveTransactionCard(item)
            )) : null}
        </View>)
    }

    const onclickSent = () => {
        setShowSent(true);
        setShowRecieve(false);

    }

    const onclickRecieve = () => {
        setShowSent(false);
        setShowRecieve(true);

    }

    const showRemitSent = () => {
        return (
            <View>
                <View style={{ alignItems: 'flex-end', width: wp('92%'), marginTop: 5 }}>
                    <TouchableOpacity onPress={showDatepicker} style={[styles.filterBtn, {}]}>
                        <View style={{ height: '100%', width: '85%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }}>
                            <Text numberOfLines={1} style={[styles.trxText, { fontWeight: '500', color: '#1E1E1E' }]}>{"Filter by"} {sentDate ? sentDate : " date"}</Text>
                        </View>

                        <TouchableOpacity onPress={showDatepicker} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image resizeMode='contain' style={{ height: 10, width: 16 }} source={require('../../../assets/down.png')} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
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

                {sentDate && sentSearchData.length > 0 ?

                    showSentSearchData() : showSentData()

                }
            </View>
        )
    }

    const showRemitRecieved = () => {
        return (
            <View>
                <View style={{ alignItems: 'flex-end', width: wp('92%'), marginTop: 5 }}>
                    <TouchableOpacity onPress={showDatepicker1} style={[styles.filterBtn, {}]}>
                        <View style={{ height: '100%', width: '85%', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }}>
                            <Text numberOfLines={1} style={[styles.trxText, { fontWeight: '500', color: '#1E1E1E' }]}>{"Filter by"} {recieveDate ? recieveDate : " date"}</Text>
                        </View>

                        <TouchableOpacity onPress={showDatepicker1} style={{ height: '100%', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image resizeMode='contain' style={{ height: 10, width: 16 }} source={require('../../../assets/down.png')} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                {show1 && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date1}
                        mode={mode1}
                        is24Hour={true}
                        display="default"
                        onChange={onChange1}
                    />
                )}


                {recieveDate && recieveSearchData.length > 0 ?

                    showRecieveSearchData() : showRecieveData()

                }
            </View>
        )
    }


    return (
        <View style={styles.mainBody}>


            <LinearGradient colors={['#ffffff', '#EFE1D3']} style={styles.container}>
                <NormalHeader title={"Remit Dashboard"} />
                <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    style={{ flex: 1 }}>

                    <View style={{ flex: 1, width: wp('92%'), alignItems: 'center', justifyContent: 'center' }}>

                        <View style={styles.topTab} >
                            <TouchableOpacity onPress={() => onclickSent()} style={[styles.topBtn, { backgroundColor: showSent ? '#008CBA' : '#fff' }]}>
                                <Image resizeMode='cover' style={{ height: 12, width: 12 }} source={showSent ? send : sendBlue} />
                                <Text style={[styles.btnText, { color: showSent ? '#FFFFFF' : '#008CBA' }]}>REMIT SENT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onclickRecieve()} style={[styles.topBtn, { backgroundColor: !showSent ? '#008CBA' : '#fff' }]}>
                                <Image resizeMode='cover' style={{ height: 12, width: 12 }} source={!showSent ? recieve : recieveBlue} />
                                <Text style={[styles.btnText, { color: !showSent ? '#FFFFFF' : '#008CBA' }]}>REMIT RECEIVED</Text>
                            </TouchableOpacity>
                        </View>

                        {showSent ? showRemitSent() : showRemitRecieved()}

                    </View>

                </ScrollView>
            </LinearGradient>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(RemitDashboard);