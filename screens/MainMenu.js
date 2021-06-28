import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import {
  Button, StyleSheet, Text, View, StatusBar, ScrollView,
  BackHandler, TextInput, SafeAreaView
} from 'react-native';
import { GetUrl } from './Utils';

import { personInfo } from './MainMenuScreens/Person';
import { abiturientInfo } from './MainMenuScreens/Abiturient';
import { entryExam } from './MainMenuScreens/EntryExam';
import { aspirantInfo } from './MainMenuScreens/Aspirant';
import { exam } from './MainMenuScreens/Exams';
import { teachersInfo } from './MainMenuScreens/Teachers';
import { candidateExam } from './MainMenuScreens/CandidateExams';
import { prelProtection } from './MainMenuScreens/PrelProtections';
import { protection } from './MainMenuScreens/Protections';
import { abstracts } from './MainMenuScreens/Abstracts';
import { conferences } from './MainMenuScreens/Conferences';
import { publications } from './MainMenuScreens/Publications';

const Drawer = createDrawerNavigator();

let nav;

export function getNavigator() {
  return nav;
}

let faculties;
export function getFaculties() {
  if(!faculties)
    getFacultiesAsync();
  return faculties;
}
const getFacultiesAsync = async () =>{
  let res = await fetch(`http://${GetUrl()}/api/faculty/List`)
  if(res.ok)
    faculties = await res.json();
};

let cathedras;
export function getCathedras() {
  if(!cathedras)
    getCathedrasAsync();
  return cathedras;
}
const getCathedrasAsync = async () =>{
  let res = await fetch(`http://${GetUrl()}/api/cathedra/List`)
  if(res.ok)
    cathedras = await res.json();
};

let specialties;
export function getSpecialties() {
  if(!specialties)
    getSpecialtiesAsync();
  return specialties;
}
const getSpecialtiesAsync = async () =>{
  let res = await fetch(`http://${GetUrl()}/api/specialty/List`)
  if(res.ok)
    specialties = await res.json();
};

let teachers;
export function getTeachers() {
  if(!teachers)
    getTeachersAsync();
  return teachers;
}
const getTeachersAsync = async () =>{
  let res = await fetch(`http://${GetUrl()}/api/teacher/List`)
  if(res.ok)
    teachers = await res.json();
};
let needUpdate = true;
export function getUpdate(){
  return needUpdate;
}
export function setUpdate(b){
  needUpdate = b;
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
    fetch(`http://${GetUrl()}/api/teacher/List`)
    .then(res => {
      if(res.ok)
        res.json().then(r => teachers = r);
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
      <Drawer.Screen name="Exams"
      component={exam}
      options={{
        headerShown: true, headerTitle: "Экзамены и зачёты",
        drawerLabel: "Экзамены и зачёты"
      }} />
      <Drawer.Screen name="Abstracts"
      component={abstracts}
      options={{
        headerShown: true, headerTitle: "Авторефераты",
        drawerLabel: "Авторефераты"
      }} />
      <Drawer.Screen name="Conferences"
      component={conferences}
      options={{
        headerShown: true, headerTitle: "Конференции",
        drawerLabel: "Конференции"
      }} />
      <Drawer.Screen name="Publications"
      component={publications}
      options={{
        headerShown: true, headerTitle: "Публикации",
        drawerLabel: "Публикации"
      }} />
      <Drawer.Screen name="CandidateExams"
      component={candidateExam}
      options={{
        headerShown: true, headerTitle: "Экзамены",
        drawerLabel: "Кандидатские экзамены"
      }} />
      <Drawer.Screen name="PrelProtections"
      component={prelProtection}
      options={{
        headerShown: true, headerTitle: "Предзащита",
        drawerLabel: "Предзащита"
      }} />
      <Drawer.Screen name="Protections"
      component={protection}
      options={{
        headerShown: true, headerTitle: "Защита",
        drawerLabel: "Защита"
      }} />
      <Drawer.Screen name="Teachers"
      component={teachersInfo}
      options={{
        headerShown: true, headerTitle: "Преподаватели",
        drawerLabel: "Преподаватели"
      }} />
    </Drawer.Navigator>
  )
}

function customSlideMenu(props) {
  return (<ScrollView>
    <SafeAreaView style={styles.slideMenu}>
      <View style={{borderBottomWidth: 2, 
        marginBottom: 10, marginTop: 5, paddingBottom: 10}}>
          <Text style={{ fontSize: 32, alignSelf: 'center' }}>
            Аспирант
          </Text>
        </View>
      <DrawerItemList {...props} />
    </SafeAreaView>
  </ScrollView>);
}

const styles = StyleSheet.create({
  slideMenu: {
    flex: 1,
    marginTop: StatusBar.currentHeight
  },
})