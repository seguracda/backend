export class HttpErrorResponse {
	constructor(
	  public errorCode: HttpError,
	  public errorResponse?: any,
	  public message?: MessagesError
	) {}
  }
  

export enum HttpError {
	SERVER_ERROR       = "SERVER_ERROR",
	RESOURCE_DUPLICATE = "RESOURCE_DUPLICATE",
	RESOURCE_NOT_EXIST = "RESOURCE_NOT_EXIST",
	PASSWORD_INCORRECT = "PASSWORD_INCORRECT",
	DATA_INVALID = "DATA_INVALID",
}

export enum MessagesError {
    NO_DATA ="Not Resouses find",
    DATA_INVALID ="Data Invalid",
    FILE_INVALID ="File Invalid",
    TEMPLATE_INVALID ="the Template Excel is invalid",
}

