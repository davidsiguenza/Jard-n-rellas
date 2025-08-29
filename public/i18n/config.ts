import { Language } from '../types';

export const supportedLngs: { [key in Language]: string } = {
  es: 'Castellano',
  gl: 'Galego',
};

export const defaultLng: Language = 'es';
