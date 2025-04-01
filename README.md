# FLEX-ADMIN - 올인원 어드민 플랫폼

## 1. 프로젝트 개요 및 비전

본 프로젝트는 다양한 디지털 서비스(웹사이트, 모바일 앱 등)의 컨텐츠와 설정을 **중앙에서 동적으로 관리**하여, 배포 주기와 관계없이 컨텐츠/설정 업데이트를 가능하게 함으로써 **비즈니스 민첩성**과 **운영 효율성**을 극대화하는 것을 목표로 하는 **올인원 어드민 플랫폼** 개발 프로젝트입니다.

## 2. 주요 목표

- **통합 어드민 관리 시스템 구축:** 여러 서비스의 관리 포인트를 단일 플랫폼으로 통합합니다.
- **서비스 컨텐츠의 동적 관리 기능 구현:** 코드 배포 없이 컨텐츠(텍스트, 이미지 등)를 실시간으로 변경하고 반영합니다.
- **유연하고 확장 가능한 아키텍처 설계:** 향후 다양한 기능과 서비스 유형을 지원할 수 있는 기반을 마련합니다.
- **관리자 사용자 경험(UX) 최적화:** 관리자가 쉽고 효율적으로 플랫폼을 사용할 수 있도록 설계합니다.

## 3. MVP(Minimum Viable Product) 범위

초기 버전(MVP)은 핵심 가치를 검증하고 필수 기능을 제공하는 데 집중하며, 다음 기능을 포함합니다:

- **기본 사용자 관리:** 관리자 로그인/인증 등 기본적인 사용자 관리 기능.
- **핵심 컨텐츠 동적 관리:** 텍스트/라벨, 이미지 URL 실시간 관리 (CRUD).
- **핵심 설정 동적 관리:** Key-Value 형태의 전역 설정 값 관리, 단순 On/Off 형태의 기능 토글(Feature Toggle) 관리.
- **핵심 인프라:** 관리 대상 서비스가 최신 컨텐츠/설정 값을 조회할 수 있는 기본 API 엔드포인트 제공.

**[MVP 제외 사항 명시]**

- 복잡한 권한 관리(RBAC), 구조적 컨텐츠 관리(네비게이션 등), A/B 테스트, 모니터링/분석 기능.
- **웹 프론트엔드 자동 생성 및 호스팅 기능:** 이 기능은 그 잠재력에도 불구하고 구현 복잡성이 높다고 판단되어 **MVP 범위에서는 제외**합니다. MVP 단계에서는 핵심 관리 기능 구현 및 API 문서/스타터 템플릿 등 **연동 편의성 제공**에 집중하며, 해당 기능은 MVP 성공 이후 **미래의 확장 기능으로 고려**합니다.

## 4. 기술 스택 및 배포 환경

### 기술 스택 (2025년 4월 1일 기준)

- **시스템 요구사항:**
  - Node.js: >= 22
  - pnpm: 9.0.0
- **공통 도구:**
  - 모노레포 관리: Turborepo (^2.4.4)
  - 패키지 매니저: pnpm (9.0.0)
  - 코드 품질: TypeScript (^5.8.2), ESLint (^9.22.0), Prettier (^3.5.3)
- **프론트엔드 (apps/frontend):**
  - 핵심 프레임워크: Next.js (^15.2.1), React (^19.0.0)
  - 언어: TypeScript (^5.8.2)
  - 개발 도구: ESLint (^9.22.0), @types/react (^19.0.10), @types/node (^22.13.10)
- **백엔드 (apps/backend):**
  - 핵심 프레임워크: NestJS (^11.0.1) _(@nestjs/common, @nestjs/core, @nestjs/platform-express 기반)_
  - 언어: TypeScript (^5.8.2)
  - 테스팅: Jest (^29.7.0), Supertest (^7.0.0)
  - 코드 품질: ESLint (^9.18.0), Prettier (^3.4.2)
  - 컴파일러: SWC (@swc/core ^1.10.7)
  - 기타 의존성: rxjs (^7.8.1), reflect-metadata (^0.2.2)
- **데이터베이스:** PostgreSQL

### 목표 배포 환경 (AWS 프리티어 활용)

초기 배포 및 운영은 비용 효율성과 안정성을 고려하여 AWS 프리티어를 적극 활용할 계획입니다.

- **프론트엔드 (apps/frontend):** AWS Amplify Hosting 활용 목표
- **백엔드 (apps/backend):** AWS EC2 (t2/t3.micro, 12개월 프리티어) 또는 AWS App Runner (월별 프리티어) 활용 목표
- **데이터베이스:** AWS RDS for PostgreSQL (db.t2/t3/t4g.micro, 12개월 프리티어) 활용 목표
- **주요 고려사항:** 프리티어 기간(12개월 또는 월별 제공량) 및 제한 사항 명확히 인지, 비용 모니터링 및 알림 설정 필수, 보안 그룹 및 IAM을 통한 접근 제어 철저.

_(참고: 세부 의존성 및 정확한 버전은 각 `apps/_/package.json` 파일을 참조하십시오.)\*

## 5. 데이터베이스 스키마 (PostgreSQL - MVP 기준)

MVP 구현을 위한 PostgreSQL 데이터베이스 구조는 다음과 같습니다.

```sql
-- 데이터베이스 타임존 설정을 권장합니다 (예: 'Asia/Seoul')
-- SET timezone = 'Asia/Seoul';

-- UUID 확장 기능 활성화 (사용하지 않는다면 SERIAL 등으로 대체 가능)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 프로젝트 테이블 (관리 대상 서비스)
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- 프로젝트 고유 ID
    name VARCHAR(100) NOT NULL,                             -- 프로젝트/서비스 이름
    description TEXT,                                       -- 프로젝트 설명 (선택 사항)
    api_key VARCHAR(64) UNIQUE NOT NULL,                    -- 타겟 서비스 인증용 API 키
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),          -- 생성 시각
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()           -- 마지막 수정 시각
);
COMMENT ON TABLE projects IS '관리 대상이 되는 서비스 또는 프로젝트 정보';
COMMENT ON COLUMN projects.api_key IS '관리 대상 서비스가 이 API 키를 사용해 데이터를 가져감';

-- (이하 users, project_users, text_content, image_content, global_settings, feature_toggles 테이블 및 인덱스, 트리거 DDL 포함)
-- ... (이전 답변의 전체 스키마 DDL을 여기에 삽입) ...

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),    -- 사용자 고유 ID
    email VARCHAR(255) UNIQUE NOT NULL,                     -- 로그인 이메일
    hashed_password VARCHAR(255) NOT NULL,                  -- 해싱된 비밀번호
    full_name VARCHAR(100),                                 -- 사용자 이름 (선택 사항)
    role VARCHAR(20) NOT NULL DEFAULT 'editor',             -- 사용자 역할 ('admin', 'editor' 등 MVP에서는 단순하게)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,                -- 활성 사용자 여부
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),          -- 가입 시각
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()           -- 마지막 수정 시각
);
COMMENT ON TABLE users IS '어드민 플랫폼 사용자 정보';
COMMENT ON COLUMN users.role IS 'MVP에서는 admin/editor 정도로 단순화. 추후 확장 가능';

CREATE TABLE project_users (
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE, -- 프로젝트 ID (FK)
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,          -- 사용자 ID (FK)
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),                                -- 추가된 시각
    PRIMARY KEY (project_id, user_id)                                           -- 복합 기본 키
);
COMMENT ON TABLE project_users IS '어떤 사용자가 어떤 프로젝트에 접근 권한이 있는지 정의';

CREATE TABLE text_content (
    text_content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- 텍스트 컨텐츠 고유 ID
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE, -- 소속 프로젝트 ID (FK)
    key VARCHAR(255) NOT NULL,                                  -- 컨텐츠 식별 키 (예: 'homepage.title')
    value TEXT NOT NULL,                                        -- 실제 텍스트 값
    description TEXT,                                           -- 컨텐츠 설명 (관리자용 메모)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 생성 시각
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 마지막 수정 시각
    UNIQUE (project_id, key)                                    -- 프로젝트 내에서 key는 고유
);
COMMENT ON TABLE text_content IS '동적으로 관리되는 텍스트 조각들';
COMMENT ON COLUMN text_content.key IS '서비스 코드에서 이 키를 사용해 값을 조회';

CREATE TABLE image_content (
    image_content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- 이미지 컨텐츠 고유 ID
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE, -- 소속 프로젝트 ID (FK)
    key VARCHAR(255) NOT NULL,                                  -- 이미지 식별 키 (예: 'splash.logo')
    image_url VARCHAR(1024) NOT NULL,                           -- 이미지 URL (실제 파일은 S3 등 외부에 저장)
    alt_text VARCHAR(255),                                      -- 대체 텍스트
    description TEXT,                                           -- 이미지 설명 (관리자용 메모)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 생성 시각
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 마지막 수정 시각
    UNIQUE (project_id, key)                                    -- 프로젝트 내에서 key는 고유
);
COMMENT ON TABLE image_content IS '동적으로 관리되는 이미지 정보 (URL 기준)';

CREATE TABLE global_settings (
    setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),     -- 설정 고유 ID
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE, -- 소속 프로젝트 ID (FK)
    key VARCHAR(255) NOT NULL,                                  -- 설정 식별 키 (예: 'api.payment_gateway.url')
    value TEXT NOT NULL,                                        -- 설정 값
    description TEXT,                                           -- 설정 설명 (관리자용 메모)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 생성 시각
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 마지막 수정 시각
    UNIQUE (project_id, key)                                    -- 프로젝트 내에서 key는 고유
);
COMMENT ON TABLE global_settings IS '서비스 전역적으로 사용되는 설정 값들';

CREATE TABLE feature_toggles (
    toggle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),      -- 토글 고유 ID
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE, -- 소속 프로젝트 ID (FK)
    key VARCHAR(255) NOT NULL,                                  -- 기능 식별 키 (예: 'new_dashboard')
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,                  -- 기능 활성화 여부
    description TEXT,                                           -- 기능 설명 (관리자용 메모)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 생성 시각
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),              -- 마지막 수정 시각
    UNIQUE (project_id, key)                                    -- 프로젝트 내에서 key는 고유
);
COMMENT ON TABLE feature_toggles IS '특정 기능의 활성화 여부를 제어하는 플래그';

-- 인덱스 추가
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_project_users_user_id ON project_users(user_id);
CREATE INDEX idx_text_content_project_key ON text_content(project_id, key);
CREATE INDEX idx_image_content_project_key ON image_content(project_id, key);
CREATE INDEX idx_global_settings_project_key ON global_settings(project_id, key);
CREATE INDEX idx_feature_toggles_project_key ON feature_toggles(project_id, key);

-- updated_at 자동 업데이트를 위한 트리거 함수 (선택 사항이지만 권장)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_text_content_updated_at BEFORE UPDATE ON text_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_image_content_updated_at BEFORE UPDATE ON image_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON global_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_toggles_updated_at BEFORE UPDATE ON feature_toggles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
