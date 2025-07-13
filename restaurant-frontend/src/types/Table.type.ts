export type TableZone = 'main-hall' | 'quiet' | 'vip';

export type TableType = 'group' | 'standard' | 'quiet' | 'vip';

export interface ITable {
  _id?: string;
  code: string;
  type: TableType;
  capacity: number;
  floor: number;
  zone: TableZone;
  isAvailable: boolean;
  position: {
    x: number;
    y: number;
  };
}
