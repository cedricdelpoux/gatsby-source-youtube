const {google} = require("googleapis")
const GoogleOAuth2 = require("google-oauth2-env-vars")

const {PAGE_SIZE_PLAYLISTS, PAGE_SIZE_VIDEOS} = require("./constants")

exports.sourceNodes = async (
  {actions: {createNode}, createContentDigest, reporter},
  pluginOptions
) => {
  try {
    const googleOAuth2 = new GoogleOAuth2({
      token: "YOUTUBE_TOKEN",
    })
    const auth = await googleOAuth2.getAuth()
    const youtube = google.youtube({version: "v3", auth})

    const playlists = []

    let nextPageToken
    let page = 1

    const timerPlaylistsFetching = reporter.activityTimer(
      `source-youtube: Fetching playlists`
    )

    if (pluginOptions.debug) {
      timerPlaylistsFetching.start()
    }

    const channelFilter = {channelId: pluginOptions.channelId}
    const playlistFilter = {id: pluginOptions.playlistId}
    const mineFilter = {mine: true}
    const filter = pluginOptions.playlistId
      ? playlistFilter
      : pluginOptions.channelId
      ? channelFilter
      : mineFilter

    do {
      const {data} = await youtube.playlists.list({
        part: ["snippet"],
        maxResults: PAGE_SIZE_PLAYLISTS,
        mine: true,
        pageToken: nextPageToken,
        ...filter,
      })

      playlists.push(...data.items)

      if (pluginOptions.debug) {
        timerPlaylistsFetching.setStatus(
          `${playlists.length} playlists found in ${page * PAGE_SIZE_PLAYLISTS}`
        )
      }

      page++

      nextPageToken = data.nextPageToken
    } while (nextPageToken)

    if (pluginOptions.debug) {
      timerPlaylistsFetching.end()
    }

    for (const playlist of playlists) {
      const timerVideosFetching = reporter.activityTimer(
        `source-youtube: Fetching ${playlist.snippet.title} videos`
      )
      const videos = []
      let nextPageToken

      if (pluginOptions.debug) {
        timerVideosFetching.start()
      }

      do {
        const {data: playlistData} = await youtube.playlistItems.list({
          part: ["snippet,contentDetails"],
          maxResults: PAGE_SIZE_VIDEOS,
          playlistId: playlist.id,
          pageToken: nextPageToken,
        })

        const videosIds = playlistData.items
          .map((item) => item.contentDetails.videoId)
          .join(",")

        const {data} = await youtube.videos.list({
          part: ["snippet, statistics, localizations"],
          maxResults: PAGE_SIZE_VIDEOS,
          id: videosIds,
        })

        videos.push(...data.items)

        if (pluginOptions.debug) {
          timerVideosFetching.setStatus(`${videos.length} videos`)
        }

        nextPageToken = data.nextPageToken
      } while (nextPageToken)

      if (pluginOptions.debug) {
        timerVideosFetching.end()
      }

      createNode({
        id: playlist.id,
        ...playlist.snippet,
        videos___NODE: videos.map((video) => video.id),
        internal: {
          type: "YoutubePlaylist",
          contentDigest: createContentDigest(playlist),
        },
      })

      videos.forEach(({snippet, ...fields}) => {
        const video = {...fields, ...snippet}
        createNode({
          ...video,
          playlist___NODE: playlist.id,
          internal: {
            type: "YoutubeVideo",
            contentDigest: createContentDigest(video),
          },
        })
      })
    }

    return
  } catch (e) {
    if (pluginOptions.debug) {
      reporter.panic(`source-youtube: `, e)
    } else {
      reporter.panic(`source-youtube: ${e.message}`)
    }
  }
}
