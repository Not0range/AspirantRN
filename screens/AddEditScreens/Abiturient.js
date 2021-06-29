import React, { useEffect, useState } from 'react';
import { 
    Button, StyleSheet, Text, View, BackHandler,
    StatusBar, Switch, TextInput, Alert, Picker, ScrollView } from 'react-native';
import { Modal, Portal, Provider } from 'react-native-paper';
import 'react-native-gesture-handler';
import moment, {Moment} from 'moment';
import { GetUrl } from '../Utils';

import { getNav, setUpdate } from '../MainMenuScreens/Abiturient';
import { getFaculties, getCathedras, getSpecialties } from '../MainMenu';

let nav;
let edit;
let back;

export function AddEditAbiturient({route, navigation}){
    nav = navigation;
    const [temp, setTemp] = useState(false);
    const [loading, setLoading] = useState(true);
    const [specialties, setSpecialties] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);

    const [faculty, setFaculty] = useState(null);
    const [cathedra, setCathedra] = useState(null);
    const [specialty, setSpecialty] = useState(null);

    const [selectF, setSelectF] = useState([]);
    const [selectC, setSelectC] = useState([]);
    const [selectS, setSelectS] = useState([]);

    useEffect(() => {
        if(route.params && 'abiturient' in route.params){
            setSpecialties(route.params.abiturient);
            edit = true;
        }
        else
            edit = false;

        if(loading){
            setSelectF(getFaculties());
            setFaculty(selectF[0]);
            setLoading(false);
        }
    })
    return(
        <Provider style={{flex: 1, justifyContent: 'center'}}>
            <Portal>
                <Modal visible={visibleModal} onDismiss={() => setVisibleModal(false)}>
                    <View style={{backgroundColor: 'white'}}>
                        <Text style={{fontSize: 20, alignSelf: 'center'}}>
                            Добавление
                        </Text>
                        <Text style={styles.label}>Факультет</Text>
                        <View style={styles.pickers}>
                            <Picker selectedValue={faculty}
                            onValueChange={(v, i) => {
                                setFaculty(v);
                                setSelectC(getCathedras().filter(c => c.facultyId == v.id));
                            }}>
                                {selectF.map(i => (<Picker.Item label={i.title} value={i}/>))}
                            </Picker>
                        </View>
                        <Text style={styles.label}>Кафедра</Text>
                        <View style={styles.pickers}>
                            <Picker selectedValue={cathedra}
                            onValueChange={(v, i) => {
                                setCathedra(v);
                                setSelectS(getSpecialties().filter(s => s.cathedraId == v.id))
                            }}>
                                {selectC.map(i => (<Picker.Item label={i.title} value={i}/>))}
                            </Picker>
                        </View>
                        <Text style={styles.label}>Специальность</Text>
                        <View style={styles.pickers}>
                            <Picker selectedValue={specialty}
                            onValueChange={(v, i) => {
                                setSpecialty(v);
                            }}>
                                {selectS.map(i => (<Picker.Item label={i.title} value={i}/>))}
                            </Picker>
                        </View>
                        <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                            <Button style={{marginHorizontal: 10}} 
                            onPress={() => {
                                if(!specialties.includes(specialty.id)){
                                    specialties.push(specialty.id);
                                    setVisibleModal(false);
                                }
                                else
                                    Alert.alert('Ошибка', 'Такая специальность уже добавлена')
                            }} title="Добавить"/>
                        </View>
                    </View>
                </Modal>
            </Portal>
            <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
                {specialtiesList(specialties, temp, setTemp)}
                <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                    <Button style={{marginHorizontal: 10}} 
                    onPress={() => setVisibleModal(true)} title="Добавить"/>
                </View>
                <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                    <Button style={{marginHorizontal: 10}} 
                    onPress={() =>{if(!edit) addAbiturient(specialties); 
                    else editAbiturient(specialties);}} title="Сохранить"/>
                </View>
            </ScrollView>
        </Provider>
    );
}

function specialtiesList(arr, t, tf){
    let s = [];
    arr.forEach(i => {
        let c = getCathedras().find(t => t.id == i);
        let f = getFaculties().find(t => t.id == c.facultyId);
        s.push({
            id: i,
            faculty: f.title,
            cathedra: c.title,
            specialty: getSpecialties().find(t => t.id == i).title
        })});
    return s.map(i => <View key={i.id} style={styles.specialty}>
        <View style={{flex: 1}}>
            <Text>Факультет: {i.faculty}</Text>
            <Text>Кафедра: {i.cathedra}</Text>
            <Text>Специальность: {i.specialty}</Text>
        </View>
        <View style={{justifyContent: 'center'}}>
            <Button title="X" 
            onPress={() => {
                arr.splice(arr.findIndex(a => a.id == i.id), 1);
                tf(!t);
            }}/>
        </View>
    </View>)
}

function addAbiturient(s){
    if(s.length == 0){
        Alert.alert("Ошибка", "Необходимо выбрать хотя бы одну специальность");
        return;
    }
    fetch(`http://${GetUrl()}/api/abiturient/add`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify({specialties: s})
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Abiturient', {update: false})
            nav.navigate('Menu');
        }
    });
}

function editAbiturient(p){
    if(p.length == 0){
        Alert.alert("Ошибка", "Необходимо выбрать хотя бы одну специальность");
        return;
    }
    fetch(`http://${GetUrl()}/api/abiturient/edit`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json;charset=utf-8'
        },
        body: JSON.stringify({specialties: p})
    }).then(res => {
        if(res.ok){
            setUpdate();
            getNav().navigate('Abiturient', {update: false})
            nav.navigate('Menu');
        }
    });
}

const styles = StyleSheet.create({
    specialty: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
        flexDirection: 'row'
      },
      pickers: {
        marginVertical: 5,
        borderColor: 'black',
        borderRadius: 6,
        borderWidth: 2
      },
      label:{
          marginLeft: 10,
          marginTop: 10
      }
});