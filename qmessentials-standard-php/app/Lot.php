<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lot extends Model
{
    public function product() {
        return $this->belongsTo('App\Product');
    }

    public function items() {
        return $this->hasMany('App\Item');
    }

}
