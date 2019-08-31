import React, { Component } from "react"
import styled, { createGlobalStyle } from "styled-components"
import CodeMirror from "codemirror"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/gfm/gfm.js"
import "./markdownish-theme.css"

import Toolbar from "./Toolbar"

const Section = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`

const GlobalStyle = createGlobalStyle`
  .CodeMirror {
    font-family: Nunito, Arial, monospace;
    font-size: 16px;
    padding: 30px;
    margin-bottom: 4rem;
    height: 100%;

    /*@media (prefers-color-scheme: dark) {
      background-color: #111;
      color: #eee;
    }*/
  }

`

// This is an uncontrolled component because CodeMirror is uncontrolled by
// default. The onChange handler works as expected though.
// This would be better controlled but not sure how yet.
class Editor extends Component {
  constructor(props) {
    super(props)
    this.textAreaRef = React.createRef()
    this.state = {
      data: props.defaultData
    }
  }

  preserveCursor(action) {
    const cursor = this.codeMirror.doc.getCursor()

    // console.log("BEFORE")
    // const length = this.codeMirror.doc.getLine(cursor.line).length
    // const lastCharOfLine = length === cursor.ch
    // console.log("line length", length)
    // console.log("last char", lastCharOfLine)
    // console.log("cursor", cursor)

    action()

    // console.log("AFTER")
    // const cursor = this.codeMirror.doc.getCursor()
    // const length = this.codeMirror.doc.getLine(cursor.line).length
    // const lastCharOfLine = length === cursor.ch
    // console.log("line length", length)
    // console.log("last char", lastCharOfLine)
    // console.log("cursor", cursor)

    this.codeMirror.doc.setCursor(cursor)
  }

  componentDidMount() {
    this.codeMirror = CodeMirror.fromTextArea(this.textAreaRef.current, {
      lineWrapping: true,
      theme: "markdownish",
      scrollbarStyle: "null",
      mode: {
        name: "gfm",
        gitHubSpice: false
      }
    })
    this.codeMirror.on("change", cm => {
      this.setState({ data: cm.doc.getValue() })
    })
    // Hack to make the actual line heights match what is displayed
    setTimeout(() => this.codeMirror.refresh(), 500)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.preserveCursor(() => this.codeMirror.doc.setValue(this.props.data))
      if (this.state.data !== this.props.data) {
        this.props.onChange({
          data: this.state.data
        })
      }
    }

    if (prevProps.data !== this.props.data) {
      this.preserveCursor(() => this.codeMirror.doc.setValue(this.props.data))
    }
  }

  render() {
    const { data } = this.props
    return (
      <Section>
        <GlobalStyle />
        <textarea ref={this.textAreaRef} defaultValue={data} />
        <Toolbar codeMirror={this.codeMirror} />
      </Section>
    )
  }
}

export default Editor
