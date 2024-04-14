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
  LabelText:{
    fontFamily:'RobotoCondensed-Bold',
    //fontWeight:'600',
    fontSize:RFValue(20),
    textAlign:'left',
    lineHeight:23,
    color:'#1E1E1E'
  },
  searchBox:{
    flexDirection:'row',
    marginTop:15, 
    width:'100%', 
    height:50,
    backgroundColor:'#E1E7EC',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#BEBEBE',
    shadowColor: '#000000',
    shadowOffset: {width:0, height: 6,},
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
  entryText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'300',
    fontSize:RFValue(12),
    textAlign:'left',
    lineHeight:14,
    color:'#707070',
  },
  emptyText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'300',
    fontSize:RFValue(12),
    textAlign:'center',
    lineHeight:14,
    color:'#707070',
  },
  searchText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(18),
    color:'#707070',
    paddingLeft:15
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
    paddingLeft:4
  },
  detailTab:{
    width:'100%',
    height:40,
    borderBottomWidth:1,
    borderBottomColor:'#F2F2F2',
    flexDirection:'row',
    alignItems:'center'
  },
  titleText:{
    fontFamily:'RobotoCondensed-Regular',
    fontWeight:'400',
    fontSize:RFValue(16),
    color:'#707070',
    paddingLeft:15
  },
  detailText:{
    fontFamily:'RobotoCondensed-Bold',
    fontWeight:'500',
    fontSize:RFValue(16),
    color:'#565656',
    //paddingLeft:15
  },
  singleTab:{
    height:'100%', 
    width:'50%',
    justifyContent:'center',
  },
  filterBtn:{
    borderWidth:0.1, 
    flexDirection:'row', 
    height:30, 
    width:'50%', 
    alignSelf:'flex-end',
    backgroundColor:'#f2f2f2',
    borderRadius:5,
    marginBottom:5
  },
  
  
});
export default styles