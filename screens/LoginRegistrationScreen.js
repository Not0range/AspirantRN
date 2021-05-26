import React from 'react';
import { Button, StyleSheet, Text, View, StatusBar, useWindowDimensions, TextInput  } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

let nav;

const FirstRoute = () => (
  <LinearGradient 
    colors={['#f00', '#0f0', '#00f']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1, backgroundColor: '#ff4081' }}
  >
    <View style={{flex: 1}}>
      <TextInput style={styles.textInputs} placeholder="Логин" />
      <TextInput style={styles.textInputs} secureTextEntry={true} placeholder="Пароль" />
    </View>
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <Button style={{marginHorizontal: 10}} onPress={LoginClick} title="Вход"/>
    </View>
  </LinearGradient>
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

export function MainScreen({ navigation }) {
  nav = navigation;
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
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
  fetch('http://162.55.62.1/api/v1/Account/SignIn/SignIn', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      login: 'string',
      password: 'string'
    })
  })
  .then(res => res.json().then(r => alert(JSON.stringify(r))), 
    reason => alert(reason))
  ;

  nav.navigate('Menu');
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