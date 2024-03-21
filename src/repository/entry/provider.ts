import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  apiUrl: string

  @Column({
    nullable: true,
  })
  apiKey?: string

  @Column({ default: 0 })
  priority: number
}
