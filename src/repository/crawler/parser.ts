import type { ParsedVideo, ParsedVideoEposide as ParsedVideoEpisode, VideoDetail, VideoType } from './types'

export class Parser {
  parseVideo(videoDetail: VideoDetail) {
    const video: ParsedVideo = {
      name: videoDetail.vod_name,
      nickName: videoDetail.vod_sub,
      year: Number.isNaN(+videoDetail.vod_year) ? 0 : +videoDetail.vod_year,
      language: videoDetail.vod_lang,
      area: videoDetail.vod_area,
      score: Number.isNaN(+videoDetail.vod_score) ? 0 : +videoDetail.vod_score,
      doubanId: '',
      director: videoDetail.vod_director === '未知' ? '' : videoDetail.vod_director,
      actors: videoDetail.vod_actor === '内详' ? '' : videoDetail.vod_actor,
      description: videoDetail.vod_content,
      remarks: videoDetail.vod_remarks,
    }
    return video
  }

  parseVideoType(videoDetail: VideoDetail): VideoType {
    const orginType = videoDetail.type_name ?? ''
    // 1 电影 2 电视剧 3 综艺 4 动漫
    let videoType: VideoType = 1
    if (orginType.endsWith('剧'))
      videoType = 2
    else if (orginType.endsWith('片'))
      videoType = 1
    else if (orginType.endsWith('综艺'))
      videoType = 3
    else if (/动[画漫]}$/.test(orginType))
      videoType = 4
    return videoType
  }

  isVaildGenre(genre: string) {
    if (genre && genre.length > 1 && genre.length < 4) {
      if (genre.length > 2 && (genre.endsWith('片') || genre.endsWith('剧')))
        return false
      if (/\w/.test(genre))
        return false
      return true
    }
    return false
  }

  parseVideoGenre(videoDetail: VideoDetail) {
    const vodClass = videoDetail.vod_class?.replace(/[;:]/g, '')
    const genreSet = new Set<string>()
    if (!vodClass) {
      // spliter by ',' or '/'
      const genreList = vodClass.split(/[,，\/\.。·\s]/g) ?? []
      if (genreList.length > 0) {
        for (const genre of genreList) {
          const trimGenre = genre.trim()
          if (this.isVaildGenre(trimGenre))
            genreSet.add(trimGenre)
        }
      }
    }

    return genreSet
  }

  parseVideoEpisode(videoDetail: VideoDetail) {
    const playUrls = videoDetail.vod_play_url
    const playUrlList = playUrls.split('#')
    const episodeList: ParsedVideoEpisode[] = []
    for (let i = 0; i < playUrlList.length; i++) {
      const playUrl = playUrlList[i]

      const [name, url] = playUrl.split('$')
      // skip invaild url
      if (!name || !url)
        continue
      const episode: ParsedVideoEpisode = {
        name,
        number: i + 1,
        url,
      }
      episodeList.push(episode)
    }

    return episodeList
  }

  parseVideoPoster(videoDetail: VideoDetail) {
    return videoDetail.vod_pic
  }
}
