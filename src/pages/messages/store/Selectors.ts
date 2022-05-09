import { createSelector } from 'reselect';

const getState = (state: any) => state;

//  General getters
export const getContacts = createSelector(getState, state => state.contacts);
export const getChats = createSelector(getState, state => state.chats);

//  More specific getters
export const getChat = (contactId: number) => createSelector(getState, state => state.chats.filter((c: any) => c.contact_id === contactId)[0].chats);
export const getContact = (contactId: number) => createSelector(getState, state => state.contacts.filter((c: any) => c.id === contactId)[0]);

export const getChatNotificationCount = (contactId: number) => createSelector(getState, state => (state.chats.filter((c: any) => c.contact_id === contactId)[0].chats).filter((chat: any) => chat.read === false));