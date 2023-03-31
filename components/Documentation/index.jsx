/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Card } from 'antd/lib';
import { get } from 'lodash';
import Overview from './content/1_Overview';
import { DOC_NAV } from './helpers';
import { Container, DocSection } from './styles';

const { useBreakpoint } = Grid;

const Documentation = () => {
  const [activeNav, setActiveNav] = useState(null);
  const router = useRouter();
  const screens = useBreakpoint();
  const isMobile = !!screens.xs;
  const anchorCommonProps = {
    affix: false,
    offsetTop: isMobile ? 20 : 60,
  };

  useEffect(() => {
    const { asPath } = router;
    const afterHash = asPath.split('#')[1];
    setActiveNav(afterHash || get(DOC_NAV, `[${0}].id`) || '');
  }, []);

  return (
    <Card className="content-card">
      <Container>
        <DocSection isMobile={isMobile}>
          <div className="reading-section">
            <Overview />
          </div>
        </DocSection>
        <br />
        <br />
        <br />
      </Container>
    </Card>
  );
};

export default Documentation;
