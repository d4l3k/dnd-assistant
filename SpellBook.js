import React from 'react'
import { StyleSheet, Text, View, SectionList, TouchableNativeFeedback, Button } from 'react-native'
import spells from './dnd-spells/spells.json'
import ActionButton from 'react-native-action-button'
import HTMLView from 'react-native-htmlview'
import {getCharacter, slugify, onLogin} from './auth'

const spellMap = {}
spells.forEach(spell => {
  spellMap[slugify(spell.name)] = spell
})

class Quote extends React.Component {
  render () {
    return (
      <View style={{
        borderLeftWidth: 2,
        borderLeftColor: '#039be5',
        paddingLeft: 5,
        marginTop: 5,
        marginBottom: 5
      }}>
        {this.props.children}
      </View>
    )
  }
}

class SpellItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showDetail: false,
      spellData: {}
    }
  }

  componentDidMount () {
    this.spell = getCharacter().collection('spells').doc(slugify(this.props.spell.name))
    this.spell.onSnapshot(spell => {
      this.setState(state => {
        return {spellData: spell.data() || {}}
      })
    })
  }

  render () {
    return (
      <View>
        <TouchableNativeFeedback
            onPress={this._onPress.bind(this)}
            background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.item}>
            <View style={styles.row}>
              <View>
                <Text style={styles.bold}>{this.props.spell.name}</Text>
                <Text>{this.props.spell.class}</Text>
                <Text>{this.props.spell.school}</Text>
              </View>
              <View style={styles.right}>
                <Text>{this.props.spell.level}</Text>
                <Text>{this.props.spell.page}</Text>
                <Text>{this.props.spell.casting_time}, {this.props.spell.components}</Text>
              </View>
            </View>

            {this.detail()}
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  detail () {
    if (!this.state.showDetail) {
      return
    }

    return (
      <View style={styles.detail}>
        <View style={styles.row}>
          <View style={styles.grow}>
            <Text style={styles.bold}>Duration</Text>
            <Text>{this.props.spell.duration}</Text>
          </View>

          <View style={styles.grow}>
            <Text style={styles.bold}>Range</Text>
            <Text>{this.props.spell.range}</Text>
          </View>

          {this.props.spell.material ? <View style={styles.grow}>
            <Text style={styles.bold}>Material</Text>
            <Text>{this.props.spell.material}</Text>
            </View> : <View />}
        </View>

        <View style={styles.row}>
          <View style={styles.grow}>
            <Text style={styles.bold}>Concentration</Text>
            <Text>{this.props.spell.concentration}</Text>
          </View>

          <View style={styles.grow}>
            <Text style={styles.bold}>Ritual</Text>
            <Text>{this.props.spell.ritual}</Text>
          </View>
        </View>


        <Text style={styles.bold}>Description</Text>
        <Quote>
          <HTMLView
            value={this.props.spell.desc}
          />
        </Quote>

        {this.higherLevel()}

        <View style={styles.row}>
          <Button
            title="Cast"
            onPress={() => this._castSpell()}
          />

          {
            this.state.spellData.prepared ?
            <Button
              title="Unprepare"
              onPress={() => this._prepareSpell(false)}
            /> :
            <Button
              title="Prepare"
              onPress={() => this._prepareSpell(true)}
            />
          }

          {
            this.state.spellData.active ?
            <Button
              title="Remove"
              onPress={() => this._addSpell(false)}
            /> :
            <Button
              title="Add"
              onPress={() => this._addSpell(true)}
            />
          }
        </View>
      </View>
    )
  }

  _addSpell (active) {
    this.spell.set({active}, {merge: true})
  }

  _prepareSpell (prepared) {
    this.spell.set({prepared}, {merge: true})
  }

  higherLevel () {
    if (!this.props.spell.higher_level) {
      return
    }

    return (
      <View>
        <Text style={styles.bold}>Higher Level</Text>
        <Quote>
          <HTMLView
            value={this.props.spell.higher_level}
          />
        </Quote>
      </View>
    )
  }

  _onPress () {
    this.setState(prev => {
      return { showDetail: !prev.showDetail }
    })
  }
}

class SpellHeader extends React.Component {
  render () {
    return (
      <View style={styles.header}>
        <Text style={styles.bold}>{this.props.title}</Text>
      </View>
    )
  }
}

class SpellList extends React.Component {
  render () {
    return (
      <SectionList
        sections={this.groupSpells(this.props.spells)}
        keyExtractor={this.spellExtractor}
        renderSectionHeader={({section}) => <SpellHeader title={section.title} />}
        renderItem={({item}) => <SpellItem spell={item} />}
      />
    )
  }

  groupSpells (spells) {
    const sections = {}
    spells.forEach(spell => {
      sections[spell.level] = (sections[spell.level] || []).concat(spell)
    })

    return Object.keys(sections).sort().map(section => {
      return {
        title: section,
        data: sections[section]
      }
    })
  }

  spellExtractor (spell) {
    return spell.name
  }
}

export class KnownSpellsScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      spells: []
    }
  }

  componentDidMount () {
    onLogin(() => {
      this.spells = getCharacter().collection('spells')
      this.spells.onSnapshot(snapshot => {
        const spells = []
        snapshot.forEach(spell => {
          const data = spell.data()
          if (!data.active) {
            return
          }
          spells.push(spellMap[spell.id])
        })
        this.setState(state => {
          return {spells}
        })
      })
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <SpellList spells={this.state.spells} />

        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={this._onPress.bind(this)}
        />
      </View>
    )
  }

  _onPress () {
    this.props.navigator.push({
      screen: 'dnd.AddSpellScreen',
      title: 'Add Spell'
    });
  }
}

export class AddSpellScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <SpellList spells={spells} />

        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => { console.log("hi")}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  item: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  right: {
    alignItems: 'flex-end'
  },
  bold: {
    fontWeight: 'bold'
  },
  detail: {
    marginTop: 10
  },
  grow: {
    flexGrow: 10000,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#eee',
    padding: 10
  }
})
