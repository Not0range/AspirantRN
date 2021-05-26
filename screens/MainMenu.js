import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button, StyleSheet, Text, View, StatusBar, useWindowDimensions, TextInput  } from 'react-native';

const Drawer = createDrawerNavigator();

export function Menu(){
  return(
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="Table1" component={Table1} />
    </Drawer.Navigator>
  )
}

function Main(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Main</Text>
    </View>
  );
}

function Table1(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Table1</Text>
    </View>
  );
}