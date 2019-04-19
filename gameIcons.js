import React from 'react'
import {StyleSheet, View} from 'react-native'
import {btoa} from './btoa'

import {Image} from './Image'
import {colors} from './styles'
import iconTxt from './icon-index.json'
import lunr from 'lunr'

const paths = iconTxt

const synonyms = {
  'spear': 'javelin',
  'wand': 'rod',
  'flask': 'glue',
  'match': 'tinder',
  'shirt': 'clothes',
  'booze': 'bottles of',
  'coins': 'gold',
  'cooking pot': 'mess kit',
  'tacos': 'food',
  'lockpicks': "thieve's tools",
  'processor': 'datapad',
  'syringe': 'stimpack',
  'microphone': 'comlink',
  'money': 'credits',
  'suit': 'jumpsuit',
  'necklace': 'locket'
}

function cleanQuery (text) {
  return text.replace(/[^a-zA-Z]+/g, ' ').toLowerCase()
}

const iconIndex = lunr(function () {
  this.ref('index')
  this.field('name')
  this.field('synonyms')

  paths.forEach((path, index) => {
    if (!path) {
      return
    }
    const parts = path.split('/')
    const name = cleanQuery(parts[parts.length - 1].split('.')[0])
    const syn = []
    for (const s of Object.keys(synonyms)) {
      if (name.indexOf(s) >= 0) {
        syn.push(synonyms[s])
      }
    }
    this.add({name, index, synonyms: syn.join(' ')})
  })
})

function findIcon (text) {
  if (!text) {
    return
  }
  const results = iconIndex.search(cleanQuery(text))
  if (results.length > 0) {
    return paths[results[0].ref]
  }
  const parts = text.split(' ')
  if (parts.length <= 1) {
    return
  }
  for (const part of parts) {
    const results = iconIndex.search(part)
    if (results.length > 0) {
      return paths[results[0].ref]
    }
  }
}

export const Icon = (props) => {
  const path = findIcon(props.text)
  const src = path ? 'https://rawgit.com/game-icons/icons/master/' + path : null

  return <Img src={src} />
}

export class Img extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    if (this.lastSrc != this.props.src) {
      this.lastSrc = this.props.src
      fetch(this.props.src)
        .then((resp) => resp.text())
        .then((data) => {
        data = data.replace('<path d="M0 0h512v512H0z"/>', '')
        data = data.replace('fill="#fff"', 'fill="' + colors.secondaryText + '"')

        this.setState({
          uri: 'data:image/svg+xml;base64,' + btoa(data),
          xmlData: data,
        })
      })
    }

    if (!this.state.uri) {
      return <View style={styles.icon}
      />
    }
    let source = {
      uri: this.state.uri,
    }

    return <Image
      style={{
        width: 32,
        height: 32,
        marginRight: 16,
      }}
      svgXmlData={this.state.xmlData}
      source={source}
    />
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 48,
    height: 32,
    paddingRight: 16,
  }
})
