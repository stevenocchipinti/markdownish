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

const Item = ({ heading, children }) => (
  <ItemCard>
    <ItemHeading>{heading}</ItemHeading>
    <div>{children}</div>
  </ItemCard>
)

const sampleNote = {
  title: "Sample",
  data:
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
}

const newNote = {
  title: "new title",
  data: "more stuff"
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = sampleNote
  }

  componentDidMount() {
    setTimeout(() => {
      console.log("change!")
      this.setState(newNote)
    }, 3000)
  }

  render() {
    return (
      <Layout>
        <GlobalStyle />
        {/* <Sidebar /> */}
        <NoteList>
          <SearchBar placeholder="Filter" />
          <Item heading="A Note">This is a note with some stuff in it</Item>
          <Item heading="A Note">This is a note with some stuff in it</Item>
          <Item heading="A Note">This is a note with some stuff in it</Item>
        </NoteList>
        <Editor
          onChange={d => {
            console.log(d)
          }}
          defaultTitle={this.state.title}
          defaultData={this.state.data}
        />
      </Layout>
    )
  }
}

export default App
