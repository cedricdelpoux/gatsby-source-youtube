const {createRemoteFileNode} = require("gatsby-source-filesystem")

exports.handleCover = async ({
  node,
  createNode,
  store,
  cache,
  createNodeId,
  reporter,
}) => {
  try {
    const max = node.thumbnails && node.thumbnails.maxres
    const standard = node.thumbnails && node.thumbnails.standard
    const high = node.thumbnails && node.thumbnails.high
    const medium = node.thumbnails && node.thumbnails.medium
    const low = node.thumbnails && node.thumbnails.low
    const thumb = max || standard || high || medium || low

    if (thumb) {
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

      node.cover = fileNode.id
    }
  } catch (e) {
    reporter.warn(`source-youtube: ${e}`)
  }

  return
}
