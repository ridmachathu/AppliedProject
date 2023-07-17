// import { ProfileComponent } from "./components/profile/profile.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";
import { SignupComponent } from "./auth/signup/signup.component";
import { ForgetPasswordComponent } from "./auth/forget-password/forget-password.component";
import { AdminGuard } from './shared/guard/admin.guard';
// import { NewListComponent } from "./components/single-page/create-new/new-list/new-list.component";


const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
    canActivate:[AdminGuard]
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/signup',
    component: SignupComponent
  },
  {
    path: 'auth/forget-password',
    component: ForgetPasswordComponent
  },
  // {
  //   path: 'components/profile',
  //   component: ProfileComponent,
  //   canActivate:[AdminGuard]
  // },
  // {
  //   path: 'components/single-page/create-new/new-list',
  //   component: NewListComponent,
  //   // canActivate:[AdminGuard]
  // },
  {
    path: "",
    component: ContentComponent,
    children: content,
    canActivate:[AdminGuard]
  },
  {
    path: "",
    component: FullComponent,
    children: full,
    canActivate:[AdminGuard]
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [
    [
      RouterModule.forRoot(routes, {
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled",
      }),
    ],
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
