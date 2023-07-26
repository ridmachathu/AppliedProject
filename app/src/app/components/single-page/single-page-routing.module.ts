import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SinglePageComponent } from "./single-page.component";
import { NewListComponent } from "./create-new/new-list/new-list.component";
import { ListItemComponent } from "./list-item/list-item.component";

const routes: Routes = [
  {
    path: "",
    component: SinglePageComponent,
  },
  {
    path: "newlist",
    component: NewListComponent,
  },
  {
    path: "listitem/:id",
    component: ListItemComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinglePageRoutingModule {}
