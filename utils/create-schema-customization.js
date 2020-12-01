exports.createSchemaCustomization = ({actions}) => {
  const {createTypes} = actions
  const typeDefs = `
		type YoutubeVideo implements Node {
		  statistics: Statistics!
		}
		
		type Statistics {
		  commentCount: Int!
		  dislikeCount: Int!
		  favoriteCount: Int!
		  likeCount: Int!
		  viewCount: Int!
		}
	`

  createTypes(typeDefs)
}
