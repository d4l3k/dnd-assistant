import React from 'react'
import autobind from 'autobind-decorator'
import firebase from './firebase'
import {StyleSheet, View, ScrollView} from 'react-native'
import {Alert} from './Alert'
import {colors, BaseText, B, LightBox, Secondary, showLightBox, Header, Error, H2} from './styles.js'
import {getCharacter} from './auth'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {SectionList} from './sectionlist'
import {TextInput} from './TextInput'
import {Button} from './Button'
import Cache from './Cache'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export class InventorySettingItem extends React.PureComponent {
  render () {
    return <View style={styles.item}>
      <View style={styles.column}>
        <TextInput
          label='Name'
          value={this.props.inventory.name}
          onChangeText={this.setName}
        />
        <TextInput
          label='Inventory ID'
          value={this.props.inventory.id}
        />
      </View>

      <View style={styles.rowend}>
        <Ionicons.Button
          name='md-close'
          color={colors.secondaryText}
          iconStyle={styles.button}
          backgroundColor='transparent'
          onPress={this.remove}
        />
      </View>
    </View>
  }

  @autobind
  setName (name) {
    this.props.inventory.ref.set({name}, {merge: true})
  }

  @autobind
  remove () {
    this.props.inventory.characterInvRef.delete()
  }
}

export class GearSettingsScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      inventories: {}
    }

    this.inventoriesKeys = {}

    this.cache = Cache()
    this.unsubscribe = []
  }

  componentDidMount () {
    listenInventory(this, true)
  }

  componentWillUnmount () {
    this.unsubscribe.forEach(a => a())
    this.unsubscribe = []
  }

  render () {
    return <ScrollView style={[styles.screen]}>
      <H2>Shared Inventories</H2>
      {this.inventoryMeta().map(
        inventory => <InventorySettingItem key={inventory.id} inventory={inventory} />
      )}

      <H2>Create Shared Inventory</H2>
      <TextInput
        label='Name'
        value={this.state.name || ''}
        onChangeText={this.cache(name => this.set({name}))}
      />
      <Button
        title='Create'
        onPress={this.create}
      />

      <H2>Add Existing Shared Inventory</H2>
      <TextInput
        label='Inventory ID'
        value={this.state.iid || ''}
        onChangeText={this.cache(iid => this.set({iid}))}
      />
      <Error error={this.state.addError} />
      <Button
        title='Add'
        onPress={this.add}
      />
    </ScrollView>
  }

  inventoryMeta () {
    return Object.keys(this.state.inventories).sort().map(a => this.state.inventories[a])
  }

  @autobind
  create () {
    if (!this.state.name) {
      return
    }

    firebase.firestore().collection('inventories').add({name: this.state.name}).then(ref => {
      console.log('add succeeded')
      return this.addInventory(ref.id)
    }).then(() => {
      this.set({name: ''})
    })
  }

  addInventory (id) {
    return this.props.character.collection('inventories').doc(id).set({id})
  }

  @autobind
  add () {
    if (!this.state.iid) {
      return
    }

    const ref = firebase.firestore().collection('inventories').doc(this.state.iid)

    ref.get().then(inv => {
      if (!inv.exists) {
        throw 'Invalid Inventory ID'
      }

      return this.addInventory(this.state.iid)
    }).catch(e => {
      this.setState(prev => {
        return {addError: e}
      })
    })
  }

  @autobind
  set (state) {
    this.setState(prev => {
      return state
    })
  }
}

export class AddGearScreen extends React.PureComponent {
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

    Promise.resolve(this.props.gear).then(gear => {
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
        <BaseText>{this.props.item.name}</BaseText>
        <Secondary>{this.props.item.description}</Secondary>
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

function listenInventory (self, noGear) {
  getCharacter().then(character => {
    self.character = character
    self.gear = character.collection('gear')
    self.unsubscribe.push(self.gear.onSnapshot(results => {
      const gear = []
      results.forEach(result => {
        const data = result.data()
        data.id = result.id
        data.gear = self.gear
        gear.push(data)
      })
      gear.sort((a, b) => {
        return a.name < b.name ? -1 : 1
      })

      self.setState(state => {
        return {gear}
      })
    }))

    self.inventories = character.collection('inventories')
    self.unsubscribe.push(self.inventories.onSnapshot(results => {
      const exist = {}
      results.forEach(result => {
        exist[result.id] = true
      })

      Object.keys(self.inventoriesKeys).forEach(id => {
        if (exist[id]) {
          return
        }

        self.inventoriesKeys[id].forEach(unsubscribe => unsubscribe())
        delete self.inventoriesKeys[id]

        self.setState(prev => {
          const inventories = {
            ...prev.inventories
          }
          delete inventories[id]
          const inventoryGear = {
            ...prev.inventoryGear
          }
          delete inventoryGear[id]

          return {inventories, inventoryGear}
        })
      })

      results.forEach(result => {
        const id = result.id
        if (self.inventoriesKeys[id]) {
          return
        }

        const unsubscribe = []

        const invRef = firebase.firestore().collection('inventories').doc(id)
        unsubscribe.push(invRef.onSnapshot(inventory => {
          self.setState(prev => {
            const inventories = {
              ...prev.inventories
            }

            inventories[id] = {
              ...inventory.data(),
              id: inventory.id,
              ref: invRef,
              characterInvRef: self.inventories.doc(id)
            }

            return {inventories}
          })
        }))

        if (!noGear) {
          const gearRef = invRef.collection('gear')
          unsubscribe.push(gearRef.onSnapshot(results => {
            const gear = []
            results.forEach(result => {
              const data = result.data()
              data.id = result.id
              data.gear = gearRef
              gear.push(data)
            })
            gear.sort((a, b) => {
              return a.name < b.name ? -1 : 1
            })

            self.setState(state => {
              const inventoryGear = {
                ...state.inventoryGear
              }
              inventoryGear[id] = gear
              return {inventoryGear}
            })
          }))
        }

        self.unsubscribe = self.unsubscribe.concat(unsubscribe)
        self.inventoriesKeys[id] = unsubscribe
      })
    }))
  })
}

export class GearScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      gear: [],
      modalVisible: false,
      inventories: {},
      inventoryGear: {}
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))

    this._renderItem = ({item}) => {
      return <GearItem item={item} parent={this} />
    }
    this.unsubscribe = []
    this.inventoriesKeys = {}

    this.cache = Cache()
  }

  componentDidMount () {
    listenInventory(this)
  }

  componentWillUnmount () {
    this.unsubscribe.forEach(a => a())
    this.unsubscribe = []
  }

  render () {
    const sections = this.getSections()

    if (sections.length === 0 || (sections.length === 1 && sections[0].data.length === 0)) {
      return <View style={styles.centerp}>
        <BaseText>
          You don't have any gear. Maybe you should add some.
        </BaseText>
      </View>
    }

    return (
      <View style={styles.screen}>
        <SectionList
          sections={sections}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          stickySectionHeadersEnabled={true}
        />
      </View>
    )
  }

  getSections () {
    const sections = [
      {
        name: 'Your Gear',
        data: this.state.gear
      }
    ]

    for (const key of Object.keys(this.state.inventories).sort()) {
      sections.push({
        ...this.state.inventories[key],
        data: this.state.inventoryGear[key] || []
      })
    }
    return sections
  }

  @autobind
  _renderSectionHeader ({section}) {
    const weight = section.data.map(gearWeight).reduce((a, b) => a + b, 0)

    return <Header right={
      <Ionicons.Button
        name='md-add'
        color={colors.secondaryText}
        iconStyle={styles.button}
        backgroundColor='transparent'
        onPress={this.cache(() => this.add(section), section.id)}
      />
    }>
      <B>{section.name}</B>
      {renderWeight(weight)}
    </Header>
  }

  @autobind
  add (section) {
    let invRef = section.id
      ? firebase.firestore().collection('inventories').doc(section.id).collection('gear')
      : null
    this.openAddGearScreen(null, invRef)
  }

  _keyExtractor (item) {
    return item.id
  }

  _edit (item) {
    this.openAddGearScreen({update: item}, item.gear)
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
            item.gear.doc(item.id).delete()
          },
          style: 'destructive'
        }
      ]
    )
  }

  _setCount (item, text) {
    item.gear.doc(item.id).set({
      count: text
    }, {merge: true})
  }

  openAddGearScreen (props, ref) {
    showLightBox(this.props.navigator, 'dnd.AddGearScreen', {
      ...props,
      gear: ref || this.gear
    })
  }

  onNavigatorEvent (event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        this.openAddGearScreen()
      } else if (event.id === 'share') {
        this.props.navigator.push({
          screen: 'dnd.GearSettingsScreen',
          title: 'Gear Settings',
          passProps: {
            character: this.character
          }
        })
      }
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16
  },
  column: {
    flex: 4,
    justifyContent: 'space-around'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    //borderBottomWidth: 1,
    //borderBottomColor: colors.border,
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
  nopadding: {
    margin: -8
  },
  input: {
    marginLeft: 10,
    width: 70
  }
})
