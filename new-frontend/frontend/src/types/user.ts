interface customerProfile {
  name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  cccd: string;
  phone_number: string;
}

interface doctorProfile {
  name: string;
  specialization: string;
  price: number;
}

interface staffProfile {
  name: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  profile: customerProfile | doctorProfile | staffProfile;
}
