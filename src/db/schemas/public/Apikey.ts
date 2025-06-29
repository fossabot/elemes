// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { UserId } from './User';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.apikey */
export type ApikeyId = string & { __brand: 'public.apikey' };

/** Represents the table public.apikey */
export default interface ApikeyTable {
  id: ColumnType<ApikeyId, ApikeyId, ApikeyId>;

  name: ColumnType<string | null, string | null, string | null>;

  start: ColumnType<string | null, string | null, string | null>;

  prefix: ColumnType<string | null, string | null, string | null>;

  key: ColumnType<string, string, string>;

  userId: ColumnType<UserId, UserId, UserId>;

  refillInterval: ColumnType<number | null, number | null, number | null>;

  refillAmount: ColumnType<number | null, number | null, number | null>;

  lastRefillAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  enabled: ColumnType<boolean | null, boolean | null, boolean | null>;

  rateLimitEnabled: ColumnType<boolean | null, boolean | null, boolean | null>;

  rateLimitTimeWindow: ColumnType<number | null, number | null, number | null>;

  rateLimitMax: ColumnType<number | null, number | null, number | null>;

  requestCount: ColumnType<number | null, number | null, number | null>;

  remaining: ColumnType<number | null, number | null, number | null>;

  lastRequest: ColumnType<Date | null, Date | string | null, Date | string | null>;

  expiresAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  createdAt: ColumnType<Date, Date | string, Date | string>;

  updatedAt: ColumnType<Date, Date | string, Date | string>;

  permissions: ColumnType<string | null, string | null, string | null>;

  metadata: ColumnType<string | null, string | null, string | null>;
}

export type Apikey = Selectable<ApikeyTable>;

export type NewApikey = Insertable<ApikeyTable>;

export type ApikeyUpdate = Updateable<ApikeyTable>;
