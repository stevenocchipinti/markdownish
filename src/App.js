import React, { Component } from "react"
import styled, { createGlobalStyle } from "styled-components"
import Editor from "./Editor"
import NoteItem from "./NoteItem"

const GlobalStyle = createGlobalStyle`
  *, ::after, ::before {
    box-sizing: border-box;
  }
`

const Layout = styled.main`
  display: flex;
  height: 100vh;
  width: 100vw;
`

// const Sidebar = styled.section`
//   background-color: #333;
//   height: 100vh;
//   width: 180px;
//   flex-shrink: 0;
// `

const NoteList = styled.section`
  height: 100vh;
  width: 250px;
  border-right: 1px solid #ddd;
  flex-shrink: 0;
`

const SearchBar = styled.input`
  width: 100%;
  background-color: #f5f5f5;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  padding: 1rem;
`

const nullNote = { data: "" }

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [nullNote],
      selectedNoteIndex: 0,
      filter: ""
    }
  }

  componentDidMount() {
    const notesJSON = localStorage.getItem("notes")
    const notes = notesJSON ? JSON.parse(notesJSON) : []
    const selectedNoteIndex = 0
    this.setState({ notes, selectedNoteIndex })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.notes[prevState.selectedNoteIndex].data !==
        this.selectedNote().data &&
      this.selectedNote().data
    ) {
      localStorage.setItem("notes", JSON.stringify(this.state.notes))
    }
  }

  selectedNote() {
    return this.state.notes[this.state.selectedNoteIndex] || nullNote
  }

  updateSelectedNote({ data }) {
    this.setState(({ notes, selectedNoteIndex }) => ({
      notes: [
        ...notes.slice(0, selectedNoteIndex),
        { data },
        ...notes.slice(selectedNoteIndex + 1)
      ]
    }))
  }

  render() {
    const filterRegex = new RegExp(this.state.filter.split("").join(".*"), "i")
    return (
      <Layout>
        <GlobalStyle />
        {/* <Sidebar /> */}
        <NoteList>
          <SearchBar
            placeholder="Filter"
            value={this.state.filter}
            onChange={e => this.setState({ filter: e.target.value })}
          />
          {this.state.notes
            .map((note, index) => ({ ...note, index }))
            .filter(note => note.data.match(filterRegex))
            .map((note, index) => (
              <NoteItem
                onClick={e => this.setState({ selectedNoteIndex: index })}
                key={index}
                value={note.data}
              />
            ))}
        </NoteList>
        <Editor
          onChange={data => this.updateSelectedNote(data)}
          data={this.selectedNote().data}
        />
      </Layout>
    )
  }
}

export default App
