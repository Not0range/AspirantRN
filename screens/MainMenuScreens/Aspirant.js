import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button, StyleSheet, Text, View, StatusBar, BackHandler, TextInput } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

import { getNavigator, getSpecialties } from '../MainMenu';

export function aspirantInfo({route}){
    const [loading, setLoading] = useState(true);
    const [aspirant, setAspirant] = useState({
        updated: route.params && 'update' in route.params && route.params.update,
        foreignLanguage: '',
        enducationForm: '',
        enducationDirection: '',
        specialtyId: 0,
        decree: '',
        dissertationTheme: '',
        workbook: false,
        teacherId: 0
    });

    useEffect(() => {
        if (!aspirant.updated) {
            setLoading(true);
            fetch(`http://${GetUrl()}/api/Aspirant/Self`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            r.updated = true;
                            setAspirant(r);
                            setLoading(false);
                        });
                    }
                });
        }
    })

    return (
        <View style={{ flex: 1, margin: 10 }}>
            {(loading? <Text style={{alignSelf: 'center'}}>Загрузка...</Text> :
            <View>
                <Text>Изучаемый язык: {aspirant.foreignLanguage}</Text>
                <Text>Форма обучения: {aspirant.enducationForm}</Text>
                <Text>Направление обучения: {aspirant.enducationDirection}</Text>
                <Text>Специальность: {getSpecialty(aspirant.specialtyId)}</Text>
                <Text>Приказ: {aspirant.decree}</Text>
                <Text>Тема диссертации: {aspirant.dissertationTheme}</Text>
                <Text>Руководитель: </Text>
            </View>)}
        </View>
    );
}

function getSpecialty(id){
    let s = getSpecialties().find(i => i.id == id);
    if(s == null)
        return '';
    else
        return s.title;
}