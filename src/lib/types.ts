export type Row = {
  escuela: string;
  division: string;
  orden: string;
  nombre: string;
  foto: string;
};

export type CuratedRow = Row & {
  orientation: "landscape" | "portrait";
};
