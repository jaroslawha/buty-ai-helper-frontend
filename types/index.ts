export interface ShoeSearchRequest {
  foot_length_cm: number;
  budget?: string;
  favorite_brands?: string;
  shoe_type?: string;
  material?: string;
  color?: string;
  description?: string;
}

export interface ShoeItem {
  title: string;
  store: string;
  price: string;
  matched_size: string;
  insole_cm: string;
  url: string;
  image_url: string;
  match_score: number;
}
