import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/domain/base.entity';
import { TextContent } from '../../contents/entities/text-content.entity';
import { ImageContent } from '../../contents/entities/image-content.entity';
import { GlobalSetting } from '../../settings/entities/global-setting.entity';
import { FeatureToggle } from '../../settings/entities/feature-toggle.entity';
import { ProjectUser } from '../../users/entities/project-user.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'api_key',
    type: 'varchar',
    length: 64,
    unique: true,
    nullable: false,
  })
  apiKey: string;

  // 관계 설정
  @OneToMany(() => ProjectUser, (projectUser) => projectUser.project)
  projectUsers: ProjectUser[];

  @OneToMany(() => TextContent, (textContent) => textContent.project)
  textContents: TextContent[];

  @OneToMany(() => ImageContent, (imageContent) => imageContent.project)
  imageContents: ImageContent[];

  @OneToMany(() => GlobalSetting, (globalSetting) => globalSetting.project)
  globalSettings: GlobalSetting[];

  @OneToMany(() => FeatureToggle, (featureToggle) => featureToggle.project)
  featureToggles: FeatureToggle[];
}
