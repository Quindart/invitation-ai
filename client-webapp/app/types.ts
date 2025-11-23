export interface GraduateData {
  id: number;
  name: string;
  graduation_datetime: string;
  venue: {
    name: string;
    address: string;
  };
  contact: {
    phone: string;
    email: string;
  };
}

export interface UserVerifiedData {
  graduate_id: number;
  guest_name: string;
  graduate_info: GraduateData;
}
