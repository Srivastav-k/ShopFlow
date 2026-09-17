import type { PaginationInfo } from '../types/index.js';

export function formatSuccess<T>(data: T) {
  return { statusCode: 200, body: { data } };
}

export function formatCreated<T>(data: T) {
  return { statusCode: 201, body: { data } };
}

export function formatPaginated<T>(items: T[], pagination: PaginationInfo) {
  return {
    statusCode: 200,
    body: { data: items, pagination },
  };
}

export function formatError(error: { statusCode?: number; code?: string; message?: string }) {
  return {
    statusCode: error.statusCode || 500,
    body: {
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred',
      },
    },
  };
}
