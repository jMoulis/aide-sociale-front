import {
  faDesktop,
  faMobile,
  faTablet
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  breakpoint: 'desktop' | 'tablet' | 'mobile';
};
function ResponsiveIcon({ breakpoint }: Props) {
  switch (breakpoint) {
    case 'desktop':
      return <FontAwesomeIcon icon={faDesktop} />;
    case 'tablet':
      return <FontAwesomeIcon icon={faTablet} />;
    case 'mobile':
      return <FontAwesomeIcon icon={faMobile} />;
    default:
      return null;
  }
}
export default ResponsiveIcon;
