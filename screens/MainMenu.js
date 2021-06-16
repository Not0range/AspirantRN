import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button, StyleSheet, Text, View, StatusBar, BackHandler, TextInput  } from 'react-native';
import { GetUrl } from './Utils';
import Moment from 'moment';

const Drawer = createDrawerNavigator();
let nav;

let individual={};

let aspirant = null;

let teachers = null;

let backHandler;

export function Menu({ route, navigation}){
  nav = navigation;
  individual = route.params[0];
  if(route.params[1])
    aspirant = route.params[1];
    
  if(!backHandler){
    backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        backHandler.remove();
        nav.navigate('MainScreen');
        return true;
      }
    );
  }

  useEffect(() => {
    if(aspirant == null){
      fetch(`http://${GetUrl()}/api/Aspirant/Get`)
      .then(res => {
        if(res.status == 200){
          res.json().then(r => {
            aspirant = r;
          });
        }
      });
    }
    if(teachers == null){
      fetch(`http://${GetUrl()}/api/teacher/get`)
      .then(res => {
        if(res.status == 200){
          res.json().then(r => {
            teachers = r;
          });
        }
      })
    }
  })
  
  return(
    <Drawer.Navigator >
      <Drawer.Screen name="Информация о физ. лице" component={individualInfo} />
      <Drawer.Screen name="Вступительные экзамены" component={entryExams} />
      <Drawer.Screen name="Информация об аспиранте" component={aspirantInfo} />
      <Drawer.Screen name="Список преподавателей" component={teacherList} />
      <Drawer.Screen name="Экзамены/зачёты" component={examsList} />
    </Drawer.Navigator>
  )
}

function individualInfo(){
  const [indiv, setIndividual] = useState({
    lastname: '',
    firstname: '',
    patronymic: '',
    birthdate: '',
    citizenship: '',
    passport: '',
    workbook: false,
    workplaces: '',
    contacts: '',
    _birthdate: ''
  });
  useEffect(() => {
    if(individual != null){
      individual._birthdate = Moment(individual.birthdate).format('DD.MM.yyyy');
      setIndividual(individual);
    }
  });
  return (
    <View style={{ flex: 1, margin: 10, paddingTop: StatusBar.currentHeight}}>
      <Text style={styles.header}>Данные о физическом лице</Text>
      <Text>Фамилия: {indiv.lastname}</Text>
      <Text>Имя: {indiv.firstname}</Text>
      <Text>Отчество: {indiv.patronymic}</Text>
      <Text>Дата рождения: {`${indiv._birthdate}`}</Text>
      <Text>Гражданство: {indiv.citizenship}</Text>
      <Text>Документ: {indiv.passport}</Text>
      <Text>Трудовая книжка: {indiv.workbook ? 'В наличии': 'Отсутствует'}</Text>
      <Text>Место работы: {indiv.workplaces}</Text>
      <Text>Контакты: {indiv.contacts}</Text>
      <View style={{marginTop: 25}}>
        <Button title='Редактировать' onPress={() => {
          backHandler.remove();
          nav.navigate('Individual', [indiv]);
        }}></Button>
      </View>
    </View>
  );
}

function aspirantInfo(){
  const [aspir, setAspirant] = useState({
    foreignLanguage: '',
    enducationForm: '',
    enducationDirection: '',
    specialty: '',
    cathedra: '',
    faculty: '',
    decree: '',
    dissertationTheme: '',
    teacherId: 0,
    new: true
  });
  const [teacher, setTeacher] = useState('');
  useEffect(() =>{
    if(aspirant != null){
      aspirant.new = false;
      setAspirant(aspirant);
    }
    if(teachers != null){
      let e = teachers.find(i => i.id == aspir.teacherId);
      if(e){
        setTeacher(`${e.faculty}. ${e.cathedra}: ${e.lastname} ` +
          `${e.firstname[0]}. ${e.patronymic[0]}.`);
      }
    }
  });
  return (
    <View style={{ flex: 1, margin: 10, paddingTop: StatusBar.currentHeight}}>
      <Text style={styles.header}>Данные об аспиранте</Text>
      <Text>Изучаемый язык: {aspir.foreignLanguage}</Text>
      <Text>Форма обучения: {aspir.enducationForm}</Text>
      <Text>Направление обучения: {aspir.enducationDirection}</Text>
      <Text>Специальность: {aspir.specialty}</Text>
      <Text>Кафедра: {aspir.cathedra}</Text>
      <Text>Факультет: {aspir.faculty}</Text>
      <Text>Приказ о зачислении: {aspir.decree}</Text>
      <Text>Тема диссертации: {aspir.dissertationTheme}</Text>
      <Text>Руководитель: {teacher}</Text> 
      <View style={{marginTop: 25}}>
        <Button title='Редактировать' onPress={() => {
          backHandler.remove();
          nav.navigate('Aspirant', [individual, aspir, teachers]);
        }}></Button>
      </View>
    </View>
  );
}

function entryExams(){
  return (
    <View style={{ flex: 1, margin: 10, paddingTop: StatusBar.currentHeight}}>
    <Text style={styles.header}>Вступительные экзамены</Text>
    </View>
  );
}

function teacherList(){
  const [ts, setTeachers] = useState([]);
  useEffect(() =>{
    if(teachers != null){
      setTeachers(teachers);
    }
  });
  return (
    <View style={{ flex: 1, margin: 10, paddingTop: StatusBar.currentHeight}}>
      <Text style={styles.header}>Данные о преподавателях</Text>
      {TeachersComp(ts)}
    </View>
  );
}

const TeachersComp = arg => {
  if(arg.length > 0)
    return (arg.map(e => (
      <View key={e.id} style={styles.teacher}>
        <Text>{e.lastname} {e.firstname} {e.patronymic}</Text>
        <Text>{e.cathedra} {e.faculty}</Text>
      </View>
    )));
}

function examsList(){
  return (
    <View style={{ flex: 1, margin: 10, paddingTop: StatusBar.currentHeight}}>
      <Text style={styles.header}>Зачёты/экзамены</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center'
  },
  teacher: {
    marginVertical: 1,
    marginHorizontal: 5,
    padding: 10,
    borderColor: '#fff',
    borderRadius: 6,
    borderWidth: 2
  }
});