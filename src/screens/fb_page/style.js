
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#fffff',


  },
  container: {
    flex:1, 
    height:hp('100%'), 
    width:wp('100%'), 
    alignItems:'center'
  },
  logoContainer: {
    flex:1,
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText:{
    fontSize:RFValue(16),
    fontWeight:'500',
    fontFamily:'RobotoCondensed-Regular',
    color:'#707070',
    lineHeight:27,
  },
  emailText:{
    fontSize:RFValue(18),
    fontWeight:'600',
    fontFamily:'RobotoCondensed-Regular',
    color:'#008CBA',
    lineHeight:27,
    textDecorationLine:'underline',
    textDecorationColor:'#008CBA'
  },
  sendButton:{
    marginTop:10,
    width:'100%',
    height:56,
    backgroundColor:'#008CBA',
    borderRadius:5,
    //borderWidth:StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  sendButtonText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(20),
    color:'#ffffff'

  },
  

  

});
export default styles