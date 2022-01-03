exports.createSchema = ({actions}) => {
  const {createTypes} = actions
  const typeDefs = `
    type Statistics {
      commentCount: Int!
      dislikeCount: Int!
      favoriteCount: Int!
      likeCount: Int!
      viewCount: Int!
    }

    type YoutubeVideo implements Node {
      statistics: Statistics!
      cover: File @link
      playlist: YoutubePlaylist @link
    }

    type YoutubePlaylist implements Node {
      videos: [YoutubeVideo!] @link
    }
  `

  createTypes(typeDefs)
}
