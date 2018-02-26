import React from 'react'
import autobind from 'autobind-decorator'
import {View, StyleSheet, Text} from 'react-native'
import {TextInput} from './TextInput'
import {BaseText, Field, colors, showLightBox, LightBox} from './styles.js'
import {DieRoll, rollFate} from './DieRoll'
import {CheckBox} from './CheckBox'
import Ionicons from 'react-native-vector-icons/Ionicons'

export class SkillInput extends React.PureComponent {
  render () {
    const value = this.value()

    return <View style={styles.skillinput}>
      <CheckBox
        onClick={this.props.onClick}
        isChecked={!!this.props.isChecked}
      />
      <View style={{width: 30, alignItems: 'flex-end', margin: 5}}>
        <BaseText>{value}</BaseText>
      </View>
      <BaseText>
        {this.props.name}
        {
          this.props.secondary
            ? <Text style={{color: colors.secondaryText}}> ({this.props.secondary})</Text>
            : null
        }
      </BaseText>

      <View style={styles.rowend}>
        <DieRoll modifier={parseMod(value)} />
      </View>
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
        <View style={styles.rowcenteritems}>
          <BaseText>{this.modifier(this.props.value)}</BaseText>
          <DieRoll modifier={statToMod(this.props.value)} />
        </View>
      </Field>
    )
  }

  modifier (val) {
    return modString(statToMod(val))
  }
}

export class ApproachInput extends React.PureComponent {
  render () {
    return (
      <Field name={this.props.name}>
        <View style={styles.row}>
          <TextInput
            value={this.props.value || ''}
            onChangeText={this.props.onChangeText}
            keyboardType={'numeric'}
          />
          <DieRoll modifier={this.props.value} roll={rollFate} mod />
        </View>
      </Field>
    )
  }

  modifier (val) {
    return modString(statToMod(val))
  }
}

function statToMod (val) {
  const num = (parseMod(val || 10) - 10) / 2
  return Math.floor(num)
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

export class RelativeInput extends React.PureComponent {
  render () {
    return <Field name={this.props.name}>
      <View style={styles.rowcenter}>
        <TextInput
          value={this.props.value || ''}
          onChangeText={this.props.onChangeText}
          keyboardType={'numeric'}
          flex
        />

        <Ionicons.Button
          name='md-add'
          color={colors.secondaryText}
          iconStyle={styles.button}
          backgroundColor='transparent'
          onPress={this.add}
        />
      </View>
    </Field>
  }

  @autobind
  add () {
    showLightBox(this.props.navigator, 'dnd.AddHealthScreen', {
      add: (relative) => {
        const value = parseFloat(this.props.value || 0) + relative
        this.props.onChangeText(value + '')
      }
    })
  }
}

export const ModInput = (props) => {
  return <Field name={props.name}>
    <View style={styles.rowcenter}>
      <TextInput
        value={props.value || ''}
        onChangeText={props.onChangeText}
        keyboardType={'numeric'}
        flex
      />

      <DieRoll modifier={parseMod(props.value)} />
    </View>
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
