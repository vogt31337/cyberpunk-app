import { MessageItemParams } from "../pages/messages/Chats";

const Quote: React.FC<ChatRepliedQuoteProps> = ({ 
    message: message,
    contact: contact, 
    message: repliedMessage 
}) => (
    <div className="in-chat-reply-to-container">
        <h1>{ contact.name }</h1>
        <p>{ repliedMessage.preview }</p>
    </div>
)

interface ChatRepliedQuoteProps {
    //Message: {id: string, date: Date, sent: boolean, starred: boolean, reply: boolean},
    message: MessageItemParams,
    contact: {name: string},
    repliedMessage: MessageItemParams,
}

const ChatRepliedQuote: React.FC<ChatRepliedQuoteProps> = ({ message: message, contact: contact, repliedMessage }) => {
    
    if (message.received && repliedMessage) {
        return <Quote message={ message } contact={ contact } repliedMessage={ repliedMessage } />;
    } else {
        return null;
    }
}

export default ChatRepliedQuote;