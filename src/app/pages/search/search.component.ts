import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchesService } from '../../services/searches.service';
import { Doctor } from '../../models/doctor.model';
import { Hospital } from '../../models/hospital.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  public doctors: Doctor[] = [];
  public hospitals: Hospital[] = [];
  public users: User[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private searchesService: SearchesService) {}

  ngOnInit(): void {
    
    this.activatedRoute.params
      .subscribe(({ termino }) => this.globalSearch(termino));

  }

  globalSearch(term: string) {

    this.searchesService.globalSearch(term)
      .subscribe((resp: any) => {
        console.log(resp);
        this.doctors = resp.doctors;
        this.hospitals = resp.hospitals;
        this.users = resp.users;
      });

  }
  
}
