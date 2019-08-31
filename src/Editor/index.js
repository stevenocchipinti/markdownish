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

const TitleEditor = styled.input`
  width: 100%;
  border: none;
  font-size: 4rem;
  font-family: Nunito, Arial, monospace;
  padding: 0 2rem;
  margin-top: 2rem;

  &:focus {
    outline: none;
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
      title: props.defaultTitle,
      data: props.defaultData
    }
  }

  preserveCursor(action) {
    const cursor = this.codeMirror.doc.getCursor()

    console.log("BEFORE")
    const length = this.codeMirror.doc.getLine(cursor.line).length
    const lastCharOfLine = length === cursor.ch
    console.log("line length", length)
    console.log("last char", lastCharOfLine)
    console.log("cursor", cursor)

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
    setTimeout(() => this.codeMirror.refresh(), 250)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.preserveCursor(() => this.codeMirror.doc.setValue(this.props.data))
      if (this.state.data !== this.props.data) {
        this.props.onChange({
          title: this.props.title,
          data: this.state.data
        })
      }
    }

    if (prevProps.data !== this.props.data) {
      this.preserveCursor(() => this.codeMirror.doc.setValue(this.props.data))
    }
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
    const { title, data } = this.props
    return (
      <Section>
        <GlobalStyle />
        <TitleEditor value={title} onChange={() => {}} />
        <textarea ref={this.textAreaRef} defaultValue={data} />
        <Toolbar>
          <button onClick={e => this.prev()}>Prev</button>
          <button onClick={e => this.next()}>Next</button>
        </Toolbar>
      </Section>
    )
  }
}

export default Editor
