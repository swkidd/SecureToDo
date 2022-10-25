import {getRandomBytes} from 'expo-random';
import {isAvailableAsync, getItemAsync, setItemAsync} from 'expo-secure-store';
import {MMKV} from 'react-native-mmkv';
import type {NativeMMKV} from 'react-native-mmkv';

/*
  Encrypted datastore
  Create a secure encryption key for usage with MMKV (react-native-mmkv)
  Store the key in secure storage (expo-secure-store)
*/

// key used to store encryption key in secure storage
const ENCRYPTION_KEY = 'secureToDoAppEncryptionKey';

// convert Uint8Array to hex string
function buf2hex(buffer: Uint8Array) {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

async function getEncryptionKey(): Promise<string | undefined> {
  if (await isAvailableAsync()) {
    // get existing key from secure storage
    let key = await getItemAsync(ENCRYPTION_KEY);
    if (!key) {
      const randomBytes = getRandomBytes(1024); // used to generate random key
      key = buf2hex(randomBytes);
      await setItemAsync(ENCRYPTION_KEY, key);
    }
    return key;
  }
}

// mmkv storage singleton
let mmkvInstance: NativeMMKV | null = null;
async function getStorage() {
  if (!mmkvInstance) {
    mmkvInstance = new MMKV({
      id: 'secure-todo-storage',
      encryptionKey: await getEncryptionKey(),
    });
  }
  return mmkvInstance;
}

export async function getObject(key: string): Promise<object | undefined> {
  const store = await getStorage()
  const value = store.getString(key)
  if (value) {
    return JSON.parse(value)
  }
}

// get all objects with key starting with prefix
export async function getAllObjectsByPrefix(prefix: string): Promise<object[]> {
  const store = await getStorage()
  const keys = store.getAllKeys()
  const values: object[] = []

  // lookup all keys that start with prefix and add them to values as an object
  for (let key of keys) {
    if (key.startsWith(prefix)) {
        const value = store.getString(key)
        if (value) {
          try {
            values.push(JSON.parse(value))
          } catch {}
        }
    }
  }
  return values;
}

export async function setObject(key: string, obj: object) {
  const store = await getStorage()
  store.set(key, JSON.stringify(obj))
}

export async function deleteItem(key: string) {
  const store = await getStorage()
  store.delete(key)
}
