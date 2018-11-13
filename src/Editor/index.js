import React, { Component } from "react"
import styled, { createGlobalStyle } from "styled-components"
import CodeMirror from "codemirror"

import "codemirror/lib/codemirror.css"
import "codemirror/mode/gfm/gfm.js"
import "./markdownish-theme.css"

const Section = styled.section`
  overflow: hidden;
  width: 100%;
`

const GlobalStyle = createGlobalStyle`
  .CodeMirror {
    font-family: Nunito, Arial, monospace;
    font-size: 16px;
    padding: 30px;
    height: calc(100vh - 60px);
  }
`

const Toolbar = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  padding: 10px;
  z-index: 2;
`

class App extends Component {
  constructor(props) {
    super(props)
    this.textAreaRef = React.createRef()
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
    // Hack to make the actual line heights match what is displayed
    setTimeout(() => this.codeMirror.refresh(), 250)
  }

  prev() {
    this.codeMirror.focus()
    this.codeMirror.execCommand("goWordLeft")
  }

  next() {
    this.codeMirror.focus()
    this.codeMirror.execCommand("goWordRight")
  }

  render() {
    const sample =
      "# Heading 1\n\n" +
      "## Heading 2\n\n" +
      "### Heading 3\n\n" +
      "#### Heading 4\n\n" +
      "##### Heading 5\n\n" +
      "###### Heading 6\n\n" +
      "Hello there. What is **happening**? I have no idea.\n\n" +
      "---\n\n" +
      "**Bold**, _italic_, ~strikethrough~\n\n" +
      "An unordered list\n* one\n* two\n\n" +
      "An ordered list\n1. one\n2. two"
    return (
      <Section>
        <GlobalStyle />
        <textarea ref={this.textAreaRef} defaultValue={sample} />
        <Toolbar>
          <button onClick={e => this.prev()}>Prev</button>
          <button onClick={e => this.next()}>Next</button>
        </Toolbar>
      </Section>
    )
  }
}

export default App
