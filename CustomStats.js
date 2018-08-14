import React from 'react'
import autobind from 'autobind-decorator'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {View, StyleSheet} from 'react-native'
import Cache from './Cache'

import {getCharacter} from './auth'
import {MarkdownInput} from './MarkdownInput'
import {BoxInput, ModInput, StatInput, LineInput, MultiLineInput, RelativeInput} from './characterInputs'
import {TextInput} from './TextInput'
import {colors, LightBox, showLightBox} from './styles.js'
import {Button} from './Button'
import {Picker, PickerItem} from './Picker'
import debounce from 'debounce'

const statTypes = {
  stat: {
    component: StatInput,
    desc: 'Takes a value 1-20 and converts to the modifier to be added to a d20. Ex: Strength',
    style: {
      maxWidth: 150,
    },
  },
  box: {
    component: BoxInput,
    desc: 'Simple box for a value. Ex: Hit Dice',
    style: {
      maxWidth: 150,
    },
  },
  mod: {
    component: ModInput,
    desc: 'Takes a modifer and adds it to a d20. Ex: Initiative',
    style: {
      maxWidth: 150,
    },
  },
  markdown: {
    component: MarkdownInput,
    desc: 'A markdown text box. Ex. Features'
  },
  relative: {
    component: RelativeInput,
    desc: 'A value that can be changed via relative values. Ex. HP',
    style: {
      maxWidth: 150,
    },
  },
  line: {
    component: LineInput,
    desc: 'A single line text box.'
  },
  multiline: {
    component: MultiLineInput,
    desc: 'A multi line text box.'
  },
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
        {Object.keys(statTypes).map((name) => {
          const type = statTypes[name]
          let label = name
          if (type.desc) {
            label += ' - ' + type.desc
          }
          return <PickerItem value={name} label={label} key={name} />
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
    this.debounceSet = debounce((stat, value) => {
      stat.collection.doc(stat.id).set(value, {merge: true})
    })
    this.cache = Cache()
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

  getComponentType (type) {
    const stat = statTypes[type]
    if (!stat) {
      return {
        component: BoxInput,
      }
    }
    return stat
  }

  @autobind
  renderStat (stat, key) {
    const type = this.getComponentType(stat.type)
    const Component = type.component

    return <View key={key} style={[styles.stat, type.style]}>
      <Component
        name={stat.name}
        value={stat.value}
        onChangeText={this.cache(value => this.set(stat, {value}), stat.id)}
        navigator={this.props.navigator}
      />
      <Ionicons.Button
        name='md-trash'
        color={colors.secondaryText}
        iconStyle={styles.button}
        backgroundColor='transparent'
        onPress={this.cache(() => {
          this.remove(stat)
        }, stat.id)}
      />
    </View>
  }

  set (stat, value) {
    this.setState(state => {
      const stats = [...state.stats]
      stats.forEach((s, i) => {
        if (s.id != stat.id) {
          return
        }

        stats[i] = {
          ...s,
          ...value,
        }
      })

      return {stats}
    })

    this.debounceSet(stat, value)
  }

  remove (stat) {
    stat.collection.doc(stat.id).delete()
  }

  renderStats () {
    return this.state.stats.map(this.renderStat)
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
    minWidth: 150,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
})
