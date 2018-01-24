import { GoogleSignin } from 'react-native-google-signin'
import firebase from 'react-native-firebase'
import storage from '../storage.js'
import RNRestart from 'react-native-restart'

// Calling this function will open Google for login.
export const googleLogin = () => {
  // Add configuration settings here:
  return GoogleSignin.configure()
  .then(() => {
    GoogleSignin.signIn()
    .then((data) => {
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)

      // login with credential
      return firebase.auth().signInWithCredential(credential)
    })
    .then((currentUser) => {
      console.info(JSON.stringify(currentUser.toJSON()))
    })
    .catch((error) => {
      console.error(`Login fail with error: ${error}`)
    })
  })
}

export const characterID = storage.load({
  key: 'characterID'
}).catch(() => {
  return onLogin().then(() => {
    const characters = getUser().collection('characters')
    return characters.limit(1).get()
  }).then(results => {
    let id = null
    results.forEach(result => {
      id = result.id
    })
    if (!id) {
      return characters.add({
        name: 'New Character'
      }).then(ref => {
        return ref.id
      })
    }
    return id
  }).then(id => {
    setCharacter(id, true)
    return id
  })
})

export const getUser = () => {
  const user = firebase.auth().currentUser
  if (!user) {
    return
  }
  return firebase.firestore().collection('users').doc(user.uid)
}

export const getCharacter = () => {
  return Promise.all([characterID, loggedIn]).then(promises => {
    const cid = promises[0]
    const user = getUser()
    if (!user) {
      return
    }
    return user.collection('characters').doc(cid)
  })
}

export const slugify = (str) => {
  return str.replace(/\W+/g, ' ').trim().replace(/ /g, '-')
}

export const onLogin = () => {
  return new Promise((resolve, reject) => {
    var unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        return
      }
      resolve(user)
      if (unsubscribe) {
        unsubscribe()
      }
    })
  })
}

var loggedIn = onLogin()

export const setCharacter = (id, noRestart) => {
  storage.save({
    key: 'characterID',
    data: id
  }).then(() => {
    if (!noRestart) {
      RNRestart.Restart()
    }
  })
}
