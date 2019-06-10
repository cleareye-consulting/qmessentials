<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductTestPlan extends Model
{
    
    public function testPlan() {
        return $this->belongsTo('App\TestPlan');
    }

    public function product() {
        return $this->belongsTo('App\Product');
    }

}
