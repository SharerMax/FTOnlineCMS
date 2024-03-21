import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Video } from './video'
import { Genre } from './genre'

/**
 * 风格
 * 剧情 爱情 动作 奇幻 冒险 科幻 动画 写实 传记 惊悚 恐怖 战争 灾难 悬疑 惊险 犯罪 搞笑 短片 伦理 历史 戏剧 青春 励志 歌舞 音乐 古装 都市 传记 文艺 纪实 等
 */
@Entity()
export class VideoGenre {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Genre)
  @JoinColumn({ name: 'genreId' })
  genre: Genre

  @ManyToOne(() => Video, video => video.genres)
  @JoinColumn({ name: 'videoId' })
  video: Video
}
