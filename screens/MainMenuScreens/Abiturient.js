import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
    StatusBar, BackHandler, TextInput, ScrollView } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

import { getNavigator, getFaculties, getCathedras, getSpecialties } from '../MainMenu';

export function abiturientInfo({route}) {
    const [loading, setLoading] = useState(true);
    const [abiturient, setAbiturient] = useState({
        updated: route.params && 'update' in route.params && route.params.update,
        specialties: []
    });

    useEffect(() => {
        if (!abiturient.updated) {
            setLoading(true);
            fetch(`http://${GetUrl()}/api/Abiturient/Self`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            r.updated = true;
                            setAbiturient(r);
                            setLoading(false);
                        });
                    }
                });
        }
    })

    return (
        <ScrollView style={{ flex: 1, margin: 10 }}>
            {loading ? <Text style={{alignSelf: 'center'}}>Загрузка...</Text> : 
            <View>
                <Text style={{fontSize: 20, marginBottom: 20}}>Выбранные специальности для поступления:</Text>
                {specialtiesList(abiturient.specialties)}
                
            </View>}
        </ScrollView>
    );
}

function specialtiesList(arr){
    let s = [];
    arr.forEach(i => {
        let c = getCathedras().find(t => t.id == i);
        let f = getFaculties().find(t => t.id == c.facultyId);
        s.push({
            faculty: f.title,
            cathedra: c.title,
            specialty: getSpecialties().find(t => t.id == i).title
        })});
    return s.map(i => <View key={i.specialty.id} style={styles.specialty}>
        <Text>Факультет: {i.faculty}</Text>
        <Text>Кафедра: {i.cathedra}</Text>
        <Text>Специальность: {i.specialty}</Text>
    </View>)
}

const styles = StyleSheet.create({
    specialty: {
      borderWidth: 1,
      padding: 10,
      margin: 10
    },
  })