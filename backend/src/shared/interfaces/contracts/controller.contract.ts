import { HttpNext, HttpRequest, HttpResponse } from "./http.contract";

export interface Controller {
  handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void>;
}
