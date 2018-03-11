import React from 'react'
import autobind from 'autobind-decorator'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {StyleSheet, View, ScrollView, Text} from 'react-native'
import {Button} from './Button'
import {colors, BaseText, H1, B, P} from './styles'
import {TextInput} from './TextInput'
import {getCharacter} from './auth'
import moment from 'moment'

import wildMagic from './wild-magic'

const defaultWildMagic = Object.keys(wildMagic).sort()[0]

class WildMagicEffect extends React.PureComponent {
  render () {
    const {effect, duration, time} = this.props.effect || {}
    return <View style={styles.item}>
      <View style={styles.flex}>
        <BaseText>
          <B>Effect: </B>
          {effect}
        </BaseText>

        <BaseText>
          <B>Until: </B>
          {duration}
        </BaseText>
        <BaseText>
          <Text style={styles.secondary}>{moment(time).fromNow()}</Text>
        </BaseText>
      </View>

      {
        this.props.onRemove
          ? <Ionicons.Button
            name='md-trash'
            color={colors.secondaryText}
            iconStyle={styles.button}
            backgroundColor='transparent'
            onPress={this.remove}
          />
          : null
      }

    </View>
  }

  @autobind
  remove () {
    this.props.onRemove(this.props.effect)
  }
}

export class WildMagicScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      effects: []
    }
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.character = character
      this.unsubscribe = character.onSnapshot(snapshot => {
        this.setState(state => {
          return {wildMagicProb: snapshot.data().wildMagicProb}
        })
      })
      this.effects = character.collection('wildMagic')
      this.unsubscribeEffects = this.effects.onSnapshot(snapshot => {
        const effects = []
        snapshot.forEach(snap => {
          const effect = snap.data()
          effect.id = snap.id
          effects.push(effect)
        })
        effects.sort((a, b) => {
          return a.time > b.time ? -1 : 1
        })
        this.setState(prev => {
          return {effects}
        })
      })
    })
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    if (this.unsubscribeEffects) {
      this.unsubscribeEffects()
      this.unsubscribeEffects = null
    }
  }

  render () {
    return <ScrollView style={styles.screen}>
      <View style={styles.pad}>
        <Button
          title={'Roll'}
          onPress={this.roll}
        />

        <P>{this.state.roll} &lt; {this.state.wildMagicProb}</P>
      </View>

      {this.renderEffect()}

      <View style={styles.pad}>
        <H1>Past Effects</H1>
      </View>

      {this.renderEffects()}

      <View style={styles.pad}>
        <H1>Settings</H1>

        <TextInput
          label='Probability of Wild Magic'
          value={this.state.wildMagicProb || '0.0'}
          keyboardType='numeric'
          onChangeText={this.setWildMagic}
        />

        <TextInput
          label='Number Rolls'
          value={this.state.wildMagicRolls || '1'}
          keyboardType='numeric'
          onChangeText={this.setWildMagicRolls}
        />
      </View>
    </ScrollView>
  }

  renderEffects () {
    return this.state.effects.map(effect => <WildMagicEffect
      key={effect.id}
      effect={effect}
      onRemove={this.remove}
    />)
  }

  renderEffect () {
    if (!this.state.effect) {
      return
    }

    return <WildMagicEffect effect={this.state.effect} />
  }

  wildMagic () {
    return wildMagic[defaultWildMagic]
  }

  @autobind
  remove (spell) {
    this.effects.doc(spell.id).delete()
  }

  @autobind
  roll () {
    const roll = Math.random()
    const state = {
      roll: roll.toFixed(2),
      effect: null
    }

    if (roll < parseFloat(this.state.wildMagicProb)) {
      const numRolls = parseInt(this.state.wildMagicRolls || 1)
      for (let i = 0; i < numRolls; i++) {
        const wildMagic = this.wildMagic()
        const effectI = Math.floor(Math.random() * wildMagic.effects.length)
        const durationI = Math.floor(Math.random() * wildMagic.durations.length)
        state.effect = {
          effect: wildMagic.effects[effectI],
          duration: wildMagic.durations[durationI],
          time: moment().toISOString()
        }
        this.effects.add(state.effect)
      }
    }

    this.setState(prev => state)
  }

  @autobind
  setWildMagic (wildMagicProb) {
    this.setState(state => {
      return {wildMagicProb}
    })
    this.character.set({wildMagicProb}, {merge: true})
  }

  @autobind
  setWildMagicRolls (wildMagicRolls) {
    this.setState(state => {
      return {wildMagicRolls}
    })
    this.character.set({wildMagicRolls}, {merge: true})
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 10
  },
  pad: {
    paddingHorizontal: 10
  },
  item: {
    padding: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  secondary: {
    color: colors.secondaryText
  },
  button: {
    marginRight: 0
  },
  flex: {
    flex: 1
  }
})
