<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Observation extends Model
{
    public function testRun() {
        return $this->belongsTo('App\TestRun');
    }

    public function testPlanMetric() {
        return $this->belongsTo('App\TestPlanMetric');
    }

    public function observationResults() {
        return $this->hasMany('App\ObservationResult');
    }

}
