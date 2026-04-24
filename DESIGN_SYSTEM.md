# Mildfist Design System

이 문서는 디자이너가 Mildfist 디자인 시스템을 이해하고 Claude Code로 안전하게 확장하기 위한 핸드오프 문서입니다.

## 1. Stack

| 영역 | 검출 결과 |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first `@theme inline`) |
| Storybook | 신규 설치 (`@storybook/nextjs` 8.x) |
| Package manager | npm |
| Font | Pretendard (CDN) — 사용자 선호 |

## 2. 기존에 있던 것

- `globals.css` 안에 9개의 색상 토큰(`--pinterest-red`, `--sand-gray`, `--olive-gray` 등)이 단일 layer로 정의되어 있었습니다. semantic 분리는 없었습니다.
- 컴포넌트는 `Header.tsx` 한 개만 분리되어 있고, 나머지 13개 페이지는 인라인 JSX + `style={{...}}` + Tailwind를 혼합해서 사용하고 있었습니다.
- Storybook, design token 파일, 아토믹 폴더 구조 모두 없었습니다.

분류: **Partial** — 기존 9개 토큰은 `--color-pinterest-red` 같은 legacy 별칭으로 `globals.css`에 그대로 남겨두었습니다. 화면 코드를 점진적으로 새 semantic 토큰으로 옮길 수 있도록 한 것이고, 마이그레이션이 완료되면 제거할 수 있습니다.

## 3. 토큰 레이어 — primitive vs. semantic

이 시스템에는 두 개의 색·간격·라디우스·섀도우 레이어가 있습니다.

```
┌──────────────────────────────────────────┐
│  UI 코드 (컴포넌트, 페이지)                  │  ← semantic 만 참조
│  text-text-neutral, bg-bg-brand-solid 등    │
└──────────────┬───────────────────────────┘
               │
       ┌───────▼──────────┐
       │  Semantic layer  │   src/styles/tokens/semantic.css
       │  fg.* / bg.* /   │   "역할" 표현
       │  stroke.*        │
       └───────┬──────────┘
               │
       ┌───────▼──────────┐
       │  Primitive layer │   src/styles/tokens/primitive.css
       │  gray.100, …     │   raw 색상 스케일
       └──────────────────┘
```

**규칙:** UI 코드는 절대로 primitive를 직접 참조하지 않습니다. 항상 semantic을 통해서만 사용합니다. (예외: `Foundations` 스토리는 문서화 목적으로 primitive를 직접 보여줍니다.)

**왜?** 브랜드가 바뀌면 primitive 한 줄을 바꿔서 전 시스템에 전파시킵니다. 어떤 역할의 의미가 바뀌면 semantic 한 줄만 바꿉니다. 단일 layer만 있다면 디자이너가 "값으로 부를지" "용도로 부를지" 매번 결정해야 하고, 둘 다 곤란해집니다.

### Semantic naming convention

```
{property}.{role}-{variant}[-{state}]
```

| 부분 | 값 |
|---|---|
| `property` | `fg` (text/icon) · `bg` (surface) · `stroke` (border) |
| `role` | `layer` · `neutral` · `brand` · `informative` · `critical` · `positive` · `magic` |
| `variant` | `solid` · `weak` · `muted` · `subtle` · `inverted` |
| `state` | `pressed` · `focused` (생략 시 기본 상태) |

예:
- `fg.neutral-solid` — 본문 텍스트 (`gray.1000`)
- `bg.brand-solid` — primary CTA 배경 (`carrot.600`)
- `bg.brand-solid-pressed` — primary CTA 눌렸을 때 (`carrot.700`)
- `stroke.neutral-muted` — 기본 구분선 (`gray.200`)

**Tailwind에서 사용하는 클래스 이름**은 prefix 중복을 피하기 위해 `text-{role-variant}`, `bg-{role-variant}`, `border-{role-variant}` 형태로 노출됩니다 (`globals.css`의 `@theme inline` 블록 참조).

| Semantic 토큰 | Tailwind 클래스 |
|---|---|
| `fg.neutral-solid` | `text-text-neutral` |
| `fg.neutral-muted` | `text-text-neutral-muted` |
| `bg.brand-solid` | `bg-bg-brand-solid` |
| `stroke.neutral-muted` | `border-border-muted` |

## 4. Color palette (primitive)

| Family | 용도 | Steps | 비고 |
|---|---|---|---|
| `gray` | 본문/배경/테두리 | `00, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000` | warm gray. 드래프트의 `#211922`/`#62625b`/`#91918c`/`#e5e5e0` 등을 단일 ramp로 정렬 |
| `carrot` | 브랜드/critical | `100`–`1000` | `carrot.600 = #e60023` (Pinterest red). brand 와 critical이 동일 hex이므로 carrot으로 통합 |
| `green` | positive | `100`–`1000` | `green.900 = #103c25` (관리자 success 메시지) |
| `blue` | informative | `100`–`1000` | `blue.600 = #2b48d4` |
| `purple` | magic / 프리미엄 | `100`–`1000` | `purple.600 = #6845ab` |

각 hue는 OKLCH 보간으로 풀 ramp을 만들었지만, 실제로 사용된 step만 의미를 갖습니다.

## 5. Semantic color map

### Foreground (`text-*`)

| Semantic | Primitive | 사용 예 |
|---|---|---|
| `text-text-neutral` | `gray.1000` | 본문 텍스트 |
| `text-text-neutral-muted` | `gray.800` | 보조 텍스트, caption |
| `text-text-neutral-subtle` | `gray.600` | placeholder, 비활성 아이콘 |
| `text-text-inverted` | `gray.00` | brand 배경 위 흰 글자 |
| `text-text-brand` | `carrot.600` | 활성 탭, brand 라벨 |
| `text-text-positive` | `green.900` | 성공 메시지 |
| `text-text-critical` | `carrot.600` | 에러, 환불 등 |
| `text-text-informative` | `blue.600` | 인포 링크 |
| `text-text-magic` | `purple.600` | AI / 프리미엄 표시 |

### Background (`bg-*`)

| Semantic | Primitive | 사용 예 |
|---|---|---|
| `bg-bg-default` | `gray.00` | 메인 화면 배경 |
| `bg-bg-floating` | `gray.00` + shadow | 카드, 팝오버 표면 |
| `bg-bg-neutral-weak` | `gray.100` | 검색바, 섹션 톤 다운 |
| `bg-bg-neutral-muted` | `gray.200` | 칩, 보조 fill |
| `bg-bg-neutral-solid` | `gray.1000` | 인버스 표면 |
| `bg-bg-brand-solid` | `carrot.600` | primary CTA |
| `bg-bg-brand-solid-pressed` | `carrot.700` | primary CTA 눌림 |
| `bg-bg-brand-weak` | `carrot.600 @ 8%` | brand tint 알림 배경 |
| `bg-bg-positive-weak` | `green.900 @ 8%` | success 알림 배경 |
| `bg-bg-critical-weak` | `carrot.100` | 에러 알림 배경 |
| `bg-bg-overlay` | `rgba(0,0,0,0.4)` | modal backdrop |

### Stroke (`border-*`)

| Semantic | Primitive | 사용 예 |
|---|---|---|
| `border-border-muted` | `gray.200` | 기본 구분선, 카드 테두리 |
| `border-border-subtle` | `gray.300` | 매우 옅은 구분선 |
| `border-border-solid` | `gray.600` | 입력 필드 활성 테두리 |
| `border-border-brand` | `carrot.600` | 브랜드 테두리, focus ring |

## 6. Component inventory

총 **24개** 컴포넌트 (Atoms 9 / Molecules 12 / Organisms 3).

### Atoms (`src/components/atoms/`)

| 컴포넌트 | 한 줄 설명 | 변형 |
|---|---|---|
| `Button` | 표준 버튼 | `variant: primary/secondary/ghost/danger`, `size: sm/md/lg`, `loading`, `fullWidth` |
| `IconButton` | 원형 아이콘 버튼 | `variant: primary/ghost/danger`, `size: sm/md/lg` |
| `Input` | 텍스트 입력 | `inputSize: sm/md/lg`, `invalid`, `disabled` |
| `Avatar` | 사용자 표시 | `size: xs–xl`, `src` 옵션, 없으면 이름 첫 글자 |
| `Badge` | 상태/카테고리 표시 | `tone: neutral/brand/positive/critical/informative/magic`, `size: sm/md` |
| `Chip` | 선택 가능한 필터 | `selected`, `leadingIcon` |
| `Divider` | 구분선 | `orientation: horizontal/vertical` |
| `Spinner` | 로딩 인디케이터 | `size: sm/md/lg`, `tone: brand/neutral/inverted` |
| `Label` (+ `HelpText`, `ErrorText`) | 폼 라벨 텍스트 atom | `required` |

### Molecules (`src/components/molecules/`)

| 컴포넌트 | 한 줄 설명 |
|---|---|
| `Card` | 둥근 컨테이너 — `padding`, `surface`, `bordered`, `shadow` |
| `SectionTitle` | 페이지/섹션 제목 — `variant: captionAbove/headingOnly/headingWithSub` |
| `InfoRow` | 라벨–값 좌우 배치 (영수증, 설정 요약) |
| `EmptyState` | 빈 상태 — 아이콘 + 제목 + 설명 + 액션 |
| `TabBar` | underline 활성 표시 탭 (최신/인기, 결제 상태 등) |
| `SearchBar` | 검색 input + 아이콘 (헤더 사용) |
| `FormField` | Label + Input + helpText/errorText 묶음 |
| `StatCard` | 어드민 대시보드 통계 카드 |
| `LikeButton` | 하트 + 카운터 토글 |
| `DropdownMenu` | trigger + 메뉴 리스트 (헤더 유저 메뉴) |
| `FileUploadArea` | 드래그&드롭 업로드 박스 |
| `ListItem` | leading + primary/secondary + trailing 행 |

### Organisms (`src/components/organisms/`)

| 컴포넌트 | 한 줄 설명 |
|---|---|
| `ModalShell` | overlay + 컨테이너 + 제목/푸터 슬롯 |
| `AdminSidebar` | 어드민 좌측 네비게이션 |
| `DataTable` | 정렬·hover·empty state 지원 테이블 |
| `Pagination` | 이전/다음 + 페이지 카운터 |

기존 `src/components/Header.tsx`는 그대로 두었습니다 (`AuthContext`와 결합되어 있어 단순 이동만으로 손댈 만한 변화가 아니므로, Phase 3의 가이드에 따라 organism 폴더로의 이전은 두 번째 패스로 미뤘습니다).

## 7. 확장 방법

### 새 semantic 색을 추가하기

1. `src/styles/tokens/primitive.css`에 raw 값이 없으면 추가합니다.
2. `src/styles/tokens/semantic.css`에 `--{property}-{role}-{variant}` 변수를 정의하고 primitive를 참조하도록 매핑합니다.
3. `src/app/globals.css`의 `@theme inline` 블록에 `--color-{prefix}-{name}` 형태로 노출하면 Tailwind 클래스로 즉시 사용 가능합니다.

### Atom에 새 변형을 추가하기

예: `Button`에 `variant="link"` 추가
1. `src/components/atoms/Button.tsx`의 `Variant` 유니온에 `"link"` 추가.
2. `variantClass` 객체에 Tailwind 클래스 매핑 추가 (semantic 토큰만 사용).
3. `Button.stories.tsx`에 `Link` 스토리 추가.

### 화면 패턴을 molecule로 승격하기

1. 패턴이 2번 이상 등장하거나 standard primitive(폼/네비)면 무조건 추출.
2. `src/components/molecules/` 안에 컴포넌트 + `.stories.tsx` 페어로 추가.
3. 기존 화면에서 인라인 JSX를 새 컴포넌트로 교체.

## 8. Deferred (의도적으로 포함하지 않은 것)

| 항목 | 이유 |
|---|---|
| 화면 파일 리팩토링 | 13개 페이지의 인라인 스타일을 semantic 토큰으로 교체하는 작업은 동작 회귀 위험이 있어 별도 패스로 분리. legacy 색 별칭(`--color-pinterest-red` 등)을 남겨놓아 화면은 그대로 동작합니다. |
| Bottom GNB | 드래프트에 하단 네비가 없습니다. 모바일 네비를 추가할 때 organism으로 만들 것. |
| Star Rating | 드래프트에 별점 UI가 없습니다. |
| Toast | 모달 외 알림 패턴이 없습니다. 어드민 `successMessage` 인라인 스타일을 표준화할 때 추가 권장. |
| `Header`의 organism 이전 | `AuthContext` 결합과 import 경로 영향 때문에 첫 패스에서는 그대로 둠. |
| 모션 토큰 | Skill 가이드에 따라 범위 외. |
| Checkbox / Radio / Select / Toggle | 드래프트에 표준 폼 위젯이 없음 (대신 chip-style 토글로 구현됨). 폼 화면이 추가되면 atom으로 추출. |

## 9. Designer workflow

1. `npm install` (한 번)으로 Storybook 의존성 설치.
2. `npm run storybook`으로 `localhost:6006`에서 컴포넌트와 토큰을 시각적으로 확인.
3. Foundations 섹션을 먼저 읽어 색·타이포·간격이 어떤 의미를 갖는지 이해.
4. 변경하고 싶은 컴포넌트의 `.tsx` 파일을 Claude Code에 열어서 자연어로 수정 지시 (예: "Button danger 변형의 hover 상태를 더 진한 톤으로 바꿔줘").
5. 새로운 색이 필요하면 Section 7의 "새 semantic 색 추가" 절차를 그대로 따르도록 Claude Code에 요청.

작업은 항상 raw 화면 파일이 아니라 **Storybook + 토큰 파일**에서 이뤄져야 합니다. 화면을 직접 만지면 토큰 시스템을 우회하게 되어 다음 패스에서 또 정리해야 합니다.
