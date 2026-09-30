import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'auth:public';
export const ALLOW_GUEST_KEY = 'auth:allowGuest';
export const ALLOW_SERVICE_KEY = 'auth:allowService';

/** No authentication required. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
/** Guests (QR session token) may call this in addition to staff. */
export const AllowGuest = () => SetMetadata(ALLOW_GUEST_KEY, true);
/** Other AtithiSafe services may call this directly. */
export const AllowService = () => SetMetadata(ALLOW_SERVICE_KEY, true);
