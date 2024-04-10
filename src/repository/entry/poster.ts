import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Video } from './video'
import { Provider } from './provider'

@Entity()
export class Poster {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Video, { nullable: false })
  @JoinColumn({ name: 'videoId' })
  video: Video

  @ManyToOne(() => Provider, { nullable: false })
  @JoinColumn({ name: 'providerId' })
  provider: Provider

  @Column()
  url: string
}
