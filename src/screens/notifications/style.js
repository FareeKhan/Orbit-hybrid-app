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
  topTab:{ 
    marginTop: 20, 
    width: '100%',
    height:54,
    backgroundColor:'#F0F0F0',
    borderRadius:5,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal:7
   },
   topBtn:{
    height:40,
    width:wp('42%'),
    backgroundColor:'#008CBA',
    borderRadius:5,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
   },
   btnText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'500',
    fontSize:RFValue(14),
    color:'#FFFFFF',
  },
  detailTab:{
    width:'100%',
    height:40,
    borderBottomWidth:1,
    borderBottomColor:'#F2F2F2',
    flexDirection:'row',
    alignItems:'center'
  },
  entryText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'300',
    fontSize:RFValue(12),
    textAlign:'left',
    lineHeight:14,
    color:'#707070',
  },
  trxBox:{
    flexDirection:'row',
    marginTop:12, 
    width:'100%', 
    height:70,
    backgroundColor:'#ffffff',
    borderRadius:10,
    // borderWidth:1,
    // borderColor:'#BEBEBE',
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  trxText:{
    fontFamily:'RobotoCondensed-Bold',
    fontWeight:'500',
    fontSize:RFValue(16),
    textAlign:'left',
    //lineHeight:14,
    color:'#1E1E1E'
  },
  
  
});
export default styles