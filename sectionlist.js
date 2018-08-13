import React from 'react'
import autobind from 'autobind-decorator'
import {FlatList} from './FlatList'

export class SectionList extends React.PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    const FL = this.props.list || FlatList
    return <FL
      style={this.props.style}
      data={this.convert(this.props.sections)}
      keyExtractor={this.keyExtractor}
      renderItem={this.renderItem}
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

  @autobind
  keyExtractor (item) {
    if (item.section) {
      return item.i
    }
    return this.props.keyExtractor(item.item)
  }

  @autobind
  renderItem ({item}) {
    if (item.section) {
      return this.props.renderSectionHeader(item)
    }
    return this.props.renderItem(item)
  }
}
