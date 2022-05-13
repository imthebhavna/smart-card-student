import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'smart-card-student';

  user: any;
  homeUrl: string = '';
  isAdmin: any;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
    ) {
    this.authenticationService.user.subscribe(u => {
      this.user = u;
      if(this.user != null) {
        this.homeUrl = userService.getRedirectUrl(this.user.role.authority);
        this.isAdmin = this.authenticationService.isAdmin;
      }
    });
    
  }

  // get isAdmin() {
  //   return this.authenticationService.isAdmin;
  // }

  get isLoggedIn() {
    // console.log("isLoggedIn: " + (this.user != null) || (this.user != undefined));
    return (this.user != null) || (this.user != undefined);
  }

  logout() {
    this.user = null;
    this.authenticationService.logout();
  }
  
}
