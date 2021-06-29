import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
    StatusBar, BackHandler, TextInput, 
    ScrollView, TouchableOpacity } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

import { getNavigator, resetBackHandler } from '../MainMenu';

let needUpdate = true;
export function setUpdate(){
    needUpdate = true;
}

let nav;
export function getNav(){
    return nav;
}

export function publications({navigation}) {
    nav = navigation;
    const [loading, setLoading] = useState(true);
    const [isAspirant, setIsAspirant] = useState(false);
    const [publication, setPublication] = useState([]);
    const [temp, setTemp] = useState(false)

    useEffect(() => {
        if(needUpdate){
            setLoading(true);
            needUpdate = false;
            fetch(`http://${GetUrl()}/api/Publication/List`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            r.forEach(i => {
                                i.expand = false;
                                if(i.reason)
                                    i.state = 2;
                                else if(i.subjectEdit || i.dateEdit 
                                    || i.journalEdit || i.numberEdit
                                    || i.pageEdit)
                                    i.state = 1
                                else i.state = 0;
                            });
                            setPublication(r);
                            setLoading(false);
                            setIsAspirant(true);
                        });
                    }
                    else{
                        setLoading(false);
                        setIsAspirant(false);
                    }
                });
        }
    });

    return(
        <View style={{flex: 1}}>
            <ScrollView style={{ flex: 1, margin: 10 }}>
                {loading ? 
                <Text style={{alignSelf: 'center'}}>Загрузка...</Text> : 
                <View>
                    {publicationList(publication, temp, setTemp)}
                </View>}
            </ScrollView>
            <View style={{position: 'absolute', right: 20, bottom: 20}}>
                <TouchableOpacity style={[styles.roundButton, 
                {display: isAspirant ? 'flex' : 'none'}]} 
                underlayColor="white" onPress={() => {
                    resetBackHandler();
                    getNavigator().navigate('PublicationEdit');
                }}>
                    <Text style={{fontSize: 48}}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function publicationList(publication, t, tf) {
    return publication.map(i => (<View key={i.id} 
    style={[styles.abstract, {backgroundColor: i.state == 0 ? 'rgba(0, 255, 0, 0.8)' : 
    i.state == 1 ? 'rgba(255, 255, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)'}]}>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    <Text>{i.subjectEdit ? i.subjectEdit : i.subject}</Text>
                    <Text>
                        {Moment(i.dateEdit ? i.dateEdit : i.date).format('DD.MM.yyyy')}
                    </Text>
                </View>
                <Button 
                title={i.expand ? "▲" : "▼"}
                onPress={() => {
                    i.expand = !i.expand
                    tf(!t);
                }}/>
            </View>
            <View style={{display: !i.expand ? 'none' : 'flex'}}>
                <Text>Журнал: {i.journalEdit ? i.journalEdit : i.journal}</Text>
                <Text>Номер: {i.numberEdit ? i.numberEdit : i.number}</Text>
                <Text>Страница: {i.pageEdit ? i.pageEdit : i.page}</Text>
                <Text style={{marginBottom: 20}}>
                    {i.state == 0 ? 'Утверждено' : 
                    i.state == 1 ? 'Не утверждено' : 
                    `Не утверждено (${u.reason})`}
                </Text>
                <Button 
                title="Редактировать"
                onPress={() => {
                    let obj;
                    if(i.state == 0)
                        obj = {subject: i.subject, journal: i.journal, 
                            date: i.date, number: i.number.toString(), page: i.page.toString(),
                            _date: Moment(i.date).format('DD.MM.yyyy')};
                    else 
                        obj = {subject: i.subjectEdit, journal: i.journalEdit, 
                            date: i.dateEdit, number: i.numberEdit.toString(), page: i.pageEdit.toString(),
                            _date: Moment(i.dateEdit).format('DD.MM.yyyy')};
                    obj.id = i.id;
                    resetBackHandler();
                    getNavigator().navigate('PublicationEdit', { publication: obj });
                }}/>
            </View>
        </View>
    </View>))
}

const styles = StyleSheet.create({
    abstract: {
      flexDirection: 'row',
      borderWidth: 1,
      padding: 10,
      margin: 10
    },
    roundButton:{
        borderRadius: 50,
        backgroundColor: 'blue',
        paddingHorizontal: 20
    }
  })