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
  username:{
    fontFamily:'RobotoCondensed-Bold',
    fontWeight:'500',
    fontSize:RFValue(20),
    alignSelf:'center',
    paddingLeft:20,
   // textAlign:'left',
    //lineHeight:14,
    color:'#1E1E1E'
  },
  tab:{
    height:60,
    width:'100%',
    justifyContent:'center',
    borderColor:'#D8D8D8',
    borderBottomWidth:1,
  },
  tabText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(18),
    //alignSelf:'center',
    paddingLeft:18,
   // textAlign:'left',
    //lineHeight:14,
    color:'#1E1E1E'
  },
  LabelText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(14),
    textAlign:'left',
    //lineHeight:16,
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
    justifyContent:'center'
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
  editButtonText:{
    fontFamily:'RobotoCondensed-Regular',
    fontSize:RFValue(13),
    fontWeight:'400',
    color:'#ffffff'

  },
  inputText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#1E1E1E',
    paddingLeft:15,
    paddingVertical:0
  },
  
});
export default styles