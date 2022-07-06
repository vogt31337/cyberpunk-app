import { IonAvatar, IonButton, IonCol, IonIcon, IonImg, IonItem, IonLabel, IonRow, IonText, IonCard } from "@ionic/react";
import { arrowRedoOutline, chatboxOutline, ellipsisHorizontal, globe, heart, thumbsUp, thumbsUpOutline, thumbsDownOutline } from "ionicons/icons";
import "./Post.css";

type PostParams = {
    id: number;
    avatar: string;
    name: string;
    message: string;
    sponsored: boolean;
    time: Date;
    views: string;
    online: boolean;
    image?: string;
}

const Post = (props: {post: PostParams}) => {

    return (
        <IonCard>
            <IonRow className="ion-no-padding ion-no-margin post">
                <IonCol size="12" className="ion-no-padding ion-no-margin">
                    <div className="post-container">
                        <IonItem lines="none" className="post-header ion-no-margin ion-no-padding" routerLink={`/profile/${props.post.name}`}>
                            <IonAvatar slot="start" className="ion-no-padding ion-no-margin">
                                <IonImg src={ props.post.avatar } />
                            </IonAvatar>

                            <IonLabel>
                                <h3>{ props.post.name }</h3>
                                <p>
                                    { props.post.sponsored ? "Sponsored" : props.post.time }
                                    &nbsp;&nbsp;
                                    <IonIcon icon={ globe } />
                                </p>
                            </IonLabel>

                            <IonIcon icon={ ellipsisHorizontal } />
                        </IonItem>

                        <IonItem lines="none" className="post-content ion-no-margin ion-no-padding">
                            <p>{ props.post.message }</p>
                        </IonItem>

                        { props.post.image && <IonImg src={ props.post.image } /> }

                        { /*props.post.sponsored && 
                            <div className="post-link ion-no-margin ion-no-padding">
                                <IonLabel>
                                    <p>ionicframework.com</p>
                                    <h3>Start building apps today!</h3>
                                </IonLabel>

                                <IonButton>
                                    Learn more
                                </IonButton>
                            </div>*/
                        }

                        {/*<div className="post-likes ion-no-margin ion-no-padding">
                            <div className="post-like-icons">
                                <IonIcon icon={ thumbsUp } />
                                <IonIcon icon={ heart } />
                            </div>

                            { props.post.sponsored && <p>{ props.post.views } Views</p> }
                        </div>*/}

                        <div className="post-actions ion-no-margin ion-no-padding ion-text-center">

                            <IonCol size="4" onClick={ () => console.log("Like") }>
                                <IonIcon icon={ thumbsUpOutline } />
                                <IonText>Like</IonText>
                            </IonCol>

                            <IonCol size="4" onClick={ () => console.log("Dislike") }>
                                <IonIcon icon={ thumbsDownOutline } />
                                <IonText>Dislike</IonText>
                            </IonCol>

                            <IonCol size="4" onClick={ () => console.log("Comment") }>
                                <IonIcon icon={ chatboxOutline } />
                                <IonText>Comment</IonText>
                            </IonCol>

                            {/*<IonCol size="4">
                                <IonIcon icon={ arrowRedoOutline } />
                                <IonText>Share</IonText>
                            </IonCol>*/}
                        </div>
                    </div>
                </IonCol>
            </IonRow>
        </IonCard>
    );
}

export default Post;