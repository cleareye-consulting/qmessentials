<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    public function user() {
        return $this->belongsTo('User');
    }

    public function role() {
        return $this->belogsTo('Role');
    }

    protected $fillable = [
        'user_id', 'role_id'
    ];

}
