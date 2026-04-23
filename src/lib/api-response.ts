/**
 * Unified API response envelope for all /api/* routes.
 * Ensures consistent error handling and response shape across the application.
 */

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, string | string[]>;
    };
}

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Standard HTTP status codes for API errors
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error codes for consistent error identification
 */
export const ERROR_CODE = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_ERROR: "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    BACKEND_ERROR: "BACKEND_ERROR",
} as const;

/**
 * Create a success response
 */
export function successResponse<T>(data: T): ApiSuccessResponse<T> {
    return {
        success: true,
        data,
    };
}

/**
 * Create an error response
 */
export function errorResponse(
    code: string,
    message: string,
    details?: Record<string, string | string[]>,
): ApiErrorResponse {
    return {
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
        },
    };
}
