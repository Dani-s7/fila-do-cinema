let fila = [];
let assistidos = [];
let contadorAleatorio = 1;

const chaveAPI = "bb9bac1b"; // Sua chave OMDb
const generos = ["action", "comedy", "horror", "drama", "romance"];
const generoEmoji = {
  action: "🔥",
  comedy: "😂",
  horror: "👻",
  drama: "🎭",
  romance: "❤️"
};

// Termos confiáveis por gênero
const termosDeBusca = {
  action: "Avengers",
  comedy: "Friends",
  horror: "It",
  drama: "Titanic",
  romance: "Love"
};

function adicionarPessoa() {
  const nome = document.getElementById("nomePessoa").value.trim();
  if (!nome) {
    alert("Digite um nome válido!");
    return;
  }
  fila.push(nome);
  document.getElementById("nomePessoa").value = "";
  atualizarFila();
}

function gerarPessoa() {
  const nomeGerado = `Pessoa ${contadorAleatorio++}`;
  fila.push(nomeGerado);
  atualizarFila();
}

function atualizarFila() {
  const lista = document.getElementById("fila");
  lista.innerHTML = fila.map(p => `<li>${p}</li>`).join("");
}

async function entrarSessao() {
  if (fila.length === 0) {
    alert("Não há ninguém na fila.");
    return;
  }

  const pessoa = fila.shift();
  atualizarFila();

  const genero = generos[Math.floor(Math.random() * generos.length)];
  const termo = termosDeBusca[genero];
  exibirCarregando(pessoa, genero);

  try {
    const resposta = await fetch(`https://www.omdbapi.com/?apikey=${chaveAPI}&s=${termo}`);
    const dados = await resposta.json();

    if (dados.Response === "True") {
      const filme = dados.Search[Math.floor(Math.random() * dados.Search.length)];
      mostrarFilme(pessoa, filme, genero);
    } else {
      throw new Error("Filme não encontrado");
    }
  } catch (erro) {
    alert("Erro ao buscar filme. Tente novamente.");
    console.error(erro);
  }
}

function mostrarFilme(pessoa, filme, genero) {
  const div = document.getElementById("infoFilme");
  const horario = new Date().toLocaleTimeString();

  div.innerHTML = `
    <h2>🎬 Sessão de Cinema</h2>
    <p><strong>👤 Pessoa:</strong> ${pessoa}</p>
    <p><strong>🎞️ Gênero da sessão:</strong> ${generoEmoji[genero]} <em>${genero}</em></p>
    <p><strong>🎥 Filme:</strong> ${filme.Title} (${filme.Year})</p>
    <img src="${filme.Poster}" alt="Pôster do filme">
    <p><small>🕒 Horário: ${horario}</small></p>
  `;

  assistidos.push(`${pessoa} assistiu "${filme.Title}" às ${horario} (${genero})`);
  atualizarAssistidos();
  tocarSomCinema();
}

function atualizarAssistidos() {
  const lista = document.getElementById("assistidos");
  lista.innerHTML = assistidos.map(a => `<li>${a}</li>`).join("");
}

function exibirCarregando(pessoa, genero) {
  const div = document.getElementById("infoFilme");
  div.innerHTML = `
    <p>🎟️ ${pessoa} está entrando na sessão de ${generoEmoji[genero]} <em>${genero}</em>...</p>
    <p>Aguarde, buscando filme aleatório...</p>
  `;
}

function tocarSomCinema() {
  const audio = new Audio("https://www.soundjay.com/button/sounds/button-16.mp3");
  audio.play();
}
