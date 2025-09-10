import { Routes } from '@angular/router';

// Layouts
import { PublicLayout } from './layouts/public-layout/public-layout';

// Public pages
import { Home } from './pages/public/home/home';
import { About } from './pages/public/about/about';
import { Contact } from './pages/public/contact/contact';
import { Summer } from './pages/public/summer/summer';
import { Winter } from './pages/public/winter/winter';
import { Booking } from './pages/public/booking/booking';
import { Success } from './pages/public/success/success';
import { Cancel } from './pages/public/cancel/cancel';
import { Login } from './pages/public/login/login';

// Admin pages
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { ManageCustomers } from './pages/admin/manage-customers/manage-customers';
import { ManageGroups } from './pages/admin/manage-groups/manage-groups';
import { ManagePromos } from './pages/admin/manage-promos/manage-promos';
import { EditAdmin } from './pages/admin/edit-admin/edit-admin';
import { EditBooking } from './pages/admin/edit-booking/edit-booking';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
      { path: 'contact', component: Contact },
      { path: 'summer', component: Summer },
      { path: 'winter', component: Winter },
      { path: 'booking', component: Booking },
      { path: 'success', component: Success },
      { path: 'cancel', component: Cancel },
      { path: 'login', component: Login }
    ]
  },
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'customers', component: ManageCustomers },
      { path: 'groups', component: ManageGroups },
      { path: 'promos', component: ManagePromos },
      { path: 'edit-admin', component: EditAdmin },
      { path: 'edit-booking', component: EditBooking }
    ]
  },
  { path: '**', redirectTo: '' }
];
