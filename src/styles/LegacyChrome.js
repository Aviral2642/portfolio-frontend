import {Outlet} from 'react-router-dom';
import GlobalStyles from './GlobalStyles';

// Base styles for the archive and the earlier designer pages.
export default function LegacyChrome() {
  return <><GlobalStyles/><Outlet/></>;
}
