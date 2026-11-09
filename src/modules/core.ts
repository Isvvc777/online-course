/**
 * DEVFORGE Security & Authentication Guard
 */

export interface AuthContext {
  token: string;
  roles?: string[];
}

export function verifyAuthorizationHeader(authHeader?: string): { valid: boolean; token?: string; error?: string } {
  if (!authHeader) {
    return { valid: false, error: 'Missing Authorization header' };
  }
  const parts = authHeader.trim().split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return { valid: false, error: 'Malformed Bearer token' };
  }
  return { valid: true, token: parts[1] };
}
