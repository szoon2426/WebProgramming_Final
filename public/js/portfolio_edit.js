document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signUpBtn = document.getElementById("signUpBtn");
  const contestBtn = document.getElementById("contestBtn");
  const studyBtn = document.getElementById("studyBtn");
  const mainLogo = document.getElementById("mainLogo");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }

  if (signUpBtn) {
    signUpBtn.addEventListener("click", () => {
      window.location.href = "/signUp";
    });
  }

  if (contestBtn) {
    contestBtn.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }

  if (studyBtn) {
    studyBtn.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }

  if (mainLogo) {
    mainLogo.addEventListener("click", () => {
      window.location.href = "/";
    });
  }

  document.querySelectorAll('.project-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wrapper = e.target.closest('.project-added-card');
      if (wrapper) {
        wrapper.remove();
      }
    });
  });
});

const fileInput = document.getElementById("profileInput");
const preview = document.getElementById("profilePreview");
const placeholder = document.getElementById("photoPlaceholder");

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      placeholder.style.display = "none";
    };

    reader.readAsDataURL(file);
  }
});

let skillCount = 0;

function addSkill() {
  const container = document.getElementById('skillList');

  const skill = document.createElement('div');
  skill.className = 'skill-button';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'skill-input';
  input.placeholder = '스킬 입력';

  const color = document.createElement('input');
  color.type = 'color';
  color.className = 'color-picker';
  color.addEventListener('input', (e) => {
    skill.style.backgroundColor = e.target.value;
  });

  skill.appendChild(input);
  skill.appendChild(color);
  container.appendChild(skill);

  // ✅ Hover 동작: 1초 후 show-delete 클래스 추가
  let hoverTimer;
  skill.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => {
      skill.classList.add('show-delete');

      // 클릭 시 삭제
      skill.onclick = () => skill.remove();
    }, 1000);
  });

  skill.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    skill.classList.remove('show-delete');
    skill.onclick = null;
  });
}

function addProjectCard() {
  const container = document.getElementById('project-card-container');

  const wrapper = document.createElement('div');
  wrapper.classList.add('project-added-card'); // show는 나중에 추가
  wrapper.innerHTML = `
    <div class="project-label">
      <input type="text" class="project-title-input" placeholder="이름을 입력하세요" />
      <p class="project-delete">X</p>
    </div>
    <hr class="project-divider" />
    <div class="project-detail">
      <textarea class="project-description" placeholder="프로젝트 내용을 입력하세요"></textarea>
    </div>
  `;

  container.appendChild(wrapper);

  const deleteBtn = wrapper.querySelector('.project-delete');
  deleteBtn.addEventListener('click', () => {
    wrapper.remove();
  });

  // 다음 프레임에 트랜지션 효과 적용
  requestAnimationFrame(() => {
    wrapper.classList.add('show');
  });
}

// ✅ “수정 완료” 버튼 눌렀을 때 이미지와 데이터를 같이 전송
const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", () => {
  const id = document.querySelector(".name-input").value; // 예시: 이름을 id로 쓴다면 (실제 id 입력창 있으면 그걸로!)
  const name = document.querySelector(".name-input").value;
  const about = document.querySelector(".about-textarea").value;

  const skills = [];
  document.querySelectorAll(".skill-button").forEach(skill => {
    const skillName = skill.querySelector(".skill-input").value;
    const color = skill.querySelector(".color-picker").value;
    skills.push({ name: skillName, color });
  });

  const projects = [];
  document.querySelectorAll(".project-added-card").forEach(card => {
    const title = card.querySelector(".project-title-input").value;
    const description = card.querySelector(".project-description").value;
    projects.push({ title, description });
  });

  const formData = new FormData();
  formData.append('id', 'tjdwns2yeyo'); // 로그인된 id에 따라 바뀌도록 수정해야함함!
  formData.append('name', name);
  formData.append('about', about);
  formData.append('skills', JSON.stringify(skills));
  formData.append('projects', JSON.stringify(projects));

  const profileFile = fileInput.files[0];
  if (profileFile) {
    formData.append('profileImage', profileFile);
  }

  fetch('/save-portfolio', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('저장 완료!');
      const userId = 'tjdwns2yeyo'; // 실제 로그인된 사용자 id로 바꿔야 함!
      window.location.href = `/portfolio?id=${userId}`;
    } else {
      alert('저장 실패!');
    }
  })
  .catch(err => {
    console.error(err);
    alert('저장 중 오류 발생!');
  });
});
