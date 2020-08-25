import React from "react"
import Img from "gatsby-image"
import {graphql} from "gatsby"

export default ({data: {allYoutubeVideo}}) => {
  return (
    <>
      {allYoutubeVideo.nodes.map((node) => (
        <a key={node.id} href={`https://www.youtube.com/watch?v=${node.id}`}>
          <div>{node.title}</div>
          {node.cover && (
            <div style={{width: 500}}>
              <Img fluid={node.cover.childImageSharp.fluid} />
            </div>
          )}
        </a>
      ))}
    </>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    allYoutubeVideo {
      nodes {
        id
        title
        cover {
          childImageSharp {
            fluid(maxWidth: 500, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
