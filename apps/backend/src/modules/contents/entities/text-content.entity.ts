import { Column, Entity, JoinColumn, ManyToOne, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/domain/base.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('text_content')
@Unique(['projectId', 'key'])
@Index(['projectId', 'key'])
export class TextContent extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid', nullable: false })
  projectId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  key: string;

  @Column({ type: 'text', nullable: false })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // 관계 설정
  @ManyToOne(() => Project, (project) => project.textContents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
