// URL-Helfer für useUrlState
import type { ParamValue } from '../types';
import { PARAM_KEYS_40 } from './params';

export function clampParam(v: number): ParamValue {
  return Math.max(0, Math.min(2, Math.round(v))) as ParamValue;
}

export const PARAM_KEYS_40_SET = new Set<string>(PARAM_KEYS_40);
