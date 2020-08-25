const {createRemoteFileNode} = require("gatsby-source-filesystem")

exports.onCreateNode = async ({
  node,
  actions: {createNode},
  store,
  cache,
  createNodeId,
  reporter,
}) => {
  if (
    node.internal.type === "YoutubePlaylist" ||
    node.internal.type === "YoutubeVideo"
  ) {
    try {
      const fileNode = await createRemoteFileNode({
        url: node.thumbnails.maxres.url,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        cache,
        store,
        name: "youtube-cover-" + node.id,
        reporter,
      })

      node.cover___NODE = fileNode.id
    } catch (e) {
      reporter.warn(`source-youtube: ${e}`)
    }
  }
}
