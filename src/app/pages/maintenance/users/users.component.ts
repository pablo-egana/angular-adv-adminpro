import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { SearchesService } from '../../../services/searches.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { User } from '../../../models/user.model';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit, OnDestroy {

  public totalUsers: number = 0;
  public users: User[] = [];
  public tempUsers: User[] = [];
  public from: number = 0;
  public loading: boolean = true;
  public subscriptionImage!: Subscription;

  constructor(private userService: UserService,
    private searchesService: SearchesService,
    private modalImageService: ModalImageService) {}

  ngOnInit(): void {
    this.showUsers();
    this.subscriptionImage = this.modalImageService.newImage
      .pipe(delay(100))
      .subscribe(image => this.showUsers());
  }

  ngOnDestroy(): void {
    this.subscriptionImage.unsubscribe();
  }

  showUsers() {
    
    this.loading = true;
    this.userService.loadUsers(this.from)
      .subscribe(({ total, users }) => {
        this.totalUsers = total;
        this.users = users;
        this.tempUsers = users;
        this.loading = false;
      });
    
  }

  changePage(value: number) {
    
    this.from += value;
    if (this.from < 0) {
      this.from = 0;
    } else if (this.from >= this.totalUsers) {
      this.from -= value;
    }
    this.showUsers();
  }

  search(term: string) {
    
    if (term.length === 0) {
      return this.users = this.tempUsers;
    }

    this.searchesService.search('users', term)
      .subscribe(results => {
        this.users = results;
      });
    
    return this.users;

  }

  deleteUser(user: User) {

    if (user.uid === this.userService.uid) {
      return Swal.fire({
        title: 'Error',
        text: 'No puede borrarse a si mismo',
        icon: 'error'
      });
    }

    return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ user.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user)
          .subscribe(() => {
            Swal.fire({
              title: 'Usuario borrado',
              text: `${ user.name } fue eliminado correctamente`,
              icon: 'success'
            });
            this.showUsers();
          });
      }
    });

  }

  changeRole(user: User) {

    this.userService.saveUser(user)
      .subscribe(() => console.log('Rol de usuario actualizado'));

  }

  openImageModal(user: User) {

    this.modalImageService.openModal('users', user.uid, user.image);

  }

}
