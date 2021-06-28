import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, Text, View, BackHandler, TextInput, Alert } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

import { getNavigator } from '../MainMenu';

let nav;
export function getNav(){
    return nav;
}

export function personInfo({route, navigation}) {
    nav = navigation;
    const [loading, setLoading] = useState(true);
    const [person, setPerson] = useState({
        updated: route.params && 'update' in route.params && route.params.update,
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
        if (!person.updated) {
            setLoading(true);
            fetch(`http://${GetUrl()}/api/Person/Self`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            r.updated = true;
                            r._birthdate = Moment(r.birthdate).format('DD.MM.yyyy');
                            setPerson(r);
                            setLoading(false);
                        });
                    }
                    else if(res.status == 404)
                        getNavigator().push('PersonEdit');
                    else
                        Alert.alert('Ошибка', "Не удалось загрузить данные");
                });
        }
    })

    return (
        <View style={{ flex: 1, margin: 10 }}>
            {(loading? <Text style={{alignSelf: 'center'}}>Загрузка...</Text> :
            <View>
                <Text>Фамилия: {person.lastname}</Text>
                <Text>Имя: {person.firstname}</Text>
                <Text>Отчество: {person.patronymic}</Text>
                <Text>Дата рождения: {person._birthdate}</Text>
                <Text>Гражданство: {person.citizenship}</Text>
                <Text>Документ: {person.passport}</Text>
                <Text>Трудовая книжка: {person.workbook ? 'В наличии' : 'Отсутствует'}</Text>
                <Text>Место работы: {person.workplaces}</Text>
                <Text>Контакты: {person.contacts}</Text>
                <View style={{ marginTop: 25 }}>
                    <Button title='Редактировать' onPress={() => {
                        getNavigator().navigate('PersonEdit', {person: person});
                    }}></Button>
                </View>
            </View>)}
        </View>
    );
}