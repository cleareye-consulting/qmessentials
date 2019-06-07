<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public $role_name = '';

    protected $fillable = [
        'role_name'
    ];

}
