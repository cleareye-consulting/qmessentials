<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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

        $this->bootstrapAdminUser();

    }

    private function isUserInRole($user, $role_names) {
        return DB::table('user_role')
            ->join('role','role.role_id','=','user_role.role_id')
            ->where('user_role.user_id', $user->id)
            ->whereIn('role.role_name', $role_names)
            ->first() != NULL;
    }

    private function bootstrapAdminUser() {
        $admin_user_exists = 
            DB::table('user_role')
            ->join('role','role.role_id','=','user_role.role_id')
            ->where('role.role_name','Administrator')
            ->first() != NULL;
        if (!$admin_user_exists) {
            Log::warn('Bootstrapping admin user');
            $default_admin = User::create([
                'name' => 'administrator',
                'password' => Hash::make('tempAdminPassword000!!!')            
            ]);        
            $administrator_role_id = DB::table('role')->where('role_name','Administrator')->value('role_id');            
            DB::table('user_role')
                ->insert([
                    'user_id' => $default_admin->id,
                    'role_id' => $administrator_role_id
                ]);            
        }
    }

}
