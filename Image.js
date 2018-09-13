import React from 'react'
import {Platform, StyleSheet, Image, View} from 'react-native'
import btoa from 'btoa'

import {colors} from './styles'
import iconTxt from './icon-index.json'
import lunr from 'lunr'

const paths = iconTxt

const iconIndex = lunr(function () {
  this.ref('index')
  this.field('name')

  paths.forEach((path, index) => {
    if (!path) {
      return
    }
    const parts = path.split('/')
    const name = parts[parts.length - 1].split('.')[0].replace(/[^a-zA-Z]+/g, ' ')
    this.add({name, index})
  })
})

function findIcon(text) {
  if (!text) {
    return
  }
  const results = iconIndex.search(text)
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

    return Platform.select({
      web: () => {
        return <img src={source.uri} style={{
          width: 32,
          height: 32,
          paddingRight: 16
        }}/>
      },
      default: () => {
        return <Image source={source} style={styles.icon}/>
      }
    })()
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 48,
    height: 32,
    paddingRight: 16,
  },
})
