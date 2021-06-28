import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, View, 
    StatusBar, BackHandler, TextInput, ScrollView } from 'react-native';
import { GetUrl } from '../Utils';
import Moment from 'moment';

import { getNavigator, getSpecialties, getTeachers } from '../MainMenu';

export function exam() {
    const [updatedExam, setUpdatedExam] = useState(false)
    const [updatedPassing, setUpdatedPassing] = useState(false)
    const [exams, setExams] = useState([]);
    const [passing, setPassing] = useState([]);

    useEffect(() => {
        if(!updatedExam){
            fetch(`http://${GetUrl()}/api/Exam/List`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            setUpdatedExam(true);
                            setExams(r);
                        });
                    }
                });
        }
        if(!updatedPassing){
            fetch(`http://${GetUrl()}/api/PassingExam/List`, {credentials: 'include'})
                .then(res => {
                    if (res.ok) {
                        res.json().then(r => {
                            setUpdatedPassing(true);
                            setPassing(r);
                        });
                    }
                });
            }
    });

    return(
        <ScrollView style={{ flex: 1, margin: 10 }}>
            {!updatedExam && !updatedPassing ? 
            <Text style={{alignSelf: 'center'}}>Загрузка...</Text> : 
            <View>
                {examsList(exams, passing)}
            </View>}
        </ScrollView>
    );
}

function examsList(exams, passing) {
    return exams.map(i => (<View key={i.id} style={styles.exam}>
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 32}}>
                {i.examType == 0 ? 'З.' : i.examType == 1 ? 'З/о' : 'Э'}
            </Text>
        </View>
        <View style={{flex: 2}}>
            <Text>{i.subject}</Text>
            <Text>{getTeacher(i.teacherId)}</Text>
            <Text>{Moment(i.date).format('DD.MM.yyyy')}</Text>
            <Text>{getSpecialties().find(t => t.id == i.specialtyId).title}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 32, alignSelf: 'flex-end'}}>
                {getResult(i.id, passing)}
            </Text>
        </View>
    </View>))
}

function getResult(id, passing){
    let p = passing.find(t => t.examId == id);
    if(p == null)
        return "--";
    else
        return p.result
}

function getTeacher(id){
    let t = getTeachers().find(t => t.id == id);
    if(t == null)
        return "-";
    else
        return `${t.rank} ${t.lastname} ${t.firstname[0]}. ${t.patronymic[0]}.`;
}

const styles = StyleSheet.create({
    exam: {
      flexDirection: 'row',
      borderWidth: 1,
      padding: 10,
      margin: 10
    },
  })