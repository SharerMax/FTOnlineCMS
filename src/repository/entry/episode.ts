import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Provider } from './provider'
import { Video } from './video'

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  number: number

  @ManyToOne(() => Video, { nullable: false })
  @JoinColumn({ name: 'videoId' })
  video: Video

  @ManyToOne(() => Provider, { nullable: false })
  @JoinColumn({ name: 'providerId' })
  provider: Provider

  @Column()
  url: string
}
