import type { ParsedVideo, ParsedVideoEposide as ParsedVideoEpisode, VideoDetail } from './types'
import { VideoType } from '@/repository/types'
import { GENRE_BLOCK_LIST } from './constant'

export class Parser {
  parseVideo(videoDetail: VideoDetail) {
    const video: ParsedVideo = {
      name: videoDetail.vod_name,
      nickName: videoDetail.vod_sub,
      year: Number.isNaN(+videoDetail.vod_year) ? 0 : +videoDetail.vod_year,
      language: this.normalizedLanguage(videoDetail.vod_lang),
      area: this.normalizedArea(videoDetail.vod_area),
      score: Number.isNaN(+videoDetail.vod_score) ? 0 : +videoDetail.vod_score,
      doubanId: '',
      director: videoDetail.vod_director === '未知' ? '' : videoDetail.vod_director,
      actors: videoDetail.vod_actor === '内详' ? '' : videoDetail.vod_actor,
      description: videoDetail.vod_content.replace(/<[^>]+>/g, '').trim(),
      remarks: videoDetail.vod_remarks,
    }
    return video
  }

  normalizedLanguage(language: string) {
    if (!language)
      return ''
    if (language.includes('国语') || language.includes('普通话') || language.includes('汉语'))
      return '国语'
    if (language === '其他' || language === '其它')
      return ''
    return language
  }

  normalizedArea(area: string) {
    if (!area)
      return ''
    if (area === '中国大陆' || '大陆' || '中国')
      return '中国大陆'
    if (area === '中国香港' || '香港')
      return '香港'
    if (area === '中国台湾' || '台湾')
      return '台湾'
    if (area === '中国澳门' || '澳门')
      return '澳门'
    return area
  }

  parseVideoType(videoDetail: VideoDetail): VideoType {
    const orginType = videoDetail.type_name ?? ''
    // 1 电影 2 电视剧 3 综艺 4 动漫
    let videoType: VideoType = VideoType.Other
    if (orginType.endsWith('剧'))
      videoType = VideoType.TV
    else if (orginType.endsWith('片'))
      videoType = VideoType.Movie
    else if (orginType.endsWith('综艺'))
      videoType = VideoType.VarietyShow
    else if (/动[画漫]\}$/.test(orginType))
      videoType = VideoType.Animation
    return videoType
  }

  isVaildGenre(genre: string) {
    if (GENRE_BLOCK_LIST.includes(genre))
      return false
    // 风格类型 最少2个字 至多3个字
    if (genre && genre.length > 1 && genre.length < 4) {
      // 空白字符
      if (/\w/.test(genre))
        return false
      if (/其[他它]/.test(genre))
        return false
      // 过滤以国家命名的风格
      if (genre.endsWith('国'))
        return false
      // 过滤  xx片 xx剧
      if (genre.length > 2 && (genre.endsWith('片') || genre.endsWith('剧')))
        return false
      return true
    }
    return false
  }

  parseVideoGenre(videoDetail: VideoDetail) {
    const vodClass = videoDetail.vod_class?.replace(/[;:]/g, '')
    const genreSet = new Set<string>()
    if (vodClass) {
      // spliter by ',' or '/'
      const genreList = vodClass.split(/[,，/.。·\s]/g) ?? []
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
