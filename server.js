const express = require('express');
const path = require('path');
const app = express();

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✨ 폼 데이터를 받기 위한 설정 (중요)
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 메인 페이지
app.get('/', (req, res) => {
  res.render('main(LogX)'); // views/main(LogX).ejs
});

// 로그인
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('[로그인]', email, password);
  res.send('로그인 처리됨!');
});

// 회원가입
app.get('/signUp', (req, res) => res.render('signUp'));
app.post('/signUp', (req, res) => {
  const { id, password, email, nickname } = req.body;
  console.log('[회원가입]', { id, password, email, nickname });
  res.send('회원가입 완료!');
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
