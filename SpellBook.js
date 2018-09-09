import React from 'react'
import autobind from 'autobind-decorator'
import {StyleSheet, View, ScrollView, Platform, Text} from 'react-native'
import {Alert} from './Alert'
import Ionicons from 'react-native-vector-icons/Ionicons'
import titleCase from 'title-case'

import dataSpells from './data/spellData.json'
import dataDisciplines from './data/disciplines.json'

import HTMLView from 'react-native-htmlview'
import {getCharacter, slugify} from './auth'
import {colors, BaseText, B, H2, H3, Secondary,LightBox, showLightBox, Touchable, H1, Header} from './styles.js'
import {SectionList} from './sectionlist'
import {Recycler} from './recycler'
import {TextInput} from './TextInput'
import Cache from './Cache'
import {Button} from './Button'
import {iconsMap} from './icons'
import lunr from 'lunr'
import {ExtractDieRolls} from './DieRoll'

const numSlotLevels = 9

const spells = dataSpells.concat(dataDisciplines)

const spellMap = {}
spells.forEach(spell => {
  spellMap[slugify(spell.name)] = spell
})

export class CastSpellScreen extends React.PureComponent {
  render () {
    return <LightBox title='Cast Spell' navigator={this.props.navigator}>
      {
        this.renderButtons()
      }
    </LightBox>
  }

  renderButtons () {
    const slots = Object.values(this.props.slots)

    if (slots.length === 0) {
      return <View style={styles.centerp}>
        <BaseText>
          You haven't configured any spell slots yet.
        </BaseText>
        <Button title='Configure Slots' onPress={this.openSpellSettings} />
      </View>
    }
    return slots.map((slot, i) => <View
      key={i}
      style={styles.buttonMargin}>

      <Button
        title={this._title(slot)}
        onPress={() => this._cast(slot)}
      />
    </View>)
  }

  @autobind
  openSpellSettings () {
    openSpellSettings(this.props.navigator)
  }

  _cast (slot) {
    getCharacter().then(character => {
      character.collection('slots').doc(slot.id).collection('spells').add({
        spell: this.props.spell.name
      }).then(() => {
        this.props.navigator.dismissLightBox()
      })
    })
  }

  _title (slot) {
    const used = (slot.spells || []).length
    return `Level ${slot.id} (used ${used} / ${slot.count})`
  }
}

class Quote extends React.PureComponent {
  render () {
    return (
      <View style={{
        borderLeftWidth: 2,
        borderLeftColor: colors.primary,
        paddingLeft: 5,
        marginTop: 5,
        marginBottom: 5
      }}>
        {this.props.children}
      </View>
    )
  }
}

class AbilityItem extends React.PureComponent {
  constructor (props) {
    super(props)

    this.cache = Cache()
    this.state = {
      expand: false
    }
  }

  @autobind
  onPress () {
    this.setState(state => {
      return {
        expand: !state.expand
      }
    })
  }

  render () {
    return (
      <View style={styles.subitem}>
        <Touchable onPress={this.onPress}>
          <View style={styles.iteminner}>
            {this.header()}
            {this.detail()}
          </View>
        </Touchable>

        {this.buttons()}
      </View>
    )
  }

  header () {
    let desc = this.props.ability.cost
    if (this.props.ability.concentration === 'yes') {
      desc += '; concentration'
    }
    if (this.props.ability.duration) {
      desc += '; ' + this.props.ability.duration
    }
    return <View style={styles.row}>
      <H3>{this.props.ability.name}</H3>
      <BaseText>{desc}</BaseText>
    </View>
  }

  detail () {
    if (!this.state.expand) {
      return
    }

    return <Quote>
      <BaseText>{this.props.ability.desc}</BaseText>
    </Quote>
  }

  castSpell (cost) {
    const parts = cost.split(' ')
    if (parts.length !== 2) {
      throw 'expected length 2'
    }
    const key = parts[1]
    if (!key.length) {
      throw 'expected nonempty key'
    }
    const val = parseInt(parts[0])

    getCharacter().then(character => {
      return character.get().then(snapshot => {
        const data = snapshot.data()
        const newData = {}
        const cur = parseInt(data[key] || 0)
        if (cur < val) {
          Alert.alert(
            'Not enough ' + key + '!',
            'You need '+val+' but you only have '+cur+' remaining.',
            [
              {text: 'Ok', style: 'cancel'},
            ]
          )
          return
        }
        newData[key] = cur - val
        return character.set(newData, {merge: true})
      })
    })
  }

  costs () {
    const parts = this.props.ability.cost.split(' ')
    const unit = parts[1]

    const costs = []
    let bits = parts[0].split(/[-–]/g)
    if (bits.length === 1) {
      return [this.props.ability.cost]
    }
    for (let i = parseInt(bits[0]); i <= parseInt(bits[1]); i++) {
      costs.push(i + ' ' + unit)
    }
    return costs
  }

  buttons () {
    if (!this.state.expand) {
      return
    }

    return <View style={styles.itembuttons}>
      <ExtractDieRolls text={this.props.ability.desc} />
      <View style={styles.wraprow}>
        <BaseText>Cast </BaseText>
        {this.costs().map((cost, i) => {
          return <Button
            key={i}
            title={cost}
            onPress={() => {this.castSpell(cost)}}
          />
        })}
      </View>
    </View>
  }
}

class SpellItem extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      spellData: {}
    }

    this._cache = Cache()

    this.castSpell = this.castSpell.bind(this)
    this.setNotes = this.setNotes.bind(this)
    this.onPress = this.onPress.bind(this)
  }

  cache (fn) {
    return this._cache(fn, this.props.spell.name)
  }

  spell () {
    return this.character.collection('spells').doc(slugify(this.props.spell.name))
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.character = character
      this.unsubscribe = this.spell().onSnapshot(spell => {
        this.setState(state => {
          return {spellData: spell.data() || {}}
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
    const SpellView = Platform.select({default: View, web: ScrollView})
    return (
      <SpellView style={styles.item}>
        <Touchable onPress={this.onPress}>
          <View style={styles.iteminner}>
            <View style={styles.row}>
              <View>
                <BaseText>{this.props.spell.name}</BaseText>
                <Secondary>{this.props.spell.class}</Secondary>
                <Secondary>{this.props.spell.school}</Secondary>
              </View>
              <View style={styles.right}>
                <Secondary>{this.props.spell.page}</Secondary>
                <Secondary>{this.props.spell.casting_time}</Secondary>
                <Secondary>{this.props.spell.components}</Secondary>
              </View>
            </View>

            {this.detail()}
          </View>
        </Touchable>

        {this.abilities()}

        {this.notes()}

        {this.buttons()}
      </SpellView>
    )
  }

  detail () {
    if (!this.props.expand || this.props.noDetail) {
      return
    }

    return <View style={styles.detail}>
      <View style={styles.row}>
        {this.props.spell.duration ? <View style={styles.flex}>
          <B>Duration</B>
          <BaseText>{this.props.spell.duration}</BaseText>
        </View>: <View />}

        {this.props.spell.range ? <View style={styles.flex}>
          <B>Range</B>
          <BaseText>{this.props.spell.range}</BaseText>
        </View> : <View />}

        {this.props.spell.material ? <View style={styles.flex}>
          <B>Material</B>
          <BaseText>{this.props.spell.material}</BaseText>
          </View> : <View />}
      </View>

      <View style={styles.row}>
        {this.props.spell.concentration ? <View style={styles.grow}>
          <B>Concentration</B>
          <BaseText>{this.props.spell.concentration}</BaseText>
        </View> : <View />}

        {this.props.spell.concentration ? <View style={styles.grow}>
          <B>Ritual</B>
          <BaseText>{this.props.spell.ritual}</BaseText>
        </View> : <View />}
      </View>

      <Quote>
        <HTMLView
          value={this.props.spell.desc}
        />
      </Quote>

      {this.higherLevel()}
    </View>
  }

  abilities () {
    if (!this.props.expand || this.props.noDetail || !this.props.spell.abilities) {
      return
    }

    return this.props.spell.abilities.map((a, i) => {
      return <AbilityItem ability={a} key={i} />
    })
  }

  notes () {
    if (!this.props.expand) {
      return
    }

    return <View style={styles.padhorizontal}>
      <TextInput
        label='Notes'
        multiline={true}
        value={this.state.spellData.notes}
        onChangeText={this.setNotes}
      />
    </View>
  }

  buttons () {
    if (!this.props.expand) {
      return
    }

    const text = [
      this.props.spell.desc,
      this.props.spell.higher_level,
      this.state.spellData.notes
    ].join(' ')

    return <View>
      <View style={styles.padhorizontal}>
        <ExtractDieRolls text={text} />
      </View>

      <View style={styles.itembuttons}>
        {
          !this.props.spell.notcastable ?
          <Button
            title='Cast'
            onPress={this.castSpell}
          />
          : null
        }

        {
          !this.props.spell.notcastable ?
            (
              this.state.spellData.prepared
                ? <Button
                  title='Unprepare'
                  onPress={this.cache(() => this.prepareSpell(false))}
                />
                : <Button
                  title='Prepare'
                  onPress={this.cache(() => this.prepareSpell(true))}
                />
            )
            : null
        }

        {
          this.state.spellData.active
            ? <Button
              title='Remove'
              onPress={this.cache(() => this.addSpell(false))}
            />
            : <Button
              title='Add'
              onPress={this.cache(() => this.addSpell(true))}
            />
        }
      </View>
    </View>
  }

  addSpell (active) {
    this.spell().set({active}, {merge: true})
  }

  castSpell () {
    showLightBox(this.props.navigator, 'dnd.CastSpellScreen', {
      slots: this.props.slots,
      spell: this.props.spell
    })
  }

  setNotes (notes) {
    this.spell().set({notes}, {merge: true})
  }

  prepareSpell (prepared) {
    this.spell().set({prepared}, {merge: true})
  }

  higherLevel () {
    if (!this.props.spell.higher_level) {
      return
    }

    return (
      <View>
        <B>Higher Level</B>
        <Quote>
          <HTMLView
            value={this.props.spell.higher_level}
          />
        </Quote>
      </View>
    )
  }

  onPress () {
    this.props.onExpand(this.props.spell)
  }
}

class SpellHeader extends React.PureComponent {
  render () {
    return (
      <Header style={styles.flex}>
        <B>{this.props.title}</B>
        {
          this.props.slot ?
          <BaseText>Slots Used {this.slotsUsed()} / {this.props.slot.count}</BaseText> :
          null
        }
      </Header>
    )
  }

  slotsUsed () {
    const spells = this.props.slot.spells
    if (!spells) {
      return
    }
    return spells.length
  }
}

class SpellList extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      slots: {},
      expanded: {},
      search: ''
    }

    this.onExpand = this.onExpand.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount () {
    this.slotListeners = {}

    getCharacter().then(character => {
      this.slots = character.collection('slots')
      this.unsubscribe = this.slots.onSnapshot(snapshot => {
        this.setState(state => {
          const oldSlots = state.slots
          const slots = {}
          snapshot.forEach(slot => {
            const data = slot.data()
            data.id = slot.id
            const prevSlot = oldSlots[slot.id]
            if (prevSlot) {
              data.spells = prevSlot.spells
            }
            slots[slot.id] = data

            if (!this.slotListeners[slot.id]) {
              this.slotListeners[slot.id] = this.slots.doc(slot.id)
                .collection('spells')
                .onSnapshot(snapshot => {
                  const spells = []
                  snapshot.forEach(spell => {
                    const data = spell.data()
                    data.id = spell.id
                    spells.push(data)
                  })
                  this.setState(state => {
                    const slots = {...state.slots}
                    const s = {...slots[slot.id]}
                    s.spells = spells
                    slots[slot.id] = s
                    return {slots}
                  })
                })
            }
          })
          return {slots}
        })
      })
    })
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    Object.values(this.slotListeners).forEach(unsubscribe => {
      unsubscribe()
    })
    this.slotListeners = {}
  }

  render () {
    let list
    if (this.props.spells.length > 50) {
      list = Recycler
    }

    const sections = this.groupSpells(this.props.spells)

    return (<View style={this.props.style}>
      {this.renderFilter()}

      <SectionList
        style={styles.spelllist}
        list={list}
        sections={sections}
        keyExtractor={this.spellExtractor}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        stickySectionHeadersEnabled={true}
      />
    </View>)
  }

  renderFilter () {
    if (!this.props.filter) {
      return
    }

    return <View style={styles.filter}>
      <TextInput
        label='Search'
        value={this.state.search}
        onChangeText={this.setSearch}
      />
    </View>
  }

  @autobind
  setSearch (search) {
    this.setState(prev => {
      return {search}
    })
  }

  renderSectionHeader ({section}) {
    return <SpellHeader
      title={section.title}
      slot={section.slot}
    />
  }

  renderItem ({item}) {
    return <SpellItem
      navigator={this.props.navigator}
      slots={this.state.slots}
      spell={item.spell}
      expand={item.expand}
      onExpand={this.onExpand}
    />
  }

  onExpand (spell) {
    this.setState(prev => {
      const expanded = {
        ...prev.expanded
      }
      expanded[spell.name] = !expanded[spell.name]
      console.log(expanded)
      return {expanded}
    })
  }

  groupSpells (spells) {
    if (this.props.filter && this.state.search) {
      if (!this.lunr || this.spellsLen !== spells.length) {
        this.spellsLen = spells.length
        this.lunr = lunr(function () {
          this.ref('index')
          this.field('name')
          this.field('school')
          this.field('level')
          this.field('class')

          spells.forEach((spell, i) => {
            spell.index = i
            this.add(spell)
          })
        })
      }

      spells = this.lunr.search(this.state.search).map(
        result => spells[result.ref]
      )
    }

    const sections = {}
    spells.forEach(spell => {
      const level = titleCase(spell.level)
      sections[level] = (sections[level] || []).concat({
        spell: spell,
        expand: !!(this.state.expanded[spell.name])
      })
    })

    return Object.keys(sections).sort((a, b) => {
      if (a === 'Cantrip') {
        return -1
      }
      if (b === 'Cantrip') {
        return 1
      }
      return a < b ? -1 : 1
    }).map(section => {
      return {
        title: section,
        data: sections[section],
        slot: this.getSlot(section)
      }
    })
  }

  getSlot (section) {
    const n = parseInt(section)
    if (!n) {
      return
    }
    return this.state.slots[n]
  }

  spellExtractor (spell) {
    return spell.spell.name
  }
}

function openSpellSettings(navigator) {
  navigator.push({
    screen: 'dnd.SpellSettingsScreen',
    title: 'Spell Settings'
  })
}

export class KnownSpellsScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      spells: [],
      spellData: {}
    }
    this.unsubscribe = []

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }

  @autobind
  onNavigatorEvent (event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'slots') {
        openSpellSettings(this.props.navigator)
      } else if (event.id === 'filter') {
        this.setState(prev => {
          return {filter: !prev.filter}
        })
      } else if (event.id === 'wildMagic') {
        this.props.navigator.push({
          screen: 'dnd.WildMagicScreen',
          title: 'Wild Magic'
        })
      } else if (event.id === 'resetSlots') {
        this._resetSlots()
      } else if (event.id === 'add') {
        this.props.navigator.push({
          screen: 'dnd.AddSpellScreen',
          title: 'Add Spell',
          navigatorButtons: {
            rightButtons: [
              {
                id: 'filter',
                title: 'Filter',
                icon: iconsMap['md-search']
              }
            ]
          }
        })
      }
    }
  }

  _resetSlots () {
    Alert.alert(
      'Reset Spell Slots?',
      'This sets all spell slot counters to zero.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          onPress: () => {
            getCharacter().then(character => {
              const slots = character.collection('slots')
              const promises = []
              for (let i = 1; i < numSlotLevels; i++) {
                promises.push(slots.doc('' + i).collection('spells').get().then(spells => {
                  const promises = []
                  spells.forEach(spell => {
                    return spell.ref.delete()
                  })
                  return Promise.all(promises)
                }))
              }
              return Promise.all(promises)
            })
          },
          style: 'destructive'
        }
      ]
    )
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.spells = character.collection('spells')
      this.unsubscribe.push(this.spells.onSnapshot(snapshot => {
        const spells = []
        const spellData = {}
        snapshot.forEach(spell => {
          const data = spell.data()
          if (!data.active) {
            return
          }
          spellData[spell.id] = data
          spells.push(spellMap[spell.id])
        })
        this.setState(state => {
          return {spells, spellData}
        })
      }))
    })
  }

  componentWillUnmount () {
    this.unsubscribe.forEach(f => {
      f()
    })
    this.unsubscribe = []
  }

  render () {
    if (this.state.spells.length === 0) {
      return <View style={styles.centerp}>
        <BaseText>
          You don't have any spells. Maybe you should add some.
        </BaseText>
      </View>
    }

    return (
      <View style={styles.container}>
        <PSIInput />

        <SpellList
          style={styles.flex}
          filter={this.state.filter}
          navigator={this.props.navigator}
          spells={this.state.spells}
          spellData={this.state.spellData}
        />
      </View>
    )
  }
}

class PSIInput extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {}
    this.unsubscribe = []
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.character = character
      this.unsubscribe.push(character.onSnapshot(snapshot => {
        const {psi, maxPsi} = snapshot.data()
        this.setState(state => {
          return {psi, maxPsi}
        })
      }))
    })
  }

  componentWillUnmount () {
    this.unsubscribe.forEach(f => {
      f()
    })
    this.unsubscribe = []
  }

  _set (key, text) {
    const val = parseInt(text)
    const data = {}
    data[key] = val
    this.character.set(data, {merge: true})
    this.setState(prev => {
      return {
        maxPsi: val,
      }
    })
  }

  @autobind
  setPsi (text) {
    this._set('psi', text)
  }

  @autobind
  resetPsi () {
    this._set('psi', this.state.maxPsi)
  }

  render () {
    if (!this.state.maxPsi) {
      return <View />
    }

    return <View style={styles.psi}>
      <TextInput
        label={'PSI'}
        value={this.state.psi}
        onChangeText={this.setPsi}
        keyboardType={'numeric'}
      />
      <BaseText>
        <Text style={{whiteSpace: 'nowrap'}}>
          {' / ' + this.state.maxPsi}
        </Text>
      </BaseText>

      <Ionicons.Button
        name='md-refresh'
        color={colors.secondaryText}
        iconStyle={styles.button}
        backgroundColor='transparent'
        onPress={this.resetPsi}
      />
    </View>
  }
}

export class AddSpellScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {}
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }

  @autobind
  onNavigatorEvent (event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'filter') {
        this.setState(prev => {
          return {filter: !prev.filter}
        })
      }
    }
  }

  render () {
    return (
      <SpellList
        filter={this.state.filter}
        navigator={this.props.navigator}
        spells={spells}
        style={styles.flex}
      />
    )
  }
}

export class SpellSettingsScreen extends React.PureComponent {
  render () {
    return <ScrollView style={styles.padding}>
      <SlotsSettingsScreen />

      <MysticSettingsScreen />
    </ScrollView>
  }
}

export class MysticSettingsScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      maxPsi: 0
    }
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.character = character
      this.unsubscribe = character.onSnapshot(snapshot => {
        const {maxPsi} = snapshot.data()
        this.setState(state => {
          return {
            maxPsi: maxPsi || 0
          }
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

  _set (key, text) {
    const val = parseInt(text)
    const data = {}
    data[key] = val
    this.character.set(data, {merge: true})
    this.setState(prev => {
      return {
        maxPsi: val,
      }
    })
  }

  render () {
    return (
      <View>
        <H2>Mystic</H2>
        <TextInput
          label={'Max PSI'}
          value={this.state.maxPsi}
          onChangeText={text => this._set('maxPsi', text)}
          keyboardType={'numeric'}
        />
      </View>
    )
  }
}

export class SlotsSettingsScreen extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      slots: {}
    }
  }

  componentDidMount () {
    getCharacter().then(character => {
      this.slots = character.collection('slots')
      this.unsubscribe = this.slots.onSnapshot(snapshot => {
        const slots = {}
        snapshot.forEach(slot => {
          const data = slot.data()
          slots[slot.id] = data
        })
        this.setState(state => {
          return {slots}
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

  _setSlots (i, text) {
    var count = parseInt(text || 0)
    if (count < 0) {
      count = 0
    }
    this.slots.doc('' + i).set({count}, {merge: true})
    this.setState(prev => {
      if (!prev.slots[i]) {
        prev.slots[i] = {}
      }
      prev.slots[i].count = count
      return {
        slots: prev.slots
      }
    })
  }

  render () {
    const slots = []
    for (let i = 1; i <= numSlotLevels; i++) {
      slots.push( <TextInput
        key={i}
        label={'Level ' + i}
        value={((this.state.slots[i] || {count: 0}).count || '') + ''}
        onChangeText={text => this._setSlots(i, text)}
        keyboardType={'numeric'}
      />)
    }
    return (
      <View>
        <H2>Slots</H2>

        {slots}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  psi: {
    paddingHorizontal: 16,
    flex: 1,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'initial',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flex: 1
  },
  item: {
    //borderBottomWidth: 1,
    //borderBottomColor: colors.border
    paddingRight: 16
  },
  iteminner: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 16,
  },
  subitem: {
    paddingLeft: 16,
  },
  itembuttons: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingBottom: 16,
  },
  padhorizontal: {
    flex: 0,
    paddingLeft: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  wraprow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  narrowrow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  right: {
    alignItems: 'flex-end'
  },
  detail: {
    marginTop: 10
  },
  grow: {
    flexGrow: 10000
  },
  padding: {
    padding: 10
  },
  centerp: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  buttonMargin: {
    marginTop: 5,
    marginBottom: 5
  },
  filter: {
    paddingHorizontal: 16,
  },
  spelllist: {
    flex: 1,
    paddingHorizontal: 16,
  },
  shrink: {
    flexShrink: 10000,
  }
})
