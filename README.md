# FlexAdmin - 올인원 어드민 플랫폼

## 프로젝트 개요 및 비전

FlexAdmin은 다양한 디지털 서비스의 컨텐츠와 설정을 중앙에서 동적으로 관리하여, 비즈니스 민첩성과 운영 효율성을 극대화하는 올인원 어드민 플랫폼입니다. 배포 주기와 관계없이 컨텐츠와 설정을 실시간으로 업데이트할 수 있어 서비스 운영을 더욱 효율적으로 만듭니다.

## 주요 목표

- **통합 어드민 관리:** 여러 서비스의 관리 포인트를 단일 플랫폼으로 통합
- **동적 컨텐츠 관리:** 코드 배포 없이 컨텐츠를 실시간으로 변경
- **확장 가능한 아키텍처:** 다양한 기능과 서비스 유형을 유연하게 지원
- **관리자 UX 최적화:** 직관적이고 효율적인 사용자 경험 제공

## 프로젝트 구조

본 프로젝트는 Turborepo를 활용한 모노레포 구조로 설계되어 있으며, 다음과 같은 구성요소를 포함합니다:

```
root/
├── apps/
│   ├── frontend/           # Next.js 기반 어드민 대시보드
│   └── backend/            # NestJS 기반 API 서버
├── packages/
│   ├── api-types/          # API 타입 정의
│   ├── ui/                 # 공통 UI 컴포넌트
│   ├── utils/              # 유틸리티 함수
│   ├── eslint-config/      # ESLint 설정
│   └── typescript-config/  # TypeScript 설정
└── package.json            # 루트 패키지 설정
```

## 기술 스택

### 공통

- **모노레포 관리:** Turborepo (^2.4.4)
- **패키지 매니저:** pnpm (9.0.0)
- **코드 품질:** TypeScript (5.8.2), ESLint (^9.22.0), Prettier (^3.5.3)

### 프론트엔드 (apps/frontend)

- **프레임워크:** Next.js (^15.2.1), React (^19.0.0)
- **개발 도구:** TypeScript (5.8.2), ESLint (^9.22.0)

### 백엔드 (apps/backend)

- **프레임워크:** NestJS (^11.0.1)
- **데이터베이스:** PostgreSQL (with TypeORM)
- **개발 도구:** TypeScript (5.8.2), ESLint (^9.18.0), Jest (^29.7.0)

## 시작하기

### 사전 요구사항

- Node.js >= 22
- pnpm 9.0.0

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd flexadmin

# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 모든 애플리케이션 개발 서버 실행
pnpm dev

# 특정 앱만 실행
pnpm dev --filter=frontend
pnpm dev --filter=backend
```

### 빌드

```bash
# 모든 앱 빌드
pnpm build

# 특정 앱만 빌드
pnpm build --filter=frontend
pnpm build --filter=backend
```

### 린트 및 타입 체크

```bash
# 린트 실행
pnpm lint

# 타입 체크
pnpm check-types
```

## 백엔드 환경 설정

`apps/backend/.env.example` 파일을 참조하여 `.env.development.local` 파일을 생성하고 환경 변수를 설정하세요:

```
NODE_ENV=development
PORT=9000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
DATABASE_SSL_ENABLED=false
```

## MVP 범위

- **기본 사용자 관리:** 관리자 로그인/인증
- **핵심 컨텐츠 관리:** 텍스트, 이미지 URL 실시간 관리
- **설정 관리:** 전역 설정 값, 기능 토글 관리
- **API 엔드포인트:** 클라이언트 서비스가 컨텐츠/설정을 조회할 수 있는 API

## 데이터베이스 구조

MVP 구현에는 다음과 같은 PostgreSQL 데이터베이스 테이블이 포함됩니다:

- `projects`: 관리 대상 서비스/프로젝트 정보
- `users`: 관리자 계정 정보
- `project_users`: 프로젝트와 사용자의 연결 관계
- `text_content`: 동적으로 관리되는 텍스트 컨텐츠
- `image_content`: 동적으로 관리되는 이미지 URL
- `global_settings`: 서비스 전역 설정 값
- `feature_toggles`: 기능 활성화 여부 토글

## 라이센스

이 프로젝트는 Apache License 2.0에 따라 라이센스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
