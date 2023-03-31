import PropTypes from 'prop-types';
import ClientOnly from 'components/ClientOnly';
import DelegateBody from './DelegateBody';

function Delegate({ delegateeAddress }) {
  return (
    <div>
      <ClientOnly>
        <DelegateBody delegateeAddress={delegateeAddress} />
      </ClientOnly>
    </div>
  );
}

Delegate.propTypes = {
  delegateeAddress: PropTypes.string.isRequired,
};

export default Delegate;
