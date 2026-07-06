import { Component } from '@angular/core';

type UserStatus = 'Active' | 'Pending' | 'Suspended';

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: UserStatus;
  lastLogin: string;
}

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  search = '';
  roleFilter = 'All Roles';
  statusFilter = 'All Status';

  roles = ['All Roles', 'Admin', 'Client', 'Reviewer'];
  statuses = ['All Status', 'Active', 'Pending', 'Suspended'];

  stats = { total: '1,284', active: 42, pending: 7 };

  users: User[] = [
    { name: 'Sarah Jenkins',   email: 'sarah.j@enterprise-corp.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiWMLt3Dr6xs-wP7mJCPF4mqirBIeGRQCfGo8qpIBjC6CsT4_DAuAJfEGLOp8MZDQhPwEqX5O5I72_KrR-vdkFGj0hz6J17nrvCSGzy2KR_WndkcG39qpmfk_gFu1oi7HoNBB995jS7LdQUO4Fa3YBuIv426eGwMN-zIwHbdddk5luVfA8hU_jFcMXgOxeKRUxG145s5lZYNEKODNz5bOtgASO_F8hT2xz4gCrxHLJV78cJr9wuBBGi9Q4zBirrZicUvJiQFl5CzZO', role: 'Admin',    status: 'Active',    lastLogin: '2024-05-12 09:44' },
    { name: 'Marcus Thorne',   email: 'm.thorne@global-pay.net',     avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApHw6Y46xmuIJ1JfYqUCai7wIRLDKxJMKW8c1g4rO5VPQqedlzu7rXzN_5ij85F65yAUlU9HCyuMVDnPDaYCNZX5O8ZDAERyt7Z5N0puWGnm1xLjT9EaINza-fP6m1vgBKlpvgqNfOT7WIHLUGU9z3aNbef7AYw3XeqZIqmxJXX4fNsH-xW1b54DZ3h_bLNmpG5YDR_6g6GhmqNkv8SZ7jbgPyqrCfhuCnF4zkX0MTM4Alodsw-sWugowKYmSQPnhWLTr9AB7evjjU', role: 'Reviewer', status: 'Pending',   lastLogin: 'Never' },
    { name: 'Elena Rodriguez', email: 'elena.r@fin-ops.biz',         avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZMlSuheYGj1is0_i82QY_0BJx1NtFqeBjqXknr0YZDT_HKG0miLNjreRgqgs-4AxU1jfcwklXNtzU6mf7CBrv7RSP_y_RznY1dpw8qfudk9fgnZMlPA8z7n44dttyC9-VhkGXFiKXrbSOsKZ7Ia9xBs9Y3FZ80aNzlsWjyMEQhSG0EH1YP3lD-bf1792gsEICTfDxX5LGlaCCq3poKTc0pVt3L7XI7hvV_Tt0OAW9-5byxmyVByPwlOdCbr-xvW0DP5uYxII-O8Nr', role: 'Client',   status: 'Suspended', lastLogin: '2023-11-28 14:02' },
    { name: 'David Chen',      email: 'd.chen@securelink.org',       avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiMqAN5ArKDD0tucxKC35KOe7OCMdie3TCs0Naoh3Kew4dRGP3Lx-j41vppglqlYdS21NN7kpsdGDmm6nDLilJ8IVAxWvETiCkro4zQDQPHvmB7TyU-s3PwBn0hhfDm1o7kojK9MLSsVk5MhUs4FdYp89Dote8u3BSpdLERPcf_2ZHSzXaQp-Yp-6Xpotis4EVmt8KIHQzrWHmDaotstl7N7ncfLsbhAfPaP6SbAxXQndgtQvR-jBjCPzzTdYKqiw7wQohJu7-oT0J', role: 'Admin',    status: 'Active',    lastLogin: '2024-05-15 16:11' }
  ];

  get filteredUsers(): User[] {
    return this.users.filter(u => {
      const matchesSearch = !this.search ||
        u.name.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase());
      const matchesRole = this.roleFilter === 'All Roles' || u.role === this.roleFilter;
      const matchesStatus = this.statusFilter === 'All Status' || u.status === this.statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  statusClasses(status: UserStatus): string {
    switch (status) {
      case 'Active':    return 'bg-secondary-container text-on-secondary-container';
      case 'Pending':   return 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
      case 'Suspended': return 'bg-error-container text-on-error-container';
    }
  }
}
