import React, { useEffect, useState } from 'react';
import { 
    Button, StyleSheet, Text, View, BackHandler,
    StatusBar, Switch, TextInput, Alert, Picker, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import moment, {Moment} from 'moment';
import { GetUrl } from '../Utils';

import { getNav, setUpdate } from '../MainMenuScreens/Conferences';

let nav;
let edit;

export function AddEditConference({route, navigation}){
    nav = navigation;
    const [conference, setConference] = useState({
        subject: '',
        place: '',
        datetime: '',
        _datetime: ''
    });

    useEffect(() => {
        if(route.params && 'conference' in route.params){
            setConference(route.params.conference);
            edit = true;
        }
        else{
            edit = false;
        }
    })
    
    return(
        <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
            <TextInput style={styles.textInputs}
            defaultValue={conference.subject}
            onChangeText={v => conference.subject = v} placeholder="Тема конференции" />

            <TextInput style={styles.textInputs}
            defaultValue={conference.place}
            onChangeText={v => conference.place = v} placeholder="Место конференции" />

            <TextInput style={styles.textInputs}
            defaultValue={conference._datetime}
            onChangeText={v => conference._datetime = v}
            placeholder="Дата и время" />

            <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                <Button style={{marginHorizontal: 10}} 
                onPress={() =>{if(!edit) addConference(conference); 
                else editConference(conference);}} title="Сохранить"/>
            </View>
        </ScrollView>
    );
}

function checkConference(p){
    if(p.subject == ''){
        Alert.alert('Ошибка', 'Введите тему');
        return false;
    }
    if(p.place == ''){
        Alert.alert('Ошибка', 'Введите место');
        return false;
    }
    if(!/^\d\d.\d\d.\d\d\d\d \d\d:\d\d$/.test(p._datetime)){
        Alert.alert('Ошибка', 'Дата и время не соответствует формату');
        return;
    }
    
    p.datetime = moment(p._datetime, 'DD.MM.yyyy kk:mm').toISOString(true);
    return true;
}

function addConference(p){
    if(!checkConference(p))
        return;
    fetch(`http://${GetUrl()}/api/conference/add`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Conferences', {update: false})
            nav.navigate('Menu');
        }
    });
}

function editConference(p){
    if(!checkConference(p))
        return;
    fetch(`http://${GetUrl()}/api/conference/edit?id=${p.id}`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Conferences', {update: false})
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