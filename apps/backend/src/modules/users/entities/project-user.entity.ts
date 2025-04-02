import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('project_users')
export class ProjectUser {
  @PrimaryColumn({ name: 'project_id' })
  projectId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({
    name: 'added_at',
    type: 'timestamptz',
    nullable: false,
    default: () => 'NOW()',
  })
  addedAt: Date;

  // 관계 설정
  @ManyToOne(() => Project, (project) => project.projectUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
