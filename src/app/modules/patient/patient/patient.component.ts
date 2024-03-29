import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lesson } from 'src/app/models/lesson.model';
import { PatientDTO } from 'src/app/models/patientDTO.model';
import { WordExerciseDTO } from 'src/app/models/word-exercise-DTO.model';
import { WordGivenToPractice, WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { LessonService } from 'src/app/services/lesson.service';
import { LogInService } from 'src/app/services/log-in.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  selectedLesson:Lesson|undefined;
  user!:PatientDTO
  lessons:Lesson[]=[]
  displayedColumns = [  'word','score'];
  LessonWords!:WordGivenToPracticeDTO[];


  constructor(
    private _lessonService:LessonService,
    private _patientService:PatientService,
    private _logInService:LogInService,
    private router:Router) { }


  ngOnInit(): void {

    this.user=(this._logInService.getTheUser()) as PatientDTO;
    this._patientService.patient=this.user;
    this._lessonService.getLessonsByPatient(this.user.patient.id).subscribe(data=>{this.lessons=data;

     console.log(this.lessons)

    });
  }


    selectLesson(lesson:Lesson){
        this.selectedLesson=lesson;
        this._lessonService.setSelectedLesson(this.selectedLesson);
        this._lessonService.getWordsByLessonId(this.selectedLesson.id).subscribe(data=>this.LessonWords=data,err=>alert("err!"));
    }
    diselect(){
      this.selectedLesson=undefined;
    }

    startExercise(){

      this._patientService.LessonWords=this.LessonWords;
      this.router.navigate(["patient/exercise"])
    }

    startExercise2(lesson:Lesson){
      this.selectedLesson=lesson;
      this._lessonService.setSelectedLesson(this.selectedLesson);
      this._lessonService.getWordsByLessonId(this.selectedLesson.id)
      .subscribe(data=>{
        this.LessonWords=data;
        this._patientService.LessonWords=this.LessonWords;
        this._patientService.difficultyLevelName=this.selectedLesson?.difficultyLevelName;
      this.router.navigate(["patient/exercise2"])
      }
        ,err=>alert("err!"));
    }

  panelOpenState = false;
}









