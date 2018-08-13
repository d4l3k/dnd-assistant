import React from 'react'
import autobind from 'autobind-decorator'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {View, StyleSheet} from 'react-native'

import {getCharacter} from './auth'
import {MarkdownInput} from './MarkdownInput'
import {BoxInput, ModInput, StatInput, LineInput, MultiLineInput, RelativeInput} from './characterInputs'
import {colors} from './styles.js'

export class CustomStats extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      stats: [],
    }
    this.unsubscribe = []
  }

  componentDidMount () {
    getCharacter().then(character => {
      const collection = character.collection('customStats')
      this.unsubscribe.push(collection.onSnapshot(snapshot => {
        const stats = []
        snapshot.forEach((stat) => {
          stats.push({
            id: stat.id,
            collection,
            ...stat.data()
          })
        })

        this.setState(prev => {
          return {stats}
        })
      }))
    })
  }

  componentWillUnmount () {
    this.unsubscribe.forEach(a => a())
    this.unsubscribe = []
  }

  renderStat (stat) {
    let Type = BoxInput
    if (stat.type === 'stat') {
      Type = StatInput
    } else if (stat.type === 'mod') {
      Type = ModInput
    } else if (stat.type === 'markdown') {
      Type = MarkdownInput
    } else if (stat.type === 'relative') {
      Type = RelativeInput
    } else if (stat.type === 'line') {
      Type = LineInput
    } else if (stat.type === 'multiline') {
      Type = MultiLineInput
    }

    return <Type
      name={stat.name}
      value={stat.value}
      onChangeText={value => this.set(stat, {value})}
    />
  }

  set (stat, value) {
    stat.collection.doc(stat.id).set(value, {merge: true})
  }

  remove (stat) {
    stat.collection.doc(stat.id).delete()
  }

  renderStats () {
    return this.state.stats.map((stat, key) => {
      return <View key={key} style={styles.stat}>
        {this.renderStat(stat)}
        <Ionicons.Button
          name='md-trash'
          color={colors.secondaryText}
          iconStyle={styles.button}
          backgroundColor='transparent'
          onPress={() => {
            this.remove(stat)
          }}
        />
      </View>
    })
  }

  render () {
    return <View style={styles.container}>
      {this.renderStats()}
    </View>
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  button: {
    marginRight: 0
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 150,
    alignItems: 'flex-start'
  },
})
