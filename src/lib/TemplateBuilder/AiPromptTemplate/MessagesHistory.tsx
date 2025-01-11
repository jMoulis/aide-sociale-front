import { useEffect, useState } from 'react';
import { IAiMessage } from './interfaces';
import { isValidJSON } from '@/lib/utils/utils';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import Avatar from '@/components/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

const Message = ({ children }: { children?: string }) => {
  return <span className='text-sm'>{children}</span>;
};
type Props = {
  messages: IAiMessage[];
};
const MessagesHistory = ({ messages }: Props) => {
  const [splicedMessages, setSplicedMessages] = useState<IAiMessage[]>([]);
  const user = useMongoUser();

  useEffect(() => {
    // remove the first element because it is the system message
    setSplicedMessages(messages.slice(1));
  }, [messages]);

  const renderMessage = (message: IAiMessage) => {
    if (message.role === 'user') {
      return (
        <>
          <Avatar src={user?.imageUrl} alt='' />
          <Message>{message.content}</Message>
        </>
      );
    }
    if (isValidJSON(message.content)) {
      const response = JSON.parse(message.content);
      return (
        <>
          <FontAwesomeIcon icon={faRobot} />
          <Message>{response.summaryAiAction}</Message>
        </>
      );
    }
    return (
      <>
        <FontAwesomeIcon icon={faRobot} />
        <Message></Message>
      </>
    );
  };

  return (
    <div className='max-h-[55vh] pb-2 overflow-auto'>
      {splicedMessages.map((message, index) => (
        <div
          className='p-1 grid grid-cols-[20px,1fr] gap-1 items-start'
          key={index}>
          {renderMessage(message)}
        </div>
      ))}
    </div>
  );
};
export default MessagesHistory;
