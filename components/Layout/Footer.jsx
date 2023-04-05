import { Fragment } from 'react';
import { Typography } from 'antd/lib';
import { ServiceStatusInfo } from '@autonolas/frontend-library';

const { Text } = Typography;

const LIST = [
  {
    text: 'Service Code',
    redirectTo: 'https://github.com/valory-xyz/governatooorr',
    isInternal: false,
  },
  {
    text: 'Service on Protocol',
    redirectTo: 'https://protocol.autonolas.network/services/5',
    isInternal: false,
  },
];

const getList = () => LIST.map(({ text, redirectTo, isInternal = true }, index) => (
  <Fragment key={`link-${redirectTo}`}>
    <Text type="secondary">
      {redirectTo ? (
        <a
          href={redirectTo}
          target={isInternal ? '_self' : '_blank'}
          rel="noreferrer"
        >
          {text}
        </a>
      ) : (
        <>{`${text} (link coming soon)`}</>
      )}

      {index !== (LIST || []).length - 1 && <>&nbsp;&nbsp;•&nbsp;&nbsp;</>}
    </Text>
  </Fragment>
));

const ExtraComponent = () => (
  <div>
    <Text className="row-1">CODE</Text>
    <div className="status-sub-content">{getList(LIST)}</div>
  </div>
);

const Footer = () => (
  <ServiceStatusInfo extra={<ExtraComponent />} extraMd={<ExtraComponent />} />
);

export default Footer;
