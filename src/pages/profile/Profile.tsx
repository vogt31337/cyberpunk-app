import { 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle, 
  IonCol, 
  IonContent, 
  IonGrid, 
  IonHeader, 
  IonIcon, 
  IonPage, 
  IonRow, 
  IonText, 
  IonToolbar,
  IonTitle,
  IonFab,
  IonFabButton,
  IonFabList
} from '@ionic/react';
import {bookmarkOutline, chatboxEllipsesOutline, imageOutline, personAddOutline, search, settingsOutline, personOutline, logOutOutline } from "ionicons/icons";

//import './Profile.css';
import styles from "./Profile.module.scss";
import { useAuth, UserProfileInterface } from "../auth/authContext";
import apiClient from "../../http-common";
import { useParams } from "react-router";
import { useQuery } from "react-query";

type ContactParams = {
  contact_id: string|any;
}

const Profile: React.FC = () => {
  const { authInfo, logOut } = useAuth()!;
  
  const params = useParams<ContactParams>();

  var contact_id = authInfo.user;
  if (params.contact_id) {
    contact_id = params.contact_id;
  }

  const { isLoading, isError, data, error } = useQuery("query-profile-" + contact_id , async () => {
    const data: UserProfileInterface = (await apiClient.get("/profile/" + contact_id)).data;
    return data
  }, 
  {
    enabled: !!authInfo.id, // only fetch if authenticated
    retry: 3,               // retry at max 3 times, not infinte
    onSuccess: (res) => {
      const data: UserProfileInterface = res
      return data;
    },
  });
  
  var profile = authInfo
  if (data) {
    profile = data;
  }

  console.log(profile);
  return (
      <IonPage className={ styles.home }>
        <IonHeader>
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>  
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
  
          <div className={ styles.topHeader }></div>
  
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" className="ion-justify-content-center ion-align-items-center ion-text-center">
                <IonCard className={ styles.profileHeader }>
  
                  <IonCardContent>
  
                    <IonRow>
                      <IonCol size="4">
                        <img src={ profile.image } alt="avatar" className={ styles.avatar } />
                      </IonCol>
  
                      <IonCol size="8">
                        <IonRow className={ styles.profileInfo }>
                          <IonCol size="12">
                            <IonText color="dark" className={ styles.profileName }>
                              <p>{ profile.user }</p>
                              {/*<p>Alan Montgomery</p>*/}
                            </IonText>
                            <IonText color="medium">
                              <p>Mobile Team Lead</p>
                            </IonText>
                          </IonCol>
                        </IonRow>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonRow className={ styles.profileStats }>
  
                          <IonCol className={ styles.profileStat }>
                            
                            <IonCardTitle>109</IonCardTitle>
                            <IonCardSubtitle>Likes</IonCardSubtitle>
                          </IonCol>
  
                          <IonCol className={ styles.profileStat }>
                            
                            <IonCardTitle>1.2k</IonCardTitle>
                            <IonCardSubtitle>Thumbs up</IonCardSubtitle>
                          </IonCol>
                        </IonRow>
                      </IonCol>
                    </IonRow>
  
                    <IonRow>
                      <IonCol size="6">
                        <IonButton fill="outline" expand="block">
                          Message
                        </IonButton>
                      </IonCol>
  
                      <IonCol size="6">
                        <IonButton color="primary" expand="block">
                          <IonIcon icon={ personAddOutline } size="small" />&nbsp;
                          Follow
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
  
            <IonRow className={ styles.profileStatusContainer }>
              <IonCol size="12">
                <IonCard className={ styles.profileCard }>
  
                  <IonCardHeader>
                    <IonRow className={ styles.profileStatus }>
                      <IonIcon icon={ chatboxEllipsesOutline } />
                      <IonCardSubtitle>Status</IonCardSubtitle>
                    </IonRow>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText>
                      <p>{ profile.status }</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
  
            <IonRow className={ styles.profileStatusContainer }>
              <IonCol size="12">
                <IonCard className={ styles.profileCard }>
  
                  <IonCardHeader>
                    <IonRow className={ styles.profileStatus }>
                      <IonIcon icon={ personOutline } />
                      <IonCardSubtitle>Me</IonCardSubtitle>
                    </IonRow>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText>
                      <p>{ profile.about_me }</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="6">
                <IonCard className={ styles.profileCard }>
                  <IonCardContent>
                    <IonIcon icon={ imageOutline } />
                    <IonCardTitle>147</IonCardTitle>
                    <IonCardSubtitle>Followers</IonCardSubtitle>
                  </IonCardContent>
                </IonCard>
              </IonCol>
  
              <IonCol size="6">
                <IonCard className={ styles.profileCard }>
                  <IonCardContent>
                    <IonIcon icon={ bookmarkOutline } />
                    <IonCardTitle>63</IonCardTitle>
                    <IonCardSubtitle>Posts</IonCardSubtitle>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
  
            {/*<IonRow className={ styles.profileActionContainer }>
              <IonCol size="12">
                <IonCard className={ styles.profileActionCard }>
                  <IonCardContent>
                    <IonRow className="ion-justify-content-between">
                      <IonCardSubtitle>View latest project</IonCardSubtitle>
                      <IonIcon icon={ arrowForward } />
                    </IonRow>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>*/}
          </IonGrid>
          
         <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={settingsOutline} />
          </IonFabButton>
          <IonFabList side="start">
          <IonFabButton>
              <IonIcon icon={logOutOutline} onClick={() => logOut()}/>
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={search}/>
            </IonFabButton>
            <IonFabButton routerLink={ `/profile` }>
              <IonIcon icon={personOutline}/>
            </IonFabButton>
          </IonFabList>
        </IonFab>

        </IonContent>
      </IonPage>
    );
};

export default Profile;
