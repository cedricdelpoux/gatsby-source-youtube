import {graphql} from "gatsby"
import {GatsbyImage, getImage} from "gatsby-plugin-image"
import React from "react"

const PageIndex = ({data: {allYoutubeVideo}}) => {
  return (
    <>
      {allYoutubeVideo.nodes.map((node) => (
        <a key={node.id} href={`https://www.youtube.com/watch?v=${node.id}`}>
          <div>{node.title}</div>
          {node.cover && (
            <div style={{width: 500}}>
              <GatsbyImage image={getImage(node.cover)} />
            </div>
          )}
        </a>
      ))}
    </>
  )
}

export default PageIndex

export const pageQuery = graphql`
  query IndexQuery {
    allYoutubeVideo {
      nodes {
        id
        title
        cover {
          childImageSharp {
            gatsbyImageData(width: 200, layout: FIXED, placeholder: BLURRED)
          }
        }
      }
    }
  }
`
