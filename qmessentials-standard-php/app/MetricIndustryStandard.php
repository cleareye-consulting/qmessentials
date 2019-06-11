<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetricIndustryStandard extends Model
{
    public function metric() {
        return $this->belongsTo('App\Metric');
    }

}
