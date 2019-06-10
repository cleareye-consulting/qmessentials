<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TestRun extends Model
{
    public function item() {
        return $this->belongsTo('App\Item');
    }

    public function testPlan() {
        return $this->belongsTo('App\TestPlan');
    }

    public function observations() {
        return $this->hasMany('App\Observation');
    }

}
