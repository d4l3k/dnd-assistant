import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableNativeFeedback } from 'react-native'
import spells from './dnd-spells/spells.json'

class SpellItem extends React.Component {
  render () {
    return (
      <View>
        <TouchableNativeFeedback
            onPress={this._onPressButton}
            background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.item}>
            <Text>{this.props.spell.name}</Text>
            <Text>{this.props.spell.class}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

export default class SpellBook extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <FlatList
          data={spells}
          keyExtractor={this.spellExtractor}
          renderItem={({item}) => <SpellItem spell={item}/>}
        />
      </View>
    )
  }

  spellExtractor (spell) {
    return spell.name
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  item: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
})
