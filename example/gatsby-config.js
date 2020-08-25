module.exports = {
  plugins: [
    {
      //resolve: "gatsby-source-youtube"
      resolve: require.resolve(`..`),
      options: {
        debug: true,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
  ],
}
