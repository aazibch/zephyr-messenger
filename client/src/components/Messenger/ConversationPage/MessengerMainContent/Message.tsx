import ProfilePhoto from '../../../UI/ProfilePhoto';

interface MessageProps {
  byLoggedInUser?: boolean;
  profileImage?: string;
  message: string;
  timestamp: string;
}

const Message = ({
  byLoggedInUser,
  profileImage,
  message,
  timestamp
}: MessageProps) => {
  let containerClassNames = 'mb-4';
  let messageClassNames = 'bg-gray-200 rounded-lg p-3 max-w-md';
  let contentClassNames = 'flex items-center mb-1';
  let metaClassNames = 'text-xs text-gray-600 block';

  if (byLoggedInUser) {
    containerClassNames = 'flex flex-col mb-4 items-end';
    messageClassNames = 'bg-[#508778] text-white rounded-lg p-3 max-w-md';
  }

  return (
    <div className={containerClassNames}>
      <div className={contentClassNames}>
        {!byLoggedInUser && profileImage && (
          <ProfilePhoto className="mr-2" src={profileImage} />
        )}
        <div className={messageClassNames}>{message}</div>
      </div>
      <span className={metaClassNames}>{timestamp}</span>
    </div>
  );
};

export default Message;