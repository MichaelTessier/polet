import { z } from 'zod';

export type FormErrors = Record<string, { message: string; type?: string }>;

export const zodResolver = (schema: z.ZodType) => {
  return async (values: any): Promise<{ values: any; errors: FormErrors }> => {
    const result = schema.safeParse(values);

    if (!result.success) {
      const errors: FormErrors = {};

      result.error.issues.forEach(issue => {
        const fieldName = issue.path.join('.');
        const { customError } = z.config();
        const error = customError!(issue as any);

        errors[fieldName] = {
          message: (error as { message: string })?.message || 'Invalid value',
          type: 'validation',
        };
      });

      return {
        values: {},
        errors: errors,
      };
    }

    return {
      values: result.data,
      errors: {},
    };
  };
};
