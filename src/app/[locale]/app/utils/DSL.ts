// Helper to replace placeholders in strings.
// const resolvePlaceholders = (value: any, context: Record<string, any>): any => {
//   if (typeof value === 'string') {
//     const exactMatch = value.match(/^{{:([\w.-]+)}}$/);
//     if (exactMatch) {
//       // Traverse context with dot notation.
//       return exactMatch[1].split('.').reduce((acc, key) => acc && acc[key], context);
//     }
//     // Replace any embedded placeholders.
//     return value.replace(/{{:([\w.-]+)}}/g, (_, key) => {
//       const resolved = key.split('.').reduce((acc: any, k: any) => acc && acc[k], context);
//       return resolved !== undefined ? String(resolved) : '';
//     });
//   } else if (Array.isArray(value)) {
//     return value.map(item => resolvePlaceholders(item, context));
//   } else if (value !== null && typeof value === 'object') {
//     const result: Record<string, any> = {};
//     for (const [k, v] of Object.entries(value)) {
//       result[k] = resolvePlaceholders(v, context);
//     }
//     return result;
//   }
//   return value;
// };

import { replacePlaceholdersRecursively } from "./sharedUtils";

// Define our DSL types.
export type DSLConfig =
  | ArithmeticDSL
  | MapDSL
  | FilterDSL
  | ReduceDSL
  | { operation: string;[key: string]: any };

export interface ArithmeticDSL {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'greaterThan';
  operands: any[]; // can be numbers, strings, or nested DSLConfig
}

export interface MapDSL {
  operation: 'map';
  input: any; // array or placeholder that resolves to an array
  mapper: DSLConfig;
}

export interface FilterDSL {
  operation: 'filter';
  input: any;
  predicate: DSLConfig; // Should evaluate to a boolean for each element
}

export interface ReduceDSL {
  operation: 'reduce';
  input: any;
  initial: any;
  reducer: DSLConfig; // Uses placeholders for accumulator and current value
}

// Main DSL evaluator.
export function evaluateDSL(config: DSLConfig, context: Record<string, any> = {}): any {
  if (config == null || typeof config !== 'object' || !('operation' in config)) {
    return replacePlaceholdersRecursively(config, context);
  }
  switch (config.operation) {
    case 'add': {
      const operands = config.operands.map((op: any) =>
        typeof op === 'object' && op.operation
          ? evaluateDSL(op, context)
          : replacePlaceholdersRecursively(op, context)
      );
      return operands.reduce((sum: any, op: any) => sum + Number(op), 0);
    }
    case 'subtract': {
      const operands = config.operands.map((op: any) =>
        typeof op === 'object' && op.operation
          ? evaluateDSL(op, context)
          : replacePlaceholdersRecursively(op, context)
      );
      return operands.slice(1).reduce((result: any, op: any) => result - Number(op), Number(operands[0]));
    }
    case 'multiply': {
      const operands = config.operands.map((op: any) =>
        typeof op === 'object' && op.operation
          ? evaluateDSL(op, context)
          : replacePlaceholdersRecursively(op, context)
      );
      return operands.reduce((prod: any, op: any) => prod * Number(op), 1);
    }
    case 'divide': {
      const operands = config.operands.map((op: any) =>
        typeof op === 'object' && op.operation
          ? evaluateDSL(op, context)
          : replacePlaceholdersRecursively(op, context)
      );
      return operands.slice(1).reduce((result: any, op: any) => result / Number(op), Number(operands[0]));
    }
    case 'greaterThan': {
      const [left, right] = config.operands.map((op: any) =>
        typeof op === 'object' && op.operation
          ? evaluateDSL(op, context)
          : replacePlaceholdersRecursively(op, context)
      );
      return Number(left) > Number(right);
    }
    case 'map': {
      const input = (typeof config.input === 'object' && 'operation' in config.input)
        ? evaluateDSL(config.input, context)
        : replacePlaceholdersRecursively(config.input, context);

      if (!Array.isArray(input)) {
        throw new Error('Input for map must be an array');
      }
      return input.map((element: any) => {
        const extendedContext = { ...context, current: element };
        return evaluateDSL(config.mapper, extendedContext);
      });
    }
    case 'filter': {
      const input = typeof config.input === 'object' && config.input.operation
        ? evaluateDSL(config.input, context)
        : replacePlaceholdersRecursively(config.input, context);
      if (!Array.isArray(input)) {
        throw new Error('Input for filter must be an array');
      }
      return input.filter(element => {
        const extendedContext = { ...context, current: element };
        const predicateResult = evaluateDSL(config.predicate, extendedContext);
        return Boolean(predicateResult);
      });
    }
    case 'reduce': {
      const input = typeof config.input === 'object' && config.input.operation
        ? evaluateDSL(config.input, context)
        : replacePlaceholdersRecursively(config.input, context);
      if (!Array.isArray(input)) {
        throw new Error('Input for reduce must be an array');
      }
      const initial = replacePlaceholdersRecursively(config.initial, context);
      return input.reduce((acc, element) => {
        const extendedContext = { ...context, accumulator: acc, current: element };
        return evaluateDSL(config.reducer, extendedContext);
      }, initial);
    }
    default:
      throw new Error(`Unsupported operation: ${(config as any).operation}`);
  }
}

