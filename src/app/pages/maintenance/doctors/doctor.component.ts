import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { DoctorService } from '../../../services/doctor.service';
import { Hospital } from '../../../models/hospital.model';
import { Doctor } from '../../../models/doctor.model';
import { delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html'
})
export class DoctorComponent implements OnInit {

  public doctorForm!: FormGroup;
  public hospitals: Hospital[] = [];
  public selectedDoctor: Doctor | undefined;
  public selectedHospital: Hospital | undefined;

  constructor(private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private doctorService: DoctorService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => this.loadDoctor(id));
    this.loadHospitals();
    this.createDoctorForm();

  }

  createDoctorForm() {

    this.doctorForm = this.formBuilder.group({
      name: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.doctorForm.get('hospital')?.valueChanges
      .subscribe((hospitalId) => {
        this.selectedHospital = this.hospitals.find(hosp => hosp._id === hospitalId);
      });

  }

  loadDoctor(id: string) {

    if (id === 'nuevo') {
      return;
    }

    this.doctorService.loadDoctorById(id).pipe(delay(100))
    .subscribe({
      next: (doctor) => {
        this.selectedDoctor = doctor;
        this.doctorForm.setValue({ name: doctor.name, hospital: doctor.hospital?._id });
      },
      error: (error) => {
        return this.router.navigateByUrl('/dashboard/medicos');
      }
    });

  }

  loadHospitals() {

    this.hospitalService.loadHospitals()
      .subscribe((hospitals: Hospital[]) => {
        this.hospitals = hospitals;
      });

  }

  saveDoctor() {

    const { name } = this.doctorForm.value;
    if (this.selectedDoctor) {
      // Actualizar medico
      const data = {
        ...this.doctorForm.value,
        _id: this.selectedDoctor._id
      }
      this.doctorService.updateDoctor(data)
        .subscribe(resp => {
          Swal.fire('Actualizado', `${ name } actualizado correctamente`, 'success');
        });
    } else {
      // Crear medico
      this.doctorService.createDoctor(this.doctorForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${ name } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${ resp.doctor._id }`);
        });
    }

  }

}
