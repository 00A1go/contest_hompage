# 2026 AI 창의융합대회 홈페이지 명세서

## 1. 개요

경산과학고등학교 2026 AI 창의융합대회 홈페이지. GitHub Pages에 배포하는 정적 사이트.

- **URL**: (GitHub Pages 도메인, 또는 커스텀 도메인)
- **기술 스택**: Vanilla HTML + CSS + JavaScript (프레임워크·빌드 도구 없음)
- **데이터 관리**: `data/works.json` 한 파일에서 작품 정보 관리
- **배포**: GitHub Pages (main 브랜치 push 시 자동 반영)
- **지원 브라우저**: 최신 Chrome, Safari, Edge, Firefox / iOS Safari, Android Chrome

---

## 2. 디렉토리 구조

```
/
├── index.html              # 홈
├── about.html              # 대회개요
├── schedule.html           # 대회일정
├── works.html              # 작품영상
├── results.html            # 대회결과
├── contact.html            # 대회문의
├── assets/
│   ├── css/
│   │   └── style.css       # 전체 공통 스타일
│   ├── js/
│   │   ├── common.js       # 헤더/푸터 삽입, 현재 페이지 하이라이트
│   │   └── works.js        # 작품영상 페이지 전용 로직
│   ├── images/
│   │   ├── hero.jpg        # 홈 히어로 배경
│   │   ├── logo.png        # 대회 로고
│   │   └── og-image.png    # 공유용 미리보기
│   └── video/
│       └── intro.mp4       # 홈 자동재생 소개 영상 (선택)
├── data/
│   └── works.json          # 작품 데이터
├── partials/
│   ├── header.html         # 공통 헤더 (내비게이션)
│   └── footer.html         # 공통 푸터 (저작권 표시)
├── .github/workflows/
│   └── validate.yml        # JSON 문법 검증 액션
├── README.md               # 관리자용 매뉴얼
└── SPEC.md                 # 본 명세서
```

---

## 3. 공통 요소

### 3.1 헤더 (`partials/header.html`)

- 좌측: 대회 로고 + "2026 AI 창의융합대회" 텍스트
- 우측 내비게이션: `홈 | 대회개요 | 대회일정 | 작품영상 | 대회결과 | 대회문의`
- 현재 페이지 링크는 강조 표시 (`.active` 클래스, `common.js`가 자동 부여)
- 모바일에서는 햄버거 메뉴로 접힘 (768px 이하)

### 3.2 푸터 (`partials/footer.html`)

- `2026 AI 창의융합대회 ⓒ 2026 AI Convergence Challenge Organizing Committee. All rights reserved.`

### 3.3 헤더/푸터 삽입 방식

각 페이지의 `<body>`에 아래 마커를 두고 `common.js`가 `fetch`로 삽입:

```html
<div id="site-header"></div>
<!-- 페이지 콘텐츠 -->
<div id="site-footer"></div>
<script src="/assets/js/common.js" defer></script>
```

---

## 4. 페이지 명세

### 4.1 홈 (`index.html`)

| 섹션 | 내용 |
|---|---|
| 히어로 | "2026년 경산과학고등학교 AI 창의융합대회" 타이틀 이미지 |
| 취지문 | 대회 취지·독려 문구 5줄, 크게 표시 |
| 소개 영상 | 자동재생 (`autoplay muted loop playsinline`), 컨트롤은 마우스 오버 시만 노출 |

### 4.2 대회개요 (`about.html`)

- 접수기간: 2026년 10월 19일 ~ 25일
- 접수방법: 이메일 접수 (`jsjcom@gss.hs.kr`, `mailto:` 링크)
- 참가대상: 경산과학고등학교 재학생 누구나
- 참가분야: 수학 / 물리 / 화학 / 생물 / 지구과학 / 인문
- 심사기준: 3열 표 (기준명 / 배점 / 설명) — **콘텐츠 확정 후 채움**

### 4.3 대회일정 (`schedule.html`)

세로 타임라인 6단계:

1. 신청접수 — 2026.10.19 ~ 10.25
2. 발표영상 촬영 — 2026.10.26 ~ 10.31
3. 영상 업로드 — 2026.11.01
4. 심사기간 — 2026.11.01 ~ 11.07
5. 결과 발표 — 2026.11.13
6. 시상식 — 2026.12.18

### 4.4 작품영상 (`works.html`)

- 상단 탭: `수학 | 물리 | 화학 | 생물 | 지구과학 | 인문`
- 탭 클릭 시 해당 분야 작품 목록 렌더링 (페이지 리로드 없이)
- URL 해시로 상태 유지 (`works.html#physics`)
- 각 작품 카드:
  - YouTube 임베드 (`youtube-nocookie.com`, 16:9 반응형)
  - 주제
  - 팀원 (콤마 구분)
  - 링크 (YouTube 원본으로 이동 — 여기서 좋아요·댓글)
- 데이터가 없는 분야는 "아직 등록된 작품이 없습니다" 표시

### 4.5 대회결과 (`results.html`)

- 발표 전: "2026년 11월 13일(금) 14:00 발표예정"
- 발표 후: 분야별 수상작 (금/은/동 등) — `data/works.json`의 각 작품 객체에 `award` 필드가 있으면 자동 표시

### 4.6 대회문의 (`contact.html`)

- 이메일: `jsjcom@gss.hs.kr` (큰 버튼 형태의 `mailto:` 링크)
- 기타 문의 채널이 있다면 추가

---

## 5. 데이터 스키마

### 5.1 `data/works.json`

```json
{
  "works": [
    {
      "id": "math-01",
      "category": "math",
      "title": "예: 대칭군을 이용한 …",
      "team": ["김철수", "이영희"],
      "youtubeId": "dQw4w9WgXcQ",
      "description": "한두 줄 요약 (선택)",
      "award": null
    }
  ]
}
```

**필드 규칙**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✓ | `{category}-{순번}` 형식, 전체에서 고유 |
| `category` | string | ✓ | `math` \| `physics` \| `chemistry` \| `biology` \| `earth` \| `humanities` |
| `title` | string | ✓ | 작품 주제 |
| `team` | string[] | ✓ | 팀원 이름 배열 |
| `youtubeId` | string | ✓ | YouTube 영상 ID (URL 뒤 `v=` 이후 부분) |
| `description` | string | ✗ | 한두 줄 요약 |
| `award` | string \| null | ✗ | `"대상"`, `"금상"`, `"은상"`, `"동상"`, `"장려상"` 등. 결과 발표 전엔 `null` |

### 5.2 카테고리 라벨 매핑

`assets/js/works.js` 상단 상수:

```js
const CATEGORIES = {
  math: "수학",
  physics: "물리",
  chemistry: "화학",
  biology: "생물",
  earth: "지구과학",
  humanities: "인문"
};
```

---

## 6. 스타일 가이드

### 6.1 색상 (CSS 변수, `:root`에 정의)

- `--color-primary`: 대회 대표색 (미정, 추후 확정)
- `--color-bg`: `#ffffff`
- `--color-text`: `#1a1a1a`
- `--color-muted`: `#6b7280`
- `--color-border`: `#e5e7eb`

### 6.2 타이포그래피

- 본문: `Pretendard` (fallback: `-apple-system, "Malgun Gothic", sans-serif`)
- 크기: 본문 16px, h1 32px(모바일 24px), h2 24px, h3 20px

### 6.3 반응형 브레이크포인트

- `≤ 640px`: 모바일
- `641 ~ 1024px`: 태블릿
- `≥ 1025px`: 데스크톱

### 6.4 레이아웃

- 최대 콘텐츠 폭: 1080px, 중앙 정렬
- 좌우 여백: 데스크톱 24px, 모바일 16px

---

## 7. 자바스크립트 동작

### 7.1 `common.js`

- 헤더·푸터 `fetch` → 삽입
- 현재 URL 기준으로 활성 메뉴 항목에 `.active` 클래스 부여
- 모바일 햄버거 메뉴 토글

### 7.2 `works.js`

- 페이지 로드 시 `data/works.json` fetch
- 해시(`#physics` 등) 기준 초기 탭 결정, 없으면 `math`
- 탭 클릭 시 `location.hash` 갱신 → 목록 재렌더
- YouTube 임베드는 `<iframe loading="lazy">`로 지연 로드

### 7.3 `results.js` (선택)

- `works.json`에서 `award !== null`인 항목만 필터해 분야별로 그룹핑 후 표시

---

## 8. 배포 (GitHub Pages)

1. GitHub repo 생성 (`public`)
2. Settings → Pages → Source: `main` 브랜치 `/ (root)`
3. main 브랜치에 push하면 1~2분 뒤 반영
4. 커스텀 도메인 쓸 경우 `CNAME` 파일 추가

### 8.1 JSON 검증 워크플로 (`.github/workflows/validate.yml`)

- `data/**/*.json` 변경 시 실행
- `python -m json.tool` 로 파싱 시도, 실패하면 커밋 차단

---

## 9. 관리자 매뉴얼 (`README.md`에 수록)

관리자가 반복적으로 수행할 작업 3가지:

### 9.1 새 작품 추가

1. GitHub에서 `data/works.json` 열기
2. 연필(편집) 아이콘 클릭
3. `"works": [ ... ]` 배열 안에 아래 형태로 한 덩어리 추가:
   ```json
   {
     "id": "physics-03",
     "category": "physics",
     "title": "작품 주제",
     "team": ["학생1", "학생2"],
     "youtubeId": "abcDEF12345",
     "description": ""
   }
   ```
4. 앞 객체 끝에 콤마(`,`) 붙이는 것 잊지 말기
5. 하단 "Commit changes" 클릭

### 9.2 결과 발표 (수상 등록)

1. `data/works.json`에서 수상 작품의 `award` 필드 값 지정
   - 예: `"award": "금상"`
2. Commit

### 9.3 일정 수정 (예: 시상식 날짜 변경)

1. `schedule.html`에서 해당 날짜 텍스트 수정
2. Commit

---

## 10. 접근성·SEO 체크리스트

- 모든 이미지에 `alt` 속성
- 링크 텍스트 의미 있게 ("여기 클릭" 지양)
- 색상 대비 WCAG AA 이상
- `<title>` 페이지마다 고유
- `<meta name="description">` 페이지마다 작성
- Open Graph 태그 (`og:title`, `og:image`, `og:description`) — SNS 공유 대비
- `favicon.ico` 포함

---

## 11. 열린 이슈 (콘텐츠 확정 필요)

- [ ] 대회 취지·독려 문구 5줄 (홈)
- [ ] 심사기준 표 내용 (대회개요)
- [ ] 히어로 이미지·소개 영상 소재
- [ ] 대회 대표 색상
- [ ] 커스텀 도메인 사용 여부
