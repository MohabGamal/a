const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const db = require("./db.json")
const typeDefs = require("./schema.js")

const resolvers = {
  Query: {
    games: () => db.games,
    reviews: () => db.reviews,
    authors: () => db.authors,
    game: (_, args) => db.games.find((game) => game.id === args.id),
    review: (_, args) => db.reviews.find((review) => review.id === args.id),
    author: (_, args) => db.authors.find((author) => author.id === args.id),
  },
  Game: {
    reviews: (game) =>
      db.reviews.filter((review) => review.game_id === game.id),
  },
  Review: {
    game: (review) => db.games.find((game) => game.id === review.game_id),
    author: (review) =>
      db.authors.find((author) => author.id === review.author_id),
  },
  Author: {
    reviews: (author) =>
      db.reviews.filter((review) => review.author_id === author.id),
  },
  Mutation: {
    addGame: (_, args) => {
      const newGame = { ...args.game, id: db.games.length + 1 }
      db.games.push(newGame)
      return newGame
    },
    editGame: (_, args) => {
      const ogGame = db.games.find((game) => game.id === args.id)
      const editedGame = { ...ogGame, ...args.game }
      return editedGame
    },
    deleteGame: (_, args) => db.games.filter((game) => game.id !== args.id),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
})
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
  .catch(console.error)
