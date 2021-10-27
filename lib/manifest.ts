import { MediaType } from './media';

export type Service = {
  type: MediaType | MediaType[];
  script: string;
};

export class Manifest {
  name: string;
  version: string;
  description?: string;
  icon?: string;
  services: Service[];
}
