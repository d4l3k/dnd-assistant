import { GoogleSignin } from 'react-native-google-signin'
import firebase from 'react-native-firebase'

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

export const getUser = () => {
  const user = firebase.auth().currentUser
  if (!user) {
    return
  }
  const uid = user.uid
  return firebase.firestore().collection('users').doc(user.uid)
}

export const getCharacter = () => {
  const user = getUser()
  if (!user) {
    return
  }
  return user.collection('characters').doc('char0')
}

export const slugify = (str) => {
  return str.replace(/\W+/g, ' ').trim().replace(/ /g, '-')
}

export const onLogin = (f) => {
  var unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      return
    }
    f(user)
    if (unsubscribe) {
      unsubscribe()
    }
  })
}
