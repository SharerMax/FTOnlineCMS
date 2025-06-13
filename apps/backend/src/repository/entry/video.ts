import type { VideoType } from '../types'
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Poster } from './poster'
import { VideoGenre } from './video-genre'

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  nickName: string

  @Column()
  year: number

  @Column()
  language: string

  @Column()
  area: string

  @Column()
  score: number

  @Column()
  doubanId: string

  @Column()
  director: string

  @Column()
  actors: string

  @Column()
  description: string

  @Column()
  remarks: string

  @Column({
    type: 'integer',
    comment: '1 电影 2 电视剧 3 综艺 4 动漫',
  })
  type: VideoType // 1 电影 2 电视剧 3 综艺 4 动漫

  @OneToMany(() => VideoGenre, videoGenre => videoGenre.video)
  @JoinColumn({ name: 'videoGenreId' })
  genres: VideoGenre[]

  @OneToMany(() => Poster, poster => poster.video)
  @JoinColumn({ name: 'posterId' })
  poster: Poster[]

  @CreateDateColumn()
  createDateTime?: Date

  @UpdateDateColumn()
  updateDateTime?: Date
}
