import React from "react"
import styled from "styled-components"

const ItemCard = styled.article`
  padding: 2rem;
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

const findH1 = str => {
  const title = str.split("\n").find(s => s.match(/^# /))
  return (title && title.replace(/# /, "")) || "Untitled"
}

const summary = str => {
  const [firstLine, ...otherLines] = str.split("\n")
  return firstLine.match(/^# /) ? otherLines : str
}

const NoteItem = ({ value, children, ...props }) => (
  <ItemCard {...props}>
    <ItemHeading>{findH1(value)}</ItemHeading>
    <ItemPreview>{summary(value)}</ItemPreview>
  </ItemCard>
)

export default NoteItem
