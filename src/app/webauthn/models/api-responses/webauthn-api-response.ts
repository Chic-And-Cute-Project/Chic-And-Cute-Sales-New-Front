import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';

export interface WebauthnApiResponse {
  options: PublicKeyCredentialCreationOptionsJSON;
}
