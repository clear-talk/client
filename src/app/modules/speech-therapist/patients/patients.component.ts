import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MyErrorStateMatcher } from 'src/app/log-in/log-in.component';
import { DifficultyLevel } from 'src/app/models/difficulty-level.model';
import { Lesson } from 'src/app/models/lesson.model';
import { PatientDTO } from 'src/app/models/patientDTO.model';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { LessonService } from 'src/app/services/lesson.service';
import { PatientService } from 'src/app/services/patient.service';
import { SpeechTherapistService } from 'src/app/services/speech-therapist.service';
import { WordService } from 'src/app/services/word.service';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'identityNumber', 'email', 'phone', 'dateOfBirth'];
  rightDisplayedColumns: string[] = ['fullName']
  dataSource: MatTableDataSource<PatientDTO>;
  patients: PatientDTO[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedPatient: PatientDTO;
  difficultyLevelsOfSelectedPatient: DifficultyLevel[];
  selectedPatientLessons: Lesson[];
  selectedLessonWords: WordGivenToPracticeDTO[];
  //maybe to delet later selectedLesson
  selectedLesson: Lesson;

  selectedLevel: DifficultyLevel;

  displayLessonDialog: boolean;

  today = new Date();

  lessonForm: FormGroup = new FormGroup({
    "level": new FormControl("", [Validators.required]),
    "date": new FormControl("", Validators.required),
    "description": new FormControl("", [Validators.required, Validators.minLength(25)])
  });

  matcher = new MyErrorStateMatcher();



  constructor(private _patientService: PatientService, private _speechTherapistService: SpeechTherapistService, private _lessonService: LessonService, private _wordService: WordService) {

    this._patientService.getSpeechTerapistPatients(this._speechTherapistService.getSpeechTherapist().speechTherapist.id).subscribe(data => {
      this.patients = data; console.log(data); this.dataSource = new MatTableDataSource(this.patients)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;;
    })

    // Assign the data to the data source for the table to render

  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calculateAge(birthDate: Date): number {
    const current = new Date();
    const birthDate1 = new Date(birthDate)
    return current.getFullYear() - (birthDate1).getFullYear();
  }

  selectPatient(patient: PatientDTO) {
    this.selectedLessonWords = []
    this.selectedPatient = patient;
    this._lessonService.getLessonsByPatient(patient.patient.id).subscribe((data) => {
      this._wordService.getProblemDifficultyLevels(patient.patient.id, patient.patient.speechTherapistId)
        .subscribe((data) => { this.difficultyLevelsOfSelectedPatient = data; })
      this.selectedPatientLessons = data;
    })
  }

  selectLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
    this._lessonService.getWordsToLesson(lesson.id).subscribe((data) => {
      this.selectedLessonWords = data;
    })
  }

  openAddLessonDialog() {
    this.displayLessonDialog = true;
  }

  addLesson() {


    //   id:number;
    //   patientId:number;
    //   date:Date;
    //   isChecked:boolean;
    //  // difficultyLevelId:number;
    //   lessonDescription:string;
    //   weightedScore?:number;
    //   isDone:boolean
    //   pronunciationProblemName?:number;
    //   difficultyLevel?:number;

    const newLesson = {
      patientId: this.selectedPatient.patient.id,
      date: this.lessonForm.get('date')?.value,
      isChecked: false,
      lessonDescription: this.lessonForm.get('description')?.value,
      isDone: false,
      difficultyLevelId: this.lessonForm.get('level')?.value.id
    }

    this._lessonService.addLesson(newLesson).subscribe((lesson) => {
      this.selectedPatientLessons.push(lesson);
    })




    this.displayLessonDialog = false;

  }
}

