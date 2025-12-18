export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export enum AppMode {
  VIEW_3D = 'VIEW_3D',
  AI_EDITOR = 'AI_EDITOR'
}

export type SkinTone = 'fair' | 'tan' | 'dark';

export interface WardrobeState {
  skin: SkinTone;
  hair: 'shawl-hair' | 'short-bob' | 'cute-bangs' | 'blonde-bombshell';
  outfit: 'pink-gown' | 'blue-gown' | 'school-uniform' | 'white-lady' | 'underwear';
  shoes: 'sandals' | 'heels' | 'boots' | 'sneakers' | 'bare';
  accessory: 'pearls' | 'silver-necklace' | 'none';
  hat: 'beret' | 'sun-hat' | 'none';
}