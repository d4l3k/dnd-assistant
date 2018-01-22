import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import spells from '../dnd-spells/spells.json'

export default class SpellBook extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>SpellBook ... </Text>
        <Text>blahhh</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
