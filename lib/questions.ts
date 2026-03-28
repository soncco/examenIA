import type { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    text: "¿Cuáles son los 'Tres Ingredientes Esenciales' que definen verdaderamente el diseño y potencial de un Agente de IA?",
    opts: [
      { t: 'LLM, Memoria y Schemas',                       ok: true  },
      { t: 'Cerebro (LLM), Prompt y Herramientas (Tools)', ok: false },
      { t: 'Knowledge, Prompting y Tools',                  ok: false },
      { t: 'APIs, Internet y Chatbot',                      ok: false },
    ],
  },
  {
    text: '¿Qué subcampo de la IA utiliza redes neuronales con muchas capas para tareas complejas como la detección de objetos?',
    opts: [
      { t: 'Machine Learning (ML)', ok: false },
      { t: 'IA Débil (Estrecha)',   ok: false },
      { t: 'IA Generativa',         ok: false },
      { t: 'Deep Learning (DL)',    ok: true  },
    ],
  },
  {
    text: "En el 'Flujo de Ejecución' de un Agente de IA, ¿cuál es el paso donde 'Comprueba la respuesta y reflexiona sobre el resultado'?",
    opts: [
      { t: 'Lee',      ok: false },
      { t: 'Planifica', ok: false },
      { t: 'Actúa',    ok: false },
      { t: 'Verifica', ok: true  },
    ],
  },
  {
    text: "Un Agente de IA puede 'agendar citas, enviar confirmaciones y actualizar calendarios automáticamente'. ¿Por qué no podría un Chatbot hacer esto?",
    opts: [
      { t: 'Porque el Chatbot no tiene Prompt.',                                                                ok: false },
      { t: 'Porque el Chatbot carece de un LLM potente.',                                                       ok: false },
      { t: 'Porque el Chatbot solo responde preguntas predefinidas sin ejecutar acciones en sistemas externos.', ok: true  },
      { t: 'Porque el Agente de IA es gratuito y el Chatbot no.',                                               ok: false },
    ],
  },
  {
    text: 'Un error común en prompting es...:',
    opts: [
      { t: 'Dar demasiado contexto.',                        ok: false },
      { t: 'Ser ambiguo y dejar detalles sin especificar.',  ok: true  },
      { t: 'Especificar el formato del resultado.',           ok: false },
      { t: 'Iterar sobre la respuesta de la IA.',            ok: false },
    ],
  },
  {
    text: "En la arquitectura del Modelo Transformer, ¿qué es la 'Tokenización'?",
    opts: [
      { t: "El paso donde el modelo 'presta atención' a las partes más relevantes.", ok: false },
      { t: 'La generación de una respuesta coherente.',                              ok: false },
      { t: 'La división del texto fuente en unidades procesables (tokens).',         ok: true  },
      { t: 'La transformación de texto en una imagen.',                              ok: false },
    ],
  },
  {
    text: 'Un Agente Automatizado se diferencia de un Agente Conversacional porque:',
    opts: [
      { t: 'Solo interactúa por voz.',                                                                                      ok: false },
      { t: 'Requiere intervención humana constante para cada tarea.',                                                        ok: false },
      { t: 'Interactúa directamente con humanos por WhatsApp o Instagram.',                                                 ok: false },
      { t: 'No requiere interacción directa y se activa por eventos (nuevo correo, horario) funcionando en segundo plano.', ok: true  },
    ],
  },
  {
    text: 'Para mejorar la relevancia y reducir errores en el output de la IA, la ingeniería de prompts recomienda:',
    opts: [
      { t: 'Limitar el contexto al mínimo para que la IA sea creativa.',                      ok: false },
      { t: 'Ser Específico, detallando la asignatura, el nivel o el formato esperado.',        ok: true  },
      { t: 'Iniciar un chat nuevo después de cada iteración.',                                 ok: false },
      { t: "Usar solo el 'Mecanismo de Atención' de la IA.",                                  ok: false },
    ],
  },
  {
    text: '¿Cuál es la función del método POST en el contexto de las APIs que utilizan los agentes?',
    opts: [
      { t: 'Obtiene información del servidor (datos, documentos, consultas).',                          ok: false },
      { t: 'Envía información al servidor para crear registros, actualizar datos o ejecutar acciones.', ok: true  },
      { t: 'Verifica si la respuesta de la API fue exitosa.',                                           ok: false },
      { t: 'Procesa los datos para convertirlos en tokens.',                                            ok: false },
    ],
  },
  {
    text: 'El principio ético de Transparencia en la IA implica:',
    opts: [
      { t: 'Evitar decisiones injustas o discriminatorias en los modelos.', ok: false },
      { t: 'Asegurar que se pueda entender cómo decide un modelo.',         ok: true  },
      { t: 'Manejar responsablemente los datos personales según la ley.',   ok: false },
      { t: 'Considerar el alto uso energético de los grandes modelos.',     ok: false },
    ],
  },
];
