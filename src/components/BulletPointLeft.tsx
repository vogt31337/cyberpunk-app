import { IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonRow } from "@ionic/react";

import "./BulletPoint.css";

type OfferParams = {
    id: string;
    image?: string;
    title?: string;
    description?: string;
    date?: string;
}

const BulletPointLeft = (props: {offer: OfferParams}) => {

    return (

        <IonRow>
            <IonCol size="12" className="animate__animated animate__fadeIn">
                <IonCard className="bulletCard bulletCardLong">
                    
                    <IonRow>
                        <IonCol size="2" className="bulletCardImgCol">
                            <img src={ props.offer.image } alt="offer" />
                        </IonCol>

                        <IonCol size="10">
                            <div className="bulletCardLongDetails">
                                <IonCardTitle>{ props.offer.title }</IonCardTitle>
                                <p>{ props.offer.description }</p>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonCard>
            </IonCol>
        </IonRow>
    );
}

export default BulletPointLeft;