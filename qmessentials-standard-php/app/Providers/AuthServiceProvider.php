<?php

namespace App\Providers;

use \App\User;
use \App\UserRole;
use \App\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        if (Schema::hasTable('roles')) { //This check is necessary to get artisan to run. Apparently artisan boots 
                                         //the application on any artisan command (including migrate!) which creates 
                                         // kind of a Catch-22. Maybe I'm missing some obvious alternative, but this 
                                         //seems to solve the problem.

            Gate::before(function($user, $ability) {
                if ($this->isUserInRole($user, ['Administrator'])) {
                    return true;
                }
            });

            Gate::define('write-metric', function($user) {
                return $this->isUserInRole($user, ['Analyst']);
            });

            Gate::define('read-metric', function($user) {
                return $this->isUserInRole($user, ['Analyst', 'Technician']);
            });

            Gate::define('write-test-plan', function($user) {
                return $this->isUserInRole($user, ['Analyst']);
            });

            Gate::define('write-product', function($user) {
                return $this->isUserInRole($user, ['Analyst']);
            });

            Gate::define('write-user', function($user) {
                return $this->isUserInRole($user, ['Administrator']);
            });

            Gate::define('write-lot', function($user) {
                return $this->isUserInRole($user, ['Lead Person']);
            });

            Gate::define('write-observation', function($user) {
                return $this->isUserInRole($user, ['Technician']);
            });

            Gate::define('read-aggregate-data', function($user) {
                return $this->isUserInRole($user, ['Quality Manager']);
            });
            $this->bootstrapRoles();
            $this->bootstrapAdminUser();
        }
        else {
            Gate::before(function($user, $ability) {
                return false;
            });
        }

    }

    private function isUserInRole($user, $roleNames) {
        foreach ($user->roles()->get() as $role) {
            foreach ($roleNames as $roleName) {
                if ($roleName == $role->role_name) {
                    return true;
                }
            }
        }
        return false;        
    }

    private function bootstrapRoles() {
        Role::firstOrCreate(['role_name'=>'Administrator']);
        Role::firstOrCreate(['role_name'=>'Analyst']);
        Role::firstOrCreate(['role_name'=>'Lead Person']);
        Role::firstOrCreate(['role_name'=>'Quality Manager']);
        Role::firstOrCreate(['role_name'=>'Technician']);
    }

    private function bootstrapAdminUser() {        
        $adminRoleId = Role::where('role_name', 'Administrator')->value('id');
        $adminUserExists = UserRole::where('role_id', $adminRoleId)->first() != NULL;
        if (!$adminUserExists) {
            $defaultAdmin = User::create([
                'name' => 'administrator',
                'password' => Hash::make('tempAdminPassword000!!!')            
            ]);        
            UserRole::create([
                'user_id' => $defaultAdmin->id,
                'role_id' => $adminRoleId
            ]);            
        }
    }

}
