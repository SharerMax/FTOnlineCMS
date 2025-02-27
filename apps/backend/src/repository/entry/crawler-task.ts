import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CrawlerTask {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    comment: '0: pending, 1: running, 2: success, 3: failed',
  })
  status: number

  @Column()
  providerId: number

  @Column()
  startTime: Date

  @Column()
  endTime: Date
}
