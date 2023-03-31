import { render } from '@testing-library/react';
import Documentation from 'components/Documentation';

import { wrapProvider } from '../helpers';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter() {
    return { asPath: '' };
  },
}));

describe('<Documentation/>', () => {
  it('renders documentation title', () => {
    expect.hasAssertions();
    const { getByText } = render(wrapProvider(<Documentation />));
    expect(getByText('Docs')).toBeInTheDocument();
  });
});
