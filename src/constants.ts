import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿Cuáles son los ‘Tres Ingredientes Esenciales’ que definen verdaderamente el diseño y potencial de un Agente de IA?",
    options: [
      "LLM, Memoria y Schemas",
      "Cerebro (LLM), Prompt y Herramientas (Tools)",
      "Knowledge, Prompting y Tools",
      "APIs, Internet y Chatbot"
    ],
    correctAnswer: "LLM, Memoria y Schemas"
  },
  {
    id: 2,
    text: "¿Qué subcampo de la IA utiliza redes neuronales con muchas capas para tareas complejas como la detección de objetos?",
    options: [
      "Machine Learning (ML)",
      "IA Débil (Estrecha)",
      "IA Generativa",
      "Deep Learning (DL)"
    ],
    correctAnswer: "Deep Learning (DL)"
  },
  {
    id: 3,
    text: "En el ‘Flujo de Ejecución’ de un Agente de IA, ¿cuál es el paso donde ‘Comprueba la respuesta y reflexiona sobre el resultado’?",
    options: [
      "Lee",
      "Planifica",
      "Actúa",
      "Verifica"
    ],
    correctAnswer: "Verifica"
  },
  {
    id: 4,
    text: "Un Agente de IA puede ‘agendar citas, enviar confirmaciones y actualizar calendarios automáticamente’. ¿Por qué no podría un Chatbot hacer esto?",
    options: [
      "Porque el Chatbot no tiene Prompt.",
      "Porque el Chatbot carece de un LLM potente.",
      "Porque el Chatbot solo responde preguntas predefinidas sin ejecutar acciones en sistemas externos.",
      "Porque el Agente de IA es gratuito y el Chatbot no."
    ],
    correctAnswer: "Porque el Chatbot solo responde preguntas predefinidas sin ejecutar acciones en sistemas externos."
  },
  {
    id: 5,
    text: "Un error común en prompting es...:",
    options: [
      "Dar demasiado contexto.",
      "Ser ambiguo y dejar detalles sin especificar.",
      "Especificar el formato del resultado.",
      "Iterar sobre la respuesta de la IA."
    ],
    correctAnswer: "Ser ambiguo y dejar detalles sin especificar."
  },
  {
    id: 6,
    text: "En la arquitectura del Modelo Transformer, ¿qué es la ‘Tokenización’?",
    options: [
      "El paso donde el modelo ‘presta atención’ a las partes más relevantes.",
      "La generación de una respuesta coherente.",
      "La división del texto fuente en unidades procesables (tokens).",
      "La transformación de texto en una imagen."
    ],
    correctAnswer: "La división del texto fuente en unidades procesables (tokens)."
  },
  {
    id: 7,
    text: "Un Agente Automatizado se diferencia de un Agente Conversacional porque:",
    options: [
      "Solo interactúa por voz.",
      "Requiere intervención humana constante para cada tarea.",
      "Interactúa directamente con humanos por WhatsApp o Instagram.",
      "No requiere interacción directa y se activa por eventos (nuevo correo, horario) funcionando en segundo plano."
    ],
    correctAnswer: "No requiere interacción directa y se activa por eventos (nuevo correo, horario) funcionando en segundo plano."
  },
  {
    id: 8,
    text: "Para mejorar la relevancia y reducir errores en el output de la IA, la ingeniería de prompts recomienda:",
    options: [
      "Limitar el contexto al mínimo para que la IA sea creativa.",
      "Ser Específico, detallando la asignatura, el nivel o el formato esperado.",
      "Iniciar un chat nuevo después de cada iteración.",
      "Usar solo el ‘Mecanismo de Atención’ de la IA."
    ],
    correctAnswer: "Ser Específico, detallando la asignatura, el nivel o el formato esperado."
  },
  {
    id: 9,
    text: "¿Cuál es la función del método POST en el contexto de las APIs que utilizan los agentes?",
    options: [
      "Obtiene información del servidor (datos, documentos, consultas).",
      "Envía información al servidor para crear registros, actualizar datos o ejecutar acciones.",
      "Verifica si la respuesta de la API fue exitosa.",
      "Procesa los datos para convertirlos en tokens."
    ],
    correctAnswer: "Envía información al servidor para crear registros, actualizar datos o ejecutar acciones."
  },
  {
    id: 10,
    text: "El principio ético de Transparencia en la IA implica:",
    options: [
      "Evitar decisiones injustas o discriminatorias en los modelos.",
      "Asegurar que se pueda entender cómo decide un modelo.",
      "Manejar responsablemente los datos personales según la ley.",
      "Considerar el alto uso energético de los grandes modelos."
    ],
    correctAnswer: "Asegurar que se pueda entender cómo decide un modelo."
  }
];
