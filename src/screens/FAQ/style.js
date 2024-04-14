
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
  headCard:{
    flexDirection:'row',
    //paddingLeft:15,
    height:46,
    width:'100%',
    backgroundColor:'#F2F2F2',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderColor:'#F2F2F2',
    //borderWidth:1,
    marginTop:20,
    shadowColor: 'rgba(0, 0, 0, 0.07)',
    shadowOffset: {width:0, height: 6,},
    //shadowOpacity: 0.2,
    shadowRadius: 10,
    justifyContent:'center'
  },
  headText:{
    fontSize:RFValue(16),
    fontWeight:'500',
    fontFamily:'RobotoCondensed-Regular',
    color:'#1e1e1e',
    paddingLeft:15,
    textAlign:'justify'
  },
  answerCard:{
    width:'100%',
    backgroundColor:'#F2F2F2',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderColor:'#F2F2F2',
    shadowColor: 'rgba(0, 0, 0, 0.07)',
    shadowOffset: {width:0, height: 6,},
    //shadowOpacity: 0.2,
    shadowRadius: 10,
    justifyContent:'center',
    paddingBottom:10
  },
  answerText:{
    fontSize:RFValue(12),
    fontWeight:'400',
    fontFamily:'RobotoCondensed-Regular',
    color:'#707070',
    paddingLeft:15,
    paddingRight:15,
    lineHeight:14,
  },

  

});
export default styles