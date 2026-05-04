import { google } from "googleapis";

const SHEET_ID = "1SFW5ui65WtXFVvvjwi8NFgvNwVK69fuPKRdv8PqNiHg";
const SHEET_NAME = "Página1";

async function getSheetClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

const TELEGRAM_CHANNEL_LINK = process.env.TELEGRAM_CHANNEL_LINK || "";

async function getInscritos(sheets) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:E`,
  });
  return res.data.values || [];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido." });
  }

  const { nome, email, acao, telegram } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ mensagem: "E-mail inválido." });
  }

  try {
    const sheets = await getSheetClient();
    const rows = await getInscritos(sheets);

    // Ignora o cabeçalho (linha 0)
    const dados = rows.slice(1);

    // Procura email existente (case-insensitive)
    const emailLower = email.toLowerCase().trim();
    const idxExistente = dados.findIndex(
      (row) => row[1]?.toLowerCase().trim() === emailLower
    );

    if (acao === "cadastro") {
      if (idxExistente !== -1) {
        const jaAtivo = dados[idxExistente][3] === "TRUE";
        if (jaAtivo) {
          return res.status(400).json({
            mensagem: "Este e-mail já está assombrado! Você já recebe o cardápio. 🧟",
          });
        } else {
          // Reativa o cadastro
          const rowNum = idxExistente + 2; // +1 header, +1 base-1
          await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!D${rowNum}:E${rowNum}`,
            valueInputOption: "RAW",
            requestBody: { values: [["TRUE", telegram ? "TRUE" : "FALSE"]] },
          });
          return res.status(200).json({
            mensagem: `Bem-vindo(a) de volta, ${dados[idxExistente][0]}! O Zumbi voltará a te assombrar. 🧟`,
            telegramLink: telegram && TELEGRAM_CHANNEL_LINK ? TELEGRAM_CHANNEL_LINK : null,
          });
        }
      }

      // Novo cadastro
      const dataHoje = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[nome.trim(), emailLower, dataHoje, "TRUE", telegram ? "TRUE" : "FALSE"]],
        },
      });

      return res.status(200).json({
        mensagem: `Pronto, ${nome.trim()}! Você será assombrado(a) todo dia útil às 9h. 🧟‍♂️`,
        telegramLink: telegram && TELEGRAM_CHANNEL_LINK ? TELEGRAM_CHANNEL_LINK : null,
      });
    }

    if (acao === "descadastro") {
      if (idxExistente === -1 || dados[idxExistente][3] !== "TRUE") {
        return res.status(404).json({
          mensagem: "Este e-mail não está na lista dos assombrados. 👻",
        });
      }

      // Desativa (soft delete — mantém o registro)
      const rowNum = idxExistente + 2;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!D${rowNum}`,
        valueInputOption: "RAW",
        requestBody: { values: [["FALSE"]] },
      });

      return res.status(200).json({
        mensagem: "Você foi libertado(a). Os zumbis vão sentir sua falta. 🥀",
      });
    }

    return res.status(400).json({ mensagem: "Ação inválida." });
  } catch (err) {
    console.error("Erro Sheets:", err);
    return res.status(500).json({
      mensagem: "Erro nas profundezas do servidor. Tente novamente.",
    });
  }
}
