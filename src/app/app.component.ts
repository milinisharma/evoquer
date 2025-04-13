import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'évoquer';
  
  dialogRef: any = "";

  constructor (
    private router: Router,
    public dialog: MatDialog
  ) {

  }

  openUserInfoModal(userInfoModal: any, event: any) {
    this.dialogRef = this.dialog.open(userInfoModal, {
      width: "240px",
      height: "auto",
      position: {
        left: `${event.clientX - 140}px`,
        top: `${event.clientY + 40}px`,
      },
      panelClass: "lead-change-modal",
    });
  }

  logout() {
    localStorage.clear();
    this.closeDialog();
    this.router.navigate(['']);
  }

  closeDialog() {
    // this.dialog.closeAll();
  }
}
