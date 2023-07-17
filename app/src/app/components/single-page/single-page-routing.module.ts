import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SinglePageComponent } from "./single-page.component";
import { NewListComponent } from "./create-new/new-list/new-list.component";

const routes: Routes = [
  {
    path: "",
    component: SinglePageComponent,
  },
  {
    path: "newlist",
    component: NewListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinglePageRoutingModule {}
