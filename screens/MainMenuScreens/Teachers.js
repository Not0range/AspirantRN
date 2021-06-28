import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
    StatusBar, BackHandler, TextInput, ScrollView } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

import { getNavigator, getTeachers, getCathedras, getFaculties } from '../MainMenu';

export function teachersInfo({route}) {
    const [loading, setLoading] = useState(true);
    const [temp, setTemp] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (loading) {
            setLoading(true);
            while(!getTeachers());
            setTeachers(getTeachers().map(i => {i.expand = false; return i}));
            setLoading(false);
        }
    });

    const filter = (t) =>{
        setSearch(t);
        let arr = getTeachers().filter(i => 
            (`${getCathedras().find(c => c.id == i.cathedraId).title} ${i.rank} ${i.lastname} ` + 
            `${i.firstname} ${i.patronymic}`).includes(t));
        setTeachers(arr.map(i => {i.expand = false; return i}));
    }

    return (
        <View style={{ flex: 1, margin: 10 }}>
            {(loading? <Text style={{alignSelf: 'center'}}>Загрузка...</Text> :
            <View>
                <TextInput 
                defaultValue={search} 
                onChangeText={filter}
                placeholder="Поиск"/>
                <ScrollView>
                    {teachersList(teachers, temp, setTemp)}
                </ScrollView>
            </View>)}
        </View>
    );
}

function teachersList(teachers, t, tf) {
    return teachers.map(i => (<View key={i.id} style={styles.teacher}>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, alignSelf: 'center'}}>
                    {`${i.rank} ${i.lastname} ${i.firstname[0]}. ${i.patronymic[0]}.`}
                </Text>
                <Button 
                title={i.expand ? "▲" : "▼"}
                onPress={() => {
                    i.expand = !i.expand
                    tf(!t);
                }}/>
            </View>
            <View style={{display: !i.expand ? 'none' : 'flex'}}>
                <Text>Фамилия: {i.lastname}</Text>
                <Text>Имя: {i.firstname}</Text>
                <Text>Отчество: {i.patronymic}</Text>
                <Text>Дата рождения: {Moment(i.birthDate).format('DD.MM.yyyy')}</Text>
                <Text>Факультет: {getFaculties().find(f => f.id == getCathedras()
                .find(c => c.id == i.cathedraId).facultyId).title}</Text>
                <Text>
                    Кафедра: {getCathedras().find(c => c.id == i.cathedraId).title}
                </Text>
                <Text>Научное звание: {i.rank}</Text>
                <Text>Должность: {i.position}</Text>
            </View>
        </View>
    </View>));
}

const styles = StyleSheet.create({
    teacher: {
      flexDirection: 'row',
      borderWidth: 1,
      padding: 10,
      margin: 10
    },
  })