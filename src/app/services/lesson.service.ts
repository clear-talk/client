import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../models/lesson.model';
import { WordGivenToPractice, WordGivenToPracticeDTO } from '../models/wordGivenToPractice.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {


  private selectedLesson?: Lesson;

  constructor(private _http: HttpClient) {
  }

  getSelectedLesson() {
    return this.selectedLesson;
  }

  setSelectedLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
  }

  getLessonsByPatient(patientId: number): Observable<Lesson[]> {

    return this._http.get<Lesson[]>("api/Lesson/" + patientId);
  }

  getWordsByLessonId(lessonId: number): Observable<WordGivenToPracticeDTO[]> {

    return this._http.get<WordGivenToPracticeDTO[]>("/api/Lesson/getLessonWords/" + lessonId);
  }
  addLesson(newLesson: { patientId: number; date: any; isChecked: boolean; lessonDescription: any; isDone: boolean; difficultyLevelId: any; }):Observable<Lesson> {
    return this._http.post<Lesson>(`/api/Lesson`,newLesson);
  }

  updateLesson(newLesson:Lesson):Observable<void>{
    return this._http.put<void>(`/api/Lesson`,newLesson);
  }

  saveLesson(lessonId: number): Observable<void>{
    return this._http.post<void>(`/api/Lesson/SaveLesson`,lessonId);
  }

  handLesson(){
    if(this.selectedLesson)
      {this.selectedLesson.isDone=true;}
      return this._http.put<void>(`/api/Lesson`,this.selectedLesson);
  }

  putWordsToLesson(lessonId:number,words:WordGivenToPracticeDTO[]){
    return this._http.put<void>(`/api/Lesson/${lessonId}/putWordsForLesson`,words);
  }

  postWordsToLesson(words:WordGivenToPracticeDTO[]){
    return this._http.post<void>(`/api/Lesson/PostWordsToLesson`,words);
  }

  deleteLesson(id: number):Observable<void> {
    return this._http.delete<void>(`api/Lesson/${id}/DeleteLesson`);
  }
}

