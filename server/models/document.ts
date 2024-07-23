import { Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { AllowNull } from "sequelize-typescript";

interface DocumentAttributes {
  id: number;
  document: Express.Multer.File;
  uploadedAt: Date;
  lastOpened: Date;
  views: number;
  owner: User;
  ownerId: string;
  category: string;
  keyInfo: Record<string, any>;
}

@Entity()
export class Document implements DocumentAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("json")
  document: Express.Multer.File;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  lastOpened: Date;

  @Column({ default: 0 })
  views: number;

  @Column()
  category: string;

  @Column("json", { nullable: true })
  keyInfo: Record<string, any>;

  @Column()
  ownerId: string;

  @Column({ default: false })
  starred: boolean;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: "ownerId" })
  owner: User;
}
