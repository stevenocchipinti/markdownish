import React, { Component } from "react"
import styled, { createGlobalStyle } from "styled-components"
import Editor from "./Editor"

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

const ItemCard = styled.article`
  padding: 30px;
  border-bottom: 1px solid #ddd;
`

const ItemHeading = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 1em;
`

const ItemPreview = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Item = ({ heading, children, ...props }) => (
  <ItemCard {...props}>
    <ItemHeading>{heading}</ItemHeading>
    <ItemPreview>{children}</ItemPreview>
  </ItemCard>
)

const findH1 = str => {
  const title = str.split("\n").find(s => s.match(/^# /))
  return (title && title.replace(/# /, "")) || "Untitled"
}

const summary = str => {
  const [firstLine, ...otherLines] = str.split("\n")
  return firstLine.match(/^# /) ? otherLines : str
}

const nullNote = { data: "" }

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [nullNote],
      selectedNoteIndex: 0
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
    return (
      <Layout>
        <GlobalStyle />
        {/* <Sidebar /> */}
        <NoteList>
          <SearchBar placeholder="Filter" />
          {this.state.notes.map((note, index) => (
            <Item
              onClick={e => this.setState({ selectedNoteIndex: index })}
              key={index}
              heading={findH1(note.data)}
            >
              {summary(note.data)}
            </Item>
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
