import React from 'react'
import autobind from 'autobind-decorator'
import {StyleSheet, View} from 'react-native'
import {Alert} from './Alert'
import {colors, BaseText, B, LightBox, showLightBox} from './styles.js'
import {getCharacter} from './auth'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {FlatList} from './FlatList'
import {TextInput} from './TextInput'
import {Button} from './Button'

export class AddGearScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      description: ''
    }

    if (this.props.update) {
      this.state = this.props.update
    }
  }

  render () {
    return <LightBox
      title={this.props.update ? 'Update Gear' : 'Add Gear'}
      navigator={this.props.navigator}>

      <TextInput
        label='Name'
        value={this.state.name}
        onChangeText={this.setName}
      />
      <TextInput
        label='Description'
        value={this.state.description}
        onChangeText={this.setDescription}
        multiline={true}
      />
      <Button
        title={this.props.update ? 'Update' : 'Add'}
        onPress={this.add}
      />
    </LightBox>
  }

  @autobind
  setName (name) {
    this.setState(prev => {
      return {name}
    })
  }

  @autobind
  setDescription (description) {
    this.setState(prev => {
      return {description}
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
        description: this.state.description
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
    return <View style={styles.row}>
      <View style={styles.column}>
        <B>{this.props.item.name}</B>
        <BaseText>{this.props.item.description}</BaseText>
      </View>
      <View style={styles.rowend}>
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
    return (
      <View style={styles.screen}>
        {
          this.state.gear.length === 0
            ? <View style={styles.centerp}>
              <BaseText>
                You don't have any gear. Maybe you should add some.
              </BaseText>
            </View>
            : null
        }

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
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
