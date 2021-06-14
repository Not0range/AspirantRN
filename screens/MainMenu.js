import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button, StyleSheet, Text, View, StatusBar, useWindowDimensions, TextInput  } from 'react-native';

const Drawer = createDrawerNavigator();
let nav;

let individual={};

export function Menu({ route, navigation}){
  nav = navigation;
  individual = route.params;
  return(
    <Drawer.Navigator>
      <Drawer.Screen name="Информация о физ. лице" component={individualInfo} />
      <Drawer.Screen name="Информация о аспиранте" component={aspirantInfo} />
      <Drawer.Screen name="Вступительные экзамены" component={entryExams} />
      <Drawer.Screen name="Список руководителей" component={executiveList} />
    </Drawer.Navigator>
  )
}

function individualInfo(){
  return (
    <View style={{ flex: 1, margin: 10, paddingTop: StatusBar.currentHeight}}>
      <Text style={styles.header}>Данные о физическом лице</Text>
      <Text>Фамилия: {individual.lastname}</Text>
      <Text>Имя: {individual.firstname}</Text>
      <Text>Отчество: {individual.patronymic}</Text>
      <Text>Дата рождения: {`${individual.birthdate.substr(8, 2)}.${individual.birthdate.substr(5, 2)}` + 
        `.${individual.birthdate.substr(0, 4)}`}</Text>
      <Text>Гражданство: {individual.citizenship}</Text>
      <Text>Документ: {individual.passport}</Text>
      <Text>Трудовая книжка: {individual.workbook ? 'В наличии': 'Отсутствует'}</Text>
      <Text>Место работы: {individual.workplaces}</Text>
      <Text>Контакты: {individual.contacts}</Text>
      <View style={{marginTop: 25}}>
        <Button title='Редактировать' onPress={openIndividual}></Button>
      </View>
    </View>
  );
}

function aspirantInfo(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Тут аспиранты</Text>
    </View>
  );
}

function entryExams(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Тут экзамены</Text>
    </View>
  );
}

function executiveList(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Руководители</Text>
    </View>
  );
}

function openIndividual(){
  nav.navigate('Individual', individual);
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    marginBottom: 10
  }
});