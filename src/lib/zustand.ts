import type { StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

type DevtoolsEnabledStateCreator<T> = StateCreator<T, [], [['zustand/devtools', never]]>;

export const withDevtools = <T>(
  name: string,
  initializer: StateCreator<T, [['zustand/devtools', never]], []>,
): DevtoolsEnabledStateCreator<T> =>
  devtools(initializer, {
    name,
    enabled: import.meta.env.DEV,
  });