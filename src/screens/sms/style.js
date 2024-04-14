import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
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
  LabelText:{
    fontFamily:'RobotoCondensed-Bold',
    fontSize:RFValue(20),
    textAlign:'left',
    lineHeight:23,
    color:'#1E1E1E'
  },
  numberBox:{
    flexDirection:'row',
    marginTop:5, 
    width:'100%', 
    height:56,
    backgroundColor:'#ffffff',
    borderRadius:5,
    //borderWidth:StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  codeText:{
    fontFamily:'RobotoCondensed-Bold',
    fontSize:RFValue(14),
    lineHeight:21,
    color:'#707070',
    textAlign:'left'

  },
  dropDownContainer:{
    height:200,
    width:'100%',
    marginTop:5, 
    alignItems:'flex-end',

  },
  dropdown:{
    height:200, 
    width:300,
    backgroundColor:'#ffffff',
    borderRadius:5,
   // borderWidth:StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 4,},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dropdownText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(16),
    color:'#707070',
    paddingLeft:15
  },
  searchBox:{
    height:40, 
    width:'92%', 
    alignSelf:'center', 
    justifyContent:'center',
    paddingVertical:0,
    marginHorizontal:5,
    marginVertical:5, 
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth:1,
    borderColor:'#f2f2f2'
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
  packageCard:{
    marginTop:30, 
    width:'100%',
    height:157, 
    borderRadius:12,
    backgroundColor:'#39475D',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width:0, height: 6,},
    flexDirection:'row',
   // shadowOpacity: 0.2,
   // shadowRadius: 12,
},
cardText:{
  fontFamily:'RobotoCondensed-Regular',
  fontWeight:'500',
  fontSize:RFValue(16),
  color:'#FFFFFF',
},
purchseButton:{
  width:120,
  height:40,
  backgroundColor:'#008cba',
  borderRadius:5,
  shadowColor: '#000000',
  shadowOffset: {width:0, height: 6,},
  shadowOpacity: 0.2,
  shadowRadius: 5,
  alignItems:'center',
  justifyContent:'center'
},
paypalButton:{
  width:'100%',
  height:50,
  backgroundColor:'#003087',
  borderRadius:5,
  //borderWidth:StyleSheet.hairlineWidth,
  shadowColor: '#000000',
  shadowOffset: {width:0, height: 6,},
  shadowOpacity: 0.2,
  shadowRadius: 5,
  alignItems:'center',
  justifyContent:'center'
},
couponButtonText:{
  fontFamily:'RobotoCondensed-Regular',
  fontWeight:'500',
  fontSize:RFValue(16),
  color:'#ffffff'

},
payButton:{
  width:'100%',
  height:50,
  borderRadius:5,
  //borderWidth:StyleSheet.hairlineWidth,
  shadowColor: '#000000',
  shadowOffset: {width:0, height: 6,},
  shadowOpacity: 0.2,
  shadowRadius: 5,
  // alignItems:'center',
  // justifyContent:'center'
},
  
});
export default styles