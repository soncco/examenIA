import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, User, ShieldCheck, ClipboardList, LogOut, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { QUESTIONS } from './constants';
import { ViewState, Question } from './types';

// Utility to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [studentName, setStudentName] = useState('');
  const [studentMajor, setStudentMajor] = useState('');
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finalScore, setFinalScore] = useState(0);
  const [teacherPass, setTeacherPass] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize exam
  const startExam = () => {
    if (!studentName || !studentMajor) return;
    const shuffled = shuffle(QUESTIONS).map(q => ({
      ...q,
      options: shuffle(q.options)
    }));
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setView('exam');
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = async () => {
    let score = 0;
    shuffledQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += 2;
      }
    });
    setFinalScore(score);
    setView('exam-finished');
    setIsSaving(true);

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentName,
          major: studentMajor,
          score: score,
          date: new Date().toLocaleString()
        })
      });
    } catch (error) {
      console.error("Failed to save result", error);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Failed to fetch results", error);
    }
  };

  const handleTeacherLogin = () => {
    if (teacherPass === 'BRAU') {
      fetchResults();
      setView('teacher-dashboard');
    } else {
      alert("Clave incorrecta");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">Examen IA</span>
          </div>
          {view !== 'landing' && (
            <button 
              onClick={() => setView('landing')}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div 
                onClick={() => setView('student-reg')}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Panel Alumno</h2>
                <p className="text-slate-500 mb-6">Ingresa para rendir tu examen de Agentes de IA.</p>
                <div className="flex items-center text-blue-600 font-semibold">
                  Comenzar examen <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>

              <div 
                onClick={() => setView('teacher-login')}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-slate-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Panel Docente</h2>
                <p className="text-slate-500 mb-6">Acceso restringido para revisión de resultados.</p>
                <div className="flex items-center text-slate-600 font-semibold">
                  Ingresar como docente <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </motion.div>
          )}

          {view === 'student-reg' && (
            <motion.div 
              key="student-reg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Registro de Alumno</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">Carrera</label>
                  <input 
                    type="text" 
                    value={studentMajor}
                    onChange={(e) => setStudentMajor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Ej. Ingeniería de Sistemas"
                  />
                </div>
                <button 
                  onClick={startExam}
                  disabled={!studentName || !studentMajor}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                >
                  Iniciar Examen
                </button>
              </div>
            </motion.div>
          )}

          {view === 'exam' && shuffledQuestions.length > 0 && (
            <motion.div 
              key="exam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}</span>
                  <h2 className="text-2xl font-bold mt-2 leading-tight">{shuffledQuestions[currentQuestionIndex].text}</h2>
                </div>
              </div>

              <div className="space-y-4">
                {shuffledQuestions[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(shuffledQuestions[currentQuestionIndex].id, option)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      answers[shuffledQuestions[currentQuestionIndex].id] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium text-lg">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      answers[shuffledQuestions[currentQuestionIndex].id] === option
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-slate-200 group-hover:border-slate-400'
                    }`}>
                      {answers[shuffledQuestions[currentQuestionIndex].id] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  onClick={nextQuestion}
                  disabled={!answers[shuffledQuestions[currentQuestionIndex].id]}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {currentQuestionIndex === shuffledQuestions.length - 1 ? 'Finalizar Examen' : 'Siguiente'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'exam-finished' && (
            <motion.div 
              key="exam-finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">¡Examen Completado!</h2>
              <p className="text-slate-500 mb-8">Gracias por participar, {studentName}. Tus resultados han sido guardados.</p>
              
              <div className="bg-slate-50 p-8 rounded-2xl mb-8">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-1">Tu Nota Final</span>
                <div className="text-6xl font-black text-slate-900">{finalScore}<span className="text-2xl text-slate-400">/20</span></div>
              </div>

              <button 
                onClick={() => setView('landing')}
                className="text-blue-600 font-bold hover:underline"
              >
                Volver al inicio
              </button>
            </motion.div>
          )}

          {view === 'teacher-login' && (
            <motion.div 
              key="teacher-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Acceso Docente</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">Clave de Acceso</label>
                  <input 
                    type="password" 
                    value={teacherPass}
                    onChange={(e) => setTeacherPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                    placeholder="••••"
                  />
                </div>
                <button 
                  onClick={handleTeacherLogin}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all"
                >
                  Ingresar
                </button>
              </div>
            </motion.div>
          )}

          {view === 'teacher-dashboard' && (
            <motion.div 
              key="teacher-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-bold">Registro de Notas</h2>
                  <p className="text-slate-500">Resultados acumulados de los exámenes rendidos.</p>
                </div>
                <button 
                  onClick={fetchResults}
                  className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                  title="Actualizar"
                >
                  <ClipboardList className="w-6 h-6 text-slate-600" />
                </button>
              </div>
              
              <div className="p-0">
                {results.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {results.map((result, idx) => (
                      <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{result.split('|')[1].split(':')[1].trim()}</div>
                            <div className="text-slate-500 text-sm">{result.split('|')[2].split(':')[1].trim()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden md:block">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Fecha</div>
                            <div className="text-sm text-slate-600">{result.split('|')[0].trim()}</div>
                          </div>
                          <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xl min-w-[80px] text-center">
                            {result.split('|')[3].split(':')[1].trim().split('/')[0]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No hay resultados registrados aún.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Plataforma de Evaluación de IA. Todos los derechos reservados.
      </footer>
    </div>
  );
}
