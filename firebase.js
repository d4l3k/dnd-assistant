import {Platform} from 'react-native'

const config = {
  apiKey: 'AIzaSyBjQ7Y2IfNj7vCVWxcqYyxrv8a9Ri9w0YA',
  authDomain: 'dnd-assistant-4bd14.firebaseapp.com',
  databaseURL: 'https://dnd-assistant-4bd14.firebaseio.com',
  projectId: 'dnd-assistant-4bd14',
  storageBucket: 'dnd-assistant-4bd14.appspot.com',
  messagingSenderId: '600049413560'
}

export default Platform.select({
  web: () => {
    const firebase = require('firebase')
    // Required for side-effects
    require('firebase/firestore')

    firebase.initializeApp(config)

    return firebase
  },
  default: () => require('react-native-firebase')
})()
