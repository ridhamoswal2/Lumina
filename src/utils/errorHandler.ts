import { toast } from "sonner";

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}

export class TMDBError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "TMDBError";
  }
}

export const handleError = (error: unknown, context?: string): void => {
  let errorMessage = "An unexpected error occurred";
  let shouldShowToast = true;

  if (error instanceof TMDBError) {
    errorMessage = error.message;
    
    // Don't show toast for certain error types
    if (error.statusCode === 404) {
      shouldShowToast = false; // Handle 404s silently in UI
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;

  console.error(fullMessage, error);

  if (shouldShowToast) {
    toast.error(errorMessage, {
      description: context,
    });
  }
};

export const createErrorHandler = (context: string) => {
  return (error: unknown) => {
    handleError(error, context);
  };
};

