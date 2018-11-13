import React, { Component } from "react"
import CodeMirror from "codemirror"

import "codemirror/lib/codemirror.css"
import "codemirror/mode/gfm/gfm.js"

class App extends Component {
  constructor(props) {
    super(props)
    this.textAreaRef = React.createRef()
  }

  componentDidMount() {
    this.codeMirror = CodeMirror.fromTextArea(this.textAreaRef.current, {
      lineNumbers: true,
      mode: {
        name: "gfm",
        gitHubSpice: false
      }
    })
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
    const sentence = "Hello there. What is **happening**? I have no idea."
    return (
      <div className="App">
        <textarea ref={this.textAreaRef} defaultValue={sentence} />
        <button onClick={e => this.prev()}>Prev</button>
        <button onClick={e => this.next()}>Next</button>
      </div>
    )
  }
}

export default App
