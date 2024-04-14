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
    textAlign:'left',
    lineHeight:26,
  },
  numberBox:{
    flexDirection:'row',
    marginTop:35, 
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
  resendButtonText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(13),
    color:'#ffffff'

  },

  bottomText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(23),
    textAlign:'justify',
    lineHeight:36,
    color:'#707070'

  },

  LabelText:{
    fontFamily:'RobotoCondensed-Bold',
    //fontWeight:'600',
    fontSize:RFValue(20),
    textAlign:'left',
    lineHeight:23,
    color:'#1E1E1E'
  },
  blueText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(14),
    textAlign:'right',
    lineHeight:16,
    color:'#1877F2'
  },
  planBox:{
    width:wp('44%'), 
    //margin:wp('2%'),
    height:63, 
    backgroundColor:'#39475D',
    borderRadius:5,
    //borderWidth:StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    flexDirection:'row'
  },
  whiteText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    textAlign:'left',
    lineHeight:18,
    color:'#ffffff'

  },

  yellowText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(14),
    textAlign:'left',
    lineHeight:16,
    color:'#FFC107'

  },
  amountBlueText:{
    fontFamily:'RobotoCondensed-Bold',
    fontSize:RFValue(18),
    textAlign:'center',
    lineHeight:16,
    color:'#1877F2',
    height:'100%',
    width:'100%',
    alignSelf:'center',
    textAlignVertical:'center',
  },
  amountBlueText1:{
    fontFamily:'RobotoCondensed-Bold',
    fontSize:RFValue(18),
    //textAlign:'center',
    lineHeight:16,
    color:'#1877F2',
    //height:'100%',
    //width:'100%',
   // alignSelf:'center',
    //textAlignVertical:'center',
  },
  couponButtonText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#ffffff'

  },
  successTextBlue:{
    fontFamily:'RobotoCondensed-Bold',
    //fontWeight:'700',
    fontSize:RFValue(34),
    textAlign:'center',
    //lineHeight:26,
    color:'#008CBA'
  },
  successLine:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(18),
    color:'#565656',
    textAlign:'left'
    //paddingLeft:15
  },
  detailsCard:{
    marginTop:13,
    height:hp('20%'),
    width:'100%',
    backgroundColor:'#ffffff',
    borderRadius:12,
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    alignItems:'center',
  },
  detailsContainer:{
    height:'25%', 
    width:'100%', 
    justifyContent:'center', 
    borderBottomColor:'#f2f2f2', 
    borderBottomWidth:1,
  },
  titleText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(16),
    color:'#707070',
  },
  detailsText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#565656',
  },

  
});
export default styles