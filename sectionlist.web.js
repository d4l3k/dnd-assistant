import React from 'react'
import List from 'react-virtualized/dist/commonjs/List'
import {View} from 'react-native'

export class FlatList extends React.Component {
  render () {
    return <View>
      {
        this.props.data.map((a) => <View
          key={this.props.keyExtractor(a)}>
          {this.props.renderItem({item: a})}
        </View>)
      }
    </View>
  }

  rowCount () {
    let count = 0
    for (const sections of this.props.sections) {
      count += 1 + sections.data.length
    }
    return count
  }
}

export class SectionList extends React.Component {
  render () {
    return <FlatList
      data={this.convert(this.props.sections)}
      keyExtractor={(a) => this.keyExtractor(a)}
      renderItem={(a) => this.renderItem(a)}
    />
  }

  convert (sections) {
    const items = []
    sections.forEach((section, i) => {
      items.push({section, i})
      for (const item of section.data) {
        items.push({item})
      }
    })
    return items
  }

  keyExtractor (item) {
    if (item.section) {
      return item.i
    }
    return this.props.keyExtractor(item.item)
  }

  renderItem ({item}) {
    if (item.section) {
      return this.props.renderSectionHeader(item)
    }
    return this.props.renderItem(item)
  }
}

