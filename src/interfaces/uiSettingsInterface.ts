export interface SettingOut {
    url?: string; // unique setting code
    redirectUrl?: string,
    }
  
  export interface SettingIn {
    _id: string,
    url: string,
    redirectUrl: string,
    createdAt: string,
    updatedAt: string,
    __v: 0
  }
  