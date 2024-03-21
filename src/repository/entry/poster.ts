import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Poster {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  videoProviderId: number

  @Column()
  url: string
}
