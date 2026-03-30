/**
 * Структура данных для пункта назначения
 * @typedef {Object} Destination
 * @property {string} id - Уникальный идентификатор
 * @property {string} name - Название города
 * @property {string} description - Описание
 * @property {Array<Photo>} photos - Массив фотографий
 */

/**
 * @typedef {Object} Photo
 * @property {string} src - Путь к изображению
 * @property {string} description - Описание фото
 */

export const destinations = [
  {
    id: 'dest-1',
    name: 'Amsterdam',
    description: 'Amsterdam is the Netherlands\' capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades, legacies of the city\'s 17th-century Golden Age.',
    photos: [] 
  },
  {
    id: 'dest-2',
    name: 'Geneva',
    description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.',
    photos: [] 
  },
  {
    id: 'dest-3',
    name: 'Chamonix',
    description: 'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it\'s renowned for its skiing.',
    photos: [] 
  }
];

/**
 * Получить пункт назначения по ID
 * @param {string} id
 * @returns {Destination|undefined}
 */
export const getDestinationById = (id) => destinations.find(dest => dest.id === id);

/**
 * Получить пункт назначения по названию
 * @param {string} name
 * @returns {Destination|undefined}
 */
export const getDestinationByName = (name) => destinations.find(dest => dest.name === name);