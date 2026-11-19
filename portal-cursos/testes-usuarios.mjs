import { firefox } from "playwright";

const BASE = "http://localhost:5173";
const resultados = [];
const ok = (nome, cond, detalhe) => {
  resultados.push({ nome, cond });
  console.log(`${cond ? "PASS" : "FAIL"} — ${nome}: ${detalhe}`);
};

const browser = await firefox.launch();

// ---------- Teste 1: carregamento real da API ----------
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
await page.goto(BASE + "/");
await page.click("nav >> text=Usuários");

const urlOk = page.url().endsWith("/usuarios");
const viuCarregando = await page
  .waitForSelector("text=Carregando usuários...", { timeout: 3000 })
  .then(() => true)
  .catch(() => false);

await page.waitForSelector(".card-usuario", { timeout: 15000 });
const cards = await page.$$(".card-usuario");
const primeiroNome = await page.textContent(".card-usuario h2");
const primeiroEmail = await page.textContent(".card-usuario p");
const titulo = await page.textContent("h1");
await page.screenshot({ path: "screenshots/06-usuarios.png", fullPage: true });

ok("1. Página carrega via menu",
  urlOk && titulo.includes("Usuários cadastrados") && cards.length === 10,
  `rota /usuarios, ${cards.length} cards`);
ok("2. Estado de carregamento", viuCarregando,
  'texto "Carregando usuários..." exibido');
ok("3. Nomes e e-mails exibidos",
  !!primeiroNome?.trim() && primeiroEmail?.includes("@"),
  `"${primeiroNome}" / "${primeiroEmail}"`);

// ---------- Teste 2: falha na API (interceptada, URL intacta) ----------
const pageErro = await browser.newPage({ viewport: { width: 1100, height: 800 } });
await pageErro.route("https://jsonplaceholder.typicode.com/users", (route) =>
  route.fulfill({ status: 500, body: "erro simulado" })
);
await pageErro.goto(BASE + "/usuarios");
const alerta = await pageErro
  .waitForSelector('[role="alert"]', { timeout: 10000 })
  .then((el) => el.textContent())
  .catch(() => "");
await pageErro.screenshot({ path: "screenshots/07-erro-api.png", fullPage: true });
ok("4. Erro da API tratado", alerta.includes("Não foi possível carregar os usuários"),
  `"${alerta}"`);

// ---------- Teste 3: lista vazia ----------
const pageVazia = await browser.newPage({ viewport: { width: 1100, height: 800 } });
await pageVazia.route("https://jsonplaceholder.typicode.com/users", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: "[]"
  })
);
await pageVazia.goto(BASE + "/usuarios");
const vazio = await pageVazia
  .waitForSelector("text=Nenhum usuário.", { timeout: 10000 })
  .then(() => true)
  .catch(() => false);
await pageVazia.screenshot({ path: "screenshots/08-lista-vazia.png", fullPage: true });
ok("5. Lista vazia", vazio, '"Nenhum usuário." exibido');

await browser.close();
const falhas = resultados.filter((r) => !r.cond);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} testes passaram`);
if (falhas.length) process.exit(1);
