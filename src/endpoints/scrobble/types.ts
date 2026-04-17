
export type ScrobbleArtist = {
  // Artist ID
  mbid: string,
  // Artist Name
  '#text': string
}

export type ScrobbleAlbum = {
  // Album ID
  mbid: string,
  // Album name
  '#text': string
}

export type ScrobbleImageSize = 'small' | 'medium' | 'large' | 'extralarge'

export type ScrobbleImage = {
  size: ScrobbleImageSize,
  // JPG URL for the image
  '#text': string
}

export type ScrobbleDate = {
  uts: string;
  '#text': string;
}

export type Scrobble = {
  recenttracks: {
    track: ScrobbleTrack[]

    // Request attributes
    '@attr': {
      user: string,
      totalPages: string,
      page: string,
      perPage: string,
      total: string
    }
  }
};



export type ScrobbleTrack = {


  // Last.fm track ID
  mbid: string,

  // Track name
  name: string,

  // Track artist
  artist: ScrobbleArtist,

  // Last.fm track URL
  url: string

  // Track album
  album: ScrobbleAlbum,

  // Different thumbnails
  image: ScrobbleImage[],

  // Accessible when nowplaying is false
  date?: ScrobbleDate,

  // Unknown
  streamable: string,

  // Track-level requested attributes
  '@attr'?: {
    // Whether the track is currently playing
    nowplaying: 'true'
  },
}

export type ScrobbleTrackQuery = {
  name: string,
  id: string,
  url: string,
  currentlyPlaying: boolean,
  artist: {
    name: string,
    id: string
  },
  album: {
    name: string,
    id: string
  }
  images: Record<ScrobbleImageSize, string>
  datePlayed?: Date
}
