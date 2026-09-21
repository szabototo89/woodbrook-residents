import { useState } from 'react';

import { listTreatments } from '../treatments/treatmentCatalog';
import { TreatmentPicker } from './TreatmentPicker';

import './booking.css';

function TreatmentPickerPreview() {
  const [value, setValue] = useState('swedish-massage');
  return (
    <TreatmentPicker
      treatments={listTreatments()}
      value={value}
      onChange={setValue}
    />
  );
}

export default <TreatmentPickerPreview />;
