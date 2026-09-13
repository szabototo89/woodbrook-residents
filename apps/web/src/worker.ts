import { GoogleSheetsContentSource } from './features/content/googleSheetsContentSource';
import { createMobileContentWorker } from './features/content/mobileContentWorker';
import type { MobileContentWorkerEnvironment } from './features/content/mobileContentWorker';
import { loadContentSnapshot } from './features/content/contentSnapshot';

type Environment = MobileContentWorkerEnvironment & {
  GOOGLE_SHEETS_SPREADSHEET_ID?: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
};

const defaultSpreadsheetId = '1X9N_0s7ZN7W6IC43nVegtottBdMbfz-rRKvClccPqgo';

export default createMobileContentWorker((environment: Environment) =>
  loadContentSnapshot(
    new GoogleSheetsContentSource({
      spreadsheetId:
        environment.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() ||
        defaultSpreadsheetId,
      serviceAccountEmail:
        environment.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || '',
      serviceAccountPrivateKey:
        environment.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n') ||
        '',
    }),
  ),
);
