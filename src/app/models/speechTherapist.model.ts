export class SpeechTherapist
{
    /**
     *
     */
    id:number;
    userId:number;
    address:string;
    prospectus:string;
    logo:string;
    constructor(
        id:number,
        userId:number,
        address:string,
        prospectus:string,
        logo:string
    ) 
    {
          this.id=id;
          this.userId=userId;
          this.address=address;
          this.prospectus=prospectus;
          this.logo=logo;
    }
}