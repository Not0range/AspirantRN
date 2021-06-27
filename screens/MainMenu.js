import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import {
  Button, StyleSheet, Text, View, StatusBar, ScrollView,
  BackHandler, TextInput, SafeAreaView
} from 'react-native';
import { GetUrl } from './Utils';
import Moment from 'moment';

import { personInfo } from './MainMenuScreens/Person';
import { abiturientInfo } from './MainMenuScreens/Abiturient';
import { entryExam } from './MainMenuScreens/EntryExam';
import { aspirantInfo } from './MainMenuScreens/Aspirant';

const Drawer = createDrawerNavigator();

let nav;

export function getNavigator() {
  return nav;
}

let faculties;
export function getFaculties() {
  return faculties;
}

let cathedras;
export function getCathedras() {
  return cathedras;
}

let specialties;
export function getSpecialties() {
  return specialties;
}

let backHandler;

export function Menu({ route, navigation }) {
  nav = navigation;

  useEffect(() => {
    fetch(`http://${GetUrl()}/api/faculty/List`)
    .then(res => {
      if(res.ok)
        res.json().then(r => faculties = r);
    });
    fetch(`http://${GetUrl()}/api/cathedra/List`)
    .then(res => {
      if(res.ok)
        res.json().then(r => cathedras = r);
    });
    fetch(`http://${GetUrl()}/api/specialty/List`)
    .then(res => {
      if(res.ok)
        res.json().then(r => specialties = r);
    });
  })

  return (
    <Drawer.Navigator
      drawerContent={customSlideMenu}>
      <Drawer.Screen name="Person"
        component={personInfo}
        options={{
          headerShown: true, headerTitle: "Данные о физ. лице",
          drawerLabel: "Данные о физ. лице"
        }} />
      <Drawer.Screen name="Abiturient"
        component={abiturientInfo}
        options={{
          headerShown: true, headerTitle: "Данные об абитуриенте",
          drawerLabel: "Данные об абитуриенте"
        }} />
      <Drawer.Screen name="EntryExams"
      component={entryExam}
      options={{
        headerShown: true, headerTitle: "Экзамены",
        drawerLabel: "Вступительные экзамены"
      }} />
      <Drawer.Screen name="Aspirant"
      component={aspirantInfo}
      options={{
        headerShown: true, headerTitle: "Данные об аспиранте",
        drawerLabel: "Данные об аспиранте"
      }} />
    </Drawer.Navigator>
  )
}

function other() {
  return (<View style={{ flex: 1 }}><Text>sdsadsa</Text></View>)
}

function customSlideMenu(props) {
  return (<ScrollView>
    <SafeAreaView style={styles.slideMenu}>
      <Text style={{ fontSize: 32, marginBottom: 10 }}>Аспирант</Text>
      <DrawerItemList {...props} />
    </SafeAreaView>
  </ScrollView>);
}

const styles = StyleSheet.create({
  slideMenu: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    marginLeft: 10
  },
})