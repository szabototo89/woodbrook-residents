export type AccountDetails = { eircode: string; address: string };

export type AccountDetailsActions = {
  loadDetails: () => Promise<AccountDetails | null>;
  saveDetails: (details: AccountDetails) => Promise<void>;
  removeDetails: () => Promise<void>;
};

export const emptyAccountDetails = (): AccountDetails => ({
  eircode: '',
  address: '',
});

export function normalizeAccountDetails(
  details: AccountDetails,
): AccountDetails {
  const code = details.eircode.replace(/\s/g, '').toUpperCase();
  if (code && !/^(?:[A-Z][0-9]{2}|D6W)[A-Z0-9]{4}$/.test(code)) {
    throw new Error('Enter an Eircode in the format A65 F4E2.');
  }
  const address = details.address.trim();
  if (address.length > 500) {
    throw new Error('Keep the address to 500 characters or fewer.');
  }
  return {
    eircode: code ? code.slice(0, 3) + ' ' + code.slice(3) : '',
    address,
  };
}
