import React, { Component } from "react"
import styled, { createGlobalStyle } from "styled-components"
import Editor from "./Editor"
import notes from "./data"

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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      note: notes.notes[0]
    }
  }

  render() {
    return (
      <Layout>
        <GlobalStyle />
        {/* <Sidebar /> */}
        <NoteList>
          <SearchBar placeholder="Filter" />
          {notes.notes.map((note, index) => (
            <Item
              onClick={e => this.setState({ note })}
              key={index}
              heading={findH1(note.data)}
            >
              {note.data}
            </Item>
          ))}
        </NoteList>
        <Editor
          onChange={d => this.setState({ note: d })}
          data={this.state.note.data}
        />
      </Layout>
    )
  }
}

export default App
