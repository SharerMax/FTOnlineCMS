import type { ParsedVideo, ParsedVideoEposide as ParsedVideoEpisode, VideoDetail, VideoType } from './types'

export class Parser {
  parseVideo(videoDetail: VideoDetail) {
    const video: ParsedVideo = {
      name: videoDetail.vod_name,
      nickName: videoDetail.vod_sub,
      year: +videoDetail.vod_year,
      language: videoDetail.vod_lang,
      area: videoDetail.vod_area,
      score: +videoDetail.vod_score,
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
    else if (/动{画,漫}$/.test(orginType))
      videoType = 4
    return videoType
  }

  parseVideoGenre(videoDetail: VideoDetail) {
    const genreList = videoDetail.vod_class?.split(',') ?? []
    const genreSet = new Set<string>()
    if (genreList.length > 0) {
      for (const genre of genreList) {
        const trimGenre = genre.trim()
        // skip invaild genre
        if (!trimGenre || trimGenre.length === 1)
          continue
        genreSet.add(trimGenre)
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
