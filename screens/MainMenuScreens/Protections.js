import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
    StatusBar, BackHandler, TextInput, ScrollView } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

export function protection() {
    const [loading, setLoading] = useState(true)
    const [protection, setProtection] = useState([]);
    const [temp, setTemp] = useState(false)

    useEffect(() => {
        if(loading){
            fetch(`http://${GetUrl()}/api/Protection/List`, {credentials: 'include'})
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
    style={styles.protection}>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 3, alignSelf: 'center'}}>
                    {Moment(i.dateTime).format('DD.MM.yyyy')}
                </Text>
                <Text style={{flex: 1, fontSize: 32}}>
                    {i.result}
                </Text>
                <Button 
                title={i.expand ? "▲" : "▼"}
                onPress={() => {
                    i.expand = !i.expand
                    tf(!t);
                }}/>
            </View>
            <View style={{display: !i.expand ? 'none' : 'flex'}}>
                <Text>Дата и время: {Moment(i.dateTime).format('DD.MM.yyyy HH:mm')}</Text>
                <Text>{i.city}</Text>
                <Text>{i.university}</Text>
                <Text>Комиссия:</Text>
                <Text>{i.commission}</Text>
            </View>
        </View>
    </View>))
}

const styles = StyleSheet.create({
    protection: {
      flexDirection: 'row',
      borderWidth: 1,
      padding: 10,
      margin: 10
    },
  })