import { useEffect, useState, useRef } from 'react';
import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import Message from './Message';
import { MessagesObj } from '../../../../types';
import { AuthObj } from '../../../../types';
import ImageModal from '../../../UI/Modals/ImageModal';

const MessengerMainContent = () => {
  const [maximizedImage, setMaximizedImage] = useState<string>();
  const auth = useRouteLoaderData('root') as AuthObj;
  const messagesData = useLoaderData() as MessagesObj;
  const messagesElementRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages when a new message is sent.
  useEffect(() => {
    if (messagesElementRef.current) {
      messagesElementRef.current.scrollTop =
        messagesElementRef.current?.scrollHeight;
    }
  }, [messagesData]);

  const attachedImageClickHandler = (imageSource: string) => {
    setMaximizedImage(imageSource);
  };

  const imageModalCloseHandler = () => {
    setMaximizedImage(undefined);
  };

  let messagesContent;

  if (messagesData.messages.length !== 0) {
    messagesContent = messagesData.messages.map((elem) => {
      let message = '';

      if (elem.contentProps.type === 'text') {
        message = elem.contentProps.text;
      } else if (elem.contentProps.type === 'image') {
        message = elem.contentProps.image;
      }

      return (
        <Message
          key={elem._id}
          byLoggedInUser={elem.sender.toString() === auth.user._id}
          messageType={elem.contentProps.type}
          messageContent={message}
          timestamp="1 month ago"
          attachedImageClickHandler={attachedImageClickHandler}
        />
      );
    });
  }

  return (
    <>
      {maximizedImage && (
        <ImageModal
          closeHandler={imageModalCloseHandler}
          src={maximizedImage}
        />
      )}
      <div
        ref={messagesElementRef}
        className="p-4 flex flex-col flex-grow overflow-y-auto"
      >
        {messagesContent}
      </div>
    </>
  );
};

export default MessengerMainContent;
