import React from 'react'
import {Button, StyleSheet, View} from 'react-native'
import {Alert} from './Alert'
import {colors, BaseText, B, LightBox, showLightBox, TextInput} from './styles.js'
import {getCharacter} from './auth'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {FlatList} from './sectionlist'

export class AddGearScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      text: ''
    }
  }

  render () {
    return <LightBox title="Add Gear" navigator={this.props.navigator}>
      <BaseText>Name</BaseText>
      <TextInput
        value={this.state.text}
        onChangeText={text => this._setText(text)}
      />
      <Button
        title={'Add'}
        onPress={() => this._add()}
      />
    </LightBox>
  }

  _setText (text) {
    this.setState(prev => {
      return {text}
    })
  }

  _add () {
    getCharacter().then(character => {
      if (!this.state.text) {
        return
      }
      return character.collection('gear').add({
        name: this.state.text,
        count: '1'
      })
    }).then(() => {
      this.props.navigator.dismissLightBox()
    })
  }
}

export class GearScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      gear: [],
      modalVisible: false
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
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
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <View style={styles.row}>
            <B>{item.name}</B>
            <View style={styles.rowend}>
              <TextInput
                value={item.count}
                onChangeText={text => this._setCount(item, text)}
                keyboardType={'numeric'}
              />
              <Ionicons.Button
                name="md-trash"
                color={colors.secondaryText}
                iconStyle={{marginRight: 0}}
                backgroundColor="transparent"
                onPress={() => this._remove(item)}
              />
            </View>
          </View>}
        />
      </View>
    )
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
  }
})
