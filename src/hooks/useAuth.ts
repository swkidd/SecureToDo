import {useState, useCallback, useMemo} from 'react';
import {
  authenticateAsync,
  getEnrolledLevelAsync,
  SecurityLevel,
} from 'expo-local-authentication';
import {Platform, Alert, Linking} from 'react-native';

type Auth = {
  isAuth: boolean;
  onAuth: () => void;
};

const useAuth = (): Auth => {
  const [isAuth, setAuth] = useState<boolean>(false);

  const onAuth = useCallback(async () => {
    const securityLevel = await getEnrolledLevelAsync();
    if (securityLevel === SecurityLevel.NONE) {
      Alert.alert('Device Security Lock Required', 'Please enable a device lock in your security settings.', [
        {
          text: 'Open Settings',
          onPress: () => {
            Platform.OS === 'ios'
              ? /* configure for ios */ '' // Linking.openURL('App-Prefs:<settings>')
              : Linking.sendIntent('android.settings.SECURITY_SETTINGS');
          },
        },
      ]);
      return;
    }

    const auth = authenticateAsync();
    auth.then(result => {
      setAuth(result.success);
    });
  }, []);

  return useMemo(
    () => ({
      isAuth,
      onAuth,
    }),
    [isAuth],
  );
};

export default useAuth;
