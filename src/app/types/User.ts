export type User = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  isOwner: boolean;
  isManager: boolean;
  isExecuter: boolean;
  isReviewer: boolean;
  companyName: string;
  designation: string;
  phone: string;
  city: string;
  country: string;
  createdBy: string;
  token: string;
};
