import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  number: number

  @Column()
  videoProviderId: number

  @Column()
  url: string
}
