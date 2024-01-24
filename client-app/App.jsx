import React, {useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {
  noAuthScreens,
  adminScreens,
  taScreens,
  instructorScreens,
} from './src/routes';
import theme from './src/theme';
import store from './src/store';
import {getUserInfoAction} from './src/store/user/actions';
// import Signup from './Screens/Signup';
// import Home from './Screens/Home';
// import Login from './Screens/Login';
// import HomePage from './Screens/Student/HomePage';
// import {getUserInfoAction} from './redux/user/actions';
// import Loading from './Screens/Loading';
// import store from './redux/index';
// import HomeScreen from './Screens/Teacher/HomeScreen';
// import Course from './Screens/Teacher/Course';
// import EditCourse from './Screens/Teacher/EditCourse';
// import UserProfile from './Screens/Student/UserProfile';
// import QRgenerator from './Screens/Student/QRGenerator';
// import Scanner from './Screens/Teacher/Scanner';
// import CourseInfo from './Screens/Teacher/CourseInfo';
// import ResetPassword from './Screens/ResetPassword';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <Provider store={store}>
        <ComponentProvider />
      </Provider>
    </NativeBaseProvider>
  );
}
const ComponentProvider = () => {
  const dispatch = useDispatch();
  const {loading, user, role} = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getUserInfoAction());
  }, [dispatch]);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user
          ? role === 'ADMIN'
            ? adminScreens.map((component, key) => (
                <Stack.Screen
                  key={key}
                  name={component.name}
                  component={component.component}
                  options={{headerShown: false}}
                />
              ))
            : role == 'INSTRUCTOR'
            ? instructorScreens.map((component, key) => (
                <Stack.Screen
                  key={key}
                  name={component.name}
                  component={component.component}
                  options={{headerShown: false}}
                />
              ))
            : taScreens.map((component, key) => (
                <Stack.Screen
                  key={key}
                  name={component.name}
                  component={component.component}
                  options={{headerShown: false}}
                />
              ))
          : noAuthScreens.map((component, key) => (
              <Stack.Screen
                key={key}
                name={component.name}
                component={component.component}
                options={{headerShown: false}}
              />
            ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
