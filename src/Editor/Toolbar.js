import React, { Component } from "react"
import styled from "styled-components"

const Toolbar = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 4rem;
  border-top: 1px solid #ddd;
  padding: 10px;
  background-color: white;
  z-index: 2;
`

const Button = styled.button`
  font-size: 2rem;
  flex-grow: 1;
  background-color: white;
  border: none;
`

export default class NavigationToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moveMode: "↔",
      moveTouch: null,
      moveStartX: null,
      moveStartY: null,

      functionMode: "•",
      functionTouch: null,
      functionStartX: null,
      functionStartY: null,
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
      line: "goLineUp",
      doc: "goDocStart"
    }[this.state.moveMode]
    this.props.codeMirror.focus()
    this.props.codeMirror.execCommand(command)
    navigator.vibrate(10)
  }

  right() {
    const command = {
      word: "goWordRight",
      line: "goLineDown",
      doc: "goDocEnd"
    }[this.state.moveMode]
    this.props.codeMirror.focus()
    this.props.codeMirror.execCommand(command)
    navigator.vibrate(10)
  }

  touchStart(e) {
    e.stopPropagation()
    const touch = e.touches.length - 1
    this.setState({
      moveMode: "word",
      moveTouch: touch,
      moveStartX: e.touches[touch].clientX,
      moveStartY: e.touches[touch].clientY,
      steps: 0
    })
  }

  touchMove(e) {
    e.stopPropagation()
    const { moveTouch, moveStartX, moveStartY, moveMode, steps } = this.state
    const Ydiff = e.touches[moveTouch].clientY - moveStartY
    const Xdiff = e.touches[moveTouch].clientX - moveStartX

    let newMoveMode = "word"
    if (Ydiff < -80) newMoveMode = "doc"
    else if (Ydiff < -40) newMoveMode = "line"

    if (newMoveMode !== moveMode) {
      this.setState({ moveMode: newMoveMode })
      navigator.vibrate(80)
    }

    const newSteps = Math.round(Xdiff / 20)
    if (newSteps !== steps) {
      this.setState({ steps: newSteps })
    }
  }

  touchEnd(e) {
    e.stopPropagation()
    this.setState({ moveMode: "↔", functionMode: "•" })
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
