import React, { useEffect, useState } from 'react';
import { 
    Button, StyleSheet, Text, View, BackHandler,
    StatusBar, Switch, TextInput, Alert, Picker, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import moment, {Moment} from 'moment';
import { GetUrl } from '../Utils';

import { getNav, setUpdate } from '../MainMenuScreens/Publications';

let nav;
let edit;

export function AddEditPublication({route, navigation}){
    nav = navigation;
    const [publication, setPublication] = useState({
        subject: '',
        journal: '',
        number: '',
        date: '',
        _date: '',
        page: '',
    });

    useEffect(() => {
        if(route.params && 'publication' in route.params){
            setPublication(route.params.publication);
            edit = true;
        }
        else{
            edit = false;
        }
    })
    
    return(
        <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
            <TextInput style={styles.textInputs}
            defaultValue={publication.subject}
            onChangeText={v => publication.subject = v} placeholder="Тема публикации" />

            <TextInput style={styles.textInputs}
            defaultValue={publication.journal}
            onChangeText={v => publication.journal = v} placeholder="Журнал" />

            <TextInput style={styles.textInputs}
            defaultValue={publication.number}
            onChangeText={v => publication.number = v} placeholder="Номер" />

            <TextInput style={styles.textInputs}
            defaultValue={publication.page}
            onChangeText={v => publication.page = v} placeholder="Страница" />

            <TextInput style={styles.textInputs}
            defaultValue={publication._date}
            onChangeText={v => publication._date = v}
            placeholder="Дата" />

            <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                <Button style={{marginHorizontal: 10}} 
                onPress={() =>{if(!edit) addPublication(publication); 
                else editPublication(publication);}} title="Сохранить"/>
            </View>
        </ScrollView>
    );
}

function checkPublication(p){
    if(p.subject == ''){
        Alert.alert('Ошибка', 'Введите тему');
        return false;
    }
    if(p.place == ''){
        Alert.alert('Ошибка', 'Введите место');
        return false;
    }
    if(!/^\d\d.\d\d.\d\d\d\d$/.test(p._date)){
        Alert.alert('Ошибка', 'Дата не соответствует формату');
        return;
    }
    if(!/^\d+$/.test(p.number)){
        Alert.alert('Ошибка', 'Номер не соответствует формату');
        return;
    }
    if(!/^\d+$/.test(p.page)){
        Alert.alert('Ошибка', 'Страница не соответствует формату');
        return;
    }
    
    p.number = +p.number;
    p.page = +p.page;
    p.date = moment(p._date, 'DD.MM.yyyy kk:mm').toISOString(true);
    return true;
}

function addPublication(p){
    if(!checkPublication(p))
        return;
    fetch(`http://${GetUrl()}/api/publication/add`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Publications');
            nav.navigate('Menu');
        }
    });
}

function editPublication(p){
    if(!checkPublication(p))
        return;
    fetch(`http://${GetUrl()}/api/publication/edit?id=${p.id}`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Publications')
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