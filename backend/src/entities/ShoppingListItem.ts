import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('shopping_list_items')
export class ShoppingListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  unit: string;

  @Column({ default: false })
  purchased: boolean;

  @Column({ nullable: true })
  recipeId?: number;

  @Column({ nullable: true })
  recipeName?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.shoppingListItems, { onDelete: 'CASCADE' })
  user: User;
}
