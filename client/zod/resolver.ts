import { z } from "zod";

export type FormErrors = Record<string, { message: string; type?: string }>;

export const zodResolver = (schema: z.ZodType) => {
  return async (values: any): Promise<{ values: any; errors: FormErrors }> => {
    const result = schema.safeParse(values);
    
    if (!result.success) {
      const treeifiedErrors = z.treeifyError(result.error) as  { properties?: Record<string, { errors: string[] }> };

      const errors: FormErrors[] =  Object.entries(treeifiedErrors.properties ?? {}).map(([key, value])=> {
          return {
            [key]: {
              message: value.errors[0],
            }
          }
        })
      
      return { 
        values: {}, 
        errors: errors[0]
      };
    }
    
    return { 
      values: result.data, 
      errors: {} 
    };
  };
}