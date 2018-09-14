import React from 'react'
import autobind from 'autobind-decorator'
import {Linking, StyleSheet, Text, View, ScrollView} from 'react-native'
import {getUser, onLogin, setCharacter, characterID, signOut} from './auth'
import {colors, BaseText, B, Touchable} from './styles.js'
import {Button} from './Button'
import {Loading} from './Loading'

const feedbackURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfBjIkfj6EpZnRgg5IXn9ajUA4ErPUg9vZlVacVxwbrijDjTg/viewform?usp=sf_link'
const sourceCodeURL = 'https://github.com/d4l3k/dnd-assistant'

export class CharacterMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      characters: [],
      loading: true
    }
  }

  componentDidMount () {
    Promise.all([characterID(), onLogin()]).then((promises) => {
      const characterID = promises[0]
      this.characters = getUser().collection('characters')
      this.unsubscribe = this.characters.onSnapshot(snapshot => {
        const characters = []
        snapshot.forEach(slot => {
          const character = slot.data()
          character.id = slot.id
          character.active = character.id === characterID
          characters.push(character)
        })
        characters.sort((a, b) => {
          return a.name < b.name ? -1 : 1
        })
        this.setState(state => {
          return {characters, loading: false}
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
      <View style={styles.menu}>
        <ScrollView>
          <Text style={styles.header}>
            Tristan's DND Assistant
          </Text>

          {this.state.loading ? <Loading /> : null}

          <View>
            {
              this.state.characters.map(c => (
                <Touchable
                  key={c.id}
                  onPress={() => this._pressed(c)}>

                  <View style={styles.characterItem}>
                    {
                      c.active ? <B>{c.name}</B> : <BaseText>{c.name}</BaseText>
                    }
                  </View>
                </Touchable>
              ))
            }
          </View>

          <Button
            title='New'
            onPress={() => this.newCharacter()}
          />
        </ScrollView>

        <View style={styles.flexend}>
          <Button
            title='Sign Out'
            color={colors.secondaryText}

            onPress={signOut}
          />

          <Button
            title='Send Feedback'
            color={colors.secondaryText}

            onPress={this.sendFeedback}
          />

          <Button
            title='Source Code'
            color={colors.secondaryText}

            onPress={this.openSourceCode}
          />
        </View>
      </View>
    )
  }

  @autobind
  sendFeedback () {
    Linking.openURL(feedbackURL)
  }

  @autobind
  openSourceCode () {
    Linking.openURL(sourceCodeURL)
  }

  newCharacter () {
    this.characters.add({
      name: 'New Character #' + (this.state.characters.length + 1)
    })
  }

  _pressed (character) {
    setCharacter(character.id)
  }
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'white',
    flex: 1
  },
  characterItem: {
    flex: 1,
    padding: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: 1
  },
  header: {
    fontSize: 32,
    padding: 10,
    backgroundColor: colors.primary,
    color: colors.textPrimary
  },
  flexend: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})
