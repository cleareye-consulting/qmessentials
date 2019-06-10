<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ObservationResult extends Model
{
    public function observation() {
        return $this->belongsTo('App\Observation');
    }
}
