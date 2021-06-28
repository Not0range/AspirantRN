import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
    StatusBar, BackHandler, TextInput, 
    ScrollView, TouchableHighlight } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

export function abstracts() {
    const [loading, setLoading] = useState(true)
    const [abstract, setAbstract] = useState([]);
    const [temp, setTemp] = useState(false)

    useEffect(() => {
        if(loading){
            fetch(`http://${GetUrl()}/api/Abstract/List`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            r.forEach(i => {
                                i.expand = false;
                                if(i.reason)
                                    i.state = 2;
                                else if(!i.subject || !i.dateTimeEdit || !i.place)
                                    i.state = 1
                                else i.state = 0;
                            });
                            setAbstract(r);
                            setLoading(false);
                        });
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
                    {abstractList(abstract, temp, setTemp)}
                </View>}
            </ScrollView>
            <View style={{position: 'absolute', right: 20, bottom: 20}}>
                <TouchableHighlight style={styles.roundButton} 
                underlayColor="white">
                    <Text style={{fontSize: 48}}>+</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
}

function abstractList(abstract, t, tf) {
    return abstract.map(i => (<View key={i.id} 
    style={[styles.abstract, {backgroundColor: i.state == 0 ? 'rgba(0, 255, 0, 0.8)' : 
    i.state == 1 ? 'rgba(255, 255, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)'}]}>
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
                <View>
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
                <Text style={{marginBottom: 20}}>
                    {i.state == 0 ? 'Утверждено' : 
                    i.state == 1 ? 'Не утверждено' : 
                    `Не утверждено (${u.reason})`}
                </Text>
                <Button style={{marginBottom: 20}}
                title="Скачать документ"
                onPress={() => {
                    
                }}/>
                <Button 
                title="Редактировать"
                onPress={() => {
                    
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