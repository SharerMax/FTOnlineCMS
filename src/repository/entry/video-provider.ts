import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Provider } from './provider'
import { Video } from './video'

@Entity()
export class VideoProvider {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Video)
  @JoinColumn({
    name: 'videoId',
  })
  video: Video

  @ManyToOne(() => Provider)
  @JoinColumn({
    name: 'providerId',
  })
  provider: Provider
}
