import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [modo, setModo] = useState("cadastro"); // "cadastro" | "descadastro"
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMensagem("Insira um e-mail válido, morto-vivo.");
      return;
    }
    if (modo === "cadastro" && !nome.trim()) {
      setStatus("error");
      setMensagem("Preciso saber seu nome pra te assombrar corretamente.");
      return;
    }

    setStatus("loading");
    setMensagem("");

    try {
      const res = await fetch("/api/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, acao: modo }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMensagem(data.mensagem);
        setNome("");
        setEmail("");
      } else {
        setStatus("error");
        setMensagem(data.mensagem || "Algo deu errado nas profundezas.");
      }
    } catch {
      setStatus("error");
      setMensagem("Erro de conexão. Os zumbis derrubaram o servidor.");
    }
  };

  return (
    <>
      <Head>
        <title>Zumbi dos Jantares · Cardápio do RU</title>
        <meta name="description" content="Receba o cardápio do RU da UFCSPA todo dia útil às 9h." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0a0a0a;
          font-family: 'Nunito', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }
        .card {
          background: #141414;
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          max-width: 440px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(74,222,128,0.08);
        }
        .header {
          background: #0d0d0d;
          border-bottom: 2px solid #4ade80;
          padding: 32px 32px 24px;
          text-align: center;
        }
        .tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #4ade80;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .titulo {
          font-family: 'Creepster', cursive;
          font-size: 38px;
          color: #4ade80;
          line-height: 1;
          letter-spacing: 2px;
          text-shadow: 0 0 20px rgba(74,222,128,0.35);
          margin-bottom: 6px;
        }
        .subtitulo {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .logo {
          width: 100px;
          height: 100px;
          object-fit: contain;
          margin-bottom: 10px;
          filter: drop-shadow(0 0 12px rgba(74,222,128,0.3));
        }
        .body { padding: 28px 32px 32px; }
        .tabs {
          display: flex;
          background: #0d0d0d;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 24px;
          border: 1px solid #222;
        }
        .tab {
          flex: 1;
          padding: 9px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: rgba(255,255,255,0.35);
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .tab.ativo {
          background: #4ade80;
          color: #0d0d0d;
        }
        .label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .input {
          width: 100%;
          background: #0d0d0d;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 12px 16px;
          color: #e2e8f0;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: #4ade80; }
        .input::placeholder { color: rgba(255,255,255,0.2); }
        .btn {
          width: 100%;
          background: #4ade80;
          color: #0d0d0d;
          border: none;
          border-radius: 10px;
          padding: 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          margin-top: 4px;
        }
        .btn:hover { background: #22c55e; transform: translateY(-1px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-danger {
          background: #ef4444;
          color: #fff;
        }
        .btn-danger:hover { background: #dc2626; }
        .msg {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }
        .msg.success { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
        .msg.error { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
        .msg.loading { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); border: 1px solid #222; }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 11px;
          color: rgba(255,255,255,0.15);
        }
        .footer a { color: rgba(74,222,128,0.4); text-decoration: none; }
        .descadastro-info {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 16px;
          line-height: 1.6;
        }
      `}} />

      <div className="card">
        <div className="header">
          <div className="tag">UFCSPA · Restaurante Universitário</div>
          <img src="/zumbi-logo.png" alt="Zumbi dos Jantares" className="logo" />
          <div className="titulo">Zumbi dos Jantares</div>
          <div className="subtitulo">Receba o cardápio diriamente no seu e-mail</div>
        </div>

        <div className="body">
          <div className="tabs">
            <button
              className={`tab ${modo === "cadastro" ? "ativo" : ""}`}
              onClick={() => { setModo("cadastro"); setStatus(null); }}
            >
              🧟 Me assombrar
            </button>
            <button
              className={`tab ${modo === "descadastro" ? "ativo" : ""}`}
              onClick={() => { setModo("descadastro"); setStatus(null); }}
            >
              😞 Me libertar
            </button>
          </div>

          {modo === "cadastro" ? (
            <>
              <div className="label">Seu nome</div>
              <input
                className="input"
                type="text"
                placeholder="Qual o seu nome?"
                value={nome}
                onChange={e => setNome(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <div className="label">Seu e-mail</div>
              <input
                className="input"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button
                className="btn"
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Invocando..." : "🧟 Quero ser assombrado(a)!"}
              </button>
            </>
          ) : (
            <>
              <p className="descadastro-info">
                Insira seu e-mail abaixo para se descadastrar. Você não receberá mais o cardápio do RU. Os zumbis vão sentir sua falta. 🥀
              </p>
              <div className="label">Seu e-mail</div>
              <input
                className="input"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button
                className="btn btn-danger"
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Processando..." : "😞 Quero me libertar"}
              </button>
            </>
          )}

          {status && status !== "loading" && (
            <div className={`msg ${status}`}>{mensagem}</div>
          )}
          {status === "loading" && (
            <div className="msg loading">⏳ Consultando as profundezas...</div>
          )}
        </div>
      </div>

      <div className="footer" style={{position:"fixed",bottom:"16px",left:0,right:0,textAlign:"center"}}>
        Design and powered by Felipe Borges·{" "}
        <a href="https://github.com/felipebborges2" target="_blank" rel="noreferrer">
          github.com/felipebborges2
        </a>
      </div>
    </>
  );
}
