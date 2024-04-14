import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TabIcons} from "./shares/Icons"
// Import Navigators from React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createDrawerNavigator } from 'react-navigation-drawer';

//import CustomSidebarMenu from './shares/Menu/index';



// Import Screens
import HomeHeader from './shares/Home_Header';
import Home1 from './screens/home/home1';
import Home2 from './screens/home/home2';
import Home3 from './screens/home/home3';
import HomeSMS from './screens/home/homeSms';
import HomeRequest from './screens/home/homeRequest';


import Login from './screens/auth/login';
import Signup from './screens/auth/signup';
import Verify_otp from './screens/auth/verify_otp';

import Topup from './screens/topup/index';
import SMS from './screens/sms';
import History from './screens/history';
import Request from './screens/request';
import Account from './screens/account';

import My_Account from './screens/account/my-account'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
//const Drawer = createDrawerNavigator();




export const HomeRoutes = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName='Home1' >
      
      <Stack.Screen name='Home1' component={Home1} options={{ headerShown: false }} />
      <Stack.Screen name='Home2' component={Home2} options={{ headerShown: false }} />
      <Stack.Screen name='Home3' component={Home3} options={{ headerShown: false }} />
      <Stack.Screen name='HomeSMS' component={HomeSMS} options={{ headerShown: false }} />
      <Stack.Screen name='HomeRequest' component={HomeRequest} options={{ headerShown: false }} />
      <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <Stack.Screen name='Verify_otp' component={Verify_otp} options={{ headerShown: false }} />
      <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
      
    </Stack.Navigator>
  );
}

export const BottomTabRoutes = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName='Topup'
      screenOptions={({route}) =>({
        // tabBarActiveBackgroundColor:'#01282E',
        // tabBarInactiveBackgroundColor:'#01282E',
        tabBarActiveTintColor: '#428BC1',
        tabBarInactiveTintColor: '#707070',
        tabBarHideOnKeyboard:true,
        headerShown: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? '1%' : 0,
          height: hp('8%'),
          backgroundColor: '#ffffff',
          paddingBottom: '1.7%',
          paddingTop: '2%'
        },
        tabBarIcon: ({focused}) => {
          let iconName;

           if (route.name === 'Topup') {
            iconName =TabIcons.home
            iconName = focused ? TabIcons.homeActive : TabIcons.home;
          } else if (route.name === 'SMS') {
            iconName = TabIcons.sms
            iconName = focused ? TabIcons.smsActive : TabIcons.sms;
          } 
           else if (route.name === 'Request') {
             iconName = TabIcons.request
             iconName = focused ? TabIcons.requestActive : TabIcons.request;
           }
          
          else if (route.name === 'Account') {
            iconName = TabIcons.account
            iconName = focused ? TabIcons.accountActive : TabIcons.account;
          } else if (route.name === 'History') {
            iconName =TabIcons.history
            iconName = focused ? TabIcons.historyActive : TabIcons.history;
            
          }
          return (
            <Image
              source={iconName}
              resizeMode="contain"
              style={{height: hp('2.5%'), width: wp('6.5%'),}}
            />
          );
        },

      })}>
      <Tab.Screen
        name="Topup"
        component={Topup}
        options={{
          tabBarLabel: 'HOME',
          tabBarLabelStyle: {
            fontSize:RFValue(12),
            fontWeight:'400',
            fontFamily:'RobotoCondensed-Regular',
            },
          // tabBarIcon: ({}) => {
          //   return (
          //     <Image resizeMode={'contain'}
          //       style={{ height: hp('3%'), width: wp('6%') }}
          //       source={require('./assets/tabIcons/homeActive.png')} />
          //   )
          // }

        }} />
      <Tab.Screen 
      name="SMS"
      component={SMS}
      options={{
        tabBarLabel: 'SMS',
        tabBarLabelStyle: {
          fontSize:RFValue(12),
          fontWeight:'400',
          fontFamily:'RobotoCondensed-Regular',
          },
        // tabBarIcon: () => {
        //   return (
        //     <Image resizeMode={'contain'}
        //       style={{ height: hp('3%'), width: wp('8%'), }}
        //       source={require('./assets/tabIcons/sms.png')} />
        //   )
        // }

      }}
      />
      <Tab.Screen 
      name="Request"
      component={Request} 
      options={{
        tabBarLabel: 'REQUEST',
        tabBarLabelStyle: {
          fontSize:RFValue(12),
          fontWeight:'400',
          fontFamily:'RobotoCondensed-Regular',
          },
        // tabBarIcon: () => {
        //   return (
        //     <Image resizeMode={'contain'}
        //       style={{ height: hp('3%'), width: wp('6%') }}
        //       source={require('./assets/tabIcons/request.png')} />
        //   )
        // }

      }}/>
      <Tab.Screen name="Account" component={Account} 
      options={{
        tabBarLabel: 'ACCOUNT',
        tabBarLabelStyle: {
          fontSize:RFValue(12),
          fontWeight:'400',
          fontFamily:'RobotoCondensed-Regular',
          },
        // tabBarIcon: () => {
        //   return (
        //     <Image resizeMode={'contain'}
        //       style={{ height: hp('3%'), width: wp('6%') }}
        //       source={require('./assets/tabIcons/account.png')} />
        //   )
        // }

      }}/>
      <Tab.Screen name="History" component={History} 
      options={{
        tabBarLabel: 'HISTORY',
        tabBarLabelStyle: {
          fontSize:RFValue(12),
          fontWeight:'400',
          fontFamily:'RobotoCondensed-Regular',
          },
        // tabBarIcon: () => {
        //   return (
        //     <Image resizeMode={'contain'}
        //       style={{ height: hp('3%'), width: wp('6%') }}
        //       source={require('./assets/tabIcons/history.png')} />
        //   )
        // }

      }}/>
    </Tab.Navigator>
  );
}




export const NavigationRoutes = ({ navigation }) => {
  return (
    <Stack.Navigator >

      <Stack.Screen name='HomeRoutes' component={HomeRoutes} options={{ headerShown: false }} />
      <Stack.Screen name='BottomTabRoutes' component={BottomTabRoutes} options={{ headerShown: false }} />

      <Stack.Screen name='My_Account' component={My_Account} options={{ headerShown: false }} />

    </Stack.Navigator>
  )

}

// export const DrawerNavigatorRoutes = (props) => {
//   console.log('props to check', props)
//   return (
//     <Drawer.Navigator
//       drawerContentOptions={{
//         activeTintColor: '#cee1f2',
//         color: '#cee1f2',
//         itemStyle: { marginVertical: 5, color: 'white' },
//         labelStyle: {
//           color: '#d8d8d8',
//         },
//       }}

//       screenOptions={{ headerShown: false }}
//       drawerContent={() => <CustomSidebarMenu navigation={props} />}>
//       <Drawer.Screen
//         name="NavigationRoutes"
//         options={{ drawerLabel: 'Home Screen' }}
//         component={NavigationRoutes}
//       />
//       {/* <Drawer.Screen
//         name="settingScreenStack"
//         options={{drawerLabel: 'Setting Screen'}}
//         component={settingScreenStack}
//         // drawerPosition='right' 
//       /> */}
//     </Drawer.Navigator>
//   );
//};
//export default NavigationRoutes;
