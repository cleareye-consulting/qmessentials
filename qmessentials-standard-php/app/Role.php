<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public $role_name = '';

    public function userRoles() {
        return $this->hasMany('UserRole');
    }

    protected $fillable = [
        'role_name'
    ];

}
