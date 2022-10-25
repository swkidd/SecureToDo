import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import colors from './src/colors';
import useAuth from './src/hooks/useAuth';
import ToDoList from './src/ToDoList';

const App = () => {
  const {isAuth, onAuth} = useAuth();
  const [reload, setReload] = useState(0); // used to reload the application

  useEffect(() => {
    if (!isAuth) {
      onAuth(); // open lock screen
    }
  }, [reload, isAuth, onAuth]);

  return isAuth ? (
    <ToDoList />
  ) : (
    <View style={styles.splash}>
      <Text style={styles.splashText}>
        Welcome to Secure To Do! {'\n\n'}
        This application requires a phone lock to be enabled
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title="Reload Application"
          onPress={() => setReload(c => c + 1)}
          color={colors.raisinBlack}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.blizardBlue,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  splashText: {
    color: colors.raisinBlack,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
