import { createContext, useContext, useState, useEffect, type ReactNode, useRef, useCallback } from 'react';
import { dbListAccounts, dbGetAccount, dbCreateAccount, dbUpdateAccount, dbDeleteAccount, dbLoad, dbSave, dbLoadProgress, dbSaveProgress } from '../lib/db';

export type UserRole = string;
export interface User { id: string; email: string; name: string; picture: string; gameNickname?: string; role: UserRole; }
export interface GuideArticle { id: string; title: string; category: string; difficulty: string; readTime: string; summary: string; content: string; authorName: string; updatedAt: string; icon: string; }
export interface UserProgress { completedGuides: string[]; favoriteWeapons: string[]; favoriteSects: string[]; visitedRegions: string[]; notes: { id: string; title: string; content: string; date: string }[]; selectedBuild: string | null; }
export interface RegisteredUser { id: string; email: string; name: string; picture: string; gameNickname?: string; role: UserRole; joinedAt: string; lastSeen: string; isBanned: boolean; }
export interface RoleConfig { id: UserRole; displayName: string; color: string; permissions: string[]; }
export interface ChatMessage { id: string; userId: string; userName: string; userRole: string; text: string; timestamp: number; deleted?: boolean; }
export interface ChatState { messages: ChatMessage[]; mutedUsers: { userId: string; until: number }[]; }
export interface SiteSettings { siteName: string; siteDescription: string; discordUrl: string; maintenanceMode: boolean; announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[]; roles: RoleConfig[]; sections: {id:string;title:string;maintenance:boolean;message:string}[]; }
export interface WikiArticle { id: string; section: string; title: string; content: string; icon: string; authorName: string; updatedAt: string; fields: Record<string, string>; }
export interface SupportTicket { id: string; userId: string; userName: string; subject: string; message: string; status: 'open'|'answered'|'closed'; createdAt: string; replies: {id:string;authorName:string;authorRole:string;message:string;createdAt:string}[]; }
export interface PrivateMessage { id: string; fromId: string; fromName: string; toId: string; toName: string; text: string; timestamp: number; read: boolean; }

interface Ctx {
  user: User|null; progress: UserProgress; guides: GuideArticle[]; registeredUsers: RegisteredUser[]; siteSettings: SiteSettings; isLoading: boolean; isSyncing: boolean;
  wikiArticles: WikiArticle[]; supportTickets: SupportTicket[]; chatState: ChatState; privateMessages: PrivateMessage[]; unreadPMCount: number;
  loginWithPassword:(u:string,p:string,r:boolean)=>Promise<string|null>; register:(u:string,p:string,g?:string)=>Promise<string|null>; logout:()=>void;
  updateProgress:(u:Partial<UserProgress>)=>void; toggleFavoriteWeapon:(id:string)=>void; toggleFavoriteSect:(id:string)=>void; toggleCompletedGuide:(id:string)=>void;
  addNote:(t:string,c:string)=>void; deleteNote:(id:string)=>void; setSelectedBuild:(id:string|null)=>void;
  updateUserPicture:(p:string)=>void; updateUserGameNickname:(n:string)=>void;
  addGuide:(g:any)=>void; updateGuide:(id:string,u:any)=>void; deleteGuide:(id:string)=>void;
  isAdmin:()=>boolean; isEditor:()=>boolean; adminSetUserRole:(id:string,r:string)=>void; adminBanUser:(id:string,b:boolean)=>void; adminDeleteUser:(id:string)=>void;
  updateSiteSettings:(u:any)=>void; addAnnouncement:(t:string,ty:any)=>void; removeAnnouncement:(id:string)=>void;
  getRoleConfig:(r:string)=>RoleConfig; hasPermission:(p:string)=>boolean;
  updateRoleDisplayName:(id:string,n:string)=>void; updateRoleColor:(id:string,c:string)=>void; addRole:(n:string,c:string,p:string[])=>void; deleteRole:(id:string)=>void; updateRolePermissions:(id:string,p:string[])=>void;
  addWikiArticle:(a:any)=>void; updateWikiArticle:(id:string,u:any)=>void; deleteWikiArticle:(id:string)=>void;
  createTicket:(s:string,m:string)=>void; replyToTicket:(id:string,m:string)=>void; closeTicket:(id:string)=>void; deleteTicket:(id:string)=>void;
  sendMessage:(t:string)=>void; deleteMessage:(id:string)=>void;
  muteUser:(id:string,m:number)=>void; unmuteUser:(id:string)=>void; isUserMuted:(id:string)=>boolean; chatBanUser:(id:string)=>void;
  sendPrivateMessage:(toId:string,toName:string,text:string)=>void; markPMRead:(id:string)=>void;
  isUserOnline:(id:string)=>boolean;
}

const defP: UserProgress = { completedGuides:[],favoriteWeapons:[],favoriteSects:[],visitedRegions:[],notes:[],selectedBuild:null };
const defS: SiteSettings = {
  siteName:'WWM Wiki — Nocthra',siteDescription:'База знаний',discordUrl:'https://discord.gg/nocthra',maintenanceMode:false,announcements:[],
  roles:[
    {id:'user',displayName:'Странник',color:'#b0a696',permissions:['read','profile','favorites','chat.write']},
    {id:'admin',displayName:'Администратор',color:'#a882ff',permissions:['read','profile','favorites','chat.write','chat.delete','chat.mute','chat.ban','guides.create','guides.edit','guides.delete','guild.edit','users.manage','users.ban','users.roles','site.settings','site.announcements','admin.panel']},
  ],
  sections:[{id:'guides',title:'Гайды',maintenance:false,message:'...'},{id:'weapons',title:'Оружие',maintenance:false,message:'...'}],
};

const AuthContext = createContext<Ctx|null>(null);

// Helper: read user from localStorage
function savedUser(): User|null {
  try { const s = localStorage.getItem('wwm_user')||sessionStorage.getItem('wwm_user'); return s ? JSON.parse(s) : null; } catch { return null; }
}

export function AuthProvider({children}:{children:ReactNode}) {
  const [user,setUser] = useState<User|null>(savedUser);
  const [progress,setProgress] = useState<UserProgress>(defP);
  const [guides,setGuides] = useState<GuideArticle[]>([]);
  const [registeredUsers,setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [siteSettings,setSiteSettings] = useState<SiteSettings>(defS);
  const [chatState,setChatState] = useState<ChatState>({messages:[],mutedUsers:[]});
  const [wikiArticles,setWikiArticles] = useState<WikiArticle[]>([]);
  const [supportTickets,setSupportTickets] = useState<SupportTicket[]>([]);
  const [privateMessages,setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [isLoading,setIsLoading] = useState(true);
  const [isSyncing,setIsSyncing] = useState(false);
  const writing = useRef(false); // flag to pause poll during writes

  const userRef = useRef(user);
  useEffect(()=>{ userRef.current=user; },[user]);

  // Write to Supabase, then update local state
  const save = useCallback(async (key:string, data:any, setter:(v:any)=>void) => {
    writing.current = true;
    setIsSyncing(true);
    try {
      await dbSave(key, data);   // write FIRST
      setter(data);              // then update UI
    } finally {
      setIsSyncing(false);
      setTimeout(()=>{ writing.current=false; }, 2000); // pause poll for 2s
    }
  },[]);

  // INIT: load everything from Supabase once
  useEffect(()=>{
    (async()=>{
      const [accs,g,s,c,w,t,pm] = await Promise.all([
        dbListAccounts(), dbLoad('guides',[]), dbLoad('site_settings',null),
        dbLoad('chat',{messages:[],mutedUsers:[]}), dbLoad('wiki',[]),
        dbLoad('support',[]), dbLoad('pm',[]),
      ]);
      if (userRef.current) {
        const p = await dbLoadProgress(userRef.current.id);
        if (p) setProgress(p);
      }
      const toUser = (a:any): RegisteredUser => ({id:a.id,email:'',name:a.username,picture:a.picture||'',gameNickname:a.game_nickname||'',role:a.role,joinedAt:a.created_at,lastSeen:'—',isBanned:false});
      setRegisteredUsers(accs.map(toUser));
      if (g) setGuides(g); if (s) setSiteSettings(s);
      setChatState(c); setWikiArticles(w||[]); setSupportTickets(t||[]); setPrivateMessages(pm||[]);
      setIsLoading(false);
    })();
  },[]);

  // POLL: read from Supabase every 3s, but SKIP if we are currently writing
  useEffect(()=>{
    const interval = setInterval(async()=>{
      if (writing.current) return; // skip this tick
      try {
        const [c,t,pm,g,s,w,accs] = await Promise.all([
          dbLoad('chat',chatState), dbLoad('support',supportTickets),
          dbLoad('pm',privateMessages), dbLoad('guides',guides),
          dbLoad('site_settings',siteSettings), dbLoad('wiki',wikiArticles),
          dbListAccounts(),
        ]);
        if (writing.current) return; // double-check
        setChatState(c); setSupportTickets(t); setPrivateMessages(pm);
        setGuides(g); setSiteSettings(s); setWikiArticles(w);
        const toUser = (a:any): RegisteredUser => ({id:a.id,email:'',name:a.username,picture:a.picture||'',gameNickname:a.game_nickname||'',role:a.role,joinedAt:a.created_at,lastSeen:'—',isBanned:false});
        setRegisteredUsers(accs.map(toUser));
      } catch {}
    }, 3000);
    return ()=>clearInterval(interval);
  },[]);

  // HELPERS
  const isAdmin = useCallback(()=>user?.role==='admin',[user]);
  const isEditor = useCallback(()=>user?.role==='admin'||user?.role==='editor',[user]);
  const getRoleConfig = useCallback((r:string)=>siteSettings.roles.find(x=>x.id===r)||siteSettings.roles[0],[siteSettings.roles]);
  const hasPermission = useCallback((p:string)=>getRoleConfig(user?.role||'user').permissions.includes(p),[user,getRoleConfig]);

  const updateProgress = useCallback((u:any)=>{
    setProgress(prev=>{ const n={...prev,...u}; if(userRef.current) dbSaveProgress(userRef.current.id,n); return n; });
  },[]);

  const value: Ctx = {
    user,progress,guides,registeredUsers,siteSettings,isLoading,isSyncing,wikiArticles,supportTickets,chatState,privateMessages,
    unreadPMCount: privateMessages.filter(x=>x.toId===user?.id&&!x.read).length,

    // Auth
    loginWithPassword: async(u,p,remember)=>{
      const acc=await dbGetAccount(u); if(!acc||acc.password_hash!==p) return 'Ошибка';
      const ud:User={id:acc.id,email:'',name:acc.username,picture:acc.picture||'',gameNickname:acc.game_nickname||'',role:acc.role};
      setUser(ud);
      (remember?localStorage:sessionStorage).setItem('wwm_user',JSON.stringify(ud));
      const pr=await dbLoadProgress(acc.id); if(pr) setProgress(pr);
      return null;
    },
    register: async(u,p,gn='')=>{
      try{const r=await dbCreateAccount(u,p,gn); const ud:User={id:r.id,email:'',name:r.username,picture:'',gameNickname:r.game_nickname||'',role:'user'}; setUser(ud); localStorage.setItem('wwm_user',JSON.stringify(ud)); return null;}
      catch(e:any){return e.message;}
    },
    logout:()=>{ setUser(null); setProgress(defP); localStorage.removeItem('wwm_user'); sessionStorage.removeItem('wwm_user'); },

    // Progress
    updateProgress,
    toggleFavoriteWeapon:(id)=>updateProgress({favoriteWeapons:progress.favoriteWeapons.includes(id)?progress.favoriteWeapons.filter(x=>x!==id):[...progress.favoriteWeapons,id]}),
    toggleFavoriteSect:(id)=>updateProgress({favoriteSects:progress.favoriteSects.includes(id)?progress.favoriteSects.filter(x=>x!==id):[...progress.favoriteSects,id]}),
    toggleCompletedGuide:(id)=>updateProgress({completedGuides:progress.completedGuides.includes(id)?progress.completedGuides.filter(x=>x!==id):[...progress.completedGuides,id]}),
    addNote:(t,c)=>updateProgress({notes:[{id:'n'+Date.now(),title:t,content:c,date:new Date().toLocaleDateString()},...progress.notes]}),
    deleteNote:(id)=>updateProgress({notes:progress.notes.filter(x=>x.id!==id)}),
    setSelectedBuild:(id)=>updateProgress({selectedBuild:id}),
    updateUserPicture:(p)=>{if(user){setUser({...user,picture:p});dbUpdateAccount(user.id,{picture:p});}},
    updateUserGameNickname:(n)=>{if(user){setUser({...user,gameNickname:n});dbUpdateAccount(user.id,{game_nickname:n});}},

    // Guides
    addGuide:(g)=>save('guides',[{...g,id:'g'+Date.now(),authorName:user?.name,updatedAt:new Date().toISOString()},...guides],setGuides),
    updateGuide:(id,u)=>save('guides',guides.map(x=>x.id===id?{...x,...u,updatedAt:new Date().toISOString()}:x),setGuides),
    deleteGuide:(id)=>save('guides',guides.filter(x=>x.id!==id),setGuides),

    // Admin
    isAdmin,isEditor,getRoleConfig,hasPermission,
    adminSetUserRole:(id,r)=>dbUpdateAccount(id,{role:r}),
    adminBanUser:()=>{},
    adminDeleteUser:(id)=>dbDeleteAccount(id),
    isUserOnline:()=>true,

    // Settings
    updateSiteSettings:(u)=>save('site_settings',{...siteSettings,...u},setSiteSettings),
    addAnnouncement:(text,type)=>save('site_settings',{...siteSettings,announcements:[{id:'a'+Date.now(),text,type,active:true},...siteSettings.announcements]},setSiteSettings),
    removeAnnouncement:(id)=>save('site_settings',{...siteSettings,announcements:siteSettings.announcements.filter(x=>x.id!==id)},setSiteSettings),
    updateRoleDisplayName:(id,n)=>save('site_settings',{...siteSettings,roles:siteSettings.roles.map(r=>r.id===id?{...r,displayName:n}:r)},setSiteSettings),
    updateRoleColor:(id,c)=>save('site_settings',{...siteSettings,roles:siteSettings.roles.map(r=>r.id===id?{...r,color:c}:r)},setSiteSettings),
    addRole:(n,c,p)=>save('site_settings',{...siteSettings,roles:[...siteSettings.roles,{id:'r'+Date.now(),displayName:n,color:c,permissions:p}]},setSiteSettings),
    deleteRole:(id)=>save('site_settings',{...siteSettings,roles:siteSettings.roles.filter(r=>r.id!==id)},setSiteSettings),
    updateRolePermissions:(id,p)=>save('site_settings',{...siteSettings,roles:siteSettings.roles.map(r=>r.id===id?{...r,permissions:p}:r)},setSiteSettings),

    // Wiki
    addWikiArticle:(a)=>save('wiki',[{...a,id:'w'+Date.now(),authorName:user?.name,updatedAt:new Date().toISOString()},...wikiArticles],setWikiArticles),
    updateWikiArticle:(id,u)=>save('wiki',wikiArticles.map(x=>x.id===id?{...x,...u,updatedAt:new Date().toISOString()}:x),setWikiArticles),
    deleteWikiArticle:(id)=>save('wiki',wikiArticles.filter(x=>x.id!==id),setWikiArticles),

    // Support
    createTicket:(subject,message)=>{if(!user)return; save('support',[...supportTickets,{id:'t'+Date.now(),userId:user.id,userName:user.name,subject,message,status:'open',createdAt:new Date().toISOString(),replies:[]}],setSupportTickets);},
    replyToTicket:(id,m)=>save('support',supportTickets.map(x=>x.id===id?{...x,status:'answered',replies:[...x.replies,{id:'r'+Date.now(),authorName:user?.name||'',authorRole:'',message:m,createdAt:new Date().toISOString()}]}:x),setSupportTickets),
    closeTicket:(id)=>save('support',supportTickets.map(x=>x.id===id?{...x,status:'closed'}:x),setSupportTickets),
    deleteTicket:(id)=>save('support',supportTickets.filter(x=>x.id!==id),setSupportTickets),

    // Chat
    sendMessage:(text)=>{if(!user)return; save('chat',{...chatState,messages:[...chatState.messages,{id:'m'+Date.now(),userId:user.id,userName:user.name,userRole:user.role,text,timestamp:Date.now()}]},setChatState);},
    deleteMessage:(id)=>save('chat',{...chatState,messages:chatState.messages.map(x=>x.id===id?{...x,deleted:true}:x)},setChatState),
    muteUser:(id,m)=>save('chat',{...chatState,mutedUsers:[...chatState.mutedUsers.filter(x=>x.userId!==id),{userId:id,until:Date.now()+m*60000}]},setChatState),
    unmuteUser:(id)=>save('chat',{...chatState,mutedUsers:chatState.mutedUsers.filter(x=>x.userId!==id)},setChatState),
    isUserMuted:(id)=>{const e=chatState.mutedUsers.find(m=>m.userId===id);return e?Date.now()<=e.until:false;},
    chatBanUser:()=>{},

    // PM
    sendPrivateMessage:(toId,toName,text)=>{if(!user)return; save('pm',[...privateMessages,{id:'p'+Date.now(),fromId:user.id,fromName:user.name,toId,toName,text,timestamp:Date.now(),read:false}],setPrivateMessages);},
    markPMRead:(id)=>save('pm',privateMessages.map(x=>x.fromId===id&&x.toId===user?.id?{...x,read:true}:x),setPrivateMessages),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){const c=useContext(AuthContext);if(!c)throw new Error('useAuth');return c;}
