<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestPlan extends Model
{
    
    public function product() {
        return $this->belongsTo('App\Product');
    }

    public function testPlanMetrics() {
        return $this->hasMany('App\TestPlanMetric');
    }

    use SoftDeletes;
}
