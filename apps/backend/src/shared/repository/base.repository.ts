import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
  FindOptionsWhere,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * 기본 레포지토리 클래스
 * @template T - 엔티티 타입
 */
export abstract class BaseRepository<T extends ObjectLiteral> {
  private static readonly ERROR_MESSAGES = {
    ENTITY_NOT_FOUND: 'Entity not found',
    ENTITY_NOT_FOUND_BY_ID: (id: string): string =>
      `Entity with id ${id} not found`,
  } as const;

  constructor(private readonly repository: Repository<T>) {}

  /**
   * 모든 엔티티를 조회합니다.
   * @param options - 조회 옵션
   * @returns 엔티티 배열
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * 단일 엔티티를 조회합니다.
   * @param options - 조회 옵션
   * @returns 엔티티
   * @throws {NotFoundException} 엔티티를 찾을 수 없는 경우
   */
  async findOne(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      throw new NotFoundException(
        BaseRepository.ERROR_MESSAGES.ENTITY_NOT_FOUND,
      );
    }
    return entity;
  }

  /**
   * ID로 엔티티를 조회합니다.
   * @param id - 엔티티 ID
   * @returns 엔티티
   * @throws {NotFoundException} 엔티티를 찾을 수 없는 경우
   */
  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
    if (!entity) {
      throw new NotFoundException(
        BaseRepository.ERROR_MESSAGES.ENTITY_NOT_FOUND_BY_ID(id),
      );
    }
    return entity;
  }

  /**
   * 새로운 엔티티를 생성합니다.
   * @param data - 엔티티 데이터
   * @returns 생성된 엔티티
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * 엔티티를 업데이트합니다.
   * @param id - 엔티티 ID
   * @param data - 업데이트할 데이터
   * @returns 업데이트된 엔티티
   * @throws {NotFoundException} 엔티티를 찾을 수 없는 경우
   */
  async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * 엔티티를 삭제합니다.
   * @param id - 엔티티 ID
   * @throws {NotFoundException} 엔티티를 찾을 수 없는 경우
   */
  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        BaseRepository.ERROR_MESSAGES.ENTITY_NOT_FOUND_BY_ID(id),
      );
    }
  }

  /**
   * 엔티티의 총 개수를 조회합니다.
   * @param options - 조회 옵션
   * @returns 엔티티 개수
   */
  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }
}
