import { OpenAPIRoute } from "chanfana";
import { BoardModel } from "./base";
import z from "zod";
import { HandleArgs } from "#src/types";
import { Context } from "hono";
import { Scrobble, ScrobbleImageSize, ScrobbleTrack, ScrobbleTrackQuery } from "./types";

export class ScrobbleRead extends OpenAPIRoute<HandleArgs> {
  _meta = {
    model: BoardModel,
  };
  schema = {
    tags: ["Scrobble"],
    request: {
      query: z.object({

      }),
    },
  };

  // Constructs the response
  async buildImageDict(track: ScrobbleTrack) {
    // Restructure the images to be easily indexed via "small", "large", etc.
    const imageDict = track.image.reduce((obj, image) => {
      // Exclude this non-image (looks like a non-descript white star)
      if (image['#text'].includes('2a96cbd8b46e442fc41c2b86b821562f')) {
        obj[image.size] = ""
      } else {
        obj[image.size] = image['#text']
      }

      return obj
    }, {} as Record<ScrobbleImageSize, string>)

    return imageDict
  }

  async deserializeScrobble(track: ScrobbleTrack): Promise<ScrobbleTrackQuery> {
    let datePlayed = track.date ? new Date(parseInt(track.date.uts) * 1000) : undefined

    const scrobble = {
      name: track.name,
      id: track.mbid,
      url: track.url,
      currentlyPlaying: !!track['@attr']?.nowplaying,
      artist: {
        name: track.artist['#text'],
        id: track.artist.mbid
      },
      album: {
        name: track.album['#text'],
        id: track.album.mbid
      },
      images: await this.buildImageDict(track),
      datePlayed
    } as ScrobbleTrackQuery

    return scrobble
  }

  public async handle(c: Context): Promise<ScrobbleTrackQuery> {
    // Process the request
    const url = new URL('https://ws.audioscrobbler.com/2.0/?')
    const params = new URLSearchParams({
      ['method']: 'user.getrecenttracks',
      ['user']: c.env.LAST_FM_USER_NAME,
      ['api_key']: c.env.LAST_FM_API_KEY,
      ['format']: 'json',
      ['nowplaying']: 'true',
      ['limit']: '1',
    })

    return fetch(url.toString() + params.toString())
      .then((res) => res.json())
      .then(async (data) => {

        try {
          const result = data as Scrobble
          const track = result.recenttracks.track[0]
          return this.deserializeScrobble(track)
        } catch (err) {
          console.error(err)
          throw err
        }
      })
  }
}
