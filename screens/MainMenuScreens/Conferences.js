import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
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

export function conferences({navigation}) {
    nav = navigation;
    const [loading, setLoading] = useState(true);
    const [isAspirant, setIsAspirant] = useState(false);
    const [conference, setConference] = useState([]);
    const [temp, setTemp] = useState(false);

    useEffect(() => {
        if(needUpdate){
            needUpdate = false;
            setLoading(true);
            fetch(`http://${GetUrl()}/api/Conference/List`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            r.forEach(i => {
                                i.expand = false;
                                if(i.reason)
                                    i.state = 2;
                                else if(i.subjectEdit || i.dateTimeEdit || i.placeEdit)
                                    i.state = 1
                                else i.state = 0;
                            });
                            setConference(r);
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
                    {conferenceList(conference, temp, setTemp)}
                </View>}
            </ScrollView>
            <View style={{position: 'absolute', right: 20, bottom: 20}}>
                <TouchableOpacity style={[styles.roundButton, 
                {display: isAspirant ? 'flex' : 'none'}]} 
                underlayColor="white" onPress={() => {
                    resetBackHandler();
                    getNavigator().navigate('ConferenceEdit');
                }}>
                    <Text style={{fontSize: 48}}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function conferenceList(conference, t, tf) {
    return conference.map(i => (<View key={i.id} 
    style={[styles.abstract, {backgroundColor: i.state == 0 ? 'rgba(0, 255, 0, 0.8)' : 
    i.state == 1 ? 'rgba(255, 255, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)'}]}>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    <Text>{i.subjectEdit ? i.subjectEdit : i.subject}</Text>
                    <Text>
                        {Moment(i.dateTimeEdit ? i.dateTimeEdit : i.dateTime).format('DD.MM.yyyy')}
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
                <Text>
                    {Moment(i.dateTimeEdit ? i.dateTimeEdit : i.dateTime).format('HH:mm')}
                </Text>
                <Text>
                    {i.placeEdit ? i.placeEdit : i.place}
                </Text>
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
                        obj = {subject: i.subject, place: i.place, 
                            datetime: i.dateTime, 
                            _datetime: Moment(i.dateTime).format('DD.MM.yyyy HH:mm')};
                    else 
                        obj = {subject: i.subjectEdit, place: i.placeEdit, 
                            datetime: i.dateTimeEdit, 
                            _datetime: Moment(i.dateTimeEdit).format('DD.MM.yyyy HH:mm')};
                    obj.id = i.id;
                    resetBackHandler();
                    getNavigator().navigate('ConferenceEdit', { conference: obj });
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