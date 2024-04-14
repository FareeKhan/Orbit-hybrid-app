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
    alignItems: 'center',
    backgroundColor: '#fffff',


  },
  container: {
    flex: 1,
    height: hp('100%'),
    width: wp('100%'),
    alignItems: 'center',
    backgroundColor: "#fff" // new Code
  },

  // NEwCode
  borderStyle: {
    borderWidth: 1,
    borderColor: "#cecece"
  },
  topText: {
    fontFamily: 'RobotoCondensed-Bold',
    textAlign: 'center',
    fontSize: RFValue(38),
    lineHeight: 54,
    color: '#1E1E1E'
  },
  titleText: {
    fontFamily: 'RobotoCondensed-Regular',
    fontWeight: '400',
    fontSize: RFValue(16),
    textAlign: 'center',
    lineHeight: 18,
    color: '#707070'
  },
  numberBox: {
    flexDirection: 'row',
    marginTop: 50,
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    //borderWidth:StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6, },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  codeText: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: RFValue(14),
    lineHeight: 21,
    color: '#707070',
    textAlign: 'left'

  },
  dropDownContainer: {
    height: 200,
    width: '100%',
    marginTop: 5,
    alignItems: 'flex-end',

  },
  dropdown: {
    height: 200,
    width: 300,
    backgroundColor: '#ffffff',
    //   borderRadius:5,
    //  // borderWidth:StyleSheet.hairlineWidth,
    //   shadowColor: '#000000',
    //   shadowOffset: {width:0, height: 4,},
    //   shadowOpacity: 0.1,
    //   shadowRadius: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    
    elevation: 9,
    marginRight:5
  },
  dropdownText: {
    fontFamily: 'RobotoCondensed-Regular',
    fontWeight: '400',
    fontSize: RFValue(16),
    color: '#707070',
    paddingLeft: 15
  },
  searchBox: {
    height: 40,
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6, },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#f2f2f2'
  },
  sendButton: {
    marginTop: 30,
    width: '100%',
    height: 56,
    backgroundColor: '#008cba',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6, },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  couponButtonText: {
    fontFamily: 'RobotoCondensed-Regular',
    fontWeight: '500',
    fontSize: RFValue(16),
    color: '#ffffff'
  },
  blueText: {
    fontFamily: 'RobotoCondensed-Regular',
    fontWeight: '500',
    fontSize: RFValue(16),
    textAlign: 'center',
    //lineHeight:16,
    color: '#1877F2',
    //paddingVertical:1,
  },
  otpInputBox: {
    width: 46,
    height: 46,
    // backgroundColor:'#ffffff',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 6, },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,

    fontFamily: 'RobotoCondensed-Regular',
    fontWeight: '500',
    fontSize: RFValue(16),
    color: '#000'
  },
  LabelText: {
    fontFamily: 'RobotoCondensed-Bold',
    //fontWeight:'600',
    fontSize: RFValue(20),
    textAlign: 'left',
    lineHeight: 23,
    color: '#1E1E1E'
  },



  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 47,
    height: 47,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#00000020',
    textAlign: 'center',
    borderRadius:7,
    marginRight:5,
    fontFamily: 'RobotoCondensed-Regular',
 paddingTop:4
    
  },
  focusCell: {
    borderColor: '#00000060',
  },

});
export default styles