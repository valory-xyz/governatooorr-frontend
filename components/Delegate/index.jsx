import ClientOnly from 'components/ClientOnly';
import TokenAddress from './TokenAddress';

function Delegate() {
  return (
    <div>
      <ClientOnly>
        <TokenAddress />
      </ClientOnly>
    </div>
  );
}

export default Delegate;
