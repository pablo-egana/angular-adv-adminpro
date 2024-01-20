import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public user!: User;

  constructor(private userService: UserService,
    private router: Router) {
    this.user = userService.user;
  }
  
  logout() {
    this.userService.logoutUser();
  }

  showSearch(term: string) {

    if (term.length === 0) {
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${ term }`);

  }

}
