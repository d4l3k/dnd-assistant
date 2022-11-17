const config = {
  apiKey: 'AIzaSyBjQ7Y2IfNj7vCVWxcqYyxrv8a9Ri9w0YA',
  authDomain: 'dnd-assistant-4bd14.firebaseapp.com',
  databaseURL: 'https://dnd-assistant-4bd14.firebaseio.com',
  projectId: 'dnd-assistant-4bd14',
  storageBucket: 'dnd-assistant-4bd14.appspot.com',
  messagingSenderId: '600049413560',
  timestampsInSnapshots: true
}

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp(config)

export default firebase
