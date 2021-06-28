import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
    StatusBar, BackHandler, TextInput, ScrollView } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

import { getNavigator, getSpecialties, getTeachers } from '../MainMenu';

export function prelProtection() {
    const [loading, setLoading] = useState(true)
    const [protection, setProtection] = useState([]);
    const [temp, setTemp] = useState(false)

    useEffect(() => {
        if(loading){
            fetch(`http://${GetUrl()}/api/PrelProtection/List`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            setLoading(false);
                            setProtection(r.map(i => {i.expand = false; return i}));
                        });
                    }
                });
        }
    });

    return(
        <ScrollView style={{ flex: 1, margin: 10 }}>
            {loading ? 
            <Text style={{alignSelf: 'center'}}>Загрузка...</Text> : 
            <View>
                {protectionList(protection, temp, setTemp)}
            </View>}
        </ScrollView>
    );
}

function protectionList(protection, t, tf) {
    return protection.map(i => (<View key={i.id} 
    style={[styles.protection, 
    {backgroundColor: i.allowmance ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.6)'}]}>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, alignSelf: 'center'}}>
                    {Moment(i.dateTime).format('DD.MM.yyyy')}
                </Text>
                <Button 
                title={i.expand ? "▲" : "▼"}
                onPress={() => {
                    i.expand = !i.expand
                    tf(!t);
                }}/>
            </View>
            <View style={{display: !i.expand ? 'none' : 'flex'}}>
                <Text>Время: {Moment(i.dateTime).format('HH:mm')}</Text>
                <Text>Комиссия:</Text>
                {getCommission(i.commission.split(' ').map(s => +s))}
                <Text>{i.allowmance ? 'К защите допущен' : 'К защите недопущен'}</Text>
            </View>
        </View>
    </View>))
}

function getCommission(arr){
    let t = arr.map(i => getTeachers().find(p => p.id == i));
    return t.map(i => (<Text>
        {`  ${i.rank} ${i.lastname} ${i.firstname[0]}. ${i.patronymic[0]}.`}
    </Text>));
}

const styles = StyleSheet.create({
    protection: {
      flexDirection: 'row',
      borderWidth: 1,
      padding: 10,
      margin: 10
    },
  })