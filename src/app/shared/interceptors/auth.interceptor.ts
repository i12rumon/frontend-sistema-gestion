import type { HttpInterceptorFn,HttpHandler} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('token');
  let newReq = req;

  if(authToken){
    newReq = req.clone({
    headers: req.headers.append('Authorization','Bearer ' +authToken)
  });
  }
  return next(newReq);
};
