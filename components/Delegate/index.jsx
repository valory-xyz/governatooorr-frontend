import ClientOnly from 'components/ClientOnly';
import DelegateBody from './DelegateBody';

function Delegate() {
  return (
    <div>
      <ClientOnly>
        <DelegateBody />
      </ClientOnly>
    </div>
  );
}

export default Delegate;
