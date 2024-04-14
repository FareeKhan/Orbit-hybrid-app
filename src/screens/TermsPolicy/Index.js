import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import Normal_Header from '../../shares/Normal_Header'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { RFValue } from 'react-native-responsive-fontsize'

const Index = ({navigation}) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerbox}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 15, width: 22 }}>
                    <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../../src/assets/back.png')} />
                </TouchableOpacity>

                {/* <View style={{ height: 34, width: 107}}>
                    <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../src/assets/orbit-logo.png')} />
                </View> */}
                <Text style={styles.title}>Terms & Policy</Text>

             

            </View>

            <WebView
                source={{ uri: 'https://orbitrecharge.com/termsprivacy' }}
                style={{ flex: 1 }}
            />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    headerbox: {
        height: heightPercentageToDP('8%'),
        width: widthPercentageToDP('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    title: {
        fontSize: RFValue(26),
        fontWeight: '500',
        color: '#1E1E1E',
        fontFamily: 'RobotoCondensed-Bold',
        marginLeft:"auto",
        marginRight:"auto"
    }
})