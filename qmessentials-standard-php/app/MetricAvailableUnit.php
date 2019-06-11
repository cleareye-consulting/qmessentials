<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetricAvailableUnit extends Model
{
    public function metric() {
        return $this->belongsTo('App\Metric');
    }
}
