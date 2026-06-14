export interface Stop {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  video: {
    kind: "mp4" | "youtube";
    title: string;
    src: string;
    fileName: string;
  };
  mapPoint: {
    x: number;
    y: number;
    color: "orange" | "pink" | "teal" | "blue";
    icon: "museum" | "pen" | "book" | "person";
  };
  tasks: {
    name: string;
    component:
      | "TrueFalseQuiz"
      | "Timeline"
      | "MatchTerms"
      | "ContinueThought"
      | "QuickQuiz"
      | "Crossword"
      | "OldWords"
      | "ComprehensionQuestions"
      | "ConceptsTask"
      | "ComparisonTable";
  }[];
}

const museumMap = "images/museum-map.webp";

export const stops: Stop[] = [
  {
    id: 1,
    title: "Знакомство с биографией писателя",
    shortTitle: "Биография",
    description:
      "Открываем маршрут с живого портрета эпохи: усадебное детство, лицей, ссылка, государственная служба и литературный голос М. Е. Салтыкова-Щедрина.",
    image: museumMap,
    video: {
      kind: "mp4",
      title: "Биография писателя",
      src: "videos/stop-1.mp4",
      fileName: "stop-1.mp4",
    },
    mapPoint: {
      x: 19,
      y: 54,
      color: "orange",
      icon: "museum",
    },
    tasks: [
      { name: "Викторина «Верно - неверно»", component: "TrueFalseQuiz" },
      { name: "Хронологическая цепочка", component: "Timeline" },
    ],
  },
  {
    id: 2,
    title: "Художественные особенности сказок М. Е. Салтыкова-Щедрина",
    shortTitle: "Сказки",
    description:
      "В этом зале рассматриваем сатиру, эзопов язык и художественные приёмы, которые превращают сказку в точный общественный диагноз.",
    image: museumMap,
    video: {
      kind: "mp4",
      title: "Художественные особенности сказок",
      src: "videos/stop-2.mp4",
      fileName: "stop-2.mp4",
    },
    mapPoint: {
      x: 46,
      y: 34,
      color: "pink",
      icon: "pen",
    },
    tasks: [
      { name: "Работа с терминами", component: "MatchTerms" },
      { name: "Игра «Продолжи мысль»", component: "ContinueThought" },
      { name: "Быстрая викторина «Кто быстрее?»", component: "QuickQuiz" },
    ],
  },
  {
    id: 3,
    title: "Мини-лекторий",
    shortTitle: "Мини-лекторий",
    description:
      "Небольшой лекторий с деталями текста: старинная лексика, предметный мир произведения и слова, без которых исчезает вкус XIX века.",
    image: museumMap,
    video: {
      kind: "mp4",
      title: "Мини-лекторий",
      src: "videos/stop-3.mp4",
      fileName: "stop-3.mp4",
    },
    mapPoint: {
      x: 73,
      y: 45,
      color: "teal",
      icon: "book",
    },
    tasks: [
      { name: "Интерактивный кроссворд", component: "Crossword" },
      { name: "Старинные слова в современном мире", component: "OldWords" },
      { name: "Соединение терминов", component: "MatchTerms" },
    ],
  },
  {
    id: 4,
    title: "Образ русского мужика",
    shortTitle: "Образ русского мужика",
    description:
      "Финальная остановка посвящена образу мужика: его труду, смекалке, покорности и скрытой силе в сатирическом мире писателя.",
    image: museumMap,
    video: {
      kind: "mp4",
      title: "Образ русского мужика",
      src: "videos/stop-4.mp4",
      fileName: "stop-4.mp4",
    },
    mapPoint: {
      x: 58,
      y: 78,
      color: "blue",
      icon: "person",
    },
    tasks: [
      { name: "Вопросы на понимание содержания", component: "ComprehensionQuestions" },
      { name: "Мини-лекторий: понятия", component: "ConceptsTask" },
      { name: "Сравнительная таблица", component: "ComparisonTable" },
    ],
  },
];

export const totalTasks = stops.reduce((sum, stop) => sum + stop.tasks.length, 0);

export function getStopById(id: number) {
  return stops.find((stop) => stop.id === id);
}
