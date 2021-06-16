import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, StatusBar, Switch, TextInput, Alert, Picker, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import Moment from 'moment';

import { GetUrl } from './Utils'

let nav;

let individual = null;
let aspirant = null;
let teachers = null;
let edit = false;

export function AddEditIndividual({route, navigation}){
    edit = false;
    nav = navigation;
    if(route.params != null){
        individual = route.params[0];
        edit = true;
    }
    else {
        individual = {
            lastname: '',
            firstname: '',
            patronymic: '',
            birthdate: '',
            citizenship: '',
            passport: '',
            workbook: false,
            workplaces: '',
            contacts: ''
        };
    }
    const [isEnabled, setIsEnabled] = React.useState(individual.workbook);
    const toggleSwitch = () => {
        setIsEnabled(p => !p);
        individual.workbook = !isEnabled;
    };
    return(
        <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
            <TextInput style={styles.textInputs}
            defaultValue={individual.lastname}
            onChangeText={v=>individual.lastname = v} placeholder="Фамилия" />

            <TextInput style={styles.textInputs}
            defaultValue={individual.firstname}
            onChangeText={v=>individual.firstname = v} placeholder="Имя" />

            <TextInput style={styles.textInputs}
            defaultValue={individual.patronymic}
            onChangeText={v=>individual.patronymic = v} placeholder="Отчество" />

            <TextInput style={styles.textInputs}
            defaultValue={individual._birthdate}
            onChangeText={(f, v)=>individual._birthdate = f}
            placeholder="Дата рождения" />

            <TextInput style={styles.textInputs}
            defaultValue={individual.citizenship}
            onChangeText={v=>individual.citizenship = v} placeholder="Гражданство" />

            <TextInput style={styles.textInputs}
            defaultValue={individual.passport}
            onChangeText={v=>individual.passport = v} placeholder="Документ" />

            <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                <Text>Наличие трудовой книжки</Text>
                <Switch
                onValueChange={toggleSwitch}
                value={isEnabled} />
            </View>

            <TextInput style={styles.textInputs}
            defaultValue={individual.workplaces}
            onChangeText={v=>individual.workplaces = v} placeholder="Место работы" />

            <TextInput style={styles.textInputs}
            defaultValue={individual.contacts}
            onChangeText={v=>individual.contacts = v} placeholder="Контакты" />

            <View style={{paddingHorizontal: 10}}>
                <Button style={{marginHorizontal: 10}} onPress={Individual} title="Сохранить"/>
            </View>
        </ScrollView>
    );
}

export function AddEditAspirant({route, navigation}){
    nav = navigation;
    individual = route.params[0];
    aspirant = route.params[1];
    teachers = route.params[2] != null ? route.params[2] : [];
    edit = !aspirant.new;
    console.log(edit);

    const [t, setTeacher] = useState(aspirant.teacherId);
    return(
        <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
            <TextInput style={styles.textInputs}
            defaultValue={aspirant.foreignLanguage}
            onChangeText={v=>aspirant.foreignLanguage = v} placeholder="Изучаемый язык" />

            <TextInput style={styles.textInputs}
            defaultValue={aspirant.enducationForm}
            onChangeText={v=>aspirant.enducationForm = v} placeholder="Форма обучения" />

            <TextInput style={styles.textInputs}
            defaultValue={aspirant.enducationDirection}
            onChangeText={v=>aspirant.enducationDirection = v} placeholder="Направление обучения" />

            <TextInput style={styles.textInputs}
            defaultValue={aspirant.specialty}
            onChangeText={v=>aspirant.specialty = v} placeholder="Специальность" />

            <TextInput style={styles.textInputs}
            defaultValue={aspirant.cathedra}
            onChangeText={v=>aspirant.cathedra = v} placeholder="Кафедра" />

            <TextInput style={styles.textInputs}
            defaultValue={aspirant.faculty}
            onChangeText={v=>aspirant.faculty = v} placeholder="Факультет" />

            <TextInput style={styles.textInputs}
            defaultValue={aspirant.decree}
            onChangeText={v=>aspirant.decree = v} placeholder="Приказ о зачислении" />

            <TextInput style={styles.textInputs}
            defaultValue={aspirant.dissertationTheme}
            onChangeText={v=>aspirant.dissertationTheme = v} placeholder="Тема диссертации" />

            <Text>Руководитель</Text>
            <Picker style={styles.textInputs}
            selectedValue={t}
            onValueChange={(v, i) => {
                setTeacher(v);
                aspirant.teacherId = v;
            }}>
                <Picker.Item label="" value="0"/>
                {teachers.map(e => (
                <Picker.Item key={`pi${e.id}`}
                label={`${e.faculty}. ${e.cathedra}: ${e.lastname} ${e.firstname[0]}. ${e.patronymic[0]}.`} 
                value={e.id}/>
                ))}
            </Picker>

            <View style={{paddingHorizontal: 10}}>
                <Button style={{marginHorizontal: 10}} onPress={Aspirant} title="Сохранить"/>
            </View>
        </ScrollView>
    );
}

function Individual(){
    if(individual.lastname == ''){
        Alert.alert('Ошибка', 'Введите фамилию');
        return;
    }
    if(individual.firstname == ''){
        Alert.alert('Ошибка', 'Введите имя');
        return;
    }
    if(individual.patronymic == ''){
        Alert.alert('Ошибка', 'Введите отчество');
        return;
    }
    if(!/^\d\d.\d\d.\d\d\d\d$/.test(individual._birthdate)){
        Alert.alert('Ошибка', 'Дата не соответствует формату');
        return;
    }
    if(individual.citizenship == ''){
        Alert.alert('Ошибка', 'Введите гражданство');
        return;
    }
    if(individual.passport == ''){
        Alert.alert('Ошибка', 'Введите паспортные данные');
        return;
    }
    if(individual.workplaces == '')
        individual.workplaces= null;
    if(individual.contacts == ''){
        Alert.alert('Ошибка', 'Введите контактные данные');
        return;
    }

    if(!edit){
        fetch(`http://${GetUrl()}/api/person/add`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json;charset=utf-8'
            },
            body: JSON.stringify(individual)
        }).then(res => {
            if(res.ok)
                nav.navigate('Menu', [individual]);
        });
    }
    else{
        fetch(`http://${GetUrl()}/api/person/edit`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json;charset=utf-8'
            },
            body: JSON.stringify(individual)
        }).then(res => {
            if(res.ok){
                nav.push('Menu', [individual]);
            }
        });
    }
}

function Aspirant(){
    if(aspirant.foreignLanguage == ''){
        Alert.alert('Ошибка', 'Введите изучаемый язык');
        return;
    }
    if(aspirant.enducationForm == ''){
        Alert.alert('Ошибка', 'Введите форму обучения');
        return;
    }
    if(aspirant.enducationDirection == ''){
        Alert.alert('Ошибка', 'Введите направление');
        return;
    }
    if(aspirant.specialty == ''){
        Alert.alert('Ошибка', 'Введите специальность');
        return;
    }
    if(aspirant.cathedra == ''){
        Alert.alert('Ошибка', 'Введите кафедру');
        return;
    }
    if(aspirant.faculty == ''){
        Alert.alert('Ошибка', 'Введите факультет');
        return;
    }
    if(aspirant.decree == ''){
        Alert.alert('Ошибка', 'Введите приказ');
        return;
    }
    if(aspirant.dissertationTheme == ''){
        Alert.alert('Ошибка', 'Введите тему диссертации');
        return;
    }
    if(aspirant.teacherId == 0){
        Alert.alert('Ошибка', 'Выберите руководителя');
        return;
    }
    if(!edit){
        fetch(`http://${GetUrl()}/api/aspirant/add`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json;charset=utf-8'
            },
            body: JSON.stringify(aspirant)
        }).then(res => {
            if(res.ok)
                nav.push('Menu', [individual, aspirant, teachers]);
        });
    }
    else{
        fetch(`http://${GetUrl()}/api/aspirant/edit`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json;charset=utf-8'
            },
            body: JSON.stringify(aspirant)
        }).then(res => {
            if(res.ok){
                nav.push('Menu', [individual, aspirant]);
            }
        });
    }
}

const styles = StyleSheet.create({
    textInputs: {
      marginVertical: 5,
      padding: 10,
      borderColor: '#fff',
      borderRadius: 6,
      borderWidth: 2
    }
  });
