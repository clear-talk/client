
 export interface Lesson{
     /**
      *     public int Id { get; set; }
            public int PatientId { get; set; }
            public DateTime Date { get; set; }
            public bool IsChecked { get; set; }
            public int DifficultyLevelId { get; set; }
            public string LessonDescription { get; set; }
            public int? WeightedScore { get; set; }
      */

        id:number;
        patientId:number;
        date:Date;
        isChecked:boolean;
        difficultyLevelId:number;
        lessonDescription:string;
        weightedScore?:number;
        isDone:boolean
        pronunciationProblemName?:string;
        difficultyLevelName:number;

     }
