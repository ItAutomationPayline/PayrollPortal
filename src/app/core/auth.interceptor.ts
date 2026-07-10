import { HttpInterceptorFn } from '@angular/common/http';

/** Attaches the JWT bearer token to every outgoing API request. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('payline_token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
