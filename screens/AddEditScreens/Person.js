import React, { useEffect, useState } from 'react';
import { 
    Button, StyleSheet, Text, View, BackHandler,
    StatusBar, Switch, TextInput, Alert, Picker, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import moment, {Moment} from 'moment';
import { GetUrl } from '../Utils';

import { getNav } from '../MainMenuScreens/Person';

let nav;
let edit;
let back;

export function AddEditPerson({route, navigation}){
    nav = navigation;
    const [person, setPerson] = useState({
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
    const [isEnabled, setIsEnabled] = React.useState(false);

    useEffect(() => {
        if(route.params && 'person' in route.params){
            setPerson(route.params.person);
            setIsEnabled(route.params.person.workbook);
            edit = true;
        }
        else{
            edit = false;
            back = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    Alert.alert("Подтверждение", "Вы действительно желаете закрыть приложение?", [
                        {
                            text: "Нет",
                            onPress: () => null,
                            style: "cancel"
                        },
                        { text: "Да", onPress: () => BackHandler.exitApp() }
                        ]);
                    return true;
                }
              );
        }
    })
    
    const toggleSwitch = () => {
        setIsEnabled(p => !p);
        person.workbook = !isEnabled;
    };
    return(
        <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
            <TextInput style={styles.textInputs}
            defaultValue={person.lastname}
            onChangeText={v => person.lastname = v} placeholder="Фамилия" />

            <TextInput style={styles.textInputs}
            defaultValue={person.firstname}
            onChangeText={v => person.firstname = v} placeholder="Имя" />

            <TextInput style={styles.textInputs}
            defaultValue={person.patronymic}
            onChangeText={v => person.patronymic = v} placeholder="Отчество" />

            <TextInput style={styles.textInputs}
            defaultValue={person._birthdate}
            onChangeText={v => person._birthdate = v}
            placeholder="Дата рождения" />

            <TextInput style={styles.textInputs}
            defaultValue={person.citizenship}
            onChangeText={v => person.citizenship = v} placeholder="Гражданство" />

            <TextInput style={styles.textInputs}
            defaultValue={person.passport}
            onChangeText={v => person.passport = v} placeholder="Документ" />

            <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                <Text>Наличие трудовой книжки</Text>
                <Switch
                onValueChange={toggleSwitch}
                value={isEnabled} />
            </View>

            <TextInput style={styles.textInputs}
            defaultValue={person.workplaces}
            onChangeText={v => person.workplaces = v} placeholder="Место работы" />

            <TextInput style={styles.textInputs}
            defaultValue={person.contacts}
            onChangeText={v=> person.contacts = v} placeholder="Контакты" />

            <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                <Button style={{marginHorizontal: 10}} 
                onPress={() =>{if(!edit) addPerson(person); else editPerson(person);}} title="Сохранить"/>
            </View>
        </ScrollView>
    );
}

function checkPerson(p){
    if(p.lastname == ''){
        Alert.alert('Ошибка', 'Введите фамилию');
        return false;
    }
    if(p.firstname == ''){
        Alert.alert('Ошибка', 'Введите имя');
        return false;
    }
    if(p.patronymic == ''){
        Alert.alert('Ошибка', 'Введите отчество');
        return false;
    }
    if(!/^\d\d.\d\d.\d\d\d\d$/.test(p._birthdate)){
        Alert.alert('Ошибка', 'Дата не соответствует формату');
        return;
    }
    if(p.citizenship == ''){
        Alert.alert('Ошибка', 'Введите гражданство');
        return false;
    }
    if(p.passport == ''){
        Alert.alert('Ошибка', 'Введите паспортные данные');
        return false;
    }
    if(p.workplaces == '')
        p.workplaces= null;
    if(p.contacts == ''){
        Alert.alert('Ошибка', 'Введите контактные данные');
        return false;
    }

    p.birthdate = moment(p._birthdate, 'DD.MM.yyyy').toISOString();
    return true;
}

function addPerson(p){
    if(!checkPerson(p))
        return;
    fetch(`http://${GetUrl()}/api/person/add`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            back.remove();
            getNav().navigate('Person', {update: false})
            nav.navigate('Menu');
        }
    });
}

function editPerson(p){
    if(!checkPerson(p))
        return;
    fetch(`http://${GetUrl()}/api/person/edit`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            getNav().navigate('Person', {update: false})
            nav.navigate('Menu');
        }
    });
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