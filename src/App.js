import React, { Component } from "react"
import styled from "styled-components"
import Editor from "./Editor"

const Layout = styled.main`
  display: flex;
  height: 100vh;
  width: 100vw;
`

const Sidebar = styled.section`
  background-color: #333;
  height: 100vh;
  width: 180px;
  flex-shrink: 0;
`

const NoteList = styled.section`
  height: 100vh;
  width: 250px;
  border-right: 1px solid #ddd;
  flex-shrink: 0;
`

const SearchBar = styled.div`
  height: 40px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
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

class App extends Component {
  render() {
    return (
      <Layout>
        <Sidebar />
        <NoteList>
          <SearchBar />
          <Item heading="A Note">This is a note with some stuff in it</Item>
          <Item heading="A Note">This is a note with some stuff in it</Item>
          <Item heading="A Note">This is a note with some stuff in it</Item>
        </NoteList>
        <Editor />
      </Layout>
    )
  }
}

export default App
