<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{

    public function lot() {
        return $this->belongsTo('App\Lot');
    }

}
