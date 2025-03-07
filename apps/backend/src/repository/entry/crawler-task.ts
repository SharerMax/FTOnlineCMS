import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Provider } from './provider'

@Entity()
export class CrawlerTask {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    comment: '0: pending, 1: running, 2: success, 3: failed',
  })
  status: number

  @ManyToOne(() => Provider, provider => provider.id)
  @JoinColumn({ name: 'providerId' })
  provider: Provider

  @Column()
  startTime: Date

  @Column()
  endTime: Date
}
