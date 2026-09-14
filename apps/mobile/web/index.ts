import '@lynx-js/web-core/client';

import { mountMobileWebRenderer } from './mountMobileWebRenderer.js';
import './styles.css';

mountMobileWebRenderer(document, '/lynx/woodbrook.web.bundle');
