// image-content.entity.ts
import { Column, Entity, JoinColumn, ManyToOne, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/domain/base.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('image_content')
@Unique(['projectId', 'key'])
@Index(['projectId', 'key'])
export class ImageContent extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid', nullable: false })
  projectId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  key: string;

  @Column({ name: 'image_url', type: 'varchar', length: 1024, nullable: false })
  imageUrl: string;

  @Column({ name: 'alt_text', type: 'varchar', length: 255, nullable: true })
  altText: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // 관계 설정
  @ManyToOne(() => Project, (project) => project.imageContents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
