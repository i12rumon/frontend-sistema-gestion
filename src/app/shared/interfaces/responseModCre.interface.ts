import { Degree } from "./degree.interface";
import { UserItem } from "./user-item.interface";

export interface responseModCreDegree {
  success: boolean;
  message?: string;
  data: Degree;
}

export interface responseModCreUser{
  success: boolean;
  message?: string;
  data: UserItem;
}
