export interface GameType{
    id:string;
    cover_img?:string;
    background_img?:string;
    avg?:number;
    description?:string;
    name?:string;
    plot?:string;
    review_count?:number;
    stars?:{uid:StarType}
}
export interface StarType{
    uid?:string;
    value:number;
}