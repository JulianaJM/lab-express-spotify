const express = require("express");
const hbs = require("hbs");
const app = express();
const path = require("path");

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste your credentials here
var clientId = "274f0bc84d3543dd8ef65e8f22b3586e",
  clientSecret = "ed863c1fe0be46c0bb5011523504cb33";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  if (req.query.artist) {
    spotifyApi
      .searchArtists(req.query.artist)
      .then(data => {
        //res.send(data);
        console.log("all artists ", data.body.artists);
        const albums = data.body.artists.items;
        res.render("artists", {
          albums: albums,
          isAlbums: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log("artist albums", data.body.items);
      const albums = data.body.items;
      res.render("artists", { albums: albums, isTracks: true });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/albums/:artistId/tracks", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.artistId, { limit: 5, offset: 1 }).then(
    function(data) {
      console.log("yooooooooo ", data.body);
      const tracks = data.body.items;
      console.log(tracks);

      res.render("tracks", { tracks });
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000);
