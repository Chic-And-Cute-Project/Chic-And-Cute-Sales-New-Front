import {Component, OnInit} from '@angular/core';
import {AttendanceDto} from "../../models/attendance.dto";
import {AttendanceService} from "../../services/attendance/attendance.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorMessage} from "../../../shared/models/error-message";
import {ErrorSnackBar} from "../../../shared/pages/error-snack-bar/error-snack-bar";
import {firstValueFrom} from "rxjs";
import {startAuthentication} from "@simplewebauthn/browser";
import {WebauthnService} from "../../../webauthn/services/webauthn.service";

@Component({
  selector: 'app-attendance',
  standalone: false,
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {
  loading: boolean = false;

  displayedColumns: string[] = ['createdAt', 'branch'];

  attendances: AttendanceDto[] = [];

  attendance: AttendanceDto;

  constructor(private attendanceService: AttendanceService, private webauthnService: WebauthnService,
              private snackBar: MatSnackBar) {
    this.attendances = [];
    this.attendance = {} as AttendanceDto;
  }

  ngOnInit() {
    this.refreshAttendances();
  }

  refreshAttendances() {
    this.loading = true;
    this.attendanceService.getObject().subscribe({
      next: (response) => {
        this.snackBar.dismiss();
        this.attendances = response.attendances;
        this.loading = false;
      },
      error: (error: ErrorMessage) => {
        this.loading = false;
        this.snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
      }
    });
  }

  async createAttendance() {
    this.loading = true;
    this.snackBar.open("Creando asistencia")
    const position = await this.getCurrentPosition();
    this.attendance.latitude = position.coords.latitude;
    this.attendance.longitude = position.coords.longitude;
    this.attendance.accuracy = position.coords.accuracy;

    try {
      const response = await firstValueFrom(this.webauthnService.authenticationOptions());
      const registrationResponse = await startAuthentication({ optionsJSON: response.options });

      await firstValueFrom(this.webauthnService.verifyAuthentication({authenticationResponseJSON: registrationResponse, attendance: this.attendance}));

      this.refreshAttendances();
      this.snackBar.dismiss();
    } catch (error: any) {
      this.loading = false;
      this.snackBar.openFromComponent(ErrorSnackBar, {
        data: {
          messages: error.message
        },
        duration: 2000
      });
    }
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
      );
    });
  }
}
