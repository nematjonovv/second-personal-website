import { about } from "./about.data";
import type { About } from "./about.type";
export const aboutApi = {
  async get(): Promise<About> {
    return about;
  },
};
