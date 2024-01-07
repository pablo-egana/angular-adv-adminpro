export class User {
  constructor
  (
    public name: string,
    public email: string,
    public password?: string,
    public image?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) 
  {
    name = 'Unknown';
    email = 'Unknown';
    password = 'Unknown';
    image = 'Unknown';
    google = false,
    name = 'USER_ROLE';
    uid = 'Unknown';
  }
}