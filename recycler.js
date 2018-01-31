import React from 'react'
import autobind from 'autobind-decorator'
import {Dimensions} from 'react-native'
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview'

const ViewTypes = {
  HEADER: 0,
  ITEM: 1,
  EXPAND: 2
}

export class Recycler extends React.PureComponent {
  constructor (args) {
    super(args)

    const { width } = Dimensions.get('window')

    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2
    })

    this._layoutProvider = new LayoutProvider(
      index => {
        const datum = this.props.data[index]
        if (datum.section) {
          return ViewTypes.HEADER
        } else if (datum.item && datum.item.expand) {
          return ViewTypes.EXPAND
        } else {
          return ViewTypes.ITEM
        }
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.HEADER:
            dim.width = width
            dim.height = 37
            break
          case ViewTypes.ITEM:
            dim.width = width
            dim.height = 75
            break
          case ViewTypes.EXPAND:
            dim.width = width
            dim.height = 400
            break
          default:
            dim.width = 0
            dim.height = 0
        }
      }
    )
  }

  @autobind
  _rowRenderer (type, item) {
    return this.props.renderItem({item})
  }

  render () {
    this.dataProvider = this.dataProvider.cloneWithRows(this.props.data)

    return <RecyclerListView
      layoutProvider={this._layoutProvider}
      dataProvider={this.dataProvider}
      rowRenderer={this._rowRenderer}
    />
  }
}
