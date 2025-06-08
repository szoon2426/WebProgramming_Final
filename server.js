const express = require('express');
const path = require('path');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// ✅ MongoDB Atlas 연결 URI (자신의 클러스터 URI로 바꿔주세요!)
const MONGO_URI = 'mongodb+srv://20213013:9W5Oj3N5ETvV4ebl@cluster0.utib0zk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true';
const client = new MongoClient(MONGO_URI);
let db;

// EJS 템플릿 엔진
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 폼 데이터 파싱
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 업로드 이미지 제공

// 메인 페이지
app.get('/', (req, res) => {
  res.render('portfolio_edit');
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

// Multer 설정 (이미지 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ✅ 포트폴리오 저장 (중복 id면 update)
app.post('/save-portfolio', upload.single('profileImage'), async (req, res) => {
  try {
    const { id, name, about, skills, projects } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    if (!id) {
      return res.status(400).json({ success: false, message: 'id가 필요합니다.' });
    }

    const skillsArray = JSON.parse(skills);
    const projectsArray = JSON.parse(projects);

    const result = await db.collection('user_portfolio').updateOne(
      { id }, // id가 이미 있으면 update
      {
        $set: {
          name,
          about,
          skills: skillsArray,
          projects: projectsArray,
          ...(profileImage && { profileImage }),
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('[포트폴리오 저장 결과]', result);
    res.json({ success: true, message: '저장 완료!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

app.get('/portfolio', async (req, res) => {
  try {
    const userId = req.query.id; // ✅ ?id=... 파라미터로 전달된 id
    if (!userId) {
      return res.status(400).send('id가 필요합니다.');
    }

    // MongoDB에서 id로 검색
    const portfolio = await db.collection('user_portfolio').findOne({ id: userId });

    if (!portfolio) {
      return res.render('portfolio_edit');
    }

    // ✅ 필요한 정보만 추출
    const { name, about, profileImage, projects, skills } = portfolio;

    // ✅ portfolio.ejs에 넘겨주기
    res.render('portfolio', { name, about, profileImage, projects, skills });
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류');
  }
});

app.get('/editPortfolio', async(req, res)=>{
  try{
    const userId = req.query.id;
    // MongoDB에서 id로 검색
    const portfolio = await db.collection('user_portfolio').findOne({ id: userId });

    if (!portfolio) {
      return res.status(404).send('포트폴리오를 찾을 수 없습니다.');
    }

    // ✅ 필요한 정보만 추출
    const { name, about, profileImage, projects, skills } = portfolio;
    res.render('portfolio_edit',{name, about, profileImage, projects, skills});
  }catch(err){
    console.log(err);
    res.status(500).send('서버 오류');
  }
})

async function serverRun() {
  try {
    await client.connect();
    db = client.db('user_db'); // ✅ user_db로 연결
    console.log('✅ MongoDB Atlas 연결 성공!');

    app.listen(PORT,()=>{
      console.log("✅ 서버 실행됨: http://localhost:${PORT}");
    });
  } catch (err) {
    console.error('❌ MongoDB Atlas 연결 실패', err);
  }
}
serverRun();