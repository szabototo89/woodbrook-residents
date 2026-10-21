import { createRoot } from 'react-dom/client';
import { HandoffViewer } from './features/handoffs/HandoffViewer';
import './features/handoffs/handoffs.css';

createRoot(document.getElementById('root')!).render(<HandoffViewer />);
