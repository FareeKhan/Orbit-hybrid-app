
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
  topText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(18),
    color:'#565656',
    textAlign:'left'
  },
  switchStyle:{
    height:25,
    width:45, 
    borderWidth:2, 
    borderRadius:13, 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'#fcf8f5'
},
  boldText:{
    fontSize:RFValue(20),
    fontWeight:'500',
    fontFamily:'RobotoCondensed-Bold',
    color:'#1E1E1E',
    paddingLeft:15,
  },

  LabelText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(14),
    textAlign:'left',
    lineHeight:16,
    color:'#707070'
  },
  inputBox:{
    marginTop:7, 
    width:'100%', 
    height:45,
    backgroundColor:'#E1E7EC',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#BEBEBE',
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent:'center',
    flexDirection:'row'
  },
  sendButton:{
    marginTop:30,
    width:'100%',
    height:56,
    backgroundColor:'#008cba',
    borderRadius:5,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  sendButtonText:{
    fontFamily:'RobotoCondensed-Bold',
    fontSize:RFValue(20),
    color:'#ffffff'

  },
  inputText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#1E1E1E',
    paddingLeft:15,
    paddingVertical:0,
  },
  authBox:{
    width:'100%',
    height:'auto',
    backgroundColor:'#ffffff',
    borderRadius:10,
    marginTop:150,
    alignItems:'center',
  },
  otpInputBox:{
    width:46, 
    height:46,
    // borderRadius:5,
    // shadowColor: 'rgba(0, 0, 0, 0.12)',
    // shadowOffset: {width:0, height: 6,},
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
   // borderWidth:1,
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#000',
   // borderColor:'#707070',
    borderBottomColor:'#707070',
    borderBottomWidth:2
  },
  blueText:{
    fontFamily:'RobotoCondensed-Regular',
    fontSize:RFValue(14),
    fontWeight:'400',
    color:'#1877F2'

  },
  line:{
    height:1,
    width:'100%',
    borderWidth:1,
    borderColor:'#D8D8D8',
    marginVertical:12,
  },
  couponButtonText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#ffffff'
  },
  otpTopText: {
    fontFamily:'RobotoCondensed-Bold',
    textAlign:'center',
    fontSize:RFValue(38),
    lineHeight:54,
    color:'#1E1E1E'
  },

});
export default styles