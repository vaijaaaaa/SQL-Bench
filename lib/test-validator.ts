import { executeSQLQuery } from './sql-executor';
import { logger } from './logger';

interface TestCase {
  id: string;
  input: string;
  expected: string;
  isHidden: boolean;
}

interface ValidationResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: TestCase[];
  executionTime: number;
}

export function compareResults(actual: any[], expected: any[]): boolean {
  // Handle empty arrays
  if (!actual) actual = [];
  if (!expected) expected = [];
  
  if (actual.length !== expected.length) {
    logger.debug('Length mismatch', { actual: actual.length, expected: expected.length });
    return false;
  }

  // If both are empty, they match
  if (actual.length === 0 && expected.length === 0) {
    return true;
  }

  // Normalize function to handle various data type inconsistencies
  const normalize = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    
    // Handle numeric types - ensure consistent number representation
    if (typeof obj === 'number') {
      // Handle special cases like NaN, Infinity
      if (!isFinite(obj)) return null;
      return Number(obj);
    }
    
    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      // Try to parse as number if it looks like one
      const asNumber = Number(trimmed);
      if (!isNaN(asNumber) && trimmed !== '') {
        return asNumber;
      }
      return trimmed;
    }
    
    if (typeof obj === 'boolean') return obj;
    if (obj instanceof Date) return obj.toISOString().split('T')[0];
    
    if (Array.isArray(obj)) {
      return obj.map(normalize);
    }
    
    if (typeof obj === 'object') {
      const normalized: any = {};
      // Sort keys to ensure consistent ordering
      Object.keys(obj).sort().forEach(key => {
        normalized[key] = normalize(obj[key]);
      });
      return normalized;
    }
    
    return obj;
  };

  // Sort function that works with objects
  const sortByKeys = (a: any, b: any): number => {
    const aStr = JSON.stringify(normalize(a));
    const bStr = JSON.stringify(normalize(b));
    return aStr.localeCompare(bStr);
  };

  try {
    const normalizedActual = actual.map(normalize).sort(sortByKeys);
    const normalizedExpected = expected.map(normalize).sort(sortByKeys);
    
    const actualStr = JSON.stringify(normalizedActual);
    const expectedStr = JSON.stringify(normalizedExpected);
    
    const isEqual = actualStr === expectedStr;
    
    if (!isEqual) {
      logger.debug('Result mismatch', {
        actualPreview: actualStr.substring(0, 300),
        expectedPreview: expectedStr.substring(0, 300),
      });
      
      // Show first differing item for debugging
      for (let i = 0; i < Math.min(normalizedActual.length, normalizedExpected.length); i++) {
        const aItem = JSON.stringify(normalizedActual[i]);
        const eItem = JSON.stringify(normalizedExpected[i]);
        if (aItem !== eItem) {
          logger.debug(`First difference at index ${i}`, {
            actualItem: aItem,
            expectedItem: eItem,
          });
          break;
        }
      }
    }
    
    return isEqual;
  } catch (error) {
    logger.error('Comparison error', error);
    return false;
  }
}

export async function validateSubmission(
  query: string,
  testCases: TestCase[],
  problemSchema: string
): Promise<ValidationResult> {
  let passedTests = 0;
  const failedTests: TestCase[] = [];
  let totalExecutionTime = 0;

  logger.debug('Starting test validation', { testCount: testCases.length });

  for (const testCase of testCases) {
    try {
      const expected = JSON.parse(testCase.expected);
      
      logger.debug('Running test case', { testId: testCase.id });
      
      const result = await executeSQLQuery(
        query,
        problemSchema,
        testCase.input,
        5000
      );

      totalExecutionTime += result.executionTime;

      if (!result.success) {
        logger.debug('Query execution failed', { error: result.error });
        failedTests.push(testCase);
        continue;
      }

      logger.debug('Comparing results', {
        actualRows: result.rows?.length,
        expectedRows: expected.length,
      });

      if (compareResults(result.rows || [], expected)) {
        logger.debug('Test case passed');
        passedTests++;
      } else {
        logger.debug('Test case failed - results do not match');
        failedTests.push(testCase);
      }
    } catch (error: any) {
      logger.error('Exception during test', error, { testId: testCase.id });
      failedTests.push(testCase);
    }
  }

  logger.info('Test validation complete', {
    passed: passedTests,
    failed: failedTests.length,
    total: testCases.length,
  });

  return {
    passed: failedTests.length === 0,
    totalTests: testCases.length,
    passedTests,
    failedTests,
    executionTime: totalExecutionTime,
  };
}
