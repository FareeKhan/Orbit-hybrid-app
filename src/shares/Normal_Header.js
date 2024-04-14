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

const NormalHeader = ({props, title }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

    

    useEffect(() => {
      if (isFocused) { 
        
        }
    }, [props, isFocused]);

   

    return (
        <View style={styles.headerbox}>
            <TouchableOpacity onPress={()=> navigation.goBack()} style={{ height: 15, width: 22 }}>
                    <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../src/assets/back.png')} />
                </TouchableOpacity>

                {/* <View style={{ height: 34, width: 107}}>
                    <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../src/assets/orbit-logo.png')} />
                </View> */}
                <Text style={styles.title}>{title}</Text>

                <TouchableOpacity style={{ height: 32, width: 32 }}>
                    <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../src/assets/test-user.png')} />
                </TouchableOpacity>

        </View>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(NormalHeader);

const styles = StyleSheet.create({
    headerbox: {
        height: heightPercentageToDP('8%'),
        width: widthPercentageToDP('92%'),
        alignSelf:'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    
      title:{
        fontSize:RFValue(26),
        fontWeight:'500',
        color:'#1E1E1E',
        fontFamily:'RobotoCondensed-Bold',
      }
      

})