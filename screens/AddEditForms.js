import React from 'react';
import { Button, StyleSheet, Text, View, StatusBar, Switch, TextInput, Alert  } from 'react-native';
import 'react-native-gesture-handler';
import Moment from 'moment';

import { GetUrl } from './Utils'

let nav;

let individual = null;
let edit = false;

export function AddEditIndividual({route, navigation}){
    nav = navigation;
    if(route.params != null){
        individual = route.params;
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
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(p => !p);
    return(
        <View style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
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
            defaultValue={individual.birthdate}
            onChangeText={(f, v)=>individual.birthdate = f}
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
        </View>
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
    if(!/^\d\d.\d\d.\d\d\d\d$/.test(individual.birthdate)){
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
    if(individual.workplaces == ''){
        Alert.alert('Ошибка', 'Введите место работы');
        return;
    }
    if(individual.contacts == ''){
        Alert.alert('Ошибка', 'Введите контактные данные');
        return;
    }
    if(!edit){
        individual.birthdate = Moment(Date.parse(`${individual.birthdate.substr(6, 4)}-` +
        `${individual.birthdate.substr(3, 2)}-${individual.birthdate.substr(0, 2)}`))
        .toISOString();
        console.log(JSON.stringify(individual));
        fetch(`http://${GetUrl()}/api/person/add`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json;charset=utf-8'
            },
            body: JSON.stringify(individual)
        }).then(res => {
            console.log(JSON.stringify(res));
            if(res.ok)
                nav.navigate('Menu', individual);
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
            console.log(JSON.stringify(res));
            if(res.ok)
                nav.navigate('Menu', individual);
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
