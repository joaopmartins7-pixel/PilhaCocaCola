
const buscar = (id) => document.getElementById(id);

const etapas = [
  {
    titulo: "Etapa 1 — Encha os copos",
    texto: "Coloque a bebida para os dois copos. Encha os dois para continuar.",
    dica: "Você também pode clicar nos copos."
  },
  {
    titulo: "Etapa 2 — Coloque os metais",
    texto: "Coloque uma placa de cobre e uma de zinco em cada copo.",
    dica: "As duas placas não podem se encostar!"
  },
  {
    titulo: "Etapa 3 — Conecte os fios",
    texto: "Clique para conectar os fios às placas e ao LED.",
    dica: "Observe os fios formando um caminho entre os componentes."
  },
  {
    titulo: "Etapa 4 — Teste o LED",
    texto: "Clique no botão para testar a luz.",
    dica: "Na experiência real, o LED pode acender fracamente ou não acender se a energia for insuficiente."
  }
];

let etapaAtual = 0;
let coposEnchidos = [0, 0];
let metaisColocados = false;
let fiosConectados = false;

function atualizarEtapa() {
  document.querySelectorAll(".botao-etapa").forEach((botao, indice) => {
    botao.classList.toggle("ativo", indice === etapaAtual);
  });

  buscar("tituloEtapa").textContent = etapas[etapaAtual].titulo;
  buscar("textoEtapa").textContent = etapas[etapaAtual].texto;
  buscar("dicaEtapa").textContent = etapas[etapaAtual].dica;

  buscar("progresso").style.width = `${(etapaAtual + 1) * 25}%`;

  ["jogoEncher", "jogoMetais", "jogoFios", "jogoLed"].forEach(
    (id, indice) => {
      buscar(id).classList.toggle("oculto", indice !== etapaAtual);
    }
  );

  if (etapaAtual === 0) {
    buscar("proximaEtapa").disabled =
      !coposEnchidos.every(valor => valor >= 100);
  } else if (etapaAtual === 1) {
    buscar("proximaEtapa").disabled = !metaisColocados;
  } else if (etapaAtual === 2) {
    buscar("proximaEtapa").disabled = !fiosConectados;
  } else {
    buscar("proximaEtapa").disabled = true;
  }

  buscar("proximaEtapa").textContent =
    etapaAtual === 3 ? "Última etapa" : "Próxima etapa →";
}

// Encher os copos
function encherCopo(indice) {
  if (etapaAtual !== 0 || coposEnchidos[indice] >= 100) return;

  coposEnchidos[indice] = Math.min(
    100,
    coposEnchidos[indice] + 25
  );

  buscar(`liquido${indice}`).style.height =
    `${coposEnchidos[indice]}%`;

  buscar("estadoEnchimento").textContent =
    `Copo 1: ${coposEnchidos[0]}% · Copo 2: ${coposEnchidos[1]}%`;

  atualizarEtapa();
}

// Arrastar a garrafa
const garrafa = buscar("garrafa");

garrafa.addEventListener("dragstart", evento => {
  evento.dataTransfer.setData("text/plain", "coca-cola");
});

document.querySelectorAll("[data-copo]").forEach(copo => {
  copo.addEventListener("dragover", evento => {
    evento.preventDefault();
    copo.classList.add("zonaDeSoltura");
  });

  copo.addEventListener("dragleave", () => {
    copo.classList.remove("zonaDeSoltura");
  });

  copo.addEventListener("drop", evento => {
    evento.preventDefault();
    copo.classList.remove("zonaDeSoltura");
    encherCopo(Number(copo.dataset.copo));
  });

  copo.addEventListener("click", () => {
    encherCopo(Number(copo.dataset.copo));
  });
});

// Arrastar com mouse ou toque
let arrastandoGarrafa = false;

garrafa.addEventListener("pointerdown", evento => {
  arrastandoGarrafa = true;
  garrafa.setPointerCapture(evento.pointerId);
});

garrafa.addEventListener("pointerup", evento => {
  if (!arrastandoGarrafa) return;

  arrastandoGarrafa = false;

  const destino = document
    .elementFromPoint(evento.clientX, evento.clientY)
    ?.closest("[data-copo]");

  if (destino) {
    encherCopo(Number(destino.dataset.copo));
  }
});

// Avançar para a próxima etapa
buscar("proximaEtapa").addEventListener("click", () => {
  if (
    etapaAtual < 3 &&
    !buscar("proximaEtapa").disabled
  ) {
    etapaAtual++;
    atualizarEtapa();
  }
});

// Navegar pelas etapas
document.querySelectorAll(".botao-etapa").forEach(botao => {
  botao.addEventListener("click", () => {
    const destino = Number(botao.dataset.etapa);

    const etapasLiberadas = [
      true,
      coposEnchidos.every(valor => valor >= 100),
      metaisColocados,
      fiosConectados
    ];

    if (
      destino <= etapaAtual ||
      etapasLiberadas[destino]
    ) {
      etapaAtual = destino;
      atualizarEtapa();
    }
  });
});

// Colocar as placas retangulares
buscar("colocarPlacas").addEventListener("click", () => {
  if (etapaAtual !== 1 || metaisColocados) return;

  metaisColocados = true;

  ["cobre0", "zinco0", "cobre1", "zinco1"].forEach(id => {
    buscar(id).classList.add("inserida");
  });

  buscar("estadoMetais").textContent =
    "Muito bem! As placas retangulares estão nos copos!";

  buscar("colocarPlacas").textContent =
    "Placas colocadas ✓";

  buscar("colocarPlacas").disabled = true;

  atualizarEtapa();
});

// Conectar os fios
buscar("conectarFios").addEventListener("click", () => {
  if (etapaAtual !== 2 || fiosConectados) return;

  fiosConectados = true;

  ["fioA", "fioB", "fioC"].forEach(id => {
    buscar(id).classList.add("conectado");
  });

  buscar("estadoFios").textContent =
    "Os fios estão conectados às placas e ao LED!";

  buscar("conectarFios").textContent =
    "Fios conectados ✓";

  buscar("conectarFios").disabled = true;

  atualizarEtapa();
});

// ETAPA 4: acender visualmente a lâmpada
buscar("testarLed").addEventListener("click", () => {
  buscar("lampadaFinal").classList.add("acessa");

  buscar("estadoLed").textContent =
    "Teste concluído! O LED acendeu! 💡🎉🥳";

  buscar("testarLed").disabled = true;
});

// Reiniciar a experiência
buscar("reiniciar").addEventListener("click", () => {
  etapaAtual = 0;
  coposEnchidos = [0, 0];
  metaisColocados = false;
  fiosConectados = false;

  buscar("liquido0").style.height = "0";
  buscar("liquido1").style.height = "0";

  buscar("estadoEnchimento").textContent =
    "Copo 1: vazio · Copo 2: vazio";

  buscar("estadoMetais").textContent =
    "As placas ainda estão fora dos copos.";

  buscar("estadoFios").textContent =
    "Os fios ainda não estão conectados.";

  ["cobre0", "zinco0", "cobre1", "zinco1"].forEach(id => {
    buscar(id).classList.remove("inserida");
  });

  ["fioA", "fioB", "fioC"].forEach(id => {
    buscar(id).classList.remove("conectado");
  });

  buscar("colocarPlacas").textContent =
    "Colocar as placas nos copos";

  buscar("colocarPlacas").disabled = false;

  buscar("conectarFios").textContent =
    "Conectar os fios";

  buscar("conectarFios").disabled = false;

  // ETAPA 4: apagar o brilho da lâmpada
  buscar("lampadaFinal").classList.remove("acessa");

  buscar("testarLed").disabled = false;

  buscar("estadoLed").textContent =
    "Circuito montado! Vamos testar.";

  atualizarEtapa();
});

// Questionário
document.querySelectorAll(".questionario button").forEach(botao => {
  botao.addEventListener("click", () => {
    const respostaCerta =
      botao.dataset.resposta === "certa";

    buscar("resultadoQuestionario").textContent =
      respostaCerta
        ? "Isso mesmo! Os fios conduzem a corrente elétrica. 🎉"
        : "Tente de novo! Pense no caminho que a eletricidade percorre.";

    buscar("resultadoQuestionario").style.color =
      respostaCerta ? "#20835f" : "#b4232c";
  });
});

atualizarEtapa();
