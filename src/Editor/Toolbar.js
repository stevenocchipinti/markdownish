import React, { Component } from "react"
import styled from "styled-components"

const Toolbar = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  border-top: 1px solid #ddd;
  padding: 10px;
`

const Button = styled.button`
  font-size: 2rem;
  flex-grow: 1;
`

export default class NavigationToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moveMode: "↔",
      moveTouch: null,
      startX: null,
      steps: 0
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.steps > this.state.steps) {
      this.left()
    } else if (prevState.steps < this.state.steps) {
      this.right()
    }
  }

  left() {
    const command = {
      word: "goWordLeft",
      doc: "goDocStart"
    }[this.state.moveMode]
    this.props.codeMirror.focus()
    this.props.codeMirror.execCommand(command)
  }

  right() {
    const command = {
      word: "goWordRight",
      doc: "goDocEnd"
    }[this.state.moveMode]
    this.props.codeMirror.focus()
    this.props.codeMirror.execCommand(command)
  }

  touchStart(e) {
    const touch = e.touches.length - 1
    this.setState({
      moveMode: "word",
      moveTouch: touch,
      startX: e.touches[touch].clientX,
      startY: e.touches[touch].clientY,
      steps: 0
    })
  }

  touchMove(e) {
    const { moveTouch, startX, startY, moveMode, steps } = this.state
    const Ydiff = e.touches[moveTouch].clientY - startY
    const Xdiff = e.touches[moveTouch].clientX - startX

    const newMoveMode = Ydiff < -40 ? "doc" : "word"
    if (newMoveMode !== moveMode) {
      this.setState({ moveMode: newMoveMode })
    }

    const newSteps = Math.round(Xdiff / 20)
    if (newSteps !== steps) {
      this.setState({ steps: newSteps })
    }
  }

  touchEnd(e) {
    this.setState({ moveMode: "↔", moveTouch: null, startX: null, steps: 0 })
  }

  render() {
    return (
      <Toolbar>
        <Button>•</Button>
        <Button
          onTouchStart={e => this.touchStart(e)}
          onTouchMove={e => this.touchMove(e)}
          onTouchEnd={e => this.touchEnd(e)}
        >
          {this.state.moveMode}
        </Button>
      </Toolbar>
    )
  }
}
