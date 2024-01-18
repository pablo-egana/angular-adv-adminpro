import { Hospital } from "./hospital.model";

interface DoctorUser {
  id: string;
  name: string;
  image: string;
}

export class Doctor {
  
  constructor(
    public name: string,
    public _id?: string,
    public image?: string,
    public user?: DoctorUser,
    public hospital?: Hospital
  ) {}

}
