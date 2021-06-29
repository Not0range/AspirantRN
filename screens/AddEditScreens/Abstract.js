import React, { useEffect, useState } from 'react';
import { 
    Button, StyleSheet, Text, View, BackHandler,
    StatusBar, Switch, TextInput, Alert, Picker, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import moment, {Moment} from 'moment';
import { GetUrl } from '../Utils';

import { getNav, setUpdate } from '../MainMenuScreens/Abstracts';

let nav;
let edit;

export function AddEditAbstract({route, navigation}){
    nav = navigation;
    const [abstract, setAbstract] = useState({
        subject: '',
        place: '',
        datetime: '',
        _datetime: ''
    });

    useEffect(() => {
        if(route.params && 'abstract' in route.params){
            setAbstract(route.params.abstract);
            edit = true;
        }
        else{
            edit = false;
        }
    })
    
    return(
        <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
            <TextInput style={styles.textInputs}
            defaultValue={abstract.subject}
            onChangeText={v => abstract.subject = v} placeholder="Тема автореферата" />

            <TextInput style={styles.textInputs}
            defaultValue={abstract.place}
            onChangeText={v => abstract.place = v} placeholder="Место защиты" />

            <TextInput style={styles.textInputs}
            defaultValue={abstract._datetime}
            onChangeText={v => abstract._datetime = v}
            placeholder="Дата и время" />

            <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                <Button style={{marginHorizontal: 10}} 
                onPress={() =>{if(!edit) addAbstract(abstract); 
                else editAbstract(abstract);}} title="Сохранить"/>
            </View>
        </ScrollView>
    );
}

function checkAbstract(p){
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

function addAbstract(p){
    if(!checkAbstract(p))
        return;
    fetch(`http://${GetUrl()}/api/abstract/add`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Abstracts');
            nav.navigate('Menu');
        }
    });
}

function editAbstract(p){
    if(!checkAbstract(p))
        return;
    fetch(`http://${GetUrl()}/api/abstract/edit?id=${p.id}`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify(p)
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Abstracts')
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