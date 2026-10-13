// ===== ESTADO DEL JUEGO =====
let tablero = Array(9).fill("");
let juegoActivo = false;
let turnoJugador = true;
let timerInterval = null;
let segundos = 0;
let victorias = 0, derrotas = 0, empates = 0;
 
const combinaciones = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];
 
// ===== INICIAR / REINICIAR =====
function reiniciarJuego() {
  tablero = Array(9).fill("");
  juegoActivo = false;
  turnoJugador = true;
  detenerCronometro();
  segundos = 0;
  actualizarCronometro();
 
  document.querySelectorAll(".celda").forEach(c => {
    c.textContent = "";
    c.classList.remove("ocupada", "ganadora", "maquina");
  });
 
  document.getElementById("estadoJuego").textContent = "Ingresa tu nombre y presiona una casilla para comenzar";
  document.getElementById("mensajeGuardado").textContent = "";
}
 
// ===== CLICK EN CELDA =====
document.querySelectorAll(".celda").forEach(celda => {
  celda.addEventListener("click", () => {
    const nombre = document.getElementById("nombreJugador").value.trim();
    if (!nombre) {
      document.getElementById("mensajeNombre").textContent = "Debes ingresar tu nombre primero.";
      return;
    }
    document.getElementById("mensajeNombre").textContent = "";
 
    const idx = parseInt(celda.dataset.index);
    if (tablero[idx] !== "" || celda.classList.contains("ocupada")) return;
    if (!juegoActivo) {
      juegoActivo = true;
      iniciarCronometro();
    }
    if (!turnoJugador) return;
 
    hacerMovimiento(idx, "X");
 
    const res = verificarResultado();
    if (res) { terminarJuego(res); return; }
 
    turnoJugador = false;
    document.getElementById("estadoJuego").textContent = "Turno de la máquina...";
    setTimeout(() => {
      const mov = movimientoMaquina();
      hacerMovimiento(mov, "O");
      const res2 = verificarResultado();
      if (res2) { terminarJuego(res2); return; }
      turnoJugador = true;
      document.getElementById("estadoJuego").textContent = "Tu turno";
    }, 400);
  });
});
 
// ===== HACER MOVIMIENTO =====
function hacerMovimiento(idx, simbolo) {
  tablero[idx] = simbolo;
  const celda = document.querySelector(`[data-index="${idx}"]`);
  celda.textContent = simbolo;
  celda.classList.add("ocupada");
  if (simbolo === "O") celda.classList.add("maquina");
}
 
// ===== ALGORITMO MINIMAX =====
function movimientoMaquina() {
  let mejorPuntaje = -Infinity, mejorMov = -1;
  tablero.forEach((v, i) => {
    if (v === "") {
      tablero[i] = "O";
      const p = minimax(tablero, false);
      tablero[i] = "";
      if (p > mejorPuntaje) { mejorPuntaje = p; mejorMov = i; }
    }
  });
  return mejorMov;
}
 
function minimax(t, esMax) {
  const r = verificarTablero(t);
  if (r === "O") return 10;
  if (r === "X") return -10;
  if (t.every(c => c !== "")) return 0;
 
  if (esMax) {
    let mejor = -Infinity;
    t.forEach((v, i) => {
      if (v === "") { t[i] = "O"; mejor = Math.max(mejor, minimax(t, false)); t[i] = ""; }
    });
    return mejor;
  } else {
    let mejor = Infinity;
    t.forEach((v, i) => {
      if (v === "") { t[i] = "X"; mejor = Math.min(mejor, minimax(t, true)); t[i] = ""; }
    });
    return mejor;
  }
}
 
// ===== VERIFICAR TABLERO =====
function verificarTablero(t) {
  for (const [a,b,c] of combinaciones) {
    if (t[a] && t[a] === t[b] && t[a] === t[c]) return t[a];
  }
  return null;
}
 
function verificarResultado() {
  const ganador = verificarTablero(tablero);
  if (ganador) return ganador;
  if (tablero.every(c => c !== "")) return "empate";
  return null;
}
 
// ===== TERMINAR JUEGO =====
function terminarJuego(resultado) {
  juegoActivo = false;
  detenerCronometro();
 
  if (resultado !== "empate") {
    for (const [a,b,c] of combinaciones) {
      if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
        [a,b,c].forEach(i => document.querySelector(`[data-index="${i}"]`).classList.add("ganadora"));
      }
    }
  }
 
  let msg = "";
  if (resultado === "X") { msg = "🎉 ¡Ganaste!"; victorias++; }
  else if (resultado === "O") { msg = "💀 ¡La máquina ganó!"; derrotas++; }
  else { msg = "🤝 ¡Empate!"; empates++; }
 
  document.getElementById("estadoJuego").textContent = msg;
  actualizarMarcador();
  guardarResultado(resultado);
}
 
// ===== MARCADOR =====
function actualizarMarcador() {
  document.getElementById("victorias").textContent = victorias;
  document.getElementById("derrotas").textContent = derrotas;
  document.getElementById("empates").textContent = empates;
}
 
// ===== CRONÓMETRO =====
function iniciarCronometro() {
  timerInterval = setInterval(() => {
    segundos++;
    actualizarCronometro();
  }, 1000);
}
 
function detenerCronometro() {
  clearInterval(timerInterval);
  timerInterval = null;
}
 
function actualizarCronometro() {
  const m = String(Math.floor(segundos / 60)).padStart(2, "0");
  const s = String(segundos % 60).padStart(2, "0");
  document.getElementById("cronometro").textContent = `${m}:${s}`;
}
 
// ===== GUARDAR EN BD VÍA PHP =====
function guardarResultado(resultado) {
  const nombre = document.getElementById("nombreJugador").value.trim();
  const tiempo = segundos;
  let estado = resultado === "X" ? "victoria" : resultado === "O" ? "derrota" : "empate";
 
  const datos = new FormData();
  datos.append("nombre", nombre);
  datos.append("tiempo", tiempo);
  datos.append("resultado", estado);
 
  fetch("triqui.php", { method: "POST", body: datos })
    .then(r => r.text())
    .then(msg => {
      document.getElementById("mensajeGuardado").textContent = msg;
    })
    .catch(() => {
      document.getElementById("mensajeGuardado").textContent = "⚠ No se pudo guardar en la base de datos.";
    });
}