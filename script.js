// ====== Navegação mobile
const menuBtn = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
if (menuBtn) {
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
}

// ====== Ano dinâmico
document.getElementById('year').textContent = new Date().getFullYear();

// ====== Downloads por SO
const DOWNLOADS = {
  windows: [
    { name: 'Token SafeNet', file: '/downloads/windows/safenet.exe' },
    { name: 'Token GD', file: '/downloads/windows/gdtoken.exe' },
    { name: 'Driver de leitora', file: '/downloads/windows/leitora.exe' },
    { name: 'Driver certificado digital', file: '/downloads/windows/driver-certificado.exe' },
    { name: 'Java', file: '/downloads/windows/java.exe' },
    { name: 'WebSigner', file: '/downloads/windows/websigner.msi' },
    { name: 'Web PKI', file: '/downloads/windows/webpki.msi' },
    { name: 'PJe Office', file: '/downloads/windows/pjeoffice.msi' },
    { name: 'Shodo', file: '/downloads/windows/shodo.msi' },
  ],
  mac: [
    { name: 'Token SafeNet', file: '/downloads/macos/safenet.pkg' },
    { name: 'Token GD', file: '/downloads/macos/gdtoken.pkg' },
    { name: 'Driver de leitora', file: '/downloads/macos/leitora.pkg' },
    { name: 'Driver certificado digital', file: '/downloads/macos/driver-certificado.pkg' },
    { name: 'Java', file: '/downloads/macos/java.dmg' },
    { name: 'WebSigner', file: '/downloads/macos/websigner.pkg' },
    { name: 'Web PKI', file: '/downloads/macos/webpki.pkg' },
    { name: 'PJe Office', file: '/downloads/macos/pjeoffice.pkg' },
    { name: 'Shodo', file: '/downloads/macos/shodo.pkg' },
  ]
};

const downloadList = document.getElementById('downloadList');
const osRadios = document.querySelectorAll('input[name="os"]');

function renderDownloads(os='windows'){
  downloadList.innerHTML = '';
  DOWNLOADS[os].forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p class="muted">Arquivo: ${item.file.split('/').pop()}</p>
      <a class="btn" href="${item.file}" download>Baixar</a>
    `;
    downloadList.appendChild(card);
  });
}
renderDownloads('windows');
osRadios.forEach(r => r.addEventListener('change', (e)=> renderDownloads(e.target.value)));


// ====== Lista de estados do Brasil (ordem alfabética)
const ESTADOS = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'
];

// ====== Mapeamento simplificado de sistemas por estado
// (adicione/edite links reais dos tribunais do seu estado)
const SISTEMAS_POR_ESTADO = {
  AC: ['PJe','eproc'],
  AL: ['PJe','e-SAJ'],
  AM: ['PJe'],
  AP: ['PJe'],
  BA: ['PJe','Projudi','eproc'],
  CE: ['PJe','eproc'],
  DF: ['PJe','eproc'],
  ES: ['PJe','e-SAJ'],
  GO: ['Projudi','PJe'],
  MA: ['PJe'],
  MG: ['PJe','Projudi'],
  MS: ['PJe','eproc'],
  MT: ['PJe','eproc'],
  PA: ['PJe'],
  PB: ['PJe'],
  PE: ['PJe'],
  PI: ['PJe'],
  PR: ['Projudi','PJe','eproc'],
  RJ: ['PJe'],
  RN: ['PJe'],
  RO: ['PJe'],
  RR: ['PJe'],
  RS: ['eproc','PJe'],
  SC: ['eproc','PJe'],
  SE: ['PJe'],
  SP: ['e-SAJ','PJe'],
  TO: ['PJe']
};

// Crie aqui os links oficiais que você quiser usar
const LINKS_SISTEMAS = {
  'PJe': '#',      // ex.: 'https://pje.jus.br/'
  'e-SAJ': '#',    // ex.: 'https://esaj.tjsp.jus.br/'
  'Projudi': '#',  // ex.: 'https://projudi.tjpr.jus.br/'
  'eproc': '#',    // ex.: 'https://eproc.jfrs.jus.br/'
  'GJud': '#',     // caso use
};

// Tribunais superiores
const SUPERIORES = [
  { rotulo:'STF', url:'#' },
  { rotulo:'STJ', url:'#' },
  { rotulo:'TST', url:'#' },
  { rotulo:'TSE', url:'#' }
];

// Preenche select de estados
const estadoSelect = document.getElementById('estadoSelect');
ESTADOS.forEach(sigla => {
  const opt = document.createElement('option');
  opt.value = sigla; opt.textContent = sigla;
  estadoSelect.appendChild(opt);
});
estadoSelect.value = 'PR';

// Renderiza sistemas do estado
const sistemasLista = document.getElementById('sistemasLista');
function renderSistemas(sigla){
  sistemasLista.innerHTML = '';
  (SISTEMAS_POR_ESTADO[sigla] || []).forEach(nome => {
    const link = document.createElement('a');
    link.className = 'link';
    link.href = LINKS_SISTEMAS[nome] || '#';
    link.target = '_blank'; link.rel = 'noopener';
    link.textContent = nome;
    sistemasLista.appendChild(link);
  });
}
estadoSelect.addEventListener('change', (e)=> renderSistemas(e.target.value));
renderSistemas(estadoSelect.value);

// Superiores
const supWrap = document.getElementById('superioresLinks');
SUPERIORES.forEach(s => {
  const a = document.createElement('a');
  a.className = 'link';
  a.href = s.url; a.target='_blank'; a.rel='noopener'; a.textContent = s.rotulo;
  supWrap.appendChild(a);
});

// ====== Formulário de contato (envio via backend Node)
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.textContent = 'Enviando...';

  const data = Object.fromEntries(new FormData(contactForm).entries());
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if(res.ok){
      formMsg.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
      contactForm.reset();
    } else {
      formMsg.textContent = out.error || 'Não foi possível enviar. Tente novamente.';
    }
  } catch(err){
    formMsg.textContent = 'Erro de conexão. Tente novamente.';
  }
});