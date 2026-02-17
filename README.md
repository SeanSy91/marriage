# 모바일 청첩장 프로젝트

모바일에서 보기 좋은 단일 페이지 청첩장 템플릿입니다.

## 파일 구조
- `index.html`: 메인 페이지
- `styles.css`: 스타일
- `script.js`: 인터랙션(방명록, 관리자 기능, 갤러리 라이트박스)
- `assets/music/`: 배경 음악 파일
- `assets/photos/`: 갤러리 사진 파일

## 실행 방법
로컬 확인은 간단 서버 실행 후 모바일에서 접속하는 방식을 권장합니다.

```powershell
python -m http.server 5500
```

같은 와이파이에서 모바일 브라우저로 `http://PC_IP:5500` 접속

## 미디어 파일 넣는 규칙
아래 파일명을 그대로 맞춰서 넣으면 자동 반영됩니다.

- 배경 음악: `assets/music/wedding-bgm.mp3`
- 사진 1: `assets/photos/photo-01.jpg`
- 사진 2: `assets/photos/photo-02.jpg`
- 사진 3: `assets/photos/photo-03.jpg`
- 사진 4: `assets/photos/photo-04.jpg`
- 사진 5: `assets/photos/photo-05.jpg`

## 관리자 기능
- 방명록 삭제는 관리자 로그인 후에만 가능합니다.
- 진입 방법: 연락하기 섹션의 `신랑` 카드를 약 1.8초 길게 누르기
- 비밀번호: `472150`

## GitHub 저장소/배포
- 저장소: `https://github.com/SeanSy91/marriage`
- 배포 URL: `https://seansy91.github.io/marriage/`
- `main` 브랜치에 `push`하면 GitHub Pages가 자동 배포됩니다.

## 수정 후 배포 반영 방법
```powershell
& "C:\Program Files\Git\cmd\git.exe" add .
& "C:\Program Files\Git\cmd\git.exe" commit -m "수정 내용"
& "C:\Program Files\Git\cmd\git.exe" push
```

푸시 후 보통 20~60초 내 배포 URL에 반영됩니다.
