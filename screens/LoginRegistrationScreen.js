import React from 'react';
import { Button, StyleSheet, Text, StatusBar, View, useWindowDimensions, TextInput, Alert  } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import { GetUrl } from './Utils'

let nav;
let loginForm = {login:"",password:""};
let registrationForm=  {userName:"",email:"",password:""};
let passwordRepeat = "";

const FirstRoute = () => (
  <LinearGradient 
    colors={['#00FFFF', '#40E0D0','#be6fe3' ]} //['#00FFFF', '#40E0D0','#1E90FF' ]
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1, backgroundColor: '#ff4081' }}
  >
    <View style={{flex: 1}}>
      <TextInput style={styles.textInputs}
      defaultValue={loginForm.login}
      onChangeText={v=>loginForm.login=v} placeholder="Имя/почта" />

      <TextInput style={styles.textInputs}
      defaultValue={loginForm.password}
      onChangeText={v=>loginForm.password=v} secureTextEntry={true} placeholder="Пароль" />
    </View>
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <Button style={{marginHorizontal: 10}} onPress={LoginClick} title="Вход"/>
    </View>
  </LinearGradient>
);


const SecondRoute = () => (
  <LinearGradient 
    colors={['#be6fe3', '#40E0D0','#00FFFF' ]} 
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1, backgroundColor: '#ff4081' }}
  >
   <View style={{ flex: 1 }} >
      <TextInput style={styles.textInputs}
      defaultValue={registrationForm.email}
      onChangeText={v=>registrationForm.email=v} placeholder="Почта" />

      <TextInput style={styles.textInputs}
      defaultValue={registrationForm.phoneNumber}
      onChangeText={v=>registrationForm.userName=v} placeholder="Логин" />

      <TextInput style={styles.textInputs}
      defaultValue={registrationForm.password}
      onChangeText={v=>registrationForm.password=v} secureTextEntry={true} placeholder="Пароль" />

      <TextInput style={styles.textInputs}
      defaultValue={passwordRepeat}
      onChangeText={v=>passwordRepeat=v} secureTextEntry={true} placeholder="Пароль (повторно)" />
    </View>
    <View style={{paddingHorizontal: 10}}>
      <Button style={{marginHorizontal: 10}} onPress={RegistrationClick} title="Регистрация"/>
    </View>
   </LinearGradient>
);

export function MainScreen({ navigation }) {
  nav = navigation;
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Вход' },
    { key: 'second', title: 'Регистрация' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={{paddingTop: StatusBar.currentHeight}}
    />
  );
}

function LoginClick(){
  if(loginForm.login==''){
    Alert.alert('Ошибка','Введите логин')
    return;
  }
  if(loginForm.password==''){
    Alert.alert('Ошибка','Введите логин')
    return;
  }
  fetch(`http://${GetUrl()}/api/Account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(loginForm),
    credentials:'include'
  })
  .then(res =>{
    console.log(JSON.stringify(res));
    if(res.ok){
      fetch(`http://${GetUrl()}/api/person/get`, {
        credentials: 'include'
      }).then(res=>{
        console.log(JSON.stringify(res));
        if(res.ok)
          res.json().then(r => {
            nav.navigate('Menu', r);
          });
        else if(res.status == 404)
          nav.navigate('Individual', null);
      });
    }
    else if(res.status == 404)
      alert('Неверная пара: логин-пароль');
    else
      res.json().then(r => alert(Object.values(r.errors).map(i=>i.toString()).join('\n')));
  },
    reason =>alert(reason));
}

function RegistrationClick(){
  if(registrationForm.email==''){
    Alert.alert('Ошибка','Введите почту.')
    return;
  }
  if(registrationForm.userName==''){
    Alert.alert('Ошибка','Введите логин.')
    return;
  }
  if(registrationForm.password==''){
    Alert.alert('Ошибка','Введите пароль')
    return;
  }
  if(registrationForm.password!=passwordRepeat){
    Alert.alert('Ошибка','Пароли не совпадают, попробуйте еще раз.')
   return;
  }
  fetch(`http://${GetUrl()}/api/Account/Registration`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(registrationForm),
    credentials:'include'
  })
  .then(res =>{
    console.log(JSON.stringify(res));
    if(res.ok){
      fetch(`http://${GetUrl()}/api/person/get`, {
        credentials: 'include'
      }).then(res=> {
        console.log(JSON.stringify(res));
        if(res.ok)
          res.json().then(r => {
            nav.navigate('Menu', r);
          });
        else if(res.status == 404)
          nav.navigate('Individual', null);
      });
    }
  }, reason => alert(reason));
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInputs: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderColor: '#fff',
    borderRadius: 6,
    borderWidth: 2
  }
});