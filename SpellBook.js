import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableNativeFeedback } from 'react-native'
import spells from './dnd-spells/spells.json'
import ActionButton from 'react-native-action-button'
import HTMLView from 'react-native-htmlview'

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
      showDetail: false
    }
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
            </View> : ''}
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
      </View>
    )
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

class SpellList extends React.Component {
  render () {
    return (
      <FlatList
        data={spells}
        keyExtractor={this.spellExtractor}
        renderItem={({item}) => <SpellItem spell={item}/>}
      />
    )
  }

  spellExtractor (spell) {
    return spell.name
  }
}

export default class SpellBook extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <SpellList />

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
  }
})
