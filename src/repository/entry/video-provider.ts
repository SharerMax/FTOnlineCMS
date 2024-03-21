import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class VideoProvider {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  videoId: number

  @Column()
  providerId: number
}
