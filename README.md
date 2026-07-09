# 2026 AI 창의융합대회 홈페이지

경산과학고등학교 2026 AI 창의융합대회 안내 홈페이지입니다.
빌드 도구 없이 HTML·CSS·JavaScript로만 만든 정적 사이트이며, GitHub Pages로 배포됩니다.

> 이 문서는 **다음 해 담당 선생님(비개발자 포함)** 을 위한 운영 매뉴얼입니다.
> 기술 상세는 `SPEC.md`, 작업 규칙은 `CLAUDE.md` 를 참고하세요.

---

## 1. 미리보기 (로컬에서 열어보기)

HTML 파일을 더블클릭해서 여는 방식(`file://`)은 작동하지 않습니다.
아래처럼 간단한 서버를 켜야 합니다.

```bash
python3 -m http.server 8000
```

그 다음 브라우저에서 `http://localhost:8000` 접속.
(파이썬 대신 Node가 있으면 `npx serve .` 도 가능)

---

## 2. 자주 하는 작업

### 2.1 새 작품 추가하기

작품 정보는 오직 `data/works.json` 한 파일에만 있습니다. HTML은 고치지 않습니다.

1. GitHub에서 `data/works.json` 열기 → 연필(편집) 아이콘 클릭
2. `"works": [ ... ]` 배열 안에 아래 형태로 한 덩어리 추가:

   ```json
   {
     "id": "physics-03",
     "category": "physics",
     "title": "작품 주제",
     "team": ["학생1", "학생2"],
     "youtubeId": "abcDEF12345",
     "description": "",
     "award": null
   }
   ```

3. **바로 앞 작품의 `}` 뒤에 콤마(`,`) 붙이기** 잊지 마세요.
4. 아래 "Commit changes" 클릭 → 1~2분 뒤 사이트 반영.

**필드 설명**

| 필드 | 설명 |
|---|---|
| `id` | `분야-순번` 형식, 전체에서 겹치지 않게 (예: `physics-03`) |
| `category` | `math` / `physics` / `chemistry` / `biology` / `earth` / `humanities` 중 하나 |
| `title` | 작품 주제 |
| `team` | 팀원 이름 목록. 예: `["김철수", "이영희"]` |
| `youtubeId` | 유튜브 주소에서 `v=` 뒤의 11글자 (전체 주소 아님) |
| `description` | 한두 줄 요약 (없으면 `""`) |
| `award` | 수상 전에는 `null`, 수상 시 `"금상"` 등 |

> `youtubeId` 는 예를 들어 `https://youtu.be/dQw4w9WgXcQ` 이면 `dQw4w9WgXcQ` 부분입니다.

### 2.2 결과(수상) 발표하기

1. `data/works.json` 에서 수상한 작품의 `award` 값을 바꿉니다.
   - 예: `"award": null` → `"award": "금상"`
   - 값: `"대상"` / `"금상"` / `"은상"` / `"동상"` / `"장려상"`
2. Commit 하면 `results.html`(대회결과) 페이지에 자동으로 표시됩니다.

### 2.3 일정 수정하기

`schedule.html` 파일에서 날짜 텍스트를 직접 고친 뒤 Commit 합니다.

---

## 3. 콘텐츠 교체가 필요한 곳 (초안 상태)

아래는 임시 문구/자료입니다. 확정되면 교체하세요. (`SPEC.md` §11)

- [ ] 홈 취지문 5줄 — `index.html` 의 `manifesto__body` (주석 `TODO(콘텐츠)`)
- [ ] 심사기준 표 — `about.html` 의 `criteria` 표 (주석 `TODO`)
- [~] 히어로 이미지 — 임시로 무료 이미지(Unsplash) 적용됨. 교체하려면 `assets/images/hero.jpg` 파일만 바꾸기 (현재 `hero.jpg` = 과학 공식 흑판, 대체본 `hero-alt.jpg` = 밤의 지구)
- [~] 소개 영상 — 임시로 무료 스톡 영상(Mixkit, 뉴럴 네트워크) 적용됨. 실제 홍보/하이라이트 영상이 나오면 `assets/video/intro.mp4` 와 포스터 `assets/images/intro-poster.jpg` 를 교체
- [ ] 대회 대표 색상 — `assets/css/style.css` 의 `:root` 안 `--color-primary`
- [ ] 공유 미리보기 이미지 — `assets/images/og-image.png`
- [ ] 샘플 작품 데이터 — `data/works.json` (실제 접수 시작 전 교체)

---

## 4. 배포 (GitHub Pages)

- `main` 브랜치에 push하면 1~2분 뒤 자동 반영됩니다.
- 최초 1회 설정: GitHub 저장소 → **Settings → Pages → Source** 를 `main` / `/(root)` 로 지정.
- 변경이 안 보이면 새로고침(Cmd/Ctrl + Shift + R).
- `data/` 안의 JSON에 문법 오류가 있으면 GitHub Actions가 자동으로 잡아줍니다.

---

## 5. 손대면 안 되는 것 (중요)

- **빌드 도구·프레임워크 추가 금지** — npm, React, Sass 등. 순수 HTML/CSS/JS 유지.
- **경로는 상대 경로로** — `assets/...` 처럼. 맨 앞에 `/` 를 붙이면 GitHub Pages에서 깨질 수 있습니다.
- **작품 정보는 JSON에만** — HTML에 직접 적지 마세요.

자세한 규칙은 `CLAUDE.md` 참고.
