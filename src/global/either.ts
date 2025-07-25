type Error<T> = {
  error: T;
  success?: never;
};

type Success<U> = {
  error?: never;
  success: U;
};

export type Result<T, U> = NonNullable<Error<T> | Success<U>>;

export type ExtractResultValue = <T, U>(e: Result<T, U>) => NonNullable<T | U>;

export const extractResultValue: ExtractResultValue = <T, U>({
   error,
  success,
}: Result<T, U>) => {
  if (success !== undefined && error !== undefined) {
    throw new Error(
      `Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(
        error
      )}\nRight: ${JSON.stringify(success)}`
    );
    /*
     We're throwing in this function because this can only occur at runtime if something 
     happens that the TypeScript compiler couldn't anticipate. That means the application
     is in an unexpected state and we should terminate immediately.
    */
  }
  if (error !== undefined) {
    return error as NonNullable<T>; // Typescript is getting confused and returning this type as `T | undefined` unless we add the type assertion
  }
  if (success !== undefined) {
    return success as NonNullable<U>;
  }
  throw new Error(
    `Received no left or right values at runtime when opening Either`
  );
};

export const isError = <T, U>(e: Result<T, U>): e is Error<T> => {
  return e.error !== undefined;
};

export const isSuccess = <T, U>(e: Result<T, U>): e is Success<U> => {
  return e.success !== undefined;
};

export const makeError = <T>(value: T): Error<T> => ({ error: value });

export const makeSuccess = <U>(value: U): Success<U> => ({ success: value });