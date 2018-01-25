import React from 'react'
import { StyleSheet, View, TextInput, ScrollView } from 'react-native'
import {googleLogin, getCharacter} from './auth'
import firebase from 'react-native-firebase'
import {BaseText, Field, Center} from './styles.js'
import CheckBox from 'react-native-check-box'

export class SkillInput extends React.Component {
  render () {
    return <View style={styles.row}>
      <CheckBox
        onClick={this.props.onClick}
        isChecked={this.props.isChecked}
      />
      <BaseText>{this.value()} {this.props.name}</BaseText>
    </View>
  }

  value () {
    let num = statToMod(this.props.value)
    if (this.props.isChecked) {
      num += parseMod(this.props.proficiency)
    }
    return modString(num)
  }
}

export class StatInput extends React.Component {
  render () {
    return (
      <Field name={this.props.name}>
        <TextInput
          value={this.props.value}
          onChangeText={this.props.onChangeText}
          keyboardType={'numeric'}
        />
        <Center>{this.modifier(this.props.value)}</Center>
      </Field>
    )
  }

  modifier (val) {
    return modString(statToMod(val))
  }
}

function statToMod (val) {
  return Math.floor((parseMod(val || 10) - 10) / 2)
}

function parseMod (n) {
  if (typeof n === 'string') {
    n = n.replace(/\+/g, '')
  }
  return parseInt(n)
}

function modString (n) {
  if (n > 0) {
    return '+' + n
  }
  return n
}


export class BoxInput extends React.Component {
  render () {
    return (
      <Field name={this.props.name}>
        <TextInput
          value={this.props.value}
          onChangeText={this.props.onChangeText}
          keyboardType={'numeric'}
        />
      </Field>
    )
  }
}


export class LineInput extends React.Component {
  render () {
    return (
      <Field name={this.props.name}>
        <TextInput
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
      </Field>
    )
  }
}

export class MultiLineInput extends React.Component {
  render () {
    return (
      <Field name={this.props.name}>
        <TextInput
          value={this.props.value}
          multiline={true}
          onChangeText={this.props.onChangeText}
        />
      </Field>
    )
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
    getCharacter().then(character => {
      this.character = character
      this.character.onSnapshot(character => {
        this.setState(state => {
          return {character: character.data()}
        })
      })
    })
  }

  render () {
    return (
      <ScrollView style={styles.screen}>
        <View style={styles.row}>
          <LineInput
            name={'Character Name'}
            value={this.state.character.name}
            onChangeText={name => this.set({name})}
          />
          <LineInput
            name={'Class & Level'}
            value={this.state.character.classLevel}
            onChangeText={classLevel => this.set({classLevel})}
          />
        </View>

        <View style={styles.row}>
          <LineInput
            name={'Race'}
            value={this.state.character.race}
            onChangeText={race => this.set({race})}
          />

          <BoxInput
            name={'Experience Points'}
            value={this.state.character.exp}
            onChangeText={exp => this.set({exp})}
          />
        </View>
        <View style={styles.row}>
          <LineInput
            name={'Alignment'}
            value={this.state.character.alignment}
            onChangeText={alignment => this.set({alignment})}
          />
          <LineInput
            name={'Background'}
            value={this.state.character.background}
            onChangeText={background => this.set({background})}
          />
        </View>


        <View style={styles.row}>
          <View style={styles.column}>
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
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <BoxInput
                name={'Inspiration'}
                value={this.state.character.inspiration}
                onChangeText={inspiration => this.set({inspiration})}
              />
              <BoxInput
                name={'Proficiency Bonus'}
                value={this.state.character.proficiency}
                onChangeText={proficiency => this.set({proficiency})}
              />
              <BoxInput
                name={'Passive Wisdom (Perception)'}
                value={this.state.character.passiveWisdom}
                onChangeText={passiveWisdom => this.set({passiveWisdom})}
              />
            </View>

            <Field name='Saving Throws'>
              <SkillInput
                name='Strength'
                onClick={() => this.set({strengthProficient: !this.state.character.strengthProficient})}
                isChecked={this.state.character.strengthProficient}
                value={this.state.character.strength}
                proficiency={this.state.character.proficiency}
              />
            </Field>
            <Field name='Skills'>
            </Field>
          </View>
        </View>

        <View style={styles.row}>
          <BoxInput
            name={'Armor Class'}
            value={this.state.character.armorClass}
            onChangeText={armorClass => this.set({armorClass})}
          />
          <BoxInput
            name={'Initiative'}
            value={this.state.character.initiative}
            onChangeText={initiative => this.set({initiative})}
          />
          <BoxInput
            name={'Speed'}
            value={this.state.character.speed}
            onChangeText={speed => this.set({speed})}
          />
        </View>

        <View style={styles.row}>
          <BoxInput
            name={'Hit Point Maximum'}
            value={this.state.character.hpMax}
            onChangeText={hpMax => this.set({hpMax})}
          />
          <BoxInput
            name={'Current Hit Points'}
            value={this.state.character.hp}
            onChangeText={hp => this.set({hp})}
          />
          <BoxInput
            name={'Temporary Hit Points'}
            value={this.state.character.tempHP}
            onChangeText={tempHP => this.set({tempHP})}
          />
        </View>

        <MultiLineInput
          name={'Features & Traits'}
          value={this.state.character.featuresTraits}
          onChangeText={featuresTraits => this.set({featuresTraits})}
        />

        <MultiLineInput
          name={'Other Proficiencies & Languages'}
          value={this.state.character.proficiencyLanguages}
          onChangeText={proficiencyLanguages => this.set({proficiencyLanguages})}
        />

        <MultiLineInput
          name={'Personality Traits'}
          value={this.state.character.personalityTraits}
          onChangeText={personalityTraits => this.set({personalityTraits})}
        />

        <MultiLineInput
          name={'Ideals'}
          value={this.state.character.ideals}
          onChangeText={ideals => this.set({ideals})}
        />

        <MultiLineInput
          name={'Bonds'}
          value={this.state.character.bonds}
          onChangeText={bonds => this.set({bonds})}
        />

        <MultiLineInput
          name={'Flaws'}
          value={this.state.character.flaws}
          onChangeText={flaws => this.set({flaws})}
        />

        <MultiLineInput
          name={'Backstory'}
          value={this.state.character.backstory}
          onChangeText={backstory => this.set({backstory})}
        />

        <MultiLineInput
          name={'Allies & Organizations'}
          value={this.state.character.alliesOrganizations}
          onChangeText={alliesOrganizations => this.set({alliesOrganizations})}
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
  screen: {
    padding: 10
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})
