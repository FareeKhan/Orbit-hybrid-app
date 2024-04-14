import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { Component, useEffect,useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused,useNavigation  } from "@react-navigation/native";

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
  }
}

const SuccessAlert = ({props, title, open }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [show,setShow] = useState(false)

    

    useEffect(() => {
      if (isFocused) { 
        setShow(open)
        // console.log('passed', title, open)
        }
    }, [props, isFocused]);

  return (
    <View> 
      {/* <Text> </Text> */}
      
    <Modal
      transparent={true}
      animationType={'none'}
       visible={open}
      onRequestClose={() => {
        // console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Text>{title}</Text>
          <Text onPress={()=>setShow(false)} >{desc}</Text>
          
        </View>
      </View>
    </Modal> 

    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SuccessAlert);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 300,
    width: "92%",
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});