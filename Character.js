import React from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import {googleLogin, getCharacter} from './auth'
import firebase from 'react-native-firebase'

export class CharacterMenu extends React.Component {
  render () {
    return (
      <View style={styles.menu}>
        <Text>Character 0</Text>
      </View>
    )
  }
}

export class GearScreen extends React.Component {
  render () {
    return (
      <View style={styles.screen}>
        <Text>Gear</Text>
      </View>
    )
  }
}

export class StatInput extends React.Component {
  render () {
    return (
      <View style={styles.stat}>
        <Text>{this.props.name}</Text>
        <TextInput
          value={this.props.value}
          onChangeText={this.props.onChangeText}
          keyboardType={'numeric'}
        />
        <Text>{this.modifier(this.props.value)}</Text>
      </View>
    )
  }

  modifier (val) {
    const n = Math.floor((parseInt(val || 10) - 10) / 2)
    if (n > 0) {
      return '+' + n
    }
    return n
  }
}

export class CharacterScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      character: {
        name: 'Loading...'
      }
    }
  }

  componentDidMount () {
    firebase.auth().onUserChanged(user => {
      if (!user) {
        googleLogin()
        return
      }
      if (!user.emailVerified) {
        user.sendEmailVerification()
        return
      }
      this.setState(state => {
        return {name: user.displayName}
      })
      this.userLoggedIn(user)
    })
  }

  userLoggedIn (user) {
    this.character = getCharacter()
    this.character.onSnapshot(character => {
      this.setState(state => {
        return {character: character.data()}
      })
    })
  }

  render () {
    return (
      <ScrollView style={styles.screen}>
        <Text>Character Name</Text>
        <TextInput
          value={this.state.character.name}
          onChangeText={name => this.set({name})}
        />

        <StatInput
          name={'Strength'}
          value={this.state.character.strength}
          onChangeText={strength => this.set({strength})}
        />
        <StatInput
          name={'Dexterity'}
          value={this.state.character.dexterity}
          onChangeText={dexterity => this.set({dexterity})}
        />
        <StatInput
          name={'Constitution'}
          value={this.state.character.constitution}
          onChangeText={constitution => this.set({constitution})}
        />
        <StatInput
          name={'Intelligence'}
          value={this.state.character.intelligence}
          onChangeText={intelligence => this.set({intelligence})}
        />
        <StatInput
          name={'Wisdom'}
          value={this.state.character.wisdom}
          onChangeText={wisdom => this.set({wisdom})}
        />
        <StatInput
          name={'Charisma'}
          value={this.state.character.charisma}
          onChangeText={charisma => this.set({charisma})}
        />
      </ScrollView>
    )
  }

  set (obj) {
    this.character.set(obj, {merge: true})
    this.setState(prev => {
      Object.keys(obj).forEach(key => {
        prev.character[key] = obj[key]
      })
      return {
        character: prev.character
      }
    })
  }
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'white',
    padding: 10,
    flex: 1
  },
  screen: {
    padding: 10
  },
  stat: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10
  }
})
