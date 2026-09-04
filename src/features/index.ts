/**
 * Modul fitur (PRD §19.1) — lapisan service yang memisahkan domain logika
 * dari action/server-layer. Kawasan kompleks seperti publishing dipindahkan
 * ke sini agar murni, mudah diuji, dan tidak mengikat ke I/O.
 *
 * Modul yang tetap hidup di src/lib (auth, db, mail, storage, etc.) adalah
 * infrastruktur lintas-fitur dan sengaja dipertahankan di sana.
 */
export * from "./publishing/validate";
export * from "./notifications/meta";
