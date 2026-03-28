'use client';

import { useState, useEffect, useRef } from 'react';
import { QUESTIONS } from '@/lib/questions';
import type { ExamQuestion, ExamResult, Option } from '@/lib/types';

type Screen = 'home' | 'student-reg' | 'exam' | 'result' | 'teacher-login' | 'teacher-dash';

const TEACHER_CODE = 'BRAU';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scoreMsg(score: number): { msg: string; sub: string } {
  if (score >= 18) return { msg: '¡Excelente! 🎉', sub: 'Rendimiento sobresaliente.' };
  if (score >= 14) return { msg: '¡Muy bien! 👍',  sub: 'Sólido desempeño en el examen.' };
  if (score >= 10) return { msg: 'Aprobado ✓',      sub: 'Superaste el examen.' };
  return              { msg: 'No aprobado ✗',      sub: 'Te recomendamos repasar el material.' };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  // ── Registro alumno ──────────────────────────────────────────
  const [studentName,   setStudentName]   = useState('');
  const [studentCareer, setStudentCareer] = useState('');
  const [regError,      setRegError]      = useState(false);

  // ── Examen ───────────────────────────────────────────────────
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [selected,      setSelected]      = useState<Record<number, number>>({});
  const [examError,     setExamError]     = useState(false);
  const [submitting,    setSubmitting]    = useState(false);

  // ── Resultado ────────────────────────────────────────────────
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  // ── Temporizador ─────────────────────────────────────────────
  const EXAM_MINUTES = 20;
  const [timeLeft, setTimeLeft] = useState(EXAM_MINUTES * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // ── Docente ──────────────────────────────────────────────────
  const [teacherPass,    setTeacherPass]    = useState('');
  const [teacherError,   setTeacherError]   = useState(false);
  const [teacherResults, setTeacherResults] = useState<ExamResult[]>([]);
  const [loadingRes,     setLoadingRes]     = useState(false);

  // ── Navegación ───────────────────────────────────────────────
  function go(s: Screen) {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Temporizador: arrancar/detener según pantalla ──────────────
  useEffect(() => {
    if (screen === 'exam') {
      setTimeLeft(EXAM_MINUTES * 60);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            submitExamForced();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  function fmtTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Flujo alumno ─────────────────────────────────────────────
  function startExam() {
    if (!studentName.trim() || !studentCareer.trim()) { setRegError(true); return; }
    setRegError(false);
    setExamQuestions(
      shuffle(QUESTIONS).map(q => ({ ...q, shuffledOpts: shuffle(q.opts) as Option[] }))
    );
    setSelected({});
    setExamError(false);
    go('exam');
  }

  async function submitExamForced() {
    await submitExam(true);
  }

  async function submitExam(forced = false) {
    if (!forced && Object.keys(selected).length < examQuestions.length) {
      setExamError(true);
      return;
    }
    setExamError(false);
    setSubmitting(true);

    let correct = 0;
    const answers = examQuestions.map((q, qi) => {
      const selOpt = q.shuffledOpts[selected[qi]];
      if (selOpt.ok) correct++;
      return {
        question:      q.text,
        selected:      selOpt.t,
        isCorrect:     selOpt.ok,
        correctAnswer: q.opts.find(o => o.ok)!.t,
      };
    });

    const score = correct * 2;
    const now   = new Date();
    const payload = {
      name:      studentName.trim(),
      career:    studentCareer.trim(),
      score,
      correct,
      incorrect: examQuestions.length - correct,
      date: now.toLocaleDateString('es-AR'),
      time: now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      answers,
    };

    try {
      const res  = await fetch('/api/results', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const saved = await res.json() as ExamResult;
      setLastResult(saved);
    } catch {
      // Si el servidor no responde, igual mostramos el resultado local
      setLastResult({ id: crypto.randomUUID(), ...payload });
    }

    setSubmitting(false);
    go('result');
  }

  // ── Flujo docente ────────────────────────────────────────────
  async function teacherLogin() {
    if (teacherPass !== TEACHER_CODE) {
      setTeacherError(true);
      setTeacherPass('');
      return;
    }
    setTeacherError(false);
    setTeacherPass('');
    setLoadingRes(true);
    go('teacher-dash');
    try {
      const res  = await fetch('/api/results');
      const data = await res.json() as ExamResult[];
      setTeacherResults(data);
    } catch {
      setTeacherResults([]);
    }
    setLoadingRes(false);
  }

  async function clearResults() {
    if (!confirm('¿Deseas borrar todos los resultados?\nEsta acción no se puede deshacer.')) return;
    await fetch('/api/results', { method: 'DELETE' });
    setTeacherResults([]);
  }

  function downloadCSV() {
    if (teacherResults.length === 0) { alert('No hay resultados para exportar.'); return; }
    const headers = ['#','Nombre','Carrera','Puntaje','Correctas','Incorrectas','Estado','Fecha','Hora'];
    const rows = teacherResults.map((r, i) => [
      i + 1,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.career.replace(/"/g, '""')}"`,
      r.score, r.correct, r.incorrect,
      r.score >= 10 ? 'Aprobado' : 'Reprobado',
      r.date, r.time,
    ]);
    const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `resultados_ia_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const progress = examQuestions.length
    ? (Object.keys(selected).length / examQuestions.length) * 100
    : 0;

  // ── Render ───────────────────────────────────────────────────
  return (
    <main>

      {/* ════ HOME ════ */}
      {screen === 'home' && (
        <div className="card" key="home">
          <div className="home-header">
            <div className="hero-icon">🤖</div>
            <h1>Examen de Inteligencia Artificial</h1>
            <p>10 preguntas &nbsp;·&nbsp; 2 puntos cada una &nbsp;·&nbsp; Total 20 puntos</p>
          </div>
          <div className="role-grid">
            <button className="role-btn" onClick={() => go('student-reg')}>
              <div className="ri">👨‍🎓</div>
              <h2>Alumno</h2>
              <p>Rinde el examen</p>
            </button>
            <button className="role-btn teacher" onClick={() => go('teacher-login')}>
              <div className="ri">👩‍🏫</div>
              <h2>Docente</h2>
              <p>Revisa los resultados</p>
            </button>
          </div>
        </div>
      )}

      {/* ════ REGISTRO ALUMNO ════ */}
      {screen === 'student-reg' && (
        <div className="card" key="student-reg">
          <button className="back-btn" onClick={() => go('home')}>← Volver</button>
          <div className="sec-title">
            <h2>👨‍🎓 Datos del alumno</h2>
            <p>Completa tu información antes de iniciar el examen</p>
          </div>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              value={studentName}
              placeholder="Ej: Lucía Fernández"
              onChange={e => setStudentName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') (document.getElementById('inp-career') as HTMLInputElement)?.focus();
              }}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Carrera</label>
            <input
              id="inp-career"
              type="text"
              value={studentCareer}
              placeholder="Ej: Ingeniería en Sistemas"
              onChange={e => setStudentCareer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') startExam(); }}
            />
          </div>
          {regError && (
            <div className="alert alert-err">Por favor completa todos los campos.</div>
          )}
          <button className="btn btn-primary" onClick={startExam}>Iniciar Examen →</button>
        </div>
      )}

      {/* ════ EXAMEN ════ */}
      {screen === 'exam' && (
        <div className="card" key="exam">
          <div className="exam-meta">
            <span>👨‍🎓 {studentName}</span>
            <span
              className={`exam-timer${timeLeft <= 120 ? ' exam-timer--danger' : timeLeft <= 300 ? ' exam-timer--warn' : ''}`}
            >
              ⏱ {fmtTime(timeLeft)}
            </span>
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${progress}%` }} />
          </div>

          {examQuestions.map((q, qi) => (
            <div key={qi} className="q-card">
              <div className="q-num">
                Pregunta {qi + 1} de {examQuestions.length} · 2 puntos
              </div>
              <div className="q-text">{q.text}</div>
              <ul className="opts">
                {q.shuffledOpts.map((opt, oi) => (
                  <li key={oi} className={`opt${selected[qi] === oi ? ' selected' : ''}`}>
                    <label>
                      <input
                        type="radio"
                        name={`q${qi}`}
                        checked={selected[qi] === oi}
                        onChange={() => {
                          setSelected(prev => ({ ...prev, [qi]: oi }));
                          setExamError(false);
                        }}
                      />
                      <span>{opt.t}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {examError && (
            <div className="alert alert-err">
              Por favor responde todas las preguntas antes de enviar.
            </div>
          )}
          <button
            className="btn btn-primary"
            onClick={() => submitExam()}
            disabled={submitting}
            style={{ marginTop: '20px' }}
          >
            {submitting ? 'Guardando resultado…' : 'Enviar Examen ✓'}
          </button>
        </div>
      )}

      {/* ════ RESULTADO ════ */}
      {screen === 'result' && lastResult && (() => {
        const pass    = lastResult.score >= 10;
        const { msg, sub } = scoreMsg(lastResult.score);
        const pct     = Math.round(lastResult.correct / 10 * 100);
        return (
          <div className="card" key="result">
            <div className="score-wrap">
              <div
                className="score-circle"
                style={{
                  background: pass
                    ? 'linear-gradient(135deg,#43e97b,#38f9d7)'
                    : 'linear-gradient(135deg,#f093fb,#f5576c)',
                }}
              >
                <div className="score-num">{lastResult.score}</div>
                <div className="score-denom">/20</div>
              </div>
              <div className="score-msg">{msg}</div>
              <div className="score-sub">{sub}</div>
            </div>

            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-val" style={{ color: '#48bb78' }}>{lastResult.correct}</div>
                <div className="stat-lbl">Correctas</div>
              </div>
              <div className="stat-box">
                <div className="stat-val" style={{ color: '#f56565' }}>{lastResult.incorrect}</div>
                <div className="stat-lbl">Incorrectas</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{pct}%</div>
                <div className="stat-lbl">Porcentaje</div>
              </div>
            </div>

            <h3 style={{ color: '#1a1a2e', marginBottom: '16px' }}>Revisión de respuestas</h3>
            {lastResult.answers.map((a, i) => (
              <div
                key={i}
                className="q-card"
                style={{
                  borderColor: a.isCorrect ? '#48bb78' : '#f56565',
                  background:  a.isCorrect ? '#f0fff4' : '#fff5f5',
                  marginBottom: '14px',
                }}
              >
                <div className="q-num" style={{ color: a.isCorrect ? '#276749' : '#9b2c2c' }}>
                  {a.isCorrect ? '✓ Correcta' : '✗ Incorrecta'} · Pregunta {i + 1}
                </div>
                <div className="q-text">{a.question}</div>
                <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                  <div style={{ color: a.isCorrect ? '#276749' : '#c53030' }}>
                    <strong>Tu respuesta:</strong> {a.selected}
                  </div>
                  {!a.isCorrect && (
                    <div style={{ color: '#276749', marginTop: '4px' }}>
                      <strong>Respuesta correcta:</strong> {a.correctAnswer}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              className="btn btn-ghost"
              onClick={() => { setStudentName(''); setStudentCareer(''); go('home'); }}
              style={{ marginTop: '18px', width: '100%' }}
            >
              ← Volver al inicio
            </button>
          </div>
        );
      })()}

      {/* ════ LOGIN DOCENTE ════ */}
      {screen === 'teacher-login' && (
        <div className="card" key="teacher-login">
          <button className="back-btn" onClick={() => go('home')}>← Volver</button>
          <div className="sec-title">
            <h2>👩‍🏫 Acceso Docente</h2>
            <p>Ingresa tu clave de acceso</p>
          </div>
          <div className="form-group">
            <label>Clave de acceso</label>
            <input
              type="password"
              value={teacherPass}
              placeholder="••••"
              onChange={e => { setTeacherPass(e.target.value); setTeacherError(false); }}
              onKeyDown={e => { if (e.key === 'Enter') teacherLogin(); }}
              autoFocus
            />
          </div>
          {teacherError && (
            <div className="alert alert-err">Clave incorrecta. Inténtalo nuevamente.</div>
          )}
          <button className="btn btn-primary" onClick={teacherLogin}>Ingresar →</button>
        </div>
      )}

      {/* ════ DASHBOARD DOCENTE ════ */}
      {screen === 'teacher-dash' && (
        <div className="card" key="teacher-dash">
          <div className="dash-head">
            <div>
              <h2>📊 Panel Docente</h2>
              <p>Resultados — Examen de Inteligencia Artificial</p>
            </div>
            <button className="btn btn-ghost" onClick={() => go('home')}>Cerrar sesión</button>
          </div>

          {loadingRes ? (
            <div className="empty-state"><p>Cargando resultados…</p></div>
          ) : teacherResults.length === 0 ? (
            <div className="empty-state">
              <div className="ei">📋</div>
              <p>Aún no hay resultados registrados.</p>
            </div>
          ) : (() => {
            const avg    = teacherResults.reduce((s, r) => s + r.score, 0) / teacherResults.length;
            const passed = teacherResults.filter(r => r.score >= 10).length;
            return (
              <>
                <div className="stats-row" style={{ marginBottom: '20px' }}>
                  <div className="stat-box">
                    <div className="stat-val">{teacherResults.length}</div>
                    <div className="stat-lbl">Alumnos</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val" style={{ color: '#48bb78' }}>{passed}</div>
                    <div className="stat-lbl">Aprobados</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-val">{avg.toFixed(1)}</div>
                    <div className="stat-lbl">Promedio</div>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Nombre</th><th>Carrera</th>
                        <th>Puntaje</th><th>Correctas</th><th>Estado</th><th>Fecha / Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherResults.map((r, i) => (
                        <tr key={r.id}>
                          <td>{i + 1}</td>
                          <td><strong>{r.name}</strong></td>
                          <td>{r.career}</td>
                          <td style={{ fontWeight: 700, fontSize: '15px' }}>{r.score}/20</td>
                          <td>{r.correct}/10</td>
                          <td>
                            <span className={`badge ${r.score >= 10 ? 'badge-ok' : 'badge-fail'}`}>
                              {r.score >= 10 ? 'Aprobado' : 'Reprobado'}
                            </span>
                          </td>
                          <td style={{ color: '#a0aec0', fontSize: '12px' }}>{r.date} {r.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}

          <div className="action-row" style={{ marginTop: '16px' }}>
            <button className="btn btn-green" onClick={downloadCSV}>⬇ Descargar CSV</button>
            <button className="btn btn-red"   onClick={clearResults}>🗑 Limpiar resultados</button>
          </div>
        </div>
      )}
    </main>
  );
}
