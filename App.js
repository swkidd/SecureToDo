import React, {useEffect} from 'react';
import useAuth from './src/hooks/useAuth';
import ToDoList from './src/ToDoList';

const App = () => {
  const {isAuth, onAuth} = useAuth();

  useEffect(() => {
    if (!isAuth) {
      onAuth();
    }
  }, [isAuth, onAuth]);

  return isAuth ? <ToDoList /> : null;
};

export default App;
