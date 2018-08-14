import React from 'react'
import autobind from 'autobind-decorator'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {View, StyleSheet} from 'react-native'

import {getCharacter} from './auth'
import {MarkdownInput} from './MarkdownInput'
import {BoxInput, ModInput, StatInput, LineInput, MultiLineInput, RelativeInput} from './characterInputs'
import {TextInput} from './TextInput'
import {colors, LightBox, showLightBox} from './styles.js'
import {Button} from './Button'
import {Picker, PickerItem} from './Picker'

const statTypes = {
  stat: StatInput,
  box: BoxInput,
  mod: ModInput,
  markdown: MarkdownInput,
  relative: RelativeInput,
  line: LineInput,
  multiline: MultiLineInput,
}

export class AddCustomStatScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      type: 'box'
    }
  }

  @autobind
  add () {
    this.props.customStats.add({
      name: this.state.name,
      value: '',
      type: this.state.type,
    }).then(() => {
      this.props.navigator.dismissLightBox()
    })
  }

  render () {
    return <LightBox
      title={'Add Custom Stat'}
      navigator={this.props.navigator}>

      <TextInput
        label='Name'
        value={this.state.name || ''}
        onChangeText={name => this.setState({name})}
      />

      <Picker
        label='Type'
        selectedValue={this.state.type}
        onValueChange={type => this.setState({type})}>
        {Object.keys(statTypes).map((type) => {
          return <PickerItem value={type} label={type} key={type} />
        })}
      </Picker>

      <Button
        title={'Add'}
        onPress={this.add}
      />
    </LightBox>
  }
}

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
      this.customStats = collection
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
    let Type = statTypes[stat.type] || BoxInput

    return <Type
      name={stat.name}
      value={stat.value}
      onChangeText={value => this.set(stat, {value})}
      navigator={this.props.navigator}
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

  @autobind
  add () {
    showLightBox(this.props.navigator, 'dnd.AddCustomStatScreen', {
      customStats: this.customStats,
    })
  }

  render () {
    return <View style={styles.container}>
      {this.renderStats()}

      <Ionicons.Button
        name='md-add'
        color={colors.secondaryText}
        iconStyle={styles.button}
        backgroundColor='transparent'
        onPress={this.add}
      />
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
