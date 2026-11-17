import { firefox } from "playwright";
import { mkdirSync } from "fs";

const BASE = "http://localhost:5173";
mkdirSync("screenshots", { recursive: true });

const results = [];
function registrar(teste, ok, detalhe) {
  results.push({ teste, ok, detalhe });
  console.log(`${ok ? "PASS" : "FAIL"} — ${teste}: ${detalhe}`);
}

const browser = await firefox.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });

// ---------- Teste 1: Navegação ----------
await page.goto(BASE + "/");
await page.screenshot({ path: "screenshots/01-inicio.png" });
await page.click("nav >> text=Cadastro");
const urlCadastro = page.url().includes("/cadastro");
const h1Cadastro = await page.textContent("h1");
await page.click("nav >> text=Início");
const urlInicio = page.url() === BASE + "/";
const h1Inicio = await page.textContent("h1");
const navOk = urlCadastro && urlInicio &&
  h1Cadastro.includes("Cadastro") && h1Inicio.includes("Bem-vindo");
registrar("1. Navegação", navOk,
  `URLs: ${urlInicio ? "/" : "?"} e ${urlCadastro ? "/cadastro" : "?"}, títulos corretos`);

// ---------- Teste 2: Campos vazios ----------
await page.click("nav >> text=Cadastro");
await page.click("button[type=submit]");
const errosVazios = await page.$$eval("small.erro", els => els.map(e => e.textContent));
const esperaVazios = errosVazios.length === 5;
await page.screenshot({ path: "screenshots/02-campos-vazios.png", fullPage: true });
registrar("2. Campos vazios", esperaVazios,
  `${errosVazios.length} mensagens de erro exibidas`);

// ---------- Teste 3: Nome inválido ("Al") ----------
await page.fill("#nome", "Al");
await page.click("button[type=submit]");
const erroNome = await page.textContent("#erro-nome").catch(() => "");
registrar("3. Nome inválido", erroNome.includes("3 caracteres"), `"${erroNome}"`);

// ---------- Teste 4: E-mail inválido ("teste@") ----------
await page.fill("#nome", "Ana Silva");
await page.fill("#email", "teste@");
await page.click("button[type=submit]");
const erroEmail = await page.textContent("#erro-email").catch(() => "");
registrar("4. E-mail inválido", erroEmail.includes("e-mail válido"), `"${erroEmail}"`);
await page.screenshot({ path: "screenshots/03-erros-validacao.png", fullPage: true });

// ---------- Teste 5: Senha curta ("123") ----------
await page.fill("#email", "ana@teste.com");
await page.fill("#senha", "123");
await page.click("button[type=submit]");
const erroSenha = await page.textContent("#erro-senha").catch(() => "");
registrar("5. Senha curta", erroSenha.includes("6 caracteres"), `"${erroSenha}"`);

// ---------- Teste 6: Senhas diferentes ----------
await page.fill("#senha", "123456");
await page.fill("#confirmar", "654321");
await page.click("button[type=submit]");
const erroConfirmar = await page.textContent("#erro-confirmar").catch(() => "");
registrar("6. Senhas diferentes", erroConfirmar.includes("iguais"), `"${erroConfirmar}"`);
await page.screenshot({ path: "screenshots/03b-erros-validacao.png", fullPage: true });

// ---------- Teste 7: Cadastro válido ----------
await page.fill("#nome", "Ana Silva");
await page.fill("#email", "ana@teste.com");
await page.fill("#senha", "123456");
await page.fill("#confirmar", "123456");
await page.selectOption("#curso", "Desenvolvimento Web");
await page.click("button[type=submit]");
const sucesso = await page.textContent(".sucesso").catch(() => "");
const campoNomeVazio = await page.inputValue("#nome") === "";
await page.screenshot({ path: "screenshots/04-sucesso.png", fullPage: true });
registrar("7. Cadastro válido",
  sucesso.includes("Parabéns") && campoNomeVazio,
  `Mensagem: "${sucesso.slice(0, 80)}..." e campos limpos: ${campoNomeVazio}`);

// ---------- Teste 8: Rota inexistente ----------
await page.goto(BASE + "/qualquer-coisa");
const rota = await page.textContent("main");
registrar("8. Rota inexistente", rota.includes("Página não encontrada"),
  `"${rota.trim()}"`);
await page.screenshot({ path: "screenshots/05-rota-inexistente.png" });

await browser.close();

const falhas = results.filter(r => !r.ok);
console.log(`\n${results.length - falhas.length}/${results.length} testes passaram`);
if (falhas.length) process.exit(1);
