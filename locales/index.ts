import zh from './zh';
import en from './en';
const messages = {
  zh,
  en,
};

export default defineI18nConfig(() => ({
  legacy: false,
  messages,
  allowComposition: true,
}));
