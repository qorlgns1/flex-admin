import { Injectable, NotFoundException } from '@nestjs/common';
import { TextContentService } from '../../contents/services/text-content.service';
import { ImageContentService } from '../../contents/services/image-content.service';
import { GlobalSettingsService } from '../../settings/services/global-setting.service';
import { FeatureTogglesService } from '../../settings/services/feature-toggle.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly textContentService: TextContentService,
    private readonly imageContentService: ImageContentService,
    private readonly globalSettingsService: GlobalSettingsService,
    private readonly featureTogglesService: FeatureTogglesService,
  ) {}

  async getTextContent(projectId: string, key?: string) {
    if (key) {
      try {
        const content = await this.textContentService.findByKey(projectId, key);
        return { [key]: content.value };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return { [key]: null };
        }
        throw error;
      }
    }

    const allContent = await this.textContentService.findAll(projectId);
    return allContent.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }

  async getImageContent(projectId: string, key?: string) {
    if (key) {
      try {
        const content = await this.imageContentService.findByKey(
          projectId,
          key,
        );
        return { [key]: { url: content.imageUrl, alt: content.altText } };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return { [key]: null };
        }
        throw error;
      }
    }

    const allContent = await this.imageContentService.findAll(projectId);
    return allContent.reduce((acc, item) => {
      acc[item.key] = { url: item.imageUrl, alt: item.altText };
      return acc;
    }, {});
  }

  async getGlobalSettings(projectId: string, key?: string) {
    if (key) {
      try {
        const setting = await this.globalSettingsService.findByKey(
          projectId,
          key,
        );
        return { [key]: setting.value };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return { [key]: null };
        }
        throw error;
      }
    }

    const allSettings = await this.globalSettingsService.findAll(projectId);
    return allSettings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }

  async getFeatureToggles(projectId: string, key?: string) {
    if (key) {
      try {
        const toggle = await this.featureTogglesService.findByKey(
          projectId,
          key,
        );
        return { [key]: toggle.isEnabled };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return { [key]: false };
        }
        throw error;
      }
    }

    const allToggles = await this.featureTogglesService.findAll(projectId);
    return allToggles.reduce((acc, item) => {
      acc[item.key] = item.isEnabled;
      return acc;
    }, {});
  }

  async getAllContent(projectId: string) {
    const [textContent, imageContent, settings, toggles] = await Promise.all([
      this.getTextContent(projectId),
      this.getImageContent(projectId),
      this.getGlobalSettings(projectId),
      this.getFeatureToggles(projectId),
    ]);

    return {
      textContent,
      imageContent,
      settings,
      toggles,
    };
  }
}
