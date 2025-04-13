import { Component, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { WebService } from 'src/app/services/web.service';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent {

  activeTab: string = 'list';
  originalValue: string = '';
  monthName: string = '';

  selectedDay: any;
  eventList: any = [];
  calenderList: any = [];
  editEventList: any[] = [];

  pagedEventList: any[] = [];
  eventForm!: FormGroup;

  length: number = 15;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageEvent!: PageEvent;
  totalRecords: number = 0;
  offset: number = 0;

  hidePageSize: boolean = false;
  showPageSizeOptions: boolean = true;
  showFirstLastButtons: boolean = true;
  disabled: boolean = false;
  isEditing: boolean[] = [];

  isLoading: boolean = false;


  constructor (
    private webService: WebService,
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
  }

  ngOnInit () {
    localStorage.setItem('activeTab', 'list');
    const storedTab = localStorage.getItem('activeTab')
    this.activeTab = storedTab ? storedTab : 'list';
    if (this.activeTab === 'list') {
      this.getEventList();
    } else if (this.activeTab === 'calender') {
      this.getCalender();
    }
  }

  setActiveTab(tabName: string) {
    localStorage.setItem('activeTab', tabName);
    const storedTab = localStorage.getItem('activeTab')
    this.activeTab = storedTab ? storedTab : 'list';
    if (this.activeTab === 'list') {
      this.getEventList();
    } else if (this.activeTab === 'calender') {
      this.getCalender();
    }
  }

  async getEventList () {
    try {
      this.isLoading = true;
      this.eventList = [];
      let response: any = await firstValueFrom(this.webService.getEventList());
      this.isLoading = false;
      if (response.status === 200) {
        this.eventList = response.data;
        this.editEventList = this.eventList.map((ele: any) => ({ ...ele }));
        this.totalRecords = this.eventList.length;
        this.updatePagedEventList();
      } else {
        this.snackbar.open(response.message)
      }
    } catch (error: any) {
      this.snackbar.open(error.message);
    }
  }

  async getCalender () {
    try {
      this.eventForm = this.fb.group({
        events: this.fb.array([])
      });  
      this.isLoading = true;
      this.eventList = [];
      let response: any = await firstValueFrom(this.webService.getCalender());
      this.isLoading = false
      if (response.status === 200) {
        this.calenderList = response.data;
        this.monthName = response.month;
      } else {
        this.snackbar.open(response.message)
      }
    } catch (error: any) {
      this.snackbar.open(error.message);
    }
  }

  updatePagedEventList() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedEventList = this.eventList.slice(start, end);
  }
  

  openEventInfoModal() {

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.offset = e.pageIndex * this.pageSize;
  
    this.updatePagedEventList();
  }
  

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      // this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  
  editField(idx: number): void {
    this.isEditing[idx] = true;
  }

  saveField(idx: number): void {
    this.eventList[idx] = { ...this.editEventList[idx] }; // Update main list
    this.isEditing[idx] = false;
  
    this.pagedEventList = this.eventList.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  
  
  }

  cancelEdit(idx: number): void {
    this.editEventList[idx] = { ...this.eventList[idx] };  // Revert to original value
    this.isEditing[idx] = false;
  
    this.pagedEventList = this.eventList.slice(this.offset, this.offset + this.pageSize); // Update paged list
  
  }

  getEventTitles(events: any[]): string {
    return events.map(e => e.title).join(', ');
  }

  get events(): FormArray {
    return this.eventForm.get('events') as FormArray;
  }
  
  openEventModal(day: any, templateRef: TemplateRef<any>): void {
    this.selectedDay = day;
    this.events.clear(); // Reset FormArray

    day.events.forEach((event: any) => {
      this.events.push(this.createEventGroup(event));
    });

    this.dialog.open(templateRef, {
      width: '500px',
      data: day
    });
  }

  createEventGroup(event = { title: '', subtitle: '', desc: '' }): FormGroup {
    return this.fb.group({
      title: [event.title, Validators.required],
      desc: [event.desc]
    });
  }

  addNewEvent(): void {
    this.events.push(this.createEventGroup());
  }

  saveEvents(): void {
    // Update selectedDay.events from form values
    this.selectedDay.events = this.eventForm.value.events;
    console.log('Updated events:', this.selectedDay.events);
    this.dialog.closeAll();
  }


  closeDialog () {
    this.dialog.closeAll();
  }

}
