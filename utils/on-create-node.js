const {createRemoteFileNode} = require("gatsby-source-filesystem")

exports.onCreateNode = async ({
  node,
  actions: {createNode},
  store,
  cache,
  createNodeId,
  reporter,
}) => {
  const isYoutubeNode =
    node.internal.type === "YoutubePlaylist" ||
    node.internal.type === "YoutubeVideo"

  if (!isYoutubeNode) return

  const {maxres, standard, high, medium, default: low} = node.thumbnails
  const thumb = maxres || standard || high || medium || low

  if (thumb) {
    try {
      const fileNode = await createRemoteFileNode({
        url: thumb.url,
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
