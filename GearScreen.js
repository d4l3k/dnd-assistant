import React from 'react'
import autobind from 'autobind-decorator'
import {StyleSheet, View} from 'react-native'
import {Alert} from './Alert'
import {colors, BaseText, B, LightBox, Secondary, showLightBox, Header} from './styles.js'
import {getCharacter} from './auth'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {FlatList} from './FlatList'
import {TextInput} from './TextInput'
import {Button} from './Button'
import Cache from './Cache'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export class AddGearScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      weight: ''
    }

    if (this.props.update) {
      this.state = this.props.update
    }

    this.cache = Cache()
  }

  render () {
    return <LightBox
      title={this.props.update ? 'Update Gear' : 'Add Gear'}
      navigator={this.props.navigator}>

      <TextInput
        label='Name'
        value={this.state.name || ''}
        onChangeText={this.cache(name => this.set({name}))}
      />
      <TextInput
        label='Description'
        value={this.state.description || ''}
        onChangeText={this.cache(description => this.set({description}))}
        multiline={true}
      />
      <TextInput
        label='Weight'
        value={this.state.weight || ''}
        onChangeText={this.cache(weight => this.set({weight}))}
      />
      <Button
        title={this.props.update ? 'Update' : 'Add'}
        onPress={this.add}
      />
    </LightBox>
  }

  @autobind
  set (state) {
    this.setState(prev => {
      return state
    })
  }

  @autobind
  add () {
    if (!this.state.name) {
      return
    }

    getCharacter().then(character => {
      const gear = character.collection('gear')

      const item = {
        name: this.state.name,
        description: this.state.description,
        weight: this.state.weight
      }
      if (this.props.update) {
        return gear.doc(this.props.update.id).set(item, {merge: true})
      }
      item.count = '1'
      return gear.add(item)
    }).then(() => {
      this.props.navigator.dismissLightBox()
    })
  }
}

class GearItem extends React.PureComponent {
  constructor (props) {
    super(props)

    this._remove = () => {
      this.props.parent._remove(this.props.item)
    }
    this._edit = () => {
      this.props.parent._edit(this.props.item)
    }
    this._setCount = (text) => {
      this.props.parent._setCount(this.props.item, text)
    }
  }

  render () {
    return <View style={styles.item}>
      <View style={styles.column}>
        <B>{this.props.item.name}</B>
        <View style={styles.row}>
          <BaseText>{this.props.item.description}</BaseText>
        </View>
      </View>
      <View style={styles.rowend}>
        {this.renderWeight()}

        <View style={styles.input}>
          <TextInput
            value={this.props.item.count}
            onChangeText={this._setCount}
            keyboardType={'numeric'}
          />
        </View>
        <Ionicons.Button
          name='md-create'
          color={colors.secondaryText}
          iconStyle={styles.button}
          backgroundColor='transparent'
          onPress={this._edit}
        />
        <Ionicons.Button
          name='md-trash'
          color={colors.secondaryText}
          iconStyle={styles.button}
          backgroundColor='transparent'
          onPress={this._remove}
        />
      </View>
    </View>
  }

  renderWeight () {
    const weight = gearWeight(this.props.item)
    return renderWeight(weight)
  }
}

function gearWeight (item) {
  return parseFloat(item.weight || 0) * parseFloat(item.count || 0)
}

function renderWeight (weight) {
  if (!weight) {
    return
  }

  return <View style={styles.rowend}>
    <MaterialCommunityIcons name='weight' size={18} color={colors.secondaryText} />
    <Secondary>{weight}</Secondary>
  </View>
}

export class GearScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      gear: [],
      modalVisible: false
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))

    this._renderItem = ({item}) => {
      return <GearItem item={item} parent={this} />
    }
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.gear = character.collection('gear')
      this.unsubscribe = this.gear.onSnapshot(results => {
        const gear = []
        results.forEach(result => {
          const data = result.data()
          data.id = result.id
          gear.push(data)
        })
        gear.sort((a, b) => {
          return a.name < b.name ? -1 : 1
        })

        this.setState(state => {
          return {gear}
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
    if (this.state.gear.length === 0) {
      return <View style={styles.centerp}>
        <BaseText>
          You don't have any gear. Maybe you should add some.
        </BaseText>
      </View>
    }
    const weight = this.state.gear.map(gearWeight).reduce((a, b) => a + b, 0)

    return (
      <View style={styles.screen}>
        <Header>
          <BaseText>{this.state.gear.length} items</BaseText>
          {renderWeight(weight)}
        </Header>

        <FlatList
          data={this.state.gear}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    )
  }

  _keyExtractor (item) {
    return item.id
  }

  _edit (item) {
    showLightBox(this.props.navigator, 'dnd.AddGearScreen', {update: item})
  }

  _remove (item) {
    Alert.alert(
      'Remove Gear',
      item.name,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          onPress: () => {
            this.gear.doc(item.id).delete()
          },
          style: 'destructive'
        }
      ]
    )
  }

  _setCount (item, text) {
    this.setState(prev => {
      const gear = []
      prev.gear.forEach(a => {
        if (a.id === item.id) {
          a.count = text
        }
        gear.push(a)
      })
      return {gear}
    })

    this.gear.doc(item.id).set({
      count: text
    }, {merge: true})
  }

  onNavigatorEvent (event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        showLightBox(this.props.navigator, 'dnd.AddGearScreen')
      }
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  column: {
    flex: 1,
    justifyContent: 'space-around'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  rowend: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  centerp: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  button: {
    marginRight: 0
  },
  input: {
    marginLeft: 10,
    width: 70
  }
})
