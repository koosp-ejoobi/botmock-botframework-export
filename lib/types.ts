export type Intent = {
  id: string;
  name: string;
  utterances: Utterance[];
};

export type BatchAddLabelsResponse = { value: any; hasError: boolean }[];

export type Utterance = {
  text: string;
  variables: {
    id: string;
    name: string;
    entity: string;
    start_index: number;
  }[];
};

export type Entity = {
  id: string;
  name: string;
  data: { value: string; synonyms: string[] }[];
};

export type LuisImportResponse = string | { error: Error };

export type LuisTrainResponse =
  | { statusId: number; status: string }
  | { error?: Error };