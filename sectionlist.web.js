import React from 'react'
import List from 'react-virtualized/dist/commonjs/List'
import {View} from 'react-native'

export class FlatList extends React.PureComponent {
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

export class SectionList extends React.PureComponent {
  constructor (props) {
    super(props)

    this._keyExtractor = this.keyExtractor.bind(this)
    this._renderItem = this.renderItem.bind(this)
  }

  render () {
    return <FlatList
      data={this.convert(this.props.sections)}
      keyExtractor={this._keyExtractor}
      renderItem={this._renderItem}
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

