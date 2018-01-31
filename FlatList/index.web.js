import React from 'react'
import autobind from 'autobind-decorator'
import List from 'react-virtualized/dist/es/List'
import {CellMeasurer, CellMeasurerCache} from 'react-virtualized/dist/es/CellMeasurer'
import AutoSizer from 'react-virtualized/dist/es/AutoSizer'
import {View, ScrollView, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
})

export class FlatListNaive extends React.PureComponent {
  render () {
    return <ScrollView>
      {
        this.props.data.map((a, i) => <View
          key={this.props.keyExtractor(a)}>
          {this.props.renderItem({item: a})}
        </View>)
      }
    </ScrollView>
  }
}

export class FlatListVirtual extends React.PureComponent {
  constructor (props) {
    super(props)

    this.cache = new CellMeasurerCache({
      fixedWidth: true
    })
  }
  render () {
    return <View style={styles.flex}>
      <AutoSizer>
        {this.renderList}
      </AutoSizer>
    </View>
  }

  @autobind
  renderList ({width, height}) {
    if (this.mostRecentWidth && this.mostRecentWidth !== width) {
      this.cache.clearAll()
      this.list.recomputeRowHeights()
    }

    this.mostRecentWidth = width

    return <List
      deferredMeasurementCache={this.cache}
      ref={this.listRef}
      width={width}
      height={height}
      rowCount={this.props.data.length}
      rowHeight={this.cache.rowHeight}
      rowRenderer={this.rowRenderer}
    />
  }

  @autobind
  listRef (list) {
    this.list = list
  }

  @autobind
  rowRenderer ({key, parent, index}) {
    const item = this.props.data[index]

    return <CellMeasurer
      cache={this.cache}
      columnIndex={0}
      key={this.props.keyExtractor(item)}
      parent={parent}
      rowIndex={index}
      width={this.mostRecentWidth}
    >
      {this.props.renderItem({item})}
    </CellMeasurer>
  }
}

export const FlatList = FlatListNaive
