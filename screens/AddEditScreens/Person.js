import React, { useEffect, useState } from 'react';
import { 
    Button, StyleSheet, Text, View, 
    StatusBar, Switch, TextInput, Alert, Picker, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import moment, {Moment} from 'moment';

let edit;

export function AddEditPerson({route, navigation}){
    const [person, setPerson] = useState({
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

    edit = false;
    useEffect(() => {
        if(route.params && 'person' in route.params){
            setPerson(route.params.person);
            edit = true;
        }
    })
    
    const [isEnabled, setIsEnabled] = React.useState(person.workbook);
    const toggleSwitch = () => {
        setIsEnabled(p => !p);
        person.workbook = !isEnabled;
    };
    return(
        <ScrollView style={{flex: 1, paddingTop: StatusBar.currentHeight, margin: 10}}>
            <TextInput style={styles.textInputs}
            defaultValue={person.lastname}
            onChangeText={v => person.lastname = v} placeholder="Фамилия" />

            <TextInput style={styles.textInputs}
            defaultValue={person.firstname}
            onChangeText={v => person.firstname = v} placeholder="Имя" />

            <TextInput style={styles.textInputs}
            defaultValue={person.patronymic}
            onChangeText={v => person.patronymic = v} placeholder="Отчество" />

            <TextInput style={styles.textInputs}
            defaultValue={person._birthdate}
            onChangeText={v => person._birthdate = v}
            placeholder="Дата рождения" />

            <TextInput style={styles.textInputs}
            defaultValue={person.citizenship}
            onChangeText={v => person.citizenship = v} placeholder="Гражданство" />

            <TextInput style={styles.textInputs}
            defaultValue={person.passport}
            onChangeText={v => person.passport = v} placeholder="Документ" />

            <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                <Text>Наличие трудовой книжки</Text>
                <Switch
                onValueChange={toggleSwitch}
                value={isEnabled} />
            </View>

            <TextInput style={styles.textInputs}
            defaultValue={person.workplaces}
            onChangeText={v => person.workplaces = v} placeholder="Место работы" />

            <TextInput style={styles.textInputs}
            defaultValue={person.contacts}
            onChangeText={v=> person.contacts = v} placeholder="Контакты" />

            <View style={{paddingHorizontal: 10, marginBottom: 30}}>
                <Button style={{marginHorizontal: 10}} onPress={() =>{}} title="Сохранить"/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    textInputs: {
        marginVertical: 5,
        padding: 10,
        borderColor: '#fff',
        borderRadius: 6,
        borderWidth: 2
      }
});