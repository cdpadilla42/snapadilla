import { create } from 'zustand';

type SnapadillaStore = {
  uri: string;
  getUri: () => string;
  setUri: (uri: string) => void;
  uriType: 'video' | 'picture' | '';
  setUriType: (uriType: 'video' | 'picture' | '') => void;
};

const useSnapadillaStore = create<SnapadillaStore>((set, get) => ({
  uri: '',
  uriType: 'picture',

  setUri: (value: string) => set({ uri: value }),
  getUri: () => get().uri,
  setUriType: (uriType: 'video' | 'picture' | '') => set({ uriType }),
}));

export default useSnapadillaStore;
