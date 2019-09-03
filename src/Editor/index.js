import React, { Component } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { Controlled as ControlledCodeMirror } from "react-codemirror2"

import "codemirror/lib/codemirror.css"
import "codemirror/mode/gfm/gfm.js"
import "codemirror/addon/search/searchcursor.js"
import "codemirror/addon/search/search.js"
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

const CodeMirror = styled(ControlledCodeMirror)`
  height: 100%;
  margin-bottom: 4rem;
`

// This is an uncontrolled component because CodeMirror is uncontrolled by
// default. The onChange handler works as expected though.
// This would be better controlled but not sure how yet.
class Editor extends Component {
  constructor(props) {
    super(props)
    this.codeMirror = null
    this.state = {
      value: "# "
    }
  }

  componentDidMount() {
    // Hack to make the variable line heights match what is displayed
    setTimeout(() => {
      this.codeMirror.refresh()
      this.codeMirror.focus()
      this.codeMirror.doc.setCursor({ line: 0, ch: 0 })
    }, 500)
  }

  render() {
    const options = {
      lineWrapping: true,
      theme: "markdownish",
      scrollbarStyle: "null",
      mode: {
        name: "gfm",
        gitHubSpice: false
      }
    }

    return (
      <Section>
        <GlobalStyle />
        <CodeMirror
          value={this.props.data}
          options={options}
          onBeforeChange={(editor, data, value) => {
            this.props.onChange({ value })
          }}
          editorDidMount={editor => (this.codeMirror = editor)}
        />
        <Toolbar codeMirror={this.codeMirror} />
      </Section>
    )
  }
}

export default Editor
