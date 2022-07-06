import { IonIcon, IonItem } from "@ionic/react";
import { checkmarkDone } from "ionicons/icons";
import { useQuery } from "react-query";
import { useAuth } from "../auth/authContext";
import apiClient from "../../http-common";

type MessageItemParams = import("./Chats").MessageItemParams;

interface ChatProps {
    chats: MessageItemParams[];
    contact_id: number
}

export type ContactParams = {
    id: number,
    name: string,
    avatar: string
}

export type ContactsParams = Array<ContactParams>

const ChatItem: React.FC<ChatProps> = ({ chats, contact_id }) => {
    const { authInfo } = useAuth()!;
    
    // react-query to synchronize with server state
    const { isLoading, isError, data: contacts, error, refetch: getAllContacts } = useQuery("query-contacts", async () => {
        const data: ContactsParams = (await apiClient.get("/contacts")).data;
    return data
    }, {
        enabled: !!authInfo.id, // only fetch if authenticated
        retry: 3,               // retry at max 3 times, not infinte
        onSuccess: (res) => {
        const data: ContactsParams = res
            return data;
        },
    });

    //const contacts = ContactStore.useState(getContacts);
    //const { chats, contact_id } = chat;
    const { read, date, preview, received } = chats[chats.length - 1];
    if (contacts) {
        const contact = contacts.filter((c: ContactParams) => c.id === contact_id)[0];
        const notificationCount = chats.filter((chat: any) => chat.read === false).length;

        return (

            <div className="chat-row" id="chat-row">
                <img src={ contact.avatar } alt="avatar" />

                <IonItem className="chat-content-container" routerLink={ `/view-chat/${ contact.id }` } detail={ false }>

                    <div className="chat-content">
                        
                        <div className="chat-name-date">

                            <h2>{ contact.name }</h2>
                        </div>
                        <p className="ion-text-wrap">
                            { (read && received) && 
                                <IonIcon icon={ checkmarkDone } color="primary" /> 
                            }
                            { preview }
                        </p>
                    </div>

                    <div className="chat-details">

                        <p className={ `chat-date ${ (notificationCount > 0) && "chat-unread"}` }>{ date }</p>
                
                        { (notificationCount > 0) && <div className="chat-notification">{ notificationCount }</div> }
                    </div>
                </IonItem>
            </div>
        );
    } else {
        return (
            <div className="chat-row" id="chat-row">
            </div>
        )
    }
}

export default ChatItem;