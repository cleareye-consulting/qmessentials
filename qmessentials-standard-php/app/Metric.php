<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Metric extends Model
{

    use SoftDeletes;

    public function metricAvailableQualifiers() {
        return $this->hasMany('App\MetricAvailableQualifier');
    }

    public function metricAvailableUnits() {
        return $this->hasMany('App\MetricAvailableUnit');
    }

    public function metricIndustryStandards() {
        return $this->hasMany('App\MetricIndustryStandard');
    }

    public function metricMethodologyReferences() {
        return $this->hasMany('App\MetricMethodologyReference');
    }
    
}
