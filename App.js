import React, {useEffect} from 'react';
import {Text} from 'react-native';
import useAuth from './src/hooks/useAuth';

const App = () => {
  const {isAuth, onAuth} = useAuth();

  useEffect(() => {
    if (!isAuth) {
      onAuth();
    }
  }, [isAuth, onAuth]);

  return <Text>{isAuth ? 'logged in' : 'logged out'}</Text>;
};

export default App;
