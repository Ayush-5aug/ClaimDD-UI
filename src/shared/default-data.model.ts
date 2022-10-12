export interface DefaultData {
  _id: string;
  claimantID: {
    _id: string;
    claimantID: string;
    name: string;
    nameInContract: string;
    user: string;
  };
  projectID: {
    _id: string;
    projectID: string;
    name: string;
    claimant: string;
    user: string;
  };
  user: string;
}
