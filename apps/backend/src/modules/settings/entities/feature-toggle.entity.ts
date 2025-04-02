import { Column, Entity, JoinColumn, ManyToOne, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/domain/base.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('feature_toggles')
@Unique(['projectId', 'key'])
@Index(['projectId', 'key'])
export class FeatureToggle extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid', nullable: false })
  projectId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  key: string;

  @Column({
    name: 'is_enabled',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isEnabled: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  // 관계 설정
  @ManyToOne(() => Project, (project) => project.featureToggles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
