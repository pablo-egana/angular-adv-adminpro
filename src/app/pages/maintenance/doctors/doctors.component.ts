import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { SearchesService } from '../../../services/searches.service';
import { Doctor } from '../../../models/doctor.model';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public doctors: Doctor[] = [];
  public tempDoctors: Doctor[] = [];
  private imageSubscription!: Subscription;

  constructor(private doctorService: DoctorService,
    private modalImageService: ModalImageService,
    private searchesService: SearchesService) {}

  ngOnInit(): void {
    
    this.loadDoctors();

    this.imageSubscription = this.modalImageService.newImage
      .pipe(delay(100))
      .subscribe(image => this.loadDoctors());

  }

  ngOnDestroy(): void {
    this.imageSubscription.unsubscribe();
  }

  loadDoctors() {

    this.doctorService.loadDoctors()
      .subscribe(doctors => {

        this.doctors = doctors;
        this.tempDoctors = doctors;
        this.loading = false;

      });

  }

  search(term: string) {
    
    if (term.length === 0) {
      return this.doctors = this.tempDoctors;
    }

    this.searchesService.search('doctors', term)
      .subscribe((results: any[]) => {
        this.doctors = results;
      });
    
    return this.doctors;

  }

  openImageModal(doctor: Doctor) {

    this.modalImageService.openModal('doctors', doctor._id, doctor.image);

  }

  deleteDoctor(doctor: Doctor) {

    return Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ doctor.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor(doctor._id!)
          .subscribe(() => {
            Swal.fire({
              title: 'Médico borrado',
              text: `${ doctor.name } fue eliminado correctamente`,
              icon: 'success'
            });
            this.loadDoctors();
          });
      }
    });

  }

}
