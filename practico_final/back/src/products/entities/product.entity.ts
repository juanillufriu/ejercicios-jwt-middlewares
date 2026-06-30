import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 256 })
  name!: string;

  @Column('decimal', {
    precision: 12,
    scale: 4,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number | null) =>
        value === null || value === undefined ? value : parseFloat(value as string),
    },
  })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'int', nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity | null;
}