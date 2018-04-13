import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  ViewPropTypes,
  StyleSheet
} from 'react-native'

import TagSelectItem from './TagSelectItem'

class TagSelect extends React.Component {
  static propTypes = {
    // Pre-selected values
    value: PropTypes.array,

    // Objet keys
    labelAttr: PropTypes.string,
    keyAttr: PropTypes.string,

    // Available data
    data: PropTypes.array,

    // validations
    max: PropTypes.number,
    onMaxSwitchToNext: PropTypes.bool,

    // disable selection
    disabled: PropTypes.bool,

    // Callbacks
    onMaxError: PropTypes.func,
    onItemPress: PropTypes.func,

    // Styles
    containerStyle: ViewPropTypes.style
  }

  static defaultProps = {
    value: [],

    labelAttr: 'label',
    keyAttr: 'id',

    data: [],

    max: null,
    onMaxSwitchToNext: false,

    disabled: false,

    onMaxError: null,
    onItemPress: null,

    containerStyle: {}
  }

  state = {
    value: {}
  }

  componentDidMount () {
    const value = {}
    this.props.value.forEach((val) => {
      value[val[[this.props.keyAttr]] || val] = val
    })

    this.setState({ value })
  }

  /**
   * @description Return the number of items selected
   * @return {Number}
   */
  get totalSelected () {
    return Object.keys(this.state.value).length
  }

  /**
   * @description Return the items selected
   * @return {Array}
   */
  get itemsSelected () {
    const items = []

    Object.entries(this.state.value).forEach(([key]) => {
      items.push(this.state.value[key])
    })

    return items
  }

  /**
   * @description Callback after select an item
   * @param {Object} item
   * @return {Void}
   */
  handleSelectItem = (item) => {
    const key = item[this.props.keyAttr] || item

    let value = { ...this.state.value }
    const found = this.state.value[key]

    // Item is on array, so user is removing the selection
    if (found) {
      delete value[key]
    } else {
      // User is adding but has reached the max number permitted
      if (this.props.max && this.totalSelected >= this.props.max && !this.props.onMaxSwitchToNext) {
        if (this.props.onMaxError) {
          return this.props.onMaxError()
        }
      } else if (this.props.max && this.totalSelected >= this.props.max && this.props.onMaxSwitchToNext) {
        value = []; 
        value[key] = item
      } else {
        value[key] = item
      }

    }

    return this.setState({ value }, () => {
      if (this.props.onItemPress) {
        this.props.onItemPress(item)
      }
    })
  }

  render () {
    return (
      <View
        style={[
          styles.container,
          this.props.containerStyle
        ]}
      >
        {this.props.data.map((i) => {
          return (
            <TagSelectItem
              {...this.props}
              label={i[this.props.labelAttr] ? i[this.props.labelAttr] : i}
              key={i[this.props.keyAttr] ? i[this.props.keyAttr] : i}
              onPress={this.props.disabled ? () => {} : this.handleSelectItem.bind(this, i)}
              selected={(this.state.value[i[this.props.keyAttr]] || this.state.value[i]) && true}
            />
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
})

export default TagSelect
