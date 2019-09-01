import React, { Component } from "react"
import styled from "styled-components"

const Toolbar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-evenly;
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
  user-select: none;
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
    let command = ""
    if (this.state.functionMode === "delete")
      command = {
        word: "delWordBefore",
        line: "delWrappedLineLeft",
        doc: ""
      }[this.state.moveMode]
    else
      command = {
        word: "goWordLeft",
        line: "goLineUp",
        doc: "goDocStart"
      }[this.state.moveMode]
    this.execCommand(command)
  }

  right() {
    let command = ""
    if (this.state.functionMode === "delete")
      command = {
        word: "delWordAfter",
        line: "delWrappedLineRight",
        doc: ""
      }[this.state.moveMode]
    else
      command = {
        word: "goWordRight",
        line: "goLineDown",
        doc: "goDocEnd"
      }[this.state.moveMode]
    this.execCommand(command)
  }

  execCommand(command) {
    console.log(command)
    this.props.codeMirror.focus()
    this.props.codeMirror.execCommand(command)
    navigator.vibrate(10)
  }

  //////////////////////////////////////////////////////////////////////////////
  // MOVEMENT TOUCH HANDLERS
  //////////////////////////////////////////////////////////////////////////////

  moveTouchStart(e) {
    const touch = e.touches.length - 1
    this.setState({
      moveMode: "word",
      moveTouch: touch,
      moveStartX: e.touches[touch].clientX,
      moveStartY: e.touches[touch].clientY,
      steps: 0
    })
  }

  moveTouchMove(e) {
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

  moveTouchEnd(e) {
    this.setState({ moveMode: "↔" })
  }

  //////////////////////////////////////////////////////////////////////////////
  // FUNCTION TOUCH HANDLERS
  //////////////////////////////////////////////////////////////////////////////

  functionTouchStart(e) {
    const touch = e.touches.length - 1
    this.setState({
      functionMode: "delete",
      functionTouch: touch
      // functionStartX: e.touches[touch].clientX,
      // functionStartY: e.touches[touch].clientY,
    })
  }

  functionTouchMove(e) {}

  functionTouchEnd(e) {
    this.setState({ functionMode: "•" })
  }

  //////////////////////////////////////////////////////////////////////////////

  nextP() {
    const doc = this.props.codeMirror.getDoc()
    const cursor = doc.getCursor()
    const result = doc.getSearchCursor(/\n\n/, { line: cursor.line })
    if (result.findNext()) {
      console.log(result.pos.to.line)
      this.props.codeMirror.focus()
      doc.setCursor(result.pos.to.line)
    }
  }

  render() {
    return (
      <Toolbar>
        <Button
          onTouchStart={e => this.functionTouchStart(e)}
          onTouchMove={e => this.functionTouchMove(e)}
          onTouchEnd={e => this.functionTouchEnd(e)}
        >
          {this.state.functionMode}
        </Button>
        <Button
          onTouchStart={e => this.moveTouchStart(e)}
          onTouchMove={e => this.moveTouchMove(e)}
          onTouchEnd={e => this.moveTouchEnd(e)}
        >
          {this.state.moveMode}
        </Button>
        <Button onClick={e => this.nextP()}>next-p</Button>
      </Toolbar>
    )
  }
}
