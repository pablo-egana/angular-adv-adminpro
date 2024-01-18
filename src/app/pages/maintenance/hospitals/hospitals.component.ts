import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { SearchesService } from '../../../services/searches.service';
import { Hospital } from '../../../models/hospital.model';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html'
})
export class HospitalsComponent implements OnInit, OnDestroy {

  public hospitals: Hospital[] = [];
  public tempHospitals: Hospital[] = [];
  public loading: boolean = true;
  private imageSubscription!: Subscription;

  constructor(private hospitalService: HospitalService,
    private modalImageService: ModalImageService,
    private searchesService: SearchesService) {}

  ngOnInit(): void {
    
    this.loadHospitals();

    this.imageSubscription = this.modalImageService.newImage
      .pipe(delay(100))
      .subscribe(image => this.loadHospitals());

  }

  ngOnDestroy(): void {
    this.imageSubscription.unsubscribe();
  }

  search(term: string) {
    
    if (term.length === 0) {
      return this.hospitals = this.tempHospitals;
    }

    this.searchesService.search('hospitals', term)
      .subscribe((results: any[]) => {
        this.hospitals = results;
      });
    
    return this.hospitals;

  }

  loadHospitals(): void {

    this.loading = true;
    this.hospitalService.loadHospitals()
      .subscribe(hospitals => {
        this.hospitals = hospitals;
        this.tempHospitals = hospitals;
        this.loading = false;
      });

  }

  updateHospital(hospital: Hospital): void {

    this.hospitalService.updateHospital(hospital._id!, hospital.name)
      .subscribe(resp => {
        this.loadHospitals();
        Swal.fire('Actualizado', hospital.name, 'success');
      });

  }

  deleteHospital(hospital: Hospital): void {
    
    this.hospitalService.deleteHospital(hospital._id!)
      .subscribe(resp => {
        
        this.loadHospitals();
        Swal.fire('Borrado', hospital.name, 'success');

      });

  }

  async openModal() {

    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });
    
    if (value.trim().length > 0) {
      this.hospitalService.createHospital(value)
        .subscribe((resp: any) => {
          this.hospitals.push(resp.hospital);
        });
    }

  }

  openImageModal(hospital: Hospital) {

    this.modalImageService.openModal('hospitals', hospital._id, hospital.image);

  }

}
