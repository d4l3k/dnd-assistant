import {Platform} from 'react-native'
import storage from '../storage.js'
import firebase from '../firebase'
const {GoogleSignin} = require('./googlesignin')
import {start} from '../App'

export const viewedCharacter = () => {
  return Platform.select({
    default: () => null,
    web: () => {
      const hash = window.location.hash
      if (!hash.startsWith('#!/view/')) {
        return
      }
      const parts = hash.split('/')
      if (parts.length < 4) {
        return
      }
      return {uid: parts[2], cid: parts[3]}
    }
  })()
}

// Calling this function will open Google for login.
export const googleLogin = () => {
  // Add configuration settings here:
  let user

  console.log('GoogleSignin auth', GoogleSignin)
  if (GoogleSignin) {
    user = GoogleSignin.configure().then(() => {
      return GoogleSignin.signIn()
    }).then((data) => {
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)

      // login with credential
      return firebase.auth().signInWithCredential(credential)
    }).catch((e) => {
      console.log(e, JSON.stringify(e))
    })
  } else {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)

    user = firebase.auth().getRedirectResult()
  }

  return user.then((currentUser) => {
    if (!currentUser) {
      throw 'not logged in!'
    }

    console.info(JSON.stringify(currentUser.toJSON()))
  })
  .catch((error) => {
    console.error(`Login fail with error: ${error}`)
  })
}

export const signOut = () => {
  firebase.auth().signOut().then(restart)
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

export const characterID = () => {
  return storage.load({
    key: 'characterID'
  }).catch(() => {
    let characters
    return onLogin().then(() => {
      characters = getUser().collection('characters')
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
      if (!viewedCharacter()) {
        setCharacter(id, true)
      }
      return id
    })
  })
}

export const getUser = () => {
  const user = firebase.auth().currentUser
  if (!user) {
    return
  }
  return firebase.firestore().collection('users').doc(user.uid)
}

export const getCharacter = () => {
  return Promise.all([characterID(), onLogin()]).then(promises => {
    const vc = viewedCharacter()
    if (vc) {
      const {uid, cid} = vc
      console.log('Viewing character!', vc)
      return firebase.firestore().collection('users').doc(uid).collection('characters').doc(cid)
    }
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



export const setCharacter = (id, noRestart) => {
  storage.save({
    key: 'characterID',
    data: id
  }).then(() => {
    Platform.select({
      default: () => null,
      web: () => {
        window.location.hash = ''
      }
    })()
    if (!noRestart) {
      restart()
    }
  })
}

export const restart = () => {
  Platform.select({
    default: () => start(),
    web: () => window.location.reload()
  })()
}
