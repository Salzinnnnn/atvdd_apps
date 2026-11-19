# Salzintech — Portal de Cursos do Salzin

Aplicação React criada com Vite para a atividade prática avaliativa da disciplina
Aplicativos Web (IFTO). Possui três páginas — **Início**, **Cadastro** e
**Usuários** — com navegação sem recarregamento via React Router, um formulário
com validações no navegador e uma listagem que consome a API pública do
JSONPlaceholder.

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

## Página Usuários (consumo de API)

A página `src/pages/Usuarios.jsx` busca os dados de
`https://jsonplaceholder.typicode.com/users` dentro de um `useEffect`, usando um
`AbortController`: uma requisição em andamento é cancelada na limpeza do efeito
(`return () => controller.abort()`), evitando atualizações de estado em
componente desmontado. O componente trata os três estados — carregamento
("Carregando usuários..."), erro (`role="alert"` com "Não foi possível carregar
os usuários.") e lista vazia ("Nenhum usuário.") — e renderiza os dados com
`map()` em cards estilizados por `Usuarios.css` (grid responsivo). A rota
`/usuarios` está registrada em `App.jsx`, com link no menu.

## Evidências dos testes

Capturas de tela em `screenshots/`:
1. Página Início
2. Página Cadastro
3. Erros de validação (campos vazios / nome e e-mail inválidos)
4. Mensagem de cadastro simulado com sucesso
5. Página Usuários com dados da API
6. Erro simulado da API
7. Lista vazia simulada

