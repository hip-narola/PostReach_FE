// middleware.ts
import {NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LocalStorageType } from './app/constants/pages';
import navigations from './app/constants/navigations';

export function middleware(request: NextRequest) {
  
  const isAuthPage = request.nextUrl.pathname.startsWith(navigations.protectedRoute);
  // Redirect unauthenticated requests to login
  if (isAuthPage && !request.cookies.get(LocalStorageType.ACCESS_TOKEN)) {
    return NextResponse.redirect(new URL(navigations.login, request.url));
  }
  return NextResponse.next();
}


