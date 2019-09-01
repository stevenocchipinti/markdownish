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

  @media (min-width: 500px) {
    display: none;
  }
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
    const { functionMode, moveMode } = this.state
    if (functionMode === "delete") {
      if (moveMode === "word") this.execCommand("delWordBefore")
      if (moveMode === "line") this.execCommand("delWrappedLineLeft")
    } else {
      if (moveMode === "word") this.execCommand("goWordLeft")
      if (moveMode === "line") this.execCommand("goLineUp")
      if (moveMode === "doc") this.execCommand("goDocStart")
      if (moveMode === "para") this.goto(/\n\n/, "prev")
    }
  }

  right() {
    const { functionMode, moveMode } = this.state
    if (functionMode === "delete") {
      if (moveMode === "word") this.execCommand("delWordAfter")
      if (moveMode === "line") this.execCommand("delWrappedLineRight")
    } else {
      if (moveMode === "word") this.execCommand("goWordRight")
      if (moveMode === "line") this.execCommand("goLineDown")
      if (moveMode === "doc") this.execCommand("goDocEnd")
      if (moveMode === "para") this.goto(/\n\n/)
    }
  }

  execCommand(command) {
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
    else if (Ydiff < -40) newMoveMode = "para"

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

  goto(pattern, direction = "next") {
    const doc = this.props.codeMirror.getDoc()
    const cursor = doc.getCursor()
    const result = doc.getSearchCursor(pattern, {
      line: direction === "next" ? cursor.line : cursor.line - 1
    })
    if (
      (direction === "next" && result.findNext()) ||
      (direction === "prev" && result.findPrevious())
    ) {
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
      </Toolbar>
    )
  }
}
