export function authError(failure: unknown): string {
  const code =
    failure && typeof failure === 'object' && 'code' in failure
      ? failure.code
      : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Check your email and password, then try again.';
    case 'auth/email-already-in-use':
      return 'Unable to create this account. Try logging in or resetting your password.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Choose a stronger password and try again.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait before trying again.';
    case 'auth/network-request-failed':
      return 'Check your connection and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'The sign-in window was closed. You can try again.';
    case 'auth/popup-blocked':
      return 'Allow the sign-in popup in your browser, then try again.';
    case 'auth/account-exists-with-different-credential':
      return 'Use your original sign-in method for this email address.';
    default:
      return 'We could not complete that request. Please try again.';
  }
}
