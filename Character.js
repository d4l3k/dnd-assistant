import React from 'react'
import autobind from 'autobind-decorator'
import {Platform, StyleSheet, View, Text, ScrollView} from 'react-native'

import {googleLogin, getCharacter, getUser} from './auth'
import firebase from './firebase'
import {BaseText, Field, colors, LightBox} from './styles.js'
import {TextInput} from './TextInput'
import {CheckBox} from './CheckBox'
import Cache from './Cache'
import {Button} from './Button'
import {Picker, PickerItem} from './Picker'
import * as rules from './rules'
import {SkillInput} from './characterInputs'
import {Loading} from './Loading'

const debounceTime = 300

export class AddHealthScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      fullDamage: true,
      value: ''
    }
  }
  render () {
    const total = this.total()

    return <LightBox title='Add Health' navigator={this.props.navigator}>
      <TextInput
        label='Amount'
        value={this.props.value}
        onChangeText={this.onChangeText}
        keyboardType={'numeric'}
        autoFocus={true}
      />

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CheckBox
          onClick={this.setFullDamage}
          isChecked={this.state.fullDamage}
        />
        <BaseText>Full</BaseText>

        <CheckBox
          onClick={this.setHalfDamage}
          isChecked={!this.state.fullDamage}
        />
        <BaseText>Half</BaseText>
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around'
      }}>
        <Button
          title={'Add ' + total}
          onPress={this.add}
        />
        <Button
          title={'Subtract ' + total}
          onPress={this.subtract}
        />
      </View>
    </LightBox>
  }

  @autobind
  onChangeText (value) {
    this.setState(prev => {
      return {value}
    })
  }

  total () {
    const value = parseFloat(this.state.value || 0)
    return this.state.fullDamage ? value : Math.floor(value / 2)
  }

  @autobind
  setFullDamage () {
    this.setState(prev => {
      return {fullDamage: true}
    })
  }

  @autobind
  setHalfDamage () {
    this.setState(prev => {
      return {fullDamage: false}
    })
  }

  @autobind
  add () {
    this.props.add(this.total())
    this.props.navigator.dismissLightBox()
  }

  @autobind
  subtract () {
    this.props.add(-this.total())
    this.props.navigator.dismissLightBox()
  }
}


const skillToShort = {
  strength: 'Str',
  dexterity: 'Dex',
  constitution: 'Con',
  intelligence: 'Int',
  wisdom: 'Wis',
  charisma: 'Cha'
}

const characterPrefix = 'character_'

export class CharacterScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      loading: true,
    }

    this.debounce = {}

    this.cache = Cache()

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
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
    })

    getCharacter().then(character => {
      this.character = character
      this.unsubscribe = this.character.onSnapshot(character => {
        this.setState(prev => {
          const state = {
            loading: false
          }
          const data = character.data()
          Object.keys(data).forEach(key => {
            const k = characterPrefix + key
            const datum = data[key]
            if (prev[k] !== datum) {
              state[k] = datum
            }
          })
          return state
        })
      })
    })
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  render () {
    if (this.state.loading) {
      return <Loading />
    }

    const characterSheet = rules[this.state.character_rules] || rules.dnd5e
    return (
      <ScrollView style={styles.screen}>
        {characterSheet.call(this)}
      </ScrollView>
    )
  }

  renderSkills (skills) {
    return skills.map((a, i) => {
      const name = a[0]
      const skill = a[1] || a[0].toLowerCase()
      const propName = a[0].replace(/ /g, '').toLowerCase() + 'Proficient'
      return <SkillInput
        key={i}
        name={name}
        secondary={a.length === 2 ? skillToShort[skill] : null}
        onClick={this.cache((val) => {
          const props = {}
          props[propName] = val
          this.set(props)
        }, propName)}
        isChecked={this.state[characterPrefix + propName]}
        value={this.state[characterPrefix + skill]}
        proficiency={this.state.character_proficiency}
      />
    })
  }

  set (obj) {
    this.setState(prev => {
      const state = {}
      Object.keys(obj).forEach(key => {
        state[characterPrefix + key] = obj[key]
      })
      return state
    })

    Object.keys(obj).forEach(key => {
      if (this.debounce[key]) {
        clearTimeout(this.debounce[key])
      }
      this.debounce[key] = setTimeout(() => {
        this.character.set({[key]: obj[key]}, {merge: true})
      }, debounceTime)
    })
  }

  @autobind
  onNavigatorEvent (event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'share') {
        this.props.navigator.push({
          screen: 'dnd.ShareSettingsScreen',
          title: 'Share Settings'
        })
      } else if (event.id === 'settings') {
        this.props.navigator.push({
          screen: 'dnd.CharacterSettingsScreen',
          title: 'Settings'
        })
      }
    }
  }
}

export class CharacterSettingsScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      character: {}
    }
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.character = character
      console.log(character)
      this.unsubscribe = this.character.onSnapshot(character => {
        this.setState(prev => {
          return {character: character.data()}
        })
      })
    })
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  render () {
    return <View style={styles.settingsscreen}>
      <Picker
        label='Rule Set'
        selectedValue={this.state.character.rules || ''}
        onValueChange={this.setRules}>
        <PickerItem value='' label='D&D 5th Edition' />
        <PickerItem value='fateAccelerated' label='Fate Accelerated' />
      </Picker>
    </View>
  }

  @autobind
  setRules (rules) {
    this.character.set({rules}, {merge: true})
  }
}

export class ShareSettingsScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      character: {}
    }
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.character = character
      console.log(character)
      this.unsubscribe = this.character.onSnapshot(character => {
        this.setState(prev => {
          return {character: character.data()}
        })
      })
    })
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  render () {
    const isPublic = this.state.character.visibility == 'public'

    return <View style={styles.settingsscreen}>
      <View style={styles.rowstart}>
        <CheckBox
          onClick={this.toggleVisibility}
          isChecked={isPublic}
        />
        <BaseText>Publicly Viewable</BaseText>
      </View>

      {
        isPublic
          ? <TextInput
            label='Viewing URL'
            value={this.viewingURL()}
          />
          : null
      }
    </View>
  }

  viewingURL () {
    if (!this.character) {
      return
    }

    const viewingPath = `/#!/view/${getUser().id}/${this.character.id}`
    const origin = Platform.select({
      default: () => 'https://dnd.fn.lc',
      web: () => {
        return window.location.origin
      }
    })()
    return origin + viewingPath

  }

  @autobind
  toggleVisibility () {
    const visibility = this.state.character.visibility === 'public' ? 'private' : 'public'
    this.setState(prev => {
      const character = {...prev.character}
      character.visibility = visibility
      return {character}
    })
    this.character.set({visibility}, {merge: true})
  }
}

const styles = StyleSheet.create({
  screen: {
    padding: 8
  },
  settingsscreen: {
    padding: 16
  },
  rowstart: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  rowcenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  rowcenteritems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowend: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rownoflex: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  skillinput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  wrap: {
    flexWrap: 'wrap'
  },
  button: {
    marginRight: 0
  },
  col4: {
    flex: 4
  }
})
