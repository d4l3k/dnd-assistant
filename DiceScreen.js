import React from 'react'
import { StyleSheet, Text, View, TouchableNativeFeedback, ScrollView, Button } from 'react-native'
import {getUser, onLogin, setCharacter, characterID} from './auth'
import {colors, BaseText, B} from './styles.js'

export class DiceScreen extends React.Component {
  render () {
    return <View>
      <BaseText>DiceMenu</BaseText>
    </View>
  }
}
