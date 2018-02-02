import React from 'react'
import autobind from 'autobind-decorator'
import {Platform, StyleSheet, View, Text, ScrollView} from 'react-native'
import {googleLogin, getCharacter, viewedCharacter, getUser} from './auth'
import firebase from './firebase'
import {BaseText, Field, Center, colors} from './styles.js'
import {TextInput} from './TextInput'
import {CheckBox} from './CheckBox'
import Cache from './Cache'
import {HealthBar} from './HealthBar'

const debounceTime = 300

export class SkillInput extends React.PureComponent {
  render () {
    return <View style={styles.skillinput}>
      <CheckBox
        onClick={this.props.onClick}
        isChecked={this.props.isChecked}
      />
      <View style={{width: 20, alignItems: 'flex-end', margin: 5}}>
        <BaseText>{this.value()}</BaseText>
      </View>
      <BaseText>
        {this.props.name}
        {
          this.props.secondary
            ? <Text style={{color: colors.secondaryText}}> ({this.props.secondary})</Text>
            : null
        }
      </BaseText>
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

export class StatInput extends React.PureComponent {
  render () {
    return (
      <Field name={this.props.name}>
        <TextInput
          value={this.props.value || ''}
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
  const num = (parseMod(val || 10) - 10) / 2
  return num < 0 ? Math.ceil(num) : Math.floor(num)
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


export const BoxInput = (props) => {
  return <Field name={props.name}>
    <TextInput
      value={props.value || ''}
      onChangeText={props.onChangeText}
      keyboardType={'numeric'}
    />
  </Field>
}


export const LineInput = (props) => {
  return <Field name={props.name}>
    <TextInput
      value={props.value || ''}
      onChangeText={props.onChangeText}
    />
  </Field>
}

export const MultiLineInput = (props) => {
  return <Field name={props.name}>
    <TextInput
      value={props.value || ''}
      multiline={true}
      onChangeText={props.onChangeText}
    />
  </Field>
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
      character: {
        name: 'Loading...'
      }
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
      this.character.onSnapshot(character => {
        this.setState(prev => {
          const state = {}
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

  render () {
    return (
      <ScrollView style={styles.screen}>
        <View style={styles.row}>
          <LineInput
            name={'Character Name'}
            value={this.state.character_name}
            onChangeText={this.cache(name => this.set({name}))}
          />
          <LineInput
            name={'Class & Level'}
            value={this.state.character_classLevel}
            onChangeText={this.cache(classLevel => this.set({classLevel}))}
          />
        </View>

        <View style={styles.row}>
          <LineInput
            name={'Race'}
            value={this.state.character_race}
            onChangeText={this.cache(race => this.set({race}))}
          />

          <BoxInput
            name={'Experience Points'}
            value={this.state.character_exp}
            onChangeText={this.cache(exp => this.set({exp}))}
          />
        </View>
        <View style={styles.row}>
          <LineInput
            name={'Alignment'}
            value={this.state.character_alignment}
            onChangeText={this.cache(alignment => this.set({alignment}))}
          />
          <LineInput
            name={'Background'}
            value={this.state.character_background}
            onChangeText={this.cache(background => this.set({background}))}
          />
        </View>

        <View style={styles.row}>
          <BoxInput
            name={'Hit Point Maximum'}
            value={this.state.character_hpMax}
            onChangeText={this.cache(hpMax => this.set({hpMax}))}
          />
          <BoxInput
            name={'Current Hit Points'}
            value={this.state.character_hp}
            onChangeText={this.cache(hp => this.set({hp}))}
          />
          <BoxInput
            name={'Temporary Hit Points'}
            value={this.state.character_tempHP}
            onChangeText={this.cache(tempHP => this.set({tempHP}))}
          />
        </View>

        <HealthBar max={this.state.character_hpMax} current={this.state.character_hp} />

        <View style={styles.row}>
          <View style={styles.columnNarrow}>
            <StatInput
              name={'Strength'}
              value={this.state.character_strength}
              onChangeText={this.cache(strength => this.set({strength}))}
            />
            <StatInput
              name={'Dexterity'}
              value={this.state.character_dexterity}
              onChangeText={this.cache(dexterity => this.set({dexterity}))}
            />
            <StatInput
              name={'Constitution'}
              value={this.state.character_constitution}
              onChangeText={this.cache(constitution => this.set({constitution}))}
            />
            <StatInput
              name={'Intelligence'}
              value={this.state.character_intelligence}
              onChangeText={this.cache(intelligence => this.set({intelligence}))}
            />
            <StatInput
              name={'Wisdom'}
              value={this.state.character_wisdom}
              onChangeText={this.cache(wisdom => this.set({wisdom}))}
            />
            <StatInput
              name={'Charisma'}
              value={this.state.character_charisma}
              onChangeText={this.cache(charisma => this.set({charisma}))}
            />

            <BoxInput
              name={'Passive Wisdom (Perception)'}
              value={this.state.character_passiveWisdom}
              onChangeText={this.cache(passiveWisdom => this.set({passiveWisdom}))}
            />
          </View>
          <View style={styles.column}>
            <View style={styles.rownoflex}>
              <BoxInput
                name={'Inspiration'}
                value={this.state.character_inspiration}
                onChangeText={this.cache(inspiration => this.set({inspiration}))}
              />
              <BoxInput
                name={'Proficiency Bonus'}
                value={this.state.character_proficiency}
                onChangeText={this.cache(proficiency => this.set({proficiency}))}
              />
            </View>

            <Field name='Saving Throws' flex={0}>
              {
                this.renderSkills([
                  ['Strength'],
                  ['Dexterity'],
                  ['Constitution'],
                  ['Intelligence'],
                  ['Wisdom'],
                  ['Charisma']
                ])
              }
            </Field>

            <Field name='Skills'>
              {
                this.renderSkills([
                  ['Acrobatics', 'dexterity'],
                  ['Animal Handling', 'wisdom'],
                  ['Arcana', 'intelligence'],
                  ['Athletics', 'strength'],
                  ['Deception', 'charisma'],
                  ['History', 'intelligence'],
                  ['Insight', 'wisdom'],
                  ['Intimidation', 'charisma'],
                  ['Investigation', 'intelligence'],
                  ['Medicine', 'wisdom'],
                  ['Nature', 'intelligence'],
                  ['Perception', 'wisdom'],
                  ['Performance', 'charisma'],
                  ['Persuasion', 'charisma'],
                  ['Religion', 'intelligence'],
                  ['Slight Of Hand', 'dexterity'],
                  ['Stealth', 'dexterity'],
                  ['Survival', 'wisdom']
                ])
              }
            </Field>
          </View>
        </View>

        <View style={styles.row}>
          <BoxInput
            name={'Armor Class'}
            value={this.state.character_armorClass}
            onChangeText={this.cache(armorClass => this.set({armorClass}))}
          />
          <BoxInput
            name={'Initiative'}
            value={this.state.character_initiative}
            onChangeText={this.cache(initiative => this.set({initiative}))}
          />
          <BoxInput
            name={'Speed'}
            value={this.state.character_speed}
            onChangeText={this.cache(speed => this.set({speed}))}
          />
        </View>

        <View style={styles.row}>
          <Field name='Hit Dice'>
            <TextInput
              value={this.state.character_hitDice || ''}
              onChangeText={this.cache(hitDice => this.set({hitDice}))}
            />
          </Field>
          <View style={styles.col4}>
            <Field name='Death Saves'>
              <View style={[styles.rowcenter, styles.wrap]}>
                <BaseText>Successes</BaseText>

                <View style={[styles.rowend, styles.wrap]}>
                  <CheckBox
                    onClick={this.cache(() => this.set({deathSuccess1: !this.state.character_deathSuccess1}))}
                    isChecked={!!this.state.character_deathSuccess1}
                  />

                  <CheckBox
                    onClick={this.cache(() => this.set({deathSuccess2: !this.state.character_deathSuccess2}))}
                    isChecked={!!this.state.character_deathSuccess2}
                  />

                  <CheckBox
                    onClick={this.cache(() => this.set({deathSuccess3: !this.state.character_deathSuccess3}))}
                    isChecked={!!this.state.character_deathSuccess3}
                  />
                </View>
              </View>

              <View style={[styles.rowcenter, styles.wrap]}>
                <BaseText>Failures</BaseText>

                <View style={[styles.rowend, styles.wrap]}>
                  <CheckBox
                    onClick={this.cache(() => this.set({deathFail1: !this.state.character_deathFail1}))}
                    isChecked={!!this.state.character_deathFail1}
                  />

                  <CheckBox
                    onClick={this.cache(() => this.set({deathFail2: !this.state.character_deathFail2}))}
                    isChecked={!!this.state.character_deathFail2}
                  />

                  <CheckBox
                    onClick={this.cache(() => this.set({deathFail3: !this.state.character_deathFail3}))}
                    isChecked={!!this.state.character_deathFail3}
                  />
                </View>
              </View>
            </Field>
          </View>
        </View>

        <View style={styles.row}>
          <BoxInput
            name={'Spellcasting Ability'}
            value={this.state.character_spellcastingAbility}
            onChangeText={this.cache(spellcastingAbility => this.set({spellcastingAbility}))}
          />

          <BoxInput
            name={'Spell Save DC'}
            value={this.state.character_spellSaveDC}
            onChangeText={this.cache(spellSaveDC => this.set({spellSaveDC}))}
          />

          <BoxInput
            name={'Spell Attack Bonus'}
            value={this.state.character_spellAttackBonus}
            onChangeText={this.cache(spellAttackBonus => this.set({spellAttackBonus}))}
          />
        </View>

        <MultiLineInput
          name={'Features & Traits'}
          value={this.state.character_featuresTraits}
          onChangeText={this.cache(featuresTraits => this.set({featuresTraits}))}
        />

        <MultiLineInput
          name={'Other Proficiencies & Languages'}
          value={this.state.character_proficiencyLanguages}
          onChangeText={this.cache(proficiencyLanguages => this.set({proficiencyLanguages}))}
        />

        <MultiLineInput
          name={'Personality Traits'}
          value={this.state.character_personalityTraits}
          onChangeText={this.cache(personalityTraits => this.set({personalityTraits}))}
        />

        <MultiLineInput
          name={'Ideals'}
          value={this.state.character_ideals}
          onChangeText={this.cache(ideals => this.set({ideals}))}
        />

        <MultiLineInput
          name={'Bonds'}
          value={this.state.character_bonds}
          onChangeText={this.cache(bonds => this.set({bonds}))}
        />

        <MultiLineInput
          name={'Flaws'}
          value={this.state.character_flaws}
          onChangeText={this.cache(flaws => this.set({flaws}))}
        />

        <View style={styles.row}>
          <LineInput
            name={'Age'}
            value={this.state.character_age}
            onChangeText={this.cache(age => this.set({age}))}
          />

          <LineInput
            name={'Height'}
            value={this.state.character_height}
            onChangeText={this.cache(height => this.set({height}))}
          />

          <LineInput
            name={'Weight'}
            value={this.state.character_weight}
            onChangeText={this.cache(weight => this.set({weight}))}
          />
        </View>

        <View style={styles.row}>
          <LineInput
            name={'Eyes'}
            value={this.state.character_eyes}
            onChangeText={this.cache(eyes => this.set({eyes}))}
          />

          <LineInput
            name={'Skin'}
            value={this.state.character_skin}
            onChangeText={this.cache(skin => this.set({skin}))}
          />

          <LineInput
            name={'Hair'}
            value={this.state.character_hair}
            onChangeText={this.cache(hair => this.set({hair}))}
          />
        </View>

        <MultiLineInput
          name={'Backstory'}
          value={this.state.character_backstory}
          onChangeText={this.cache(backstory => this.set({backstory}))}
        />

        <MultiLineInput
          name={'Allies & Organizations'}
          value={this.state.character_alliesOrganizations}
          onChangeText={this.cache(alliesOrganizations => this.set({alliesOrganizations}))}
        />
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
        onClick={this.cache(() => {
          const props = {}
          props[propName] = !this.state[characterPrefix + propName]
          this.set(props)
        }, propName)}
        isChecked={!!this.state[characterPrefix + propName]}
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
        console.log('firebase set', obj)
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
      }
    }
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
          ? <LineInput
            name={'Viewing URL'}
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
    margin: 5
  },
  settingsscreen: {
    padding: 10
  },
  column: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  columnNarrow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
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
  col4: {
    flex: 4
  }
})
