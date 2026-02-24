export type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'sand';

export interface Block {
  position: [number, number, number];
  type: BlockType;
}
