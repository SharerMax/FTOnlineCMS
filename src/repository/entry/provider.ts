import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

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

  @Column({ default: true })
  enable: boolean

  @CreateDateColumn()
  createDateTime: Date

  @UpdateDateColumn()
  updateDateTime: Date
}
