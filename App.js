import React from 'react';
import StatusBar from 'react-native'
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { MainScreen } from './screens/LoginRegistrationScreen'
import { Menu } from './screens/MainMenu'
import { AddEditPerson } from './screens/AddEditScreens/Person';
import { AddEditAbiturient } from './screens/AddEditScreens/Abiturient';
import { AddEditConference } from './screens/AddEditScreens/Conference';
import { AddEditAbstract } from './screens/AddEditScreens/Abstract';
import { AddEditPublication } from './screens/AddEditScreens/Publication';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>
        <Stack.Screen name="PersonEdit" component={AddEditPerson} options={{ headerShown: false }}/>
        <Stack.Screen name="AbiturientEdit" component={AddEditAbiturient} options={{ headerShown: false }}/>
        <Stack.Screen name="ConferenceEdit" component={AddEditConference} options={{ headerShown: false }}/>
        <Stack.Screen name="AbstractEdit" component={AddEditAbstract} options={{ headerShown: false }}/>
        <Stack.Screen name="PublicationEdit" component={AddEditPublication} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
