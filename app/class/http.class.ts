import axios, { AxiosInstance} from "axios";

class HttpClient {
  public http: AxiosInstance;
  constructor() {
    this.http = axios.create();
  }

  get get(){
    return this.http.get
  }

  setHeaders(headers: object){
    this.http.defaults.headers.common = headers
  }
}

export const httpClient = new HttpClient();
