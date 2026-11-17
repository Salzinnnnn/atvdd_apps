# EduTech — Portal de Cursos

Aplicação React criada com Vite para a atividade prática avaliativa da disciplina
Aplicativos Web (IFTO). Possui duas páginas — **Início** e **Cadastro** — com
navegação sem recarregamento via React Router e um formulário com validações
no navegador (sem API nem banco de dados).

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço indicado no terminal (geralmente `http://localhost:5173`).

## Como a navegação e a validação foram implementadas

A navegação usa o React Router: o `BrowserRouter` (em `main.jsx`) habilita o
roteamento, o componente `NavLink` cria os links do menu com destaque na rota
ativa, e `Routes`/`Route` definem qual página aparece em cada endereço — sem
recarregar o site. O formulário é controlado por `useState`: cada campo tem
`value` vinculado ao estado e `onChange` que atualiza os valores. Ao enviar,
`preventDefault()` evita o recarregamento, a função `validar()` checa as regras
(nome ≥ 3 caracteres, e-mail válido, senha ≥ 6, confirmação igual e curso
selecionado) e retorna um objeto de erros; o cadastro simulado só é confirmado
quando esse objeto está vazio (`Object.keys(novosErros).length === 0`), com
mensagens exibidas abaixo de cada campo e acessíveis por `aria-describedby`.

## Evidências dos testes

Capturas de tela em `screenshots/`:
1. Página Início
2. Página Cadastro
3. Erros de validação (campos vazios / nome e e-mail inválidos)
4. Mensagem de cadastro simulado com sucesso

> Obs.: esta validação é didática e acontece apenas no navegador. Os dados
> ficam somente no estado do React e desaparecem ao atualizar a página.
