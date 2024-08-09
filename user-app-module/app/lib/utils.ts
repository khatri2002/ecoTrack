type CustomError = {
  response: {
    data: {
        status: boolean;
        type: string;
        title: string;
        message: string;
    };
  };
};

export const isCustomError = (error: unknown): error is CustomError => {
  return typeof error === "object" && error != null && "response" in error;
};
