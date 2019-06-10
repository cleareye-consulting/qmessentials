<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestPlan extends Model
{
    
    public function productTestPlans() {
        return $this->hasMany('App\ProductTestPlan');
    }

    public function testPlanMetrics() {
        return $this->hasMany('App\TestPlanMetric');
    }

    use SoftDeletes;
}
