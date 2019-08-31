import React, { Component } from "react"

export default class DragButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startX: null,
      steps: 0
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.steps < this.state.steps) {
      this.props.next()
    } else if (prevState.steps > this.state.steps) {
      this.props.prev()
    }
  }

  touchStart(e) {
    this.setState({ startX: e.touches[0].clientX, steps: 0 })
  }

  touchMove(e) {
    const steps = Math.round((e.touches[0].clientX - this.state.startX) / 20)
    if (steps !== this.state.steps) {
      this.setState({ steps })
    }
  }

  touchEnd(e) {
    this.setState({ startX: null, steps: 0 })
  }

  render() {
    return (
      <>
        <button
          onTouchStart={e => this.touchStart(e)}
          onTouchMove={e => this.touchMove(e)}
          onTouchEnd={e => this.touchEnd(e)}
          onClick={e => this.props.prev()}
        >
          prev
        </button>
        <button
          onTouchStart={e => this.touchStart(e)}
          onTouchMove={e => this.touchMove(e)}
          onTouchEnd={e => this.touchEnd(e)}
          onClick={e => this.props.next()}
        >
          next
        </button>
      </>
    )
  }
}
