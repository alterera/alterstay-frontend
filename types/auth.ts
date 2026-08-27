export type AuthUser = {
  id: string;
  phone: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  status: string;
  roles?: string[];
  gender?: string | null;
  dateOfBirth?: string | null;
  cityOfResidence?: string | null;
  referralCode?: string | null;
  alterCashBalance?: number;
  membershipTier?: string;
  membershipExpiresAt?: string | null;
  hasPassword?: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type AuthResponse = AuthTokens & {
  user: AuthUser;
};

export type RequestOtpResponse = {
  success: boolean;
  purpose: string;
  channel: string;
  expiresInSeconds: number;
  debugOtp?: string;
};

export type ApiErrorBody = {
  statusCode?: number;
  message?: string | string[];
  retryAfterSec?: number;
};
