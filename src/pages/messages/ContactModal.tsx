import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/react";
import { useQuery } from "react-query";
import { useAuth } from "../auth/authContext";
import apiClient from "../../http-common";
import { ContactsParams, ContactParams } from "./ChatItem";

import "./ContactModal.scss";

const ContactModal: React.FC<any> = ({ close: any }) => {
    const { authInfo } = useAuth()!;

    //const contacts = ContactStore.useState(getContacts);
    const { data: contacts, refetch: getAllContacts } = useQuery("query-contacts", async () => {
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

    return (
        <div style={{ height: "100%" }}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>New Chat</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill="clear" onClick={ () => {console.log("close")} }>Cancel</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList>
                    { contacts && contacts.map((contact: ContactParams) => {

                        return (

                            <IonItem key={ `contact_${ contact.id }` } lines="full" className="contact-item">
                                <img src={ contact.avatar } alt="contact avatar" />
                                <IonLabel>
                                    <h1>{ contact.name }</h1>
                                    <p>Available</p>
                                </IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>
            </IonContent>
        </div>
    );
}

export default ContactModal;