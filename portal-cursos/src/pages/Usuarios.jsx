import { useEffect, useState } from "react";
import "./Usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function buscarUsuarios() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );
        if (!resposta.ok) throw new Error("Falha na API");
        const dados = await resposta.json();
        setUsuarios(dados);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro("Não foi possível carregar os usuários.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscarUsuarios();
    return () => controller.abort();
  }, []);

  if (carregando) return <p>Carregando usuários...</p>;
  if (erro) return <p role="alert">{erro}</p>;

  return (
    <section>
      <h1>Usuários cadastrados</h1>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário.</p>
      ) : (
        <div className="lista-usuarios">
          {usuarios.map((u) => (
            <article className="card-usuario" key={u.id}>
              <h2>{u.name}</h2>
              <p>{u.email}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
