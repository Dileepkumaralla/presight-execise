export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    let code = "HTTP_ERROR";
    let message = `Request failed with status ${response.status}`;
    let requestId: string | undefined;

    try {
      const body = (await response.json()) as {
        error?: { code?: string; message?: string; requestId?: string };
      };
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
      requestId = body.error?.requestId;
    } catch {
      // Keep the generic HTTP error when the body is not JSON.
    }

    throw new ApiError(response.status, code, message, requestId);
  }

  return (await response.json()) as T;
}
