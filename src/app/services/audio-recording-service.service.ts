import { Injectable, NgZone } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WordGivenToPracticeDTO } from '../models/wordGivenToPractice.model';
import { PatientRecordingDetails } from '../models/patient-recording-details.model';
import { Word } from '../models/word.model';
// import { isNullOrUndefined } from 'util';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {



  private wordsRecordDetails: PatientRecordingDetails[];

  private stream!: any;
  private recorder!: any;
  private interval!: any;
  private startTime!: any;
  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();

  constructor(private _http: HttpClient) { }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  getWordsRecordDetails() { return this.wordsRecordDetails }

  startRecording() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }
    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(s => {
        this.stream = s;
        this.record();
      }).catch(error => {
        this._recordingFailed.next(error);
      });
  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/mp3'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      500
    );
  }

  private toString(value: any) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop((blob: any) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next('');
      });
    }
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track: any) => track.stop());
        this.stream = null;
      }
    }
  }


  // addWordRecordDetails(recordDetails:PatientRecordingDetails,index:number)
  // {
  //   this.wordsRecordDetails[index]=recordDetails;
  // }

  getPatientRecording(wordId: number): any {
    return this._http.get<Blob>(`/api/Lesson/getPatienRecording/${wordId}`, { observe: 'response', responseType: 'blob' as 'json' });
  }

  savePatientRecording(file: any, type: string, filename: string, word: WordGivenToPracticeDTO): Observable<void> {
    let formData: FormData = new FormData();
    formData.append("asset", file, filename);
    this.sendPatientWordToServer(word).subscribe();
    return this._http.put<void>("api/Lesson/UpdateRecording/", formData);
  }


  sendPatientWordToServer(word: WordGivenToPracticeDTO) {

    return this._http.put<void>("api/Lesson/getWordToUpdate/", word);
  }


  saveSpeechTherapistRecording(file: any, type: string, filename: string, word: Word): Observable<void> {
    let formData: FormData = new FormData();
    formData.append("asset", file, filename);
    this.sendWordToServer(word).subscribe();
    return this._http.post<void>("api/Word/PostWordRecording/", formData);
  }


  sendWordToServer(word: Word) {

    return this._http.post<void>("api/Word/word/", word);
  }

  updateSpeechTherapistRecording(blob: Blob, type: string, audioName: any, word: Word) {
    let formData: FormData = new FormData();
    formData.append("asset", blob, audioName);
    this.sendWordToServer(word).subscribe();
    return this._http.put<void>("api/Word/PutWordRecording/", formData);

  }

  getWordRecord(wordId: number): any {
    return this._http.get<Blob>(`/api/Word/${wordId}/getRecord`, { observe: 'response', responseType: 'blob' as 'json' })
  }

  getSpeechTherapistWordRecord(wordId: number): any {

    return this._http.get<Blob>(`/api/Word/${wordId}/getRecord`, { observe: 'response', responseType: 'blob' as 'json' });//{responseType: 'blob' as 'json' }
  }

}
