import React from 'react'
import autobind from 'autobind-decorator'
import {FlatList} from './FlatList'

export class SectionList extends React.PureComponent {
  constructor (props) {
    super(props)

    this._keyExtractor = this.keyExtractor.bind(this)
    this._renderItem = this.renderItem.bind(this)
  }

  render () {
    const FL = this.props.list || FlatList
    return <FL
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
